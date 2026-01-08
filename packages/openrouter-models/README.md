# 🔌 @cappasoft/openrouter-models

[![npm version](https://img.shields.io/npm/v/@cappasoft/openrouter-models.svg?style=flat-square)](https://www.npmjs.com/package/@cappasoft/openrouter-models)

Headless TypeScript client for fetching and grouping [OpenRouter](https://openrouter.ai) models.

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

// Fetch all models grouped by category
const { models, categories } = await client.listModels()

console.log(`Found ${models.length} models`)
console.log(`Categories: ${categories.map(c => c.name).join(', ')}`)
```

## API

### `createOpenRouterModelsClient(options)`

Creates a client instance.

```ts
const client = createOpenRouterModelsClient({
  apiKey: string,      // Your OpenRouter API key
  baseUrl?: string,    // API base URL (optional)
})
```

### `client.listModels()`

Fetches all models and groups them by provider.

```ts
const { models, categories } = await client.listModels()
```

### Types

```ts
interface OpenRouterModel {
  id: string
  name: string
  description?: string
  context_length: number
  pricing: { prompt: string; completion: string }
  // ... more fields
}

interface ModelCategory {
  name: string
  models: OpenRouterModel[]
}
```

## License

MIT