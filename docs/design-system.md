# Design system — AFRIK'LEARN Consulting

> Statut : **proposition v1, non validée.** À soumettre à Mme TANOU avant le début effectif
> du Sprint 1. Référence complète : `CLAUDE.md` §4.

## Palette

| Token | Valeur | Usage |
|---|---|---|
| `al-primary-900` | `#0A4D68` | Texte sur fond clair, fonds foncés (footer CTA) |
| `al-primary-700` | `#088395` | Boutons primaires, liens actifs |
| `al-accent-500` | `#E8A33D` | CTA d'accent, badges |
| `al-accent-700` | `#A6620F` | Texte sur fond blanc (eyebrow, rôles) — foncé depuis `#C97B1A` pour l'AA (voir note ci-dessous) |
| `al-ink-900` | `#0F172A` | Texte principal |
| `al-ink-500` | `#64748B` | Texte secondaire |
| `al-surface` | `#F8FAFC` | Fonds de section alternés |

Définis comme variables CSS dans `src/styles/tokens.css`, exposés à Tailwind via `@theme`
dans `src/styles/global.css` (classes `bg-al-primary-700`, `text-al-ink-500`, etc.).

## Typographie

- Titres : **Plus Jakarta Sans** (600, 700) — `@fontsource/plus-jakarta-sans`
- Corps : **Inter** (400, 500, 600) — `@fontsource/inter`
- Self-hosted (pas de CDN Google Fonts) pour la souveraineté et la performance.

## Composants disponibles

| Composant | Fichier | Rôle |
|---|---|---|
| `Button` | `src/components/shared/Button.astro` | 4 variantes : primary, secondary, ghost, accent |
| `Badge` | `src/components/shared/Badge.astro` | Étiquette (pôle, statut) |
| `SectionHeading` | `src/components/shared/SectionHeading.astro` | Titre de section + eyebrow + description |
| `Hero` | `src/components/sections/Hero.astro` | Bloc d'accroche avec double CTA |
| `ExpertiseGrid` | `src/components/sections/ExpertiseGrid.astro` | Grille 3 colonnes des pôles |
| `FormationCard` | `src/components/sections/FormationCard.astro` | Carte formation avec CTA Academy |
| `PillarsGrid` | `src/components/sections/PillarsGrid.astro` | 4 piliers "Pourquoi AFRIK'LEARN" |
| `CTASection` | `src/components/sections/CTASection.astro` | Bandeau CTA pleine largeur |
| `ContactForm` | `src/components/forms/ContactForm.tsx` | Îlot React, formulaire validé (Zod) |

## Corrections d'accessibilité déjà apportées au scaffolding

Trois échecs de contraste AA détectés par Lighthouse ont été corrigés directement dans les
tokens/composants (et non en ignorant l'audit) :

- Bouton `primary` (`Button.astro`, `ContactForm.tsx`) : base passée de `al-primary-700` à
  `al-primary-900` (le `700` en texte blanc n'atteignait que 4.47:1, sous le seuil 4.5:1).
- `al-accent-700` foncé de `#C97B1A` à `#A6620F` (3.31:1 → 4.80:1) — impacte `SectionHeading`
  (eyebrow), `Badge` (variante accent) et le rôle des fondateurs sur `/a-propos`.
- Texte du placeholder visuel hero : `al-ink-500` → `al-ink-700` sur fond clair.

Ces trois tokens/couleurs restent **à valider** avec le reste de la palette (voir DoR).

## Point d'attention : budget JS de la page Contact

`ContactForm.tsx` (React + React Hook Form + Zod, hydraté via `client:visible`) pèse environ
95 Ko minifiés + ~215 Ko de runtime React partagé, avant gzip ~27 Ko + ~67 Ko. Cela dépasse
le budget de 50 Ko JS/page fixé en CLAUDE.md §11.2 — mais seulement sur `/contact`, la seule
page avec un îlot interactif. Les 3 autres pages du Sprint 1 restent à 0 Ko de JS applicatif.

Avant le DoD Sprint 1, mesurer l'impact réel sur Lighthouse mobile. Si le score Performance
en pâtit, deux options : (a) accepter le dépassement sur cette seule page (le budget visait
l'ensemble du site, pas une page à formulaire), ou (b) remplacer React par un formulaire HTML
natif + validation JS vanilla pour cette page précise. Décision à trancher en Sprint 1, pas
avant — pas de sur-ingénierie prématurée.

## Ce qui reste à valider avant production

- [ ] Palette couleur définitive (proposition ci-dessus à confirmer ou amender)
- [ ] Logo SVG officiel (actuellement texte brut dans `Header.astro`)
- [ ] Photographies (hero, fondateurs) — voir tous les `{{PLACEHOLDER_IMAGE}}` du code
