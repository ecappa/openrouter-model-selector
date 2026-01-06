# OpenRouter Model Selector

React UI component for selecting and managing OpenRouter AI models with a headless architecture.

## Packages

- [`@cappasoft/openrouter-models`](./packages/openrouter-models) - Headless client for fetching models
- [`@cappasoft/openrouter-model-selector`](./packages/openrouter-model-selector) - React UI component

## Installation

```bash
npm install @cappasoft/openrouter-model-selector
```

## Quick Start

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

## Development

```bash
npm install
npm run build
```

## Playground (test manuel)

Un mini projet Vite/React est disponible pour valider le composant avant publication :

```bash
cd examples/playground-vite-react
npm install
export VITE_OPENROUTER_API_KEY="sk-or-v1-..."
npm run dev
```

## License

MIT


