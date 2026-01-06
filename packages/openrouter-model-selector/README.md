# 🤖 @cappasoft/openrouter-model-selector

[![npm version](https://img.shields.io/npm/v/@cappasoft/openrouter-model-selector.svg?style=flat-square)](https://www.npmjs.com/package/@cappasoft/openrouter-model-selector)

A beautiful React component for selecting AI models from [OpenRouter](https://openrouter.ai).

## Installation

```bash
npm install @cappasoft/openrouter-model-selector
```

## Usage

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

## Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Currently selected model ID |
| `onValueChange` | `(modelId: string) => void` | Callback when model changes |
| `apiKey` | `string` | Your OpenRouter API key |
| `disabled?` | `boolean` | Disable the selector |
| `contrast?` | `"default" \| "high-contrast"` | Increase contrast for secondary text (prices, metadata, headers) |
| `endpoint?` | `string` | Custom OpenRouter endpoint (optional) |
| `locale?` | `"en" \| "fr"` | UI language (labels + formatting) |
| `labels?` | `Partial<Labels>` | Override i18n labels |
| `className?` | `string` | Wrapper class name |
| `showSearch?` | `boolean` | Show search input (default: true) |
| `showPricing?` | `boolean` | Show pricing (default: true) |
| `showFilters?` | `boolean` | Show provider/capability filters (default: true) |
| `variant?` | `"default" \| "compact"` | Layout variant |
| `showAllInModal?` | `boolean` | Put the full library in a modal |
| `infoToggle?` | `boolean` | Adds an “info” button to show the selected model details |

## Customization (contrast)

If your app theme makes secondary text too light, prefer using `contrast="high-contrast"`:

```tsx
<ModelSelector
  value={model}
  onValueChange={setModel}
  apiKey="sk-or-v1-..."
  contrast="high-contrast"
/>
```

You can also override the exposed CSS variables (scoped to `.orm-root`):

```css
.orm-root {
  --orm-text-secondary: hsl(var(--foreground) / 0.85);
}
```

## Use cases (Playground)

### 1) API key from env (Vite)

```bash
export VITE_OPENROUTER_API_KEY="sk-or-v1-..."
```

### 2) “Draft + Apply” pattern (recommended)

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

### 3) Locale switch (en/fr)

```tsx
<ModelSelector value={model} onValueChange={setModel} apiKey={apiKey} locale="fr" />
```

### 4) Full library in a modal

```tsx
<ModelSelector value={model} onValueChange={setModel} apiKey={apiKey} showAllInModal />
```

### 5) Toggle model details (info panel)

```tsx
<ModelSelector value={model} onValueChange={setModel} apiKey={apiKey} showAllInModal infoToggle />
```

### 6) High contrast

```tsx
<ModelSelector value={model} onValueChange={setModel} apiKey={apiKey} contrast="high-contrast" />
```

## Features

- 🎨 Beautiful UI with dark mode support
- 🔍 Smart search by name, provider, or capability
- 📂 Models grouped by provider
- ⭐ Curated recommended models
- 🪶 Lightweight and tree-shakeable

## License

MIT
