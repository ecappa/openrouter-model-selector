# Guide de Migration et Bonnes Pratiques : @cappasoft/openrouter-model-selector

**Date :** 7 janvier 2026  
**Composant :** `@cappasoft/openrouter-model-selector`  
**Contexte :** Conflit CSS avec l'application `posts-generator` utilisant Tailwind v4 + shadcn/ui

---

## 🔍 Problème identifié

### Symptômes observés
- Barre latérale (sidebar) invisible ou cassée
- Thème qui "saute" lors de l'affichage du composant
- Conflits visuels généraux

### Cause racine

Le CSS du composant (`styles.css`) inclut le **Tailwind CSS preflight/reset GLOBAL** qui écrase les styles de l'application parente.

```css
/* Règles problématiques dans le CSS actuel du composant */
*,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}
:host,html{line-height:1.5;font-family:ui-sans-serif,system-ui,...}
body{margin:0;line-height:inherit}
menu,ol,ul{list-style:none;margin:0;padding:0}  /* ← Casse la sidebar */
```

### Double conflit identifié

| Conflit | Application | Composant |
|---------|-------------|-----------|
| **Preflight** | Tailwind v4 via `@import "tailwindcss"` | Tailwind v3 preflight global |
| **Format couleurs** | `oklch` (ex: `oklch(0.985 0 0)`) | `hsl` (ex: `hsl(var(--foreground))`) |

---

## ✅ Bonnes pratiques pour composants npm

### Règle #1 : Désactiver le preflight (OBLIGATOIRE)

Le preflight/reset CSS doit être appliqué **UNE SEULE FOIS** par l'application racine, jamais par un composant tiers.

```js
// tailwind.config.js du composant
export default {
  corePlugins: {
    preflight: false  // ← OBLIGATOIRE pour tout composant npm
  }
}
```

**Pourquoi ?**
- Un composant npm doit être "isolé"
- Il ne doit jamais modifier les styles globaux
- Les grandes librairies (Radix UI, Headless UI, shadcn/ui) font pareil

### Règle #2 : Être agnostique sur le format des couleurs

#### ❌ À éviter (dépend du format)
```css
.orm-text { color: hsl(var(--foreground)); }
/* Cassé si l'app utilise oklch ! */
```

#### ✅ Recommandé (agnostique)
```css
.orm-text { color: var(--foreground); }
/* Fonctionne avec hsl ET oklch */
```

### Règle #3 : Variables internes avec fallback

```css
.orm-root {
  /* Variables internes du composant avec fallback */
  --orm-bg: var(--popover, var(--background, #fff));
  --orm-fg: var(--popover-foreground, var(--foreground, #000));
  --orm-border: var(--border, #e5e7eb);
  --orm-primary: var(--primary, #6366f1);
  --orm-muted: var(--muted-foreground, #6b7280);
  --orm-accent: var(--accent, #f3f4f6);
}

/* Utilise les variables internes */
.orm-container {
  background: var(--orm-bg);
  color: var(--orm-fg);
  border-color: var(--orm-border);
}
```

**Avantages :**
- Compatible Tailwind v3 (hsl)
- Compatible Tailwind v4 (oklch)
- Compatible apps sans Tailwind (fallback)
- Compatible shadcn/ui (toutes versions)

### Règle #4 : Tout scoper sous une classe racine

S'assurer qu'aucune règle CSS ne s'applique globalement :

```css
/* ❌ Mauvais - affecte tout le DOM */
* { box-sizing: border-box; }
ul { list-style: none; }

/* ✅ Bon - scopé sous .orm-root */
.orm-root * { box-sizing: border-box; }
.orm-root ul { list-style: none; }
```

---

## 🚀 Migration vers Tailwind v4

### Décision

Pour des apps modernes (Next.js 15+, shadcn récent), **migrer en Tailwind v4** est recommandé.

### Commande de migration

```bash
npx @tailwindcss/upgrade
```

### Changements principaux v3 → v4

| Aspect | Tailwind v3 | Tailwind v4 |
|--------|-------------|-------------|
| Import | `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| Couleurs | `hsl` | `oklch` (natif) |
| Config | `tailwind.config.js` | CSS-first avec `@theme` |
| Variables | Manuelles | Auto-générées |

### Configuration recommandée post-migration

```js
// tailwind.config.js (ou tailwind.config.ts)
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false  // TOUJOURS désactivé pour composant npm
  },
  theme: {
    extend: {}
  }
}
```

---

## 📋 Checklist de publication

Avant de republier le composant :

- [ ] `preflight: false` dans la config Tailwind
- [ ] Remplacer tous les `hsl(var(--xxx))` par `var(--xxx)`
- [ ] Définir des variables internes (`--orm-*`) avec fallback
- [ ] Vérifier qu'aucun sélecteur global (`*`, `body`, `html`) n'est hors scope
- [ ] Tester avec une app Tailwind v3
- [ ] Tester avec une app Tailwind v4
- [ ] Tester avec une app sans Tailwind

---

## 📦 Structure CSS finale recommandée

```css
/* styles.css du composant */

/* Variables internes - isolées et avec fallback */
.orm-root {
  --orm-background: var(--popover, var(--background, #ffffff));
  --orm-foreground: var(--popover-foreground, var(--foreground, #0f172a));
  --orm-border: var(--border, #e2e8f0);
  --orm-input: var(--input, #e2e8f0);
  --orm-ring: var(--ring, #6366f1);
  --orm-primary: var(--primary, #6366f1);
  --orm-primary-foreground: var(--primary-foreground, #ffffff));
  --orm-secondary: var(--secondary, #f1f5f9);
  --orm-secondary-foreground: var(--secondary-foreground, #0f172a));
  --orm-muted: var(--muted, #f1f5f9);
  --orm-muted-foreground: var(--muted-foreground, #64748b));
  --orm-accent: var(--accent, #f1f5f9);
  --orm-accent-foreground: var(--accent-foreground, #0f172a));
  --orm-destructive: var(--destructive, #ef4444);
  --orm-radius: var(--radius, 0.5rem);
}

/* Contraste élevé */
.orm-contrast-high {
  --orm-text-secondary: var(--orm-foreground);
  --orm-text-muted: var(--orm-muted-foreground);
}

/* Classes utilitaires du composant */
.orm-container {
  background: var(--orm-background);
  color: var(--orm-foreground);
  border: 1px solid var(--orm-border);
  border-radius: var(--orm-radius);
}

/* ... reste des styles, tous scopés ... */
```

---

## 🔗 Références

- [Tailwind CSS v4 Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Radix UI - Styling Best Practices](https://www.radix-ui.com/docs/primitives/overview/styling)
- [shadcn/ui - Theming](https://ui.shadcn.com/docs/theming)
- [CSS oklch() color function](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)

---

## 📝 Notes

Ce guide a été créé suite à l'analyse d'un conflit CSS entre le composant `@cappasoft/openrouter-model-selector` (v1.2.0) et l'application `posts-generator` utilisant :
- Next.js 16.1.1
- Tailwind CSS v4
- shadcn/ui (version oklch moderne)
- next-themes pour le dark mode

