# Architecture des packages

Ce repo est un **monorepo** avec **2 packages** séparés volontairement :

## 1) `@cappasoft-dev/openrouter-models` (headless)

- Contient la logique **sans UI** : client, types, grouping/catégorisation, modèles recommandés.
- Peut être utilisé partout (Node, frontend, etc.) tant qu’on peut appeler l’API OpenRouter.

## 2) `@cappasoft-dev/openrouter-model-selector` (UI React)

- Contient le composant React `ModelSelector` + les helpers UI (shadcn-like).
- Dépend de `@cappasoft-dev/openrouter-models` pour la donnée (fetch + grouping).
- Expose aussi un `styles.css` compilé via Tailwind pour un rendu immédiat.

## Pourquoi 2 packages ?

- **Séparation des responsabilités** : data/logic vs UI.
- **Réutilisable** : tu peux consommer le headless sans embarquer React/Tailwind.
- **Build/peer deps** plus propres : React reste en `peerDependencies` côté UI.


