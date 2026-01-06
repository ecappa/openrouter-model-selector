# 🤖 OpenRouter Model Selector

[![npm version](https://img.shields.io/npm/v/@cappasoft/openrouter-model-selector.svg?style=flat-square)](https://www.npmjs.com/package/@cappasoft/openrouter-model-selector)
[![npm downloads](https://img.shields.io/npm/dm/@cappasoft/openrouter-model-selector.svg?style=flat-square)](https://www.npmjs.com/package/@cappasoft/openrouter-model-selector)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A beautiful React component for selecting AI models from [OpenRouter](https://openrouter.ai). Features a compact dropdown with an expandable model library for exploring 200+ models.

<p align="center">
  <img src="./static/model-selector.png" alt="Model Selector Component" width="400" />
</p>

<p align="center">
  <img src="./static/model-library-popup.png" alt="Model Library Popup" width="600" />
</p>

## ✨ Features

- 🎨 **Beautiful UI** — Clean, modern design with dark mode support
- 🔍 **Smart Search** — Find models by name, provider, or capability
- 📂 **Categorized** — Models grouped by provider (OpenAI, Anthropic, Google, etc.)
- ⭐ **Recommended Models** — Curated list of popular models for quick access
- 🪶 **Lightweight** — Headless architecture with tree-shakeable exports
- 🔒 **Secure** — API key never leaves the client

## 📦 Packages

| Package | Description |
|---------|-------------|
| [`@cappasoft/openrouter-model-selector`](https://www.npmjs.com/package/@cappasoft/openrouter-model-selector) | React UI component |
| [`@cappasoft/openrouter-models`](https://www.npmjs.com/package/@cappasoft/openrouter-models) | Headless client for fetching models |

## 🚀 Installation

```bash
npm install @cappasoft/openrouter-model-selector
```

## 🎯 Quick Start

```tsx
import { useState } from 'react'
import { ModelSelector } from '@cappasoft/openrouter-model-selector'
import '@cappasoft/openrouter-model-selector/styles.css'

export function App() {
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

## 🛠️ Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Currently selected model ID |
| `onValueChange` | `(modelId: string) => void` | Callback when model changes |
| `apiKey` | `string` | Your OpenRouter API key |
| `disabled?` | `boolean` | Disable the selector |
| `contrast?` | `"default" \| "high-contrast"` | Increase contrast for secondary text (prices, metadata, headers) |
| `locale?` | `"en" \| "fr"` | UI language (labels + formatting) |
| `showAllInModal?` | `boolean` | Put the full library in a modal (recommended for large lists) |
| `infoToggle?` | `boolean` | Adds an “info” button to show the selected model details |

## 🎨 Styling

The component uses Tailwind CSS classes. Import the included stylesheet or customize with your own:

```tsx
// Use included styles
import '@cappasoft/openrouter-model-selector/styles.css'

// Or wrap with your own Tailwind config
<div className="dark">
  <ModelSelector ... />
</div>
```

## 🧩 Use cases (from the Playground)

### **1) API key from env (recommended for local dev)**

In Vite, expose your key via `VITE_OPENROUTER_API_KEY`:

```bash
export VITE_OPENROUTER_API_KEY="sk-or-v1-..."
```

### **2) “Draft + Apply” pattern (avoid spamming API while typing)**

```tsx
import { useState } from 'react'
import { ModelSelector } from '@cappasoft/openrouter-model-selector'
import '@cappasoft/openrouter-model-selector/styles.css'

export function App() {
  const initialKey = (import.meta as any).env?.VITE_OPENROUTER_API_KEY ?? ''
  const [apiKeyDraft, setApiKeyDraft] = useState(initialKey)
  const [apiKey, setApiKey] = useState(initialKey)
  const [model, setModel] = useState('openai/gpt-4o')

  return (
    <>
      <input value={apiKeyDraft} onChange={(e) => setApiKeyDraft(e.target.value)} placeholder="sk-or-v1-..." />
      <button onClick={() => setApiKey(apiKeyDraft.trim())}>Apply</button>
      <button onClick={() => { setApiKeyDraft(''); setApiKey('') }}>Clear</button>

      <ModelSelector value={model} onValueChange={setModel} apiKey={apiKey} />
    </>
  )
}
```

### **3) Locale switch (en/fr)**

```tsx
<ModelSelector
  value={model}
  onValueChange={setModel}
  apiKey={apiKey}
  locale="fr"
/>
```

### **4) Full library in a modal (best UX for big lists)**

```tsx
<ModelSelector
  value={model}
  onValueChange={setModel}
  apiKey={apiKey}
  showAllInModal
/>
```

### **5) Toggle model details (info panel)**

```tsx
<ModelSelector
  value={model}
  onValueChange={setModel}
  apiKey={apiKey}
  infoToggle
  showAllInModal
/>
```

### **6) Fix low-contrast themes**

```tsx
<ModelSelector
  value={model}
  onValueChange={setModel}
  apiKey={apiKey}
  contrast="high-contrast"
/>
```

Or via CSS variables (scoped to `.orm-root`):

```css
.orm-root {
  --orm-text-secondary: hsl(var(--foreground) / 0.85);
}
```

## 📚 Headless Usage

Need just the data without UI? Use the headless client:

```bash
npm install @cappasoft/openrouter-models
```

```ts
import { createOpenRouterModelsClient } from '@cappasoft/openrouter-models'

const client = createOpenRouterModelsClient({
  apiKey: 'sk-or-v1-...',
})

const { models, categories } = await client.listModels()
console.log(`Found ${models.length} models in ${categories.length} categories`)
```

## 🧪 Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run the playground
cd examples/playground-vite-react
npm install
export VITE_OPENROUTER_API_KEY="sk-or-v1-..."
npm run dev
```

## 📄 License

MIT © [Cappasoft](https://github.com/ecappa)
