import { useCallback, useEffect, useMemo, useState } from "react"

import type { ModelCategory, OpenRouterModel, OpenRouterModelsClient } from "@cappasoft-dev/openrouter-models"
import { createOpenRouterModelsClient } from "@cappasoft-dev/openrouter-models"

export interface UseOpenRouterModelsOptions {
  apiKey: string
  endpoint?: string
  enabled?: boolean
}

export interface UseOpenRouterModelsResult {
  models: OpenRouterModel[]
  categories: ModelCategory[]
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  lastUpdated: number | null
  refresh(): void
  formatPrice(pricePerToken: string): string
}

function formatPriceForUI(pricePerToken: string): string {
  const price = parseFloat(pricePerToken)
  if (price === 0) return "Free"
  const pricePerMillion = price * 1000000
  if (pricePerMillion < 0.01) return "<$0.01/M"
  return `$${pricePerMillion.toFixed(2)}/M`
}

export function useOpenRouterModels(options: UseOpenRouterModelsOptions): UseOpenRouterModelsResult {
  const enabled = options.enabled ?? true

  const client: OpenRouterModelsClient | null = useMemo(() => {
    if (!enabled) return null
    return createOpenRouterModelsClient({
      apiKey: options.apiKey,
      endpoint: options.endpoint,
    })
  }, [enabled, options.apiKey, options.endpoint])

  const [models, setModels] = useState<OpenRouterModel[]>([])
  const [categories, setCategories] = useState<ModelCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)

  const load = useCallback(
    async (force: boolean) => {
      if (!enabled || !client) {
        setModels([])
        setCategories([])
        setLastUpdated(null)
        setError(null)
        setIsLoading(false)
        setIsRefreshing(false)
        return
      }
      setError(null)
      if (force) setIsRefreshing(true)
      setIsLoading(true)
      try {
        const res = force ? await client.refresh() : await client.listModels()
        setModels(res.models)
        setCategories(res.categories)
        setLastUpdated(res.lastUpdated)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch models")
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [enabled, client]
  )

  useEffect(() => {
    load(false)
  }, [load])

  const refresh = useCallback(() => void load(true), [load])

  return {
    models,
    categories,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh,
    formatPrice: formatPriceForUI,
  }
}


