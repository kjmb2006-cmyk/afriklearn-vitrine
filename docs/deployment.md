# Déploiement — Site vitrine AFRIK'LEARN Consulting

Référence : CLAUDE.md §3.2, §3.4.

## Architecture de déploiement

Le site vitrine est un **build 100 % statique** (Astro, `output: "static"`), servi directement
par Nginx. Le seul composant dynamique — l'envoi d'email du formulaire de contact — est isolé
dans `server/contact-service/`, un micro-service Express tournant sous PM2, exactement comme
`academy.afriklearn-consulting.com`.

```
Navigateur
   │
   ├── GET /, /a-propos, /formations, /contact, ...  → Nginx sert dist/ (statique)
   │
   └── POST /api/contact  → Nginx proxy_pass → localhost:4001 (contact-service, PM2)
```

## 1. Préparation du VPS (une seule fois)

```bash
# Créer le dossier de déploiement
sudo mkdir -p /var/www/afriklearn-vitrine
sudo chown deploy:deploy /var/www/afriklearn-vitrine

# Créer un utilisateur de déploiement dédié (si pas déjà fait pour academy)
sudo adduser --disabled-password deploy
sudo mkdir -p /home/deploy/.ssh
# Ajouter la clé publique générée pour GitHub Actions dans /home/deploy/.ssh/authorized_keys
```

## 2. Configuration Nginx

Créer `/etc/nginx/sites-available/afriklearn-vitrine` :

```nginx
server {
    listen 80;
    server_name afriklearn-consulting.com www.afriklearn-consulting.com;
    return 301 https://afriklearn-consulting.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.afriklearn-consulting.com;
    # ... certs Let's Encrypt (voir certbot) ...
    return 301 https://afriklearn-consulting.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name afriklearn-consulting.com;

    root /var/www/afriklearn-vitrine;
    index index.html;

    ssl_certificate     /etc/letsencrypt/live/afriklearn-consulting.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/afriklearn-consulting.com/privkey.pem;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location /api/ {
        proxy_pass http://127.0.0.1:4001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Rate limiting additionnel au niveau Nginx (optionnel, défense en profondeur)
        limit_req zone=contact_form burst=5 nodelay;
    }

    location / {
        try_files $uri $uri/index.html $uri.html =404;
    }

    error_page 404 /404.html;
}
```

Activer et recharger :

```bash
sudo ln -s /etc/nginx/sites-available/afriklearn-vitrine /etc/nginx/sites-enabled/
sudo certbot --nginx -d afriklearn-consulting.com -d www.afriklearn-consulting.com
sudo nginx -t && sudo systemctl reload nginx
```

## 3. Déploiement du contact-service (une seule fois, puis mises à jour manuelles)

```bash
cd /var/www/
git clone <url-du-repo> afriklearn-vitrine-source  # ou copier server/contact-service/ seul
cd afriklearn-vitrine-source/server/contact-service
npm install --production
cp .env.example .env
# Renseigner les vraies valeurs SMTP dans .env
pm2 start index.js --name afriklearn-vitrine-contact
pm2 save
```

## 4. Secrets GitHub Actions requis

Dans **Settings → Secrets and variables → Actions** du repo :

| Secret | Description |
|---|---|
| `VPS_HOST` | IP ou domaine du VPS |
| `VPS_DEPLOY_USER` | `deploy` (utilisateur dédié, droits limités à `/var/www/afriklearn-vitrine/`) |
| `VPS_DEPLOY_SSH_KEY` | Clé privée SSH correspondante |

## 5. Flux de déploiement continu

Chaque push sur `main` :
1. `ci.yml` build + type-check + Lighthouse CI
2. `deploy.yml` rsync `dist/` vers `/var/www/afriklearn-vitrine/` + reload Nginx

Le `contact-service` n'est **pas** redéployé automatiquement (changement rare, impact
sur un processus PM2 vivant) — mise à jour manuelle documentée ci-dessus.
