# @cappasoft-dev/openrouter-model-selector

React UI component for selecting OpenRouter models.

## Installation

```bash
npm install @cappasoft-dev/openrouter-model-selector
```

## Usage

```tsx
import { useState } from 'react'
import { ModelSelector } from '@cappasoft-dev/openrouter-model-selector'
import '@cappasoft-dev/openrouter-model-selector/styles.css'

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


