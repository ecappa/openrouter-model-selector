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
| `placeholder?` | `string` | Placeholder text (default: "Select a model") |
| `disabled?` | `boolean` | Disable the selector |

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
