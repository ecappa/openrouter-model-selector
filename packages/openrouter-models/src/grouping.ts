import type { ModelCategory, OpenRouterModel } from "./types"
import { CATEGORY_MAP, DEFAULT_CATEGORY_ORDER, DEFAULT_EXCLUDED_PATTERNS, RECOMMENDED_MODELS } from "./constants"

export function getCategory(modelId: string): string {
  const prefix = modelId.split("/")[0]
  return CATEGORY_MAP[prefix] || "Other"
}

export function isModelExcluded(model: OpenRouterModel, excludedPatterns: RegExp[] = DEFAULT_EXCLUDED_PATTERNS): boolean {
  return excludedPatterns.some((pattern) => pattern.test(model.id))
}

export function buildCategories(
  models: OpenRouterModel[],
  options?: { includeAllCategories?: boolean; categoryOrder?: readonly string[] }
): ModelCategory[] {
  const categoryMap = new Map<string, OpenRouterModel[]>()
  const categoryOrder = options?.categoryOrder ?? DEFAULT_CATEGORY_ORDER

  for (const model of models) {
    const category = getCategory(model.id)

    if (!options?.includeAllCategories && !Object.values(CATEGORY_MAP).includes(category)) {
      continue
    }

    if (!categoryMap.has(category)) categoryMap.set(category, [])
    categoryMap.get(category)!.push(model)
  }

  // Convert to array and sort by predefined order
  const categoriesArray: ModelCategory[] = []
  for (const catName of categoryOrder) {
    const catModels = categoryMap.get(catName)
    if (catModels && catModels.length > 0) {
      categoriesArray.push({ name: catName, models: catModels })
    }
  }

  // Add any remaining categories not in the predefined order
  for (const [catName, catModels] of categoryMap) {
    if (!categoryOrder.includes(catName) && catModels.length > 0) {
      categoriesArray.push({ name: catName, models: catModels })
    }
  }

  return categoriesArray
}

export function filterAndGroup(
  allModels: OpenRouterModel[],
  options?: {
    filterToRecommended?: boolean
    includeAllCategories?: boolean
    recommendedModels?: readonly string[]
    excludedPatterns?: RegExp[]
  }
) {
  const excludedPatterns = options?.excludedPatterns ?? DEFAULT_EXCLUDED_PATTERNS

  let filteredModels = allModels.filter((m) => !isModelExcluded(m, excludedPatterns))

  const recommendedList = options?.recommendedModels ?? RECOMMENDED_MODELS
  if (options?.filterToRecommended) {
    const recommendedSet = new Set(recommendedList)
    filteredModels = filteredModels.filter((m) => recommendedSet.has(m.id))
    filteredModels.sort((a, b) => recommendedList.indexOf(a.id) - recommendedList.indexOf(b.id))
  } else {
    filteredModels.sort((a, b) => a.name.localeCompare(b.name))
  }

  const categoriesArray = buildCategories(filteredModels, { includeAllCategories: options?.includeAllCategories })
  return { filteredModels, categoriesArray }
}


