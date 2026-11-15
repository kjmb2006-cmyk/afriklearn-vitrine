# CLAUDE.md — Site Vitrine AFRIK'LEARN Consulting (v2)

> **Document de gouvernance pour Claude Code.**
> Contrat d'exécution strict. Toute dérogation doit être tracée en bas de document avec date et motif.
>
> Version : 2.0 — 12 novembre 2026
> Propriétaire produit : Dr Jean-Marc Bertrand KORANDJI (Directeur Associé)
> Validation statutaire : Mme TANOU Lath You Rita Marcelle (Directrice Associée et Gérante)

---

## 0. Règles d'engagement pour l'agent

1. **Ne jamais inventer de contenu factuel** (noms, chiffres, témoignages, logos clients). Utiliser des placeholders `{{PLACEHOLDER_NOM}}` que le client remplira.
2. **MVP-first strict.** Tout ce qui n'est pas dans le Sprint courant va au **Backlog**, jamais dans le code.
3. **Pas de scope creep.** Si une nouvelle idée émerge pendant le Sprint, l'écrire dans la section Backlog et continuer.
4. **Une branche = une feature.** Nom : `feat/sprint-N-nom-feature`. PR obligatoire avant merge sur `main`.
5. **Pas de dépendance ajoutée sans justification** dans le commit (`chore(deps): add X — motif : …`).
6. **Validation visuelle obligatoire** sur 3 breakpoints (375, 768, 1280 px) avant de marquer une tâche DONE.
7. **Pas de contenu lorem ipsum livré en production.** Soit vrai contenu, soit placeholder explicite `{{…}}`.
8. **Jamais de secret ou clé API en clair** dans le dépôt. `.env.example` + `.env` dans `.gitignore`.

---

## 1. Contexte & périmètre

### 1.1 Client
**AFRIK'LEARN Consulting SARL** — cabinet de formation professionnelle et conseil stratégique, basé à Abidjan, couverture Afrique francophone. Constitué sous l'OHADA.

### 1.2 Objectif du site
Site **vitrine corporate** destiné à :
1. Crédibiliser la marque auprès de clients institutionnels (ministères, agences internationales, ONG) et entreprises privées.
2. Présenter clairement l'offre (pôles d'expertise, formations phares, conseil).
3. Générer des leads qualifiés (formulaire contact, demande de devis).
4. Renvoyer, via lien sortant, vers `academy.afriklearn-consulting.com` pour tout parcours apprenant (inscription, paiement, LMS).

### 1.3 Ce que le site n'est PAS
- **Pas une LMS.** Aucune authentification apprenant. Aucun paiement.
- **Pas une boutique.** TOUT & PLUS reste un sous-domaine séparé.
- **Pas un portail employés.** Pas d'espace client.
- **Pas un blog multi-auteurs** au Sprint 1 (reporté au Sprint 3).

### 1.4 Cibles
- Décideurs institutionnels (ministères Santé, Éducation, Plan ; agences UN ; ONG internationales)
- Direction RH / Learning & Development des grandes entreprises et PME africaines
- Chefs de projet cherchant certifications (PMI, santé publique, data)
- Bailleurs et partenaires techniques et financiers

---

## 2. Inventaire de l'existant (ne pas toucher)

| Surface | URL | Stack | Statut | Lien depuis la vitrine |
|---------|-----|-------|--------|------------------------|
| Vitrine actuelle | LWS (statique) | HTML/CSS | **À remplacer** par ce projet | — |
| Academy e-learning | `academy.afriklearn-consulting.com` | Node.js/Express/SQLite/PM2/Nginx (VPS Ubuntu 24.04) | Live | CTA "Accéder à l'Academy" + CTA par formation |
| Boutique TOUT & PLUS | sous-domaine | Node.js/Express/SQLite | En dev | Lien footer uniquement au Sprint 1 |

**L'academy et TOUT & PLUS sont hors scope de ce projet.** Aucune modification de leur code. Simples liens sortants.

---

## 3. Architecture cible

