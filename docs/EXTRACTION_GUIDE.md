# Guide d'Extraction : openrouter-model-selector

Ce document décrit comment extraire et publier les packages `@cappasoft-dev/openrouter-models` et `@cappasoft-dev/openrouter-model-selector` vers le dépôt GitHub dédié.

## ❓ Pas clair sur l'architecture ?

➡️ Lis d'abord **[ARCHITECTURE_PACKAGES.md](./ARCHITECTURE_PACKAGES.md)** pour comprendre pourquoi il y a 2 packages et ce qu'il faut copier.

**TL;DR** : Tu copies **TOUT le dossier `packages/`** (les 2 packages ensemble) car ils sont liés.

## 📋 Prérequis

- ✅ Dépôt GitHub créé : `git@github.com:cappasoft-dev/openrouter-model-selector.git`
- ✅ Code dans `packages/` sur la branche `feat/openrouter-model-selector-extraction`
- ✅ Accès en écriture au dépôt GitHub
- Node.js 18+ installé
- npm 9+ ou pnpm 8+

> Note importante : **npm ne supporte pas `workspace:*`** dans les versions de dépendances.
> Si tu utilises npm, mets une version semver normale (ex: `^0.1.0`) et npm workspaces fera le lien local automatiquement.
> Le protocole `workspace:` est surtout pour **pnpm/yarn**.

> Note GitHub Packages : les **fine-grained PAT** ne permettent pas l'accès *Packages* dans tous les cas.
> Pour publier sur GitHub Packages via npm, utilise soit **`GITHUB_TOKEN`** (si ton org autorise `packages:write`),
> soit un **PAT classic** avec `write:packages` (recommandé via un secret `NPM_PUBLISH_TOKEN`).

## ✅ État actuel (dans ce repo)

- **Déjà fait**:
  - `package.json` racine + `tsconfig.json`
  - `packages/*/package.json`
  - **Imports** corrigés vers `@cappasoft-dev/openrouter-models`
  - **Tailwind**: `packages/openrouter-model-selector/src/styles.css` + `tailwind.config.js`
  - **Build tsup**: ajout de `tsup.config.ts` dans chaque package (détection automatique par `tsup`)
  - **Changesets**: `.changeset/config.json`
  - **GitHub Action publish**: `.github/workflows/publish.yml`
  - `README.md` (racine + packages), `.gitignore`, `.npmrc`

- **À faire maintenant** (local):

```bash
npm install
npm run build
npm run typecheck
```

- **Pour publier**:
  - créer un changeset: `npx changeset add`
  - versionner: `npx changeset version`
  - push sur `main` (le workflow peut ensuite publier via Changesets)

## 🚀 Étape 1 : Cloner le nouveau dépôt

```bash
# Depuis n'importe quel répertoire
git clone git@github.com:cappasoft-dev/openrouter-model-selector.git
cd openrouter-model-selector
```

## 📦 Étape 2 : Copier les fichiers depuis egoBot

### 2.1 Copier les packages

Depuis le répertoire `egoBot` :

```bash
# Chemin vers egoBot (adapter selon votre configuration)
cd /Users/ecappannelli/devRoot/cappasoft/egoBot

# Assure-toi d'être sur la bonne branche
git checkout feat/openrouter-model-selector-extraction

# Copier les packages vers le nouveau repo
cp -r packages /chemin/vers/openrouter-model-selector/

# Copier la documentation de feature (optionnel mais recommandé)
cp docs/features/2026-01-05-extraction-model-selector-openrouter.md \
   /chemin/vers/openrouter-model-selector/docs/
```

### 2.2 Copier les fichiers UI Shadcn nécessaires

Les composants UI internes (`button.tsx`, `dialog.tsx`, etc.) sont déjà dans `packages/openrouter-model-selector/src/ui/`. Rien à faire.

## 🛠️ Étape 3 : Créer les fichiers de configuration manquants

Dans le nouveau repo `openrouter-model-selector`, tu dois créer les fichiers suivants :

### 3.1 Package.json racine (workspace root)

Créer `/package.json` :

```json
{
  "name": "@cappasoft-dev/openrouter-model-selector-monorepo",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "npm run build:headless && npm run build:ui",
    "build:headless": "npm run build -w @cappasoft-dev/openrouter-models",
    "build:ui": "npm run build -w @cappasoft-dev/openrouter-model-selector",
    "changeset": "changeset",
    "changeset:version": "changeset version",
    "changeset:publish": "changeset publish",
    "clean": "rm -rf packages/*/dist",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.1",
    "typescript": "^5.8.3"
  }
}
```

