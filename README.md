# AFRIK'LEARN Consulting — Site vitrine

Site vitrine corporate pour AFRIK'LEARN Consulting SARL. Build statique Astro, hébergé sur
le VPS existant qui fait déjà tourner `academy.afriklearn-consulting.com`.

**Avant toute chose : lire `CLAUDE.md`** (contrat de gouvernance du projet — architecture,
sprints, DoR/DoD, conventions). Ce README est un guide d'onboarding rapide ; `CLAUDE.md` est
la source de vérité.

## État actuel

Scaffolding Sprint 1 complet : 4 pages, design system, formulaire de contact fonctionnel
(micro-service dédié), CI/CD. Le contenu réel n'est pas encore intégré — chaque zone à
compléter est marquée `{{PLACEHOLDER_...}}` dans le code.

**Avant mise en production**, voir `docs/dor-sprint-1.md` — la checklist des informations
et accès encore nécessaires côté client.

## Stack

- [Astro 5](https://astro.build) (SSG, `output: "static"`)
- Tailwind CSS 4
- React 19 (îlots interactifs uniquement — formulaire de contact)
- TypeScript strict
- pnpm

Le formulaire de contact **n'est pas** géré par Astro (qui reste 100 % statique) mais par un
micro-service Express séparé dans `server/contact-service/`, tournant sous PM2 sur le VPS —
voir `docs/deployment.md` pour le détail et la justification de ce choix.

## Démarrage local

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

Pour tester le formulaire de contact en local, lancer aussi le micro-service :

```bash
cd server/contact-service
npm install
cp .env.example .env   # renseigner un compte SMTP de test (ex: Mailtrap)
npm run dev             # port 4001
```

Et ajouter côté Astro un proxy dev dans `astro.config.mjs` si besoin, ou appeler directement
`http://localhost:4001/api/contact` pendant le développement.

## Build

```bash
pnpm run build    # type-check (astro check) + build statique dans dist/
pnpm run preview  # prévisualiser le build
```

## Structure du projet

Voir `CLAUDE.md` §9 pour l'arborescence complète et la justification de chaque dossier.

```
src/
├── components/     # layout/, sections/, forms/, shared/
├── layouts/         # BaseLayout.astro
├── pages/           # les 4 pages Sprint 1 + pages légales
├── lib/             # seo.ts
└── styles/          # tokens.css (design tokens), global.css

server/contact-service/   # micro-service Express pour le formulaire contact

docs/
├── design-system.md      # palette, typo, composants — statut "à valider"
├── deployment.md          # procédure complète de déploiement VPS + Nginx
└── dor-sprint-1.md         # checklist des items client manquants avant prod
```

## Trouver ce qui reste à compléter

```bash
grep -rn "{{PLACEHOLDER" src/
```

Chaque résultat correspond à un item de `docs/dor-sprint-1.md`.

## Déploiement

Push sur `main` → `.github/workflows/ci.yml` (build + Lighthouse CI) puis
`.github/workflows/deploy.yml` (rsync vers le VPS + reload Nginx).

Secrets GitHub requis : `VPS_HOST`, `VPS_DEPLOY_USER`, `VPS_DEPLOY_SSH_KEY`.
Détail complet : `docs/deployment.md`.

## Gouvernance

Développement en sprints gouvernés par `CLAUDE.md` :
- **Sprint 1** (ce scaffolding) — MVP vitrine, 4 pages
- **Sprint 2** — pages conseil détaillées, fiches formations, Plausible
- **Sprint 3** — blog, études de cas, audit accessibilité

Tout écart par rapport au périmètre défini doit être tracé dans `CLAUDE.md` §15
(Dérogations), pas improvisé dans le code.