### 3.1 Stack validée

| Couche | Choix | Version | Motif |
|--------|-------|---------|-------|
| Framework | **Astro** | 7.x (voir §15) | Zéro JS par défaut, SSG pur, parfait pour vitrine, excellent SEO |
| Styling | **Tailwind CSS** | 4.x | Productivité, cohérence design system |
| Composants îlots | **React** (via `@astrojs/react`) | 19.x | Uniquement pour formulaires et carrousels |
| Formulaires | React Hook Form + Zod | dernières | Validation robuste |
| Icônes | lucide-react (via `astro-icon`) | dernières | Ligne cohérente |
| Fonts | `@fontsource` (self-host) | — | Souveraineté, pas de CDN Google |
| Email (contact) | SMTP du VPS ou OVH | — | Pas de dépendance SaaS tierce |
| Analytics | **Plausible self-hosted** sur le VPS | — | RGPD, loi ivoirienne 2013-450, pas de bannière cookies |
| Node (build) | 22 LTS (voir dérogation 2026-11-15, §15) | — | Imposé par Astro ≥7.x (§15) ; alignement avec l'academy à revérifier |
| Gestionnaire paquets | **pnpm** | 9.x | Vitesse, économie disque |

### 3.2 Hébergement

- **VPS existant Ubuntu 24.04** (celui qui héberge déjà l'academy).
- Build Astro → dossier statique `dist/` → servi par **Nginx** sur un `server_block` dédié.
- Domaine racine : **`afriklearn-consulting.com`** et **`www.afriklearn-consulting.com`** (redirection www → apex).
- TLS : **Let's Encrypt** (certbot déjà en place sur le VPS).
- Pas de Node.js runtime en production pour la vitrine (full statique).

### 3.3 Topologie finale

```
afriklearn-consulting.com              → Vitrine corporate (ce projet)
www.afriklearn-consulting.com          → redirect 301 vers apex
academy.afriklearn-consulting.com      → Academy (existant, inchangé)
tout-et-plus.afriklearn-consulting.com → Boutique (existant, inchangé)
plausible.afriklearn-consulting.com    → Analytics self-hosted (à provisionner Sprint 2)
```

### 3.4 Pipeline de déploiement

1. Push sur `main` → GitHub Actions
2. Build Astro (`pnpm build`) + tests Lighthouse CI
3. Déploiement par `rsync` vers `/var/www/afriklearn-vitrine/` sur le VPS
4. Reload Nginx (atomique, pas de downtime)
5. Notification Slack / email d'équipe

---

## 4. Identité visuelle & design system

> **À valider avec Mme TANOU avant le début du Sprint 1.** La palette ci-dessous est une **proposition**, pas un choix figé.

### 4.1 Palette (proposition v1)

```css
/* tokens.css — design tokens */
:root {
  /* Primaires */
  --al-primary-900: #0A4D68;   /* Bleu profond — confiance */
  --al-primary-700: #088395;   /* Cyan — modernité */
  --al-primary-500: #0AA5BA;

  /* Accent chaleur africaine */
  --al-accent-700: #C97B1A;
  --al-accent-500: #E8A33D;    /* Ocre safran */
  --al-accent-300: #F4C572;

  /* Neutres */
  --al-ink-900: #0F172A;        /* Texte principal */
  --al-ink-700: #334155;
  --al-ink-500: #64748B;
  --al-ink-300: #CBD5E1;
  --al-ink-100: #E2E8F0;
  --al-surface: #F8FAFC;
  --al-white: #FFFFFF;

  /* Sémantiques */
  --al-success: #16A34A;
  --al-warning: #F59E0B;
  --al-error: #DC2626;
}
```

### 4.2 Typographie

- **Titres** : `Plus Jakarta Sans` (600, 700) — self-hosted via `@fontsource/plus-jakarta-sans`
- **Corps** : `Inter` (400, 500, 600) — self-hosted via `@fontsource/inter`
- **Échelle** (clamp mobile → desktop) :
  - h1 : `clamp(2rem, 5vw, 3.5rem)`
  - h2 : `clamp(1.75rem, 4vw, 2.5rem)`
  - h3 : `clamp(1.375rem, 3vw, 1.875rem)`
  - body : `1rem` / `lh 1.65`
  - small : `0.875rem`

### 4.3 Layout

- Container : `max-w-7xl` (1280 px)
- Padding horizontal : `px-4 md:px-8 lg:px-12`
- Sections : `py-16 md:py-24`
- Grille : 12 colonnes, `gap-6 md:gap-8`
- Border-radius : `rounded-xl` (12 px) par défaut, `rounded-2xl` sur cards principales

### 4.4 Principes directeurs

- **Sobriété premium, africain sans cliché.** Pas de wax surchargé, pas de masques stylisés, pas de photos stéréotypées.
- **Photographies authentiques** : professionnels africains en contexte réel. Sources privilégiées : Nappy.co, Iwaria, ou shootings dédiés commandités.
- **Iconographie cohérente** : lucide-react uniquement, stroke 1.5 px.
- **Whitespace généreux.** Ne jamais saturer.
- **Mobile-first obligatoire** : 70 %+ du trafic Afrique vient du mobile.
- **Accessibilité WCAG AA minimum** : contrastes vérifiés, focus visibles, alt descriptifs, navigation clavier intégrale.

---

## 5. SPRINT 1 — MVP Vitrine (2 semaines)

### 5.1 Objectif
Mettre en ligne une vitrine crédible et fonctionnelle sur `afriklearn-consulting.com`, avec 4 pages, formulaire de contact opérationnel, et SEO complet.

### 5.2 Scope exact — 4 pages

#### Page 1 — Accueil (`/`)
Sections, dans l'ordre :
1. **Header** : logo (SVG fourni), menu (Accueil, À propos, Formations, Contact, bouton "Academy" sortant).
2. **Hero** : titre + sous-titre + 2 CTA ("Nos formations" interne / "Demander un devis" → ancre formulaire).
3. **Nos pôles d'expertise** : 3 cards (Santé publique & systèmes d'information · Gestion de projet & PMO · Data & Digital Learning).
4. **Formations phares** : 3 cards statiques avec CTA "Voir sur l'Academy" → `academy.afriklearn-consulting.com`.
5. **Pourquoi AFRIK'LEARN** : 4 piliers (Expertise terrain · Approche panafricaine · Certifications reconnues · Accompagnement post-formation).
6. **CTA final** : "Discutons de votre projet" → ancre contact ou `/contact`.
7. **Footer** : coordonnées, mentions, liens sociaux, lien academy, lien TOUT & PLUS.