### 3.2 TypeScript configs

#### `tsconfig.json` (racine)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx"
  },
  "exclude": ["node_modules", "dist", "build"]
}
```

#### `packages/openrouter-models/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

#### `packages/openrouter-model-selector/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../openrouter-models" }
  ]
}
```

### 3.3 Build configs (tsup)

#### `packages/openrouter-models/tsup.config.ts`

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  external: [],
})
```

#### `packages/openrouter-model-selector/tsup.config.ts`

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  external: ['react', 'react-dom', '@cappasoft-dev/openrouter-models'],
})
```

### 3.4 Package.json des packages (mettre à jour)

#### `packages/openrouter-models/package.json`

```json
{
  "name": "@cappasoft-dev/openrouter-models",
  "version": "0.1.0",
  "description": "Headless client for fetching and managing OpenRouter models",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  },
  "keywords": ["openrouter", "llm", "models", "api"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cappasoft-dev/openrouter-model-selector.git",
    "directory": "packages/openrouter-models"
  },
  "license": "MIT",
  "devDependencies": {
    "tsup": "^8.3.5",
    "typescript": "^5.8.3"
  }
}
```

#### `packages/openrouter-model-selector/package.json`

```json
{
  "name": "@cappasoft-dev/openrouter-model-selector",
  "version": "0.1.0",
  "description": "React UI component for selecting OpenRouter models",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "tsup && npm run build:css",
    "build:css": "tailwindcss -i ./src/styles.css -o ./dist/styles.css --minify",
    "dev": "tsup --watch"
  },
  "keywords": ["openrouter", "llm", "models", "react", "ui", "component"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cappasoft-dev/openrouter-model-selector.git",
    "directory": "packages/openrouter-model-selector"
  },
  "license": "MIT",
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "dependencies": {
    "@cappasoft-dev/openrouter-models": "^0.1.0",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-slot": "^1.2.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.462.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.23",
    "@types/react-dom": "^18.3.7",
    "tailwindcss": "^3.4.17",
    "tsup": "^8.3.5",
    "typescript": "^5.8.3"
  }
}
```

### 3.5 Styles Tailwind

Créer `packages/openrouter-model-selector/src/styles.css` :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS variables pour le thème (compatible avec shadcn/ui) */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}
```

Créer `packages/openrouter-model-selector/tailwind.config.js` :

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
```

### 3.6 .gitignore

Créer `/.gitignore` :

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
dist/
build/
*.tsbuildinfo

# Environment
.env
.env.local
.env.*.local

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
```

### 3.7 .npmrc (pour GitHub Packages)

Créer `/.npmrc` :

```
@cappasoft-dev:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

⚠️ **Important** : Ne jamais commiter de token dans ce fichier. Utilise la variable d'environnement `GITHUB_TOKEN`.

### 3.8 README.md racine

Créer `/README.md` :

```markdown
# OpenRouter Model Selector

React UI component for selecting and managing OpenRouter AI models with headless architecture.

## Packages

- [`@cappasoft-dev/openrouter-models`](./packages/openrouter-models) - Headless client for fetching models
- [`@cappasoft-dev/openrouter-model-selector`](./packages/openrouter-model-selector) - React UI component

## Installation

```bash
npm install @cappasoft-dev/openrouter-model-selector
```

## Quick Start

```tsx
import { ModelSelector } from '@cappasoft-dev/openrouter-model-selector'
import '@cappasoft-dev/openrouter-model-selector/styles.css'

function App() {
  const [model, setModel] = useState('openai/gpt-4o')

  return (
    <ModelSelector
      value={model}
      onValueChange={setModel}
      apiKey="sk-or-v1-..."
    />
  )
}
```

## Documentation

See [feature spec](./docs/2026-01-05-extraction-model-selector-openrouter.md) for detailed architecture and API.

## Development

```bash
npm install
npm run build
```

## License

MIT
```

## 🔧 Étape 4 : Fixer les imports relatifs

### 4.1 Dans `packages/openrouter-model-selector/src/`

Remplacer tous les imports relatifs vers `openrouter-models` :

**Avant :**
```ts
import type { OpenRouterModel } from "../../openrouter-models/src"
import { RECOMMENDED_MODELS } from "../../openrouter-models/src"
```

**Après :**
```ts
import type { OpenRouterModel } from "@cappasoft-dev/openrouter-models"
import { RECOMMENDED_MODELS } from "@cappasoft-dev/openrouter-models"
```

Fichiers à modifier :
- `packages/openrouter-model-selector/src/ModelSelector.tsx`
- `packages/openrouter-model-selector/src/useOpenRouterModels.ts`

## 📦 Étape 5 : Installation et build

```bash
cd openrouter-model-selector

