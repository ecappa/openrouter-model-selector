# @cappasoft/openrouter-models

Headless client for fetching and grouping OpenRouter models.

## Installation

```bash
npm install @cappasoft/openrouter-models
```

## Usage

```ts
import { createOpenRouterModelsClient } from '@cappasoft/openrouter-models'

const client = createOpenRouterModelsClient({
  apiKey: 'sk-or-v1-...',
})

const { models, categories } = await client.listModels()
console.log(models.length, categories.map((c) => c.name))
```


