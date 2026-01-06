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
| `placeholder?` | `string` | Placeholder text |
| `disabled?` | `boolean` | Disable the selector |

## Features

- 🎨 Beautiful UI with dark mode support
- 🔍 Smart search by name, provider, or capability
- 📂 Models grouped by provider
- ⭐ Curated recommended models
- 🪶 Lightweight and tree-shakeable

## License

MIT