# Installer les dépendances (workspace)
npm install

# Builder les packages
npm run build

# Vérifier que tout compile
npm run typecheck
```

## 🔄 Étape 6 : Configuration Changesets

```bash
npm install -D @changesets/cli
npx changeset init
```

Créer `.changeset/config.json` :

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

## 🚀 Étape 7 : Publication sur GitHub Packages

### 7.1 Configuration locale

Créer un Personal Access Token (PAT) GitHub avec le scope `write:packages` :
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token avec `write:packages` et `repo`
3. Copier le token

Exporter la variable :

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

### 7.2 Login npm

```bash
npm login --scope=@cappasoft-dev --auth-type=legacy --registry=https://npm.pkg.github.com
```

### 7.3 Versionner et publier

```bash
# Créer un changeset
npx changeset add
# (suivre les prompts : major, minor ou patch pour chaque package)

# Appliquer les versions
npx changeset version

# Builder
npm run build

# Publier
npx changeset publish
```

## 🤖 Étape 8 : Automatiser avec GitHub Actions

Créer `.github/workflows/publish.yml` :

```yaml
name: Publish Packages

on:
  push:
    branches:
      - main

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@cappasoft-dev'

      - run: npm ci

      - run: npm run build

      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: npx changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 🔙 Étape 9 : Consommer dans egoBot

Une fois publié, dans `egoBot` :

### 9.1 Installer le package

```bash
cd /Users/ecappannelli/devRoot/cappasoft/egoBot

# Configurer .npmrc pour GitHub Packages
echo "@cappasoft-dev:registry=https://npm.pkg.github.com" >> .npmrc

# Installer
npm install @cappasoft-dev/openrouter-model-selector
```

### 9.2 Supprimer les anciens fichiers

```bash
# Supprimer les packages locaux
rm -rf packages/

# Supprimer l'ancien hook
rm src/hooks/useOpenRouterModels.ts

# Supprimer l'ancien composant
rm src/components/ui/model-selector.tsx
```

### 9.3 Mettre à jour les imports

Dans `src/pages/SettingsPage.tsx` (et autres) :

**Avant :**
```ts
import { ModelSelector } from '@/components/ui/model-selector'
```

**Après :**
```tsx
import { ModelSelector } from '@cappasoft-dev/openrouter-model-selector'
import '@cappasoft-dev/openrouter-model-selector/styles.css'

// Plus loin dans le composant :
<ModelSelector
  value={platformModel}
  onValueChange={(value) => {
    setPlatformModel(value)
    localStorage.setItem(PLATFORM_MODEL_KEY, value)
  }}
  apiKey={openRouterApiKey} // <-- AJOUTER
  showPricing={true}
  showSearch={true}
/>
```

### 9.4 Gérer la clé API

Tu devras passer `apiKey` au composant. Options :
1. La récupérer depuis les settings utilisateur
2. La récupérer depuis Supabase
3. Créer un état local/contexte pour la stocker

## 📝 Checklist finale

- [ ] Repo cloné et packages copiés
- [ ] Tous les fichiers de config créés (tsconfig, tsup, package.json, etc.)
- [ ] Imports relatifs fixés (`../../openrouter-models/src` → `@cappasoft-dev/openrouter-models`)
- [ ] CSS Tailwind créé + config
- [ ] Build réussi (`npm run build`)
- [ ] Changesets configuré
- [ ] Publié sur GitHub Packages
- [ ] GitHub Actions configuré
- [ ] Consommé dans egoBot
- [ ] Tests dans egoBot

## 🆘 Troubleshooting

### Erreur "Cannot find module '@cappasoft-dev/openrouter-models'"

Dans `openrouter-model-selector`, assure-toi que :
1. `openrouter-models` est buildé (`npm run build:headless`)
2. Le workspace est installé (`npm install` à la racine)

### Erreur "Unable to authenticate"

Vérifie que :
1. `GITHUB_TOKEN` est exporté
2. Le token a le scope `write:packages`
3. `.npmrc` est configuré correctement

### Erreur Tailwind "Unknown at rule @tailwind"

C'est normal dans l'éditeur. Le build (`npm run build:css`) fonctionnera.

## 📚 Ressources

- [GitHub Packages npm](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Changesets](https://github.com/changesets/changesets)
- [tsup](https://tsup.egoist.dev/)

---

**Auteur** : EgoBot Team  
**Date** : 5 Janvier 2026

