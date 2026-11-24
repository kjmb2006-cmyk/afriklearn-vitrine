# Vidéos de démonstration — section "Nos réalisations en vidéo"

> Section ajoutée sur l'accueil le 24/11/2026, décision client. Actuellement **3 emplacements
> vides** en attente de vraies vidéos. Référence : `src/components/sections/VideoShowcase.astro`,
> `src/pages/index.astro` (variable `demoVideos`).

## Décisions actées (24/11/2026)

- **Hébergement** : YouTube (gratuit, CDN rapide). Peut être mis en "non répertorié" si vous ne
  voulez pas de chaîne publique visible — la vidéo reste accessible uniquement via le lien
  intégré sur le site.
- **Confidentialité** : embed via `youtube-nocookie.com`, chargement différé au clic (aucun
  cookie tiers déposé tant que le visiteur ne clique pas sur "Lire").
- **Emplacement** : nouvelle section sur l'accueil, juste après "Nos pôles d'expertise".

## Comment ajouter une vraie vidéo

Pour chaque vidéo à publier, il faut :

1. **Mettre la vidéo en ligne sur YouTube** (publique ou non répertoriée — pas privée, sinon
   l'embed ne fonctionnera pas pour les visiteurs du site)
2. **Récupérer l'ID de la vidéo** : dans l'URL YouTube `https://www.youtube.com/watch?v=XXXXXXXXXXX`,
   c'est la partie après `v=` (11 caractères, ex. `dQw4w9WgXcQ`)
3. **Donner un titre court** pour la légende affichée sur la vignette

Transmettre pour chaque vidéo : **ID YouTube + titre**. Une fois reçu, Claude Code remplace un
des emplacements vides dans `demoVideos` (`src/pages/index.astro`) par
`{ title: "...", youtubeId: "..." }`.

## Limite actuelle

3 emplacements prévus sur l'accueil. Si vous avez plus de 3 vidéos à terme, une page dédiée
"Réalisations" (déjà envisagée au Sprint 3 de CLAUDE.md §7 pour les études de cas) serait plus
adaptée qu'une accumulation sur l'accueil — à rediscuter le moment venu.
