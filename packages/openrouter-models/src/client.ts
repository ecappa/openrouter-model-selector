import type { ModelCategory, OpenRouterModel } from "./types"
import { DEFAULT_CACHE_KEY, DEFAULT_CACHE_TTL_MS, DEFAULT_ENDPOINT } from "./constants"
import { filterAndGroup } from "./grouping"

export interface OpenRouterModelsClient {
  listModels(): Promise<{
    models: OpenRouterModel[]
    categories: ModelCategory[]
    lastUpdated: number | null
  }>
  refresh(): Promise<{
    models: OpenRouterModel[]
    categories: ModelCategory[]
    lastUpdated: number | null
  }>
}

export interface CacheProvider {
  get(key: string): string | null
  set(key: string, value: string): void
  ttlMs?: number
  cacheKey?: string
}

export interface CreateOpenRouterModelsClientOptions {
  apiKey: string
  endpoint?: string
  fetcher?: typeof fetch
  cache?: CacheProvider
}

function defaultCacheProvider(): CacheProvider | null {
  try {
    if (typeof window === "undefined") return null
    if (!("localStorage" in window)) return null
    return {
      get: (key) => window.localStorage.getItem(key),
      set: (key, value) => window.localStorage.setItem(key, value),
      ttlMs: DEFAULT_CACHE_TTL_MS,
      cacheKey: DEFAULT_CACHE_KEY,
    }
  } catch {
    return null
  }
}

function getRecommendedHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  try {
    if (typeof window !== "undefined") {
      headers["HTTP-Referer"] = window.location.origin
      headers["X-Title"] = document.title || "App"
    }
  } catch {
    // ignore
  }
  return headers
}

export function createOpenRouterModelsClient(options: CreateOpenRouterModelsClientOptions): OpenRouterModelsClient {
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT
  const fetcher = options.fetcher ?? fetch
  const cache = options.cache ?? defaultCacheProvider()
  const cacheKey = cache?.cacheKey ?? DEFAULT_CACHE_KEY
  const ttlMs = cache?.ttlMs ?? DEFAULT_CACHE_TTL_MS

  const readCache = (): { data: OpenRouterModel[]; ts: number } | null => {
    if (!cache) return null
    try {
      const raw = cache.get(cacheKey)
      if (!raw) return null
      const parsed = JSON.parse(raw) as { data: OpenRouterModel[]; ts: number }
      if (!parsed?.ts || !Array.isArray(parsed.data)) return null
      if (Date.now() - parsed.ts > ttlMs) return null
      return parsed
    } catch {
      return null
    }
  }

  const writeCache = (models: OpenRouterModel[]) => {
    if (!cache) return
    try {
      cache.set(cacheKey, JSON.stringify({ data: models, ts: Date.now() }))
    } catch {
      // ignore cache write failures
    }
  }

  const fetchModels = async (force: boolean): Promise<{ models: OpenRouterModel[]; lastUpdated: number | null }> => {
    if (!force) {
      const cached = readCache()
      if (cached) return { models: cached.data, lastUpdated: cached.ts }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${options.apiKey}`,
      ...getRecommendedHeaders(),
    }

    const response = await fetcher(endpoint, { headers })
    if (!response.ok) {
      const text = await response.text().catch(() => "")
      throw new Error(`Failed to fetch models: ${response.status}${text ? ` - ${text}` : ""}`)
    }

    const json = (await response.json()) as { data?: OpenRouterModel[] }
    const models = json.data ?? []
    writeCache(models)
    return { models, lastUpdated: Date.now() }
  }

  const toResult = (models: OpenRouterModel[], lastUpdated: number | null) => {
    const { categoriesArray } = filterAndGroup(models, { filterToRecommended: false, includeAllCategories: true })
    return { models, categories: categoriesArray, lastUpdated }
  }

  return {
    async listModels() {
      const { models, lastUpdated } = await fetchModels(false)
      return toResult(models, lastUpdated)
    },
    async refresh() {
      const { models, lastUpdated } = await fetchModels(true)
      return toResult(models, lastUpdated)
    },
  }
}