#### Page 2 — À propos (`/a-propos`)
- Mission et histoire courte
- Les deux co-fondateurs (photos, bios, LinkedIn) — **noms à confirmer avant livraison**
- 4-5 valeurs illustrées
- Mention OHADA et cadre juridique
- Encart "Ils nous font confiance" (logos partenaires si autorisation reçue, sinon placeholder)

#### Page 3 — Formations (`/formations`)
- Vue d'ensemble de l'offre (pas de filtre, pas de système dynamique au Sprint 1)
- Grille statique de 6 à 12 formations : titre, pôle, durée, modalité, CTA "S'inscrire sur l'Academy"
- Encart "Vous ne trouvez pas votre besoin ?" → CTA contact
- **Contenu formations à fournir par le client** avant début développement de la page

#### Page 4 — Contact (`/contact`)
- Formulaire : Nom, Email, Organisation, Téléphone, Sujet (select : Formation / Conseil / Partenariat / Autre), Message
- Validation Zod + React Hook Form
- Soumission : POST vers endpoint Astro API qui envoie via SMTP → `contact@afriklearn-consulting.com`
- Protection anti-spam : honeypot + rate limiting IP côté Nginx
- Confirmation UX après envoi
- Coordonnées : adresse Abidjan (à fournir), téléphone pro, email
- Lien Google Maps (embed non-cookie, ou capture statique + lien)

### 5.3 Definition of Ready (DoR) — à satisfaire avant d'ouvrir le Sprint

- [ ] Logo SVG officiel fourni (horizontal, vertical, monochrome)
- [ ] Palette couleur validée par Mme TANOU
- [ ] Textes des 4 pages fournis (au moins en version brouillon)
- [ ] 2 photos des co-fondateurs
- [ ] Coordonnées exactes (adresse, téléphone, email)
- [ ] Accès VPS (utilisateur de déploiement, clé SSH publique ajoutée)
- [ ] Nom de domaine `afriklearn-consulting.com` pointant vers l'IP du VPS
- [ ] Email `contact@afriklearn-consulting.com` fonctionnel + SMTP configuré

### 5.4 Definition of Done (DoD) — Sprint 1 livré uniquement si

- [ ] 4 pages responsive sur 375 / 768 / 1280 px (captures d'écran jointes à la PR)
- [ ] Formulaire contact testé bout-en-bout, email réellement reçu
- [ ] Lighthouse mobile ≥ 90 Performance, ≥ 95 Accessibility, = 100 SEO
- [ ] Core Web Vitals : LCP < 2.5 s, CLS < 0.1, INP < 200 ms
- [ ] Meta tags OG + Twitter Cards sur chaque page
- [ ] `sitemap.xml` + `robots.txt` générés
- [ ] JSON-LD `Organization` sur accueil
- [ ] HTTPS actif, redirection HTTP → HTTPS, HSTS activé
- [ ] Mentions légales, Politique de confidentialité, Cookies (si Plausible pas encore en place) publiées
- [ ] Site accessible publiquement sur `afriklearn-consulting.com`
- [ ] README de reprise rédigé

### 5.5 Hors-scope Sprint 1 (ne pas commencer)
- Blog, études de cas, carrousel témoignages, i18n EN, CMS, animations complexes, dashboard admin, inscription formation, paiement, authentification, filtres dynamiques sur formations.

---

## 6. SPRINT 2 — Profondeur de l'offre (2 semaines)

### 6.1 Objectif
Enrichir le site avec les pages conseil détaillées, fiches formations individuelles, et activer l'analytics.

### 6.2 Scope
- Page **`/conseil`** + 3 sous-pages par pôle :
  - `/conseil/sante-publique`
  - `/conseil/gestion-projet`
  - `/conseil/data-digital`
- Fiches formation détaillées `/formations/[slug]` (Astro Content Collections, Markdown)
- PDF programme téléchargeable par formation (hébergé dans `/public/pdf/`)
- Teaser **TOUT & PLUS** sur l'accueil (bandeau) → lien sortant
- Déploiement **Plausible** self-hosted sur `plausible.afriklearn-consulting.com`
- Intégration tracking Plausible sur toutes les pages

### 6.3 DoD additionnels
- [ ] Au moins 6 fiches formations publiées
- [ ] Plausible reçoit des événements en production
- [ ] Toutes les nouvelles pages passent le même bench Lighthouse que Sprint 1

---

## 7. SPRINT 3 — Contenu & crédibilisation (2 semaines)

### 7.1 Scope
- Section **Blog / Insights** (`/blog`) avec Astro Content Collections (Markdown versionné dans Git, zéro CMS)
  - Pages de liste + pagination
  - Pages d'article avec JSON-LD `Article`
  - RSS feed
- 2 à 3 **études de cas** (`/realisations/[slug]`) — contenu à fournir
- **Témoignages clients** : grille sur l'accueil + page dédiée `/temoignages`
- Audit accessibilité WCAG AA complet (axe-core + test manuel clavier + lecteur d'écran)

### 7.2 DoD
- [ ] Minimum 3 articles de blog publiés
- [ ] 2 études de cas publiées
- [ ] 5 témoignages avec autorisation écrite de publication
- [ ] 0 violation critique/sérieuse axe-core

---

## 8. Backlog post-MVP (ne pas démarrer sans décision explicite)

| Priorité | Item | Effort estimé |
|----------|------|---------------|
| Haute | Version anglaise (i18n via `@astrojs/i18n`) | 1 sprint |
| Moyenne | CMS headless (Sanity ou Decap CMS git-based) si volume éditorial > 2 articles/mois | 1 sprint |
| Moyenne | Système de newsletter (intégration Listmonk self-hosted sur VPS) | 0.5 sprint |
| Moyenne | Page "Carrières" avec formulaire candidature | 0.5 sprint |
| Basse | Chat / WhatsApp Business bouton flottant | 0.2 sprint |
| Basse | Mode sombre | 0.5 sprint |
| Basse | SSO vitrine ↔ academy (si pertinence business confirmée) | 2+ sprints, projet séparé |

---

## 9. Structure du dépôt

```
afriklearn-vitrine/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # lint, typecheck, build, lighthouse
│       └── deploy.yml                # rsync vers VPS sur push main
├── .env.example
├── .gitignore
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── README.md
├── CLAUDE.md                          # ce fichier
├── docs/
│   ├── design-system.md
│   ├── deployment.md
│   └── content-guidelines.md
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── pdf/                          # programmes formations (Sprint 2)
│   └── images/
├── src/
│   ├── assets/                       # images optimisées par Astro
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── Container.astro
│   │   ├── sections/
│   │   │   ├── Hero.astro
│   │   │   ├── ExpertiseGrid.astro
│   │   │   ├── FormationCard.astro
│   │   │   ├── PillarsGrid.astro
│   │   │   └── CTASection.astro
│   │   ├── forms/
│   │   │   └── ContactForm.tsx       # React island
│   │   └── shared/
│   │       ├── Button.astro
│   │       ├── Badge.astro
│   │       └── SectionHeading.astro
│   ├── content/                      # Sprint 2+
│   │   ├── formations/
│   │   └── blog/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── a-propos.astro
│   │   ├── formations.astro
│   │   ├── contact.astro
│   │   ├── mentions-legales.astro
│   │   └── politique-confidentialite.astro
│   ├── styles/
│   │   ├── tokens.css
│   │   └── global.css
│   └── lib/
│       └── seo.ts
├── server/
│   └── contact-service/              # micro-service Express (SMTP) — voir §15 dérogation 2026-11-15
│       ├── index.js
│       ├── package.json
│       └── .env.example
└── tests/
    └── lighthouserc.json
```

---

## 10. Conventions de code

### 10.1 Général
- **TypeScript strict** partout (`"strict": true`)
- Pas de `any` — utiliser `unknown` puis narrow
- Nommage fichiers : `PascalCase.astro` pour composants, `kebab-case.astro` pour pages
- Commentaires en **français**, concis, seulement quand la logique n'est pas évidente
- Un composant = un fichier = une responsabilité

### 10.2 Astro
- Composants `.astro` par défaut
- `.tsx` React uniquement pour îlots interactifs (formulaires, carrousels)
- Directive `client:visible` ou `client:idle` jamais `client:load` sauf justification
- `<Image />` d'Astro obligatoire pour toute image (optimisation auto AVIF/WebP)

### 10.3 Tailwind
- Préférer les utility classes, pas de CSS custom sauf tokens
- Extraire en composant Astro dès qu'une combinaison de classes se répète 3+ fois
- Pas de `@apply` sauf dans `global.css` pour patterns transverses

### 10.4 Git & commits
- **Conventional Commits** : `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `perf:`, `style:`, `test:`, `ci:`
- Scope sprint : `feat(sprint-1): add hero section`
- Une PR = une feature, revue obligatoire avant merge
- `main` protégée, pas de push direct
- Tags SemVer : `v0.1.0` à la fin du Sprint 1, `v0.2.0` Sprint 2, `v1.0.0` fin Sprint 3

---

## 11. SEO & performance

### 11.1 Cible Lighthouse (mobile, throttling 4G)
- Performance ≥ 90
- Accessibilité ≥ 95
- Best Practices ≥ 95
- SEO = 100

### 11.2 Budgets
- LCP < 2.5 s
- CLS < 0.1
- INP < 200 ms
- JS total par page ≤ 50 Ko (grâce à Astro 0-JS par défaut)
- Image hero ≤ 150 Ko en AVIF

### 11.3 Technique
- `generateMetadata` par page (via frontmatter Astro)
- Open Graph + Twitter Cards
- `sitemap.xml` auto via `@astrojs/sitemap`
- `robots.txt` manuel dans `/public/`
- JSON-LD : `Organization`, `BreadcrumbList`, `Course` (Sprint 2), `Article` (Sprint 3)
- Fonts self-hosted avec `font-display: swap`
- Pas de bibliothèques tierces lourdes sans justification écrite

---

## 12. Conformité juridique

### 12.1 OHADA (statut)
Mentions légales doivent inclure :
- Dénomination sociale complète : AFRIK'LEARN CONSULTING SARL
- Forme juridique : SARL de droit OHADA
- Capital social (à préciser)
- Siège social (à préciser)
- Numéro RCCM Abidjan (à préciser)
- Gérante : Mme TANOU Lath You Rita Marcelle
- Directeur de la publication : {{à définir}}
- Hébergeur : {{nom hébergeur VPS, adresse, téléphone}}

### 12.2 Protection des données
- **RGPD** (clients UE, bailleurs européens)
- **Loi ivoirienne n° 2013-450** du 19 juin 2013 relative à la protection des données à caractère personnel
- Déclaration / autorisation **ARTCI** à vérifier pour le traitement du formulaire contact
- Politique de confidentialité conforme aux deux régimes
- Durée de conservation des données du formulaire : 3 ans max après dernier contact

### 12.3 Cookies
- **Plausible self-hosted** ne pose aucun cookie et respecte RGPD/ePrivacy nativement → **pas de bannière cookies nécessaire** si c'est le seul outil analytics.
- Si ajout futur de Google Analytics / Meta Pixel : bannière conforme obligatoire (CNIL + ARTCI).

---

## 13. Items à faire confirmer par le client (DoR Sprint 1)

### Identité
- [ ] Logo SVG (horizontal, vertical, monochrome, favicon)
- [ ] Palette couleur définitive (validation sur la proposition §4.1)
- [ ] Charte graphique existante si disponible

### Contenu
- [ ] Textes des 4 pages MVP (brouillons acceptés)
- [ ] Liste définitive des 6-12 formations à afficher
- [ ] Photo + bio des co-fondateurs
- [ ] Liste des partenaires/clients avec logos et **autorisations écrites** d'affichage

### Infrastructure
- [ ] Accès SSH au VPS (créer un user `deploy` avec droits limités sur `/var/www/afriklearn-vitrine/`)
- [ ] Nom de domaine `afriklearn-consulting.com` pointé vers l'IP du VPS (A record)
- [ ] Email `contact@afriklearn-consulting.com` provisionné + identifiants SMTP
- [ ] Directeur de la publication désigné
- [ ] Déclaration ARTCI faite ou en cours

### Juridique
- [ ] Capital social, RCCM, adresse siège, pour mentions légales
- [ ] CGV éventuelles (Sprint 2+ si inscription directe)

### Communication
- [ ] Comptes réseaux sociaux officiels (URLs LinkedIn, Facebook, YouTube, X)
- [ ] Coordonnées hébergeur du VPS (OVH, Hetzner, etc.) pour mentions légales

---

## 14. Journal des décisions (ADR léger)

| Date | Décision | Motif |
|------|----------|-------|
| 2026-11-12 | Stack : **Astro** (pas Next.js) | Vitrine marketing pure, mobile Afrique prioritaire, 0 JS par défaut |
| 2026-11-12 | Hébergement : **VPS existant** (pas Vercel) | Cohérence opérationnelle avec l'academy, souveraineté, coût nul |
| 2026-11-12 | Domaine racine : **afriklearn-consulting.com** à l'apex | Vitrine = porte d'entrée corporate ; academy reste en sous-domaine |
| 2026-11-12 | Pas de SSO vitrine ↔ academy au MVP | Les deux surfaces restent indépendantes ; un simple lien sortant suffit |
| 2026-11-12 | Analytics : **Plausible self-hosted** | RGPD natif, pas de bannière cookies, souveraineté |

---

## 15. Dérogations (à remplir uniquement si nécessaire)

| Date | Dérogation | Motif | Validé par |
|------|-----------|-------|------------|
| 2026-11-15 | Formulaire de contact : pas de route `src/pages/api/contact.ts` dans Astro. Remplacé par un micro-service Express séparé (`server/contact-service/`), tournant sous PM2 sur le VPS. | `output: "static"` (décision §3.1/§3.2) ne peut pas exécuter de route serveur sans adaptateur Node — ce qui aurait annulé le choix "0 runtime Node en prod pour la vitrine". Le micro-service isole le seul besoin dynamique, sur le modèle déjà en place pour l'academy (Node/Express/PM2). Le contrat fonctionnel du formulaire (§5.2 Page 4 : Zod, honeypot, rate limiting, SMTP) est intégralement respecté, seule l'implémentation technique change. | Scaffolding initial — à confirmer par le Directeur Associé |
| 2026-11-15 | Astro figé en **7.x** au lieu de 5.x initialement spécifié en §3.1. Zod figé en **4.x** au lieu de 3.x. Nodemailer figé en **10.x** au lieu de 6.x (côté `contact-service`). | GitHub Dependabot a signalé 54 vulnérabilités sur le commit initial (2 critiques dont une RCE Astro via optimisation d'image AVIF, 15 élevées dont une SSRF et une XSS Astro, une DoS Zod, 22 CVE Nodemailer dont injections SMTP). Les correctifs n'existaient qu'à partir d'Astro ≥7.2.8, Zod ≥4.6.6 et Nodemailer ≥10.x — pas de patch mineur disponible. Mise à jour effectuée immédiatement (Sprint 0, aucun code de production encore livré) plutôt que de porter ces vulnérabilités jusqu'au Sprint 1. Résultat après mise à jour : 1 vulnérabilité low résiduelle (bug esbuild dev-server, Windows uniquement, non exploitable sur notre pipeline Linux CI/VPS), non corrigée car sans impact réel. | Scaffolding initial — à confirmer par le Directeur Associé |
| 2026-11-15 | **Node (build) relevé à 22 LTS**, au lieu du **20 LTS** spécifié en §3.1 ("alignement avec l'academy"). Mise à jour de `.github/workflows/ci.yml`, `.github/workflows/deploy.yml` (`node-version: 20` → `22`) et de `package.json` (`engines.node` : `>=20.0.0` → `>=22.23.4`). | Conséquence directe de la dérogation Astro 7.x ci-dessus : Astro ≥7.x refuse de démarrer sous Node 20 (`Node.js v20.20.2 is not supported by Astro! […] ">=22.23.4"` requis), ce qui faisait échouer la CI (`build-and-check`) sur la PR #2. Comme le correctif de sécurité Astro 7.x n'est pas négociable (54 vulnérabilités dont 2 critiques), c'est la contrainte Node 20 qui cède. **Point d'attention avant déploiement production (DoD Sprint 1)** : vérifier que le VPS (qui héberge aussi l'academy) tourne bien sous Node ≥22.23.4, ou le mettre à niveau — sinon `deploy.yml` restera cohérent avec la CI mais le build local sur le VPS (s'il y en a un, hors pipeline rsync) échouerait pareillement. L'alignement de version avec l'academy n'est donc plus garanti nativement et devra être revérifié. | CI automatique (correctif de build cassé) — à confirmer par le Directeur Associé |

---

**Fin du contrat Sprint 0.**
Toute évolution de ce document exige une nouvelle version numérotée et une entrée dans le §14.
