# Definition of Ready — Sprint 1

> À transmettre à Mme TANOU (Directrice Associée et Gérante) et Dr KORANDJI.
> Chaque item non coché bloque un ou plusieurs `{{PLACEHOLDER}}` déjà présents dans le code.
> Référence : CLAUDE.md §5.3 et §13.

Le scaffolding du site (structure, pages, composants, design system par défaut, CI/CD) est
déjà en place et fonctionnel avec du contenu placeholder. Rien ci-dessous ne bloque le
développement — mais tout bloque la **mise en production**.

## Identité

- [ ] Logo SVG officiel (versions horizontale, verticale, monochrome, favicon)
  → remplace `public/favicon.svg` et le texte dans `src/components/layout/Header.astro`
- [ ] Palette couleur validée (proposition dans `docs/design-system.md` §Palette)
  → ou confirmation que la proposition convient telle quelle

## Contenu

- [ ] Textes définitifs des 4 pages (accueil, à propos, formations, contact) — brouillons acceptés
  → remplace tous les `{{PLACEHOLDER}}` texte dans `src/pages/*.astro`
- [ ] Liste définitive de 6 à 12 formations (titre, pôle, durée, modalité, lien Academy exact)
  → remplace `{{PLACEHOLDER_FORMATION_N}}` dans `src/pages/index.astro` et `src/pages/formations.astro`
- [ ] Photo + bio courte des deux co-fondateurs
  → remplace les `{{PLACEHOLDER_PHOTO}}` / `{{PLACEHOLDER_BIO}}` dans `src/pages/a-propos.astro`
- [ ] 4-5 valeurs de l'entreprise (titre + description courte)
  → remplace `{{PLACEHOLDER_VALEUR_N}}` dans `src/pages/a-propos.astro`
- [ ] Liste des partenaires/clients autorisant l'affichage de leur logo (avec autorisation écrite)
  → section "Ils nous font confiance", actuellement absente, à ajouter une fois reçue

## Infrastructure

- [ ] Accès SSH au VPS : créer un utilisateur `deploy` avec droits limités sur
      `/var/www/afriklearn-vitrine/` (voir `docs/deployment.md` §1)
- [ ] Clé publique SSH générée pour GitHub Actions ajoutée à `authorized_keys` du user `deploy`
- [ ] Nom de domaine `afriklearn-consulting.com` pointé vers l'IP du VPS (enregistrement A)
- [ ] Email `contact@afriklearn-consulting.com` provisionné + identifiants SMTP
  → à renseigner dans `server/contact-service/.env` (jamais commité)
- [ ] URL exacte confirmée de `academy.afriklearn-consulting.com` (déjà supposée correcte dans le code)
- [ ] URL exacte confirmée du sous-domaine TOUT & PLUS
  → remplace `{{PLACEHOLDER_URL}}` dans `src/components/layout/Footer.astro`

## Juridique

- [ ] Capital social, numéro RCCM, adresse exacte du siège
  → remplace les `{{PLACEHOLDER_*}}` dans `src/pages/mentions-legales.astro`
- [ ] Nom du Directeur de la publication (distinct de la Gérante si applicable)
- [ ] Coordonnées de l'hébergeur du VPS (nom, adresse, téléphone) pour les mentions légales
- [ ] Email dédié aux demandes RGPD/protection des données (peut être `contact@...`)
  → remplace `{{PLACEHOLDER_EMAIL_DPO}}` dans `src/pages/politique-confidentialite.astro`
- [ ] Vérification si une déclaration ARTCI est requise pour le traitement du formulaire contact

## Communication

- [ ] URLs des comptes réseaux sociaux officiels (LinkedIn, Facebook, etc.)
  → remplace `{{PLACEHOLDER_LINKEDIN}}`, `{{PLACEHOLDER_FACEBOOK}}` dans `Footer.astro` et `a-propos.astro`

---

**Comment utiliser ce document :** chercher `{{PLACEHOLDER` dans le code (`grep -r "{{PLACEHOLDER" src/`)
donne la liste exhaustive et à jour de ce qui reste à remplacer.
