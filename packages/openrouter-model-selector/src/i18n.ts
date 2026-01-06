export type Locale = "en" | "fr"

export interface Labels {
  placeholder: string
  loading: string
  searchPlaceholder: string
  noResults: string
  apiKeyRequired: string
  refreshTitle: string
  lastUpdatedPrefix: string
  clearFilters: string
  libraryTitle: string
  showAllModelsTitle: string
  showDetailsTitle: string
  modelDetailsTitle: string
  noDescription: string

  // Capability labels
  capabilityFast: string
  capabilityPowerful: string
  capabilityReasoning: string
  capabilityCheap: string

  // Badge labels
  badgeFast: string
  badgePowerful: string
  badgeReasoning: string
}

export const defaultLabelsEN: Labels = {
  placeholder: "Select a model",
  loading: "Loading...",
  searchPlaceholder: "Search a model...",
  noResults: "No models found",
  apiKeyRequired: "OpenRouter API key required",
  refreshTitle: "Refresh model list",
  lastUpdatedPrefix: "Last updated:",
  clearFilters: "Clear filters",
  libraryTitle: "Model library",
  showAllModelsTitle: "All models",
  showDetailsTitle: "Show details",
  modelDetailsTitle: "Model details",
  noDescription: "No description available.",

  capabilityFast: "Fast",
  capabilityPowerful: "Powerful",
  capabilityReasoning: "Reasoning",
  capabilityCheap: "Cheap",

  badgeFast: "Fast",
  badgePowerful: "Powerful",
  badgeReasoning: "Reasoning",
}

export const defaultLabelsFR: Labels = {
  placeholder: "Sélectionner un modèle",
  loading: "Chargement...",
  searchPlaceholder: "Rechercher un modèle...",
  noResults: "Aucun modèle trouvé",
  apiKeyRequired: "Clé API OpenRouter requise",
  refreshTitle: "Rafraîchir la liste des modèles",
  lastUpdatedPrefix: "Dernière mise à jour:",
  clearFilters: "Effacer les filtres",
  libraryTitle: "Bibliothèque de modèles",
  showAllModelsTitle: "Tous les modèles",
  showDetailsTitle: "Afficher les détails",
  modelDetailsTitle: "Détails du modèle",
  noDescription: "Pas de description disponible.",

  capabilityFast: "Rapide",
  capabilityPowerful: "Puissant",
  capabilityReasoning: "Raisonnement",
  capabilityCheap: "Économique",

  badgeFast: "Rapide",
  badgePowerful: "Puissant",
  badgeReasoning: "Raisonnement",
}

export function resolveBrowserLocale(): Locale {
  try {
    if (typeof navigator === "undefined") return "en"
    const candidates = (navigator.languages?.length ? navigator.languages : [navigator.language]).filter(Boolean)
    const first = candidates[0] ?? ""
    if (first.toLowerCase().startsWith("fr")) return "fr"
    return "en"
  } catch {
    return "en"
  }
}

export function resolveLabels(locale: Locale | undefined, overrides?: Partial<Labels>): Labels {
  const effectiveLocale = locale ?? resolveBrowserLocale()
  const base = effectiveLocale === "fr" ? defaultLabelsFR : defaultLabelsEN
  return { ...base, ...(overrides ?? {}) }
}


