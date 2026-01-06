import { useCallback, useMemo, useState } from "react"
import { Brain, DollarSign, Info, Loader2, Search, Settings2, Sparkles, X, Zap } from "lucide-react"

import type { OpenRouterModel } from "@cappasoft/openrouter-models"
import { RECOMMENDED_MODELS } from "@cappasoft/openrouter-models"

import { cn } from "./utils"
import type { Labels, Locale } from "./i18n"
import { resolveLabels } from "./i18n"
import { useOpenRouterModels } from "./useOpenRouterModels"

import { Button as DefaultButton } from "./ui/button"
import { Input as DefaultInput } from "./ui/input"
import { Dialog as DefaultDialog, DialogContent as DefaultDialogContent, DialogHeader as DefaultDialogHeader, DialogTitle as DefaultDialogTitle, DialogTrigger as DefaultDialogTrigger } from "./ui/dialog"
import {
  Select as DefaultSelect,
  SelectContent as DefaultSelectContent,
  SelectItem as DefaultSelectItem,
  SelectTrigger as DefaultSelectTrigger,
  SelectValue as DefaultSelectValue,
} from "./ui/select"

// Quick filter types
type ProviderFilter = "openai" | "anthropic" | "google" | "meta" | "deepseek" | null
type CapabilityFilter = "fast" | "powerful" | "reasoning" | "cheap" | null

export interface UIComponents {
  Button: React.ComponentType<any>
  Input: React.ComponentType<any>
  Select: React.ComponentType<any>
  SelectTrigger: React.ComponentType<any>
  SelectValue: React.ComponentType<any>
  SelectContent: React.ComponentType<any>
  SelectItem: React.ComponentType<any>
  Dialog: React.ComponentType<any>
  DialogTrigger: React.ComponentType<any>
  DialogContent: React.ComponentType<any>
  DialogHeader: React.ComponentType<any>
  DialogTitle: React.ComponentType<any>
}

export interface ModelSelectorProps {
  value: string
  onValueChange: (value: string) => void

  apiKey: string
  endpoint?: string

  locale?: Locale
  labels?: Partial<Labels>
  components?: Partial<UIComponents>

  className?: string
  disabled?: boolean
  showSearch?: boolean
  showPricing?: boolean
  showFilters?: boolean
  variant?: "default" | "compact"

  // Advanced layout
  showAllInModal?: boolean
  infoToggle?: boolean
}

function formatContextLength(length: number): string {
  if (length >= 1000000) return `${(length / 1000000).toFixed(1)}M ctx`
  if (length >= 1000) return `${Math.round(length / 1000)}K ctx`
  return `${length} ctx`
}

function matchesCapability(model: OpenRouterModel, filter: CapabilityFilter): boolean {
  if (!filter) return true
  const id = model.id.toLowerCase()
  const price = parseFloat(model.pricing.prompt)

  switch (filter) {
    case "fast":
      return id.includes("flash") || id.includes("mini") || id.includes("haiku") || id.includes("small") || id.includes("8b")
    case "powerful":
      return id.includes("opus") || id.includes("large") || id.includes("pro") || (id.includes("4o") && !id.includes("mini")) || id.includes("70b") || id.includes("sonnet-4")
    case "reasoning":
      return id.includes("o1") || id.includes("r1") || id.includes("reasoning")
    case "cheap":
      return price * 1000000 < 1
    default:
      return true
  }
}

function matchesProvider(model: OpenRouterModel, filter: ProviderFilter): boolean {
  if (!filter) return true
  return model.id.toLowerCase().startsWith(filter)
}

export function ModelSelector({
  value,
  onValueChange,
  apiKey,
  endpoint,
  locale,
  labels: labelsOverrides,
  components,
  className,
  disabled = false,
  showSearch = true,
  showPricing = true,
  showFilters = true,
  variant = "default",
  showAllInModal = false,
  infoToggle = false,
}: ModelSelectorProps) {
  const labels = useMemo(() => resolveLabels(locale, labelsOverrides), [locale, labelsOverrides])

  const ui = {
    Button: components?.Button ?? DefaultButton,
    Input: components?.Input ?? DefaultInput,
    Select: components?.Select ?? DefaultSelect,
    SelectTrigger: components?.SelectTrigger ?? DefaultSelectTrigger,
    SelectValue: components?.SelectValue ?? DefaultSelectValue,
    SelectContent: components?.SelectContent ?? DefaultSelectContent,
    SelectItem: components?.SelectItem ?? DefaultSelectItem,
    Dialog: components?.Dialog ?? DefaultDialog,
    DialogTrigger: components?.DialogTrigger ?? DefaultDialogTrigger,
    DialogContent: components?.DialogContent ?? DefaultDialogContent,
    DialogHeader: components?.DialogHeader ?? DefaultDialogHeader,
    DialogTitle: components?.DialogTitle ?? DefaultDialogTitle,
  } satisfies UIComponents

  const { Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } = ui

  const apiKeyMissing = !apiKey

  const { categories, isLoading, isRefreshing, error, refresh, lastUpdated, models, formatPrice } = useOpenRouterModels({
    apiKey,
    endpoint,
    enabled: !apiKeyMissing,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>(null)
  const [capabilityFilter, setCapabilityFilter] = useState<CapabilityFilter>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const hasActiveFilters = providerFilter !== null || capabilityFilter !== null || searchQuery.trim() !== ""

  const clearFilters = () => {
    setSearchQuery("")
    setProviderFilter(null)
    setCapabilityFilter(null)
  }

  const recommendedModels = useMemo(() => {
    const map = new Map(models.map((m) => [m.id, m]))
    return RECOMMENDED_MODELS.map((id) => map.get(id)).filter(Boolean) as OpenRouterModel[]
  }, [models])

  const commonModels = useMemo(() => {
    if (!showAllInModal) return null
    const list = [...recommendedModels]
    if (value && !list.find((m) => m.id === value)) {
      const selected = models.find((m) => m.id === value)
      if (selected) list.push(selected)
    }
    return list
  }, [recommendedModels, value, models, showAllInModal])

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        models: cat.models
          .filter((m) => {
            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase()
              const matchesSearch =
                m.name.toLowerCase().includes(query) ||
                m.id.toLowerCase().includes(query) ||
                m.description?.toLowerCase().includes(query)
              if (!matchesSearch) return false
            }
            if (!matchesProvider(m, providerFilter)) return false
            if (!matchesCapability(m, capabilityFilter)) return false
            return true
          })
          .sort((a, b) => parseFloat(b.pricing.prompt) - parseFloat(a.pricing.prompt)),
      }))
      .filter((cat) => cat.models.length > 0)
  }, [categories, searchQuery, providerFilter, capabilityFilter])

  const selectedModel = useMemo(() => {
    for (const cat of categories) {
      const model = cat.models.find((m) => m.id === value)
      if (model) return model
    }
    return null
  }, [categories, value])

  const handleRefresh = useCallback(() => refresh(), [refresh])

  const fmtPrice = useCallback(
    (pricePerToken: string) => {
      const v = parseFloat(pricePerToken)
      if (v === 0) return locale === "fr" ? "Gratuit" : "Free"
      return formatPrice(pricePerToken)
    },
    [formatPrice, locale]
  )

  const getModelBadge = (model: OpenRouterModel): { icon: React.ReactNode; label: string; color: string; bgColor: string } | null => {
    const id = model.id.toLowerCase()
    if (id.includes("o1") || id.includes("r1") || id.includes("reasoning")) {
      return { icon: <Brain className="h-3 w-3" />, label: labels.badgeReasoning, color: "text-purple-500", bgColor: "bg-purple-500/10" }
    }
    if (id.includes("flash") || id.includes("mini") || id.includes("haiku") || id.includes("small")) {
      return { icon: <Zap className="h-3 w-3" />, label: labels.badgeFast, color: "text-yellow-500", bgColor: "bg-yellow-500/10" }
    }
    if (id.includes("opus") || id.includes("large") || id.includes("pro") || (id.includes("4o") && !id.includes("mini"))) {
      return { icon: <Sparkles className="h-3 w-3" />, label: labels.badgePowerful, color: "text-blue-500", bgColor: "bg-blue-500/10" }
    }
    return null
  }

  const PROVIDER_FILTERS: { id: ProviderFilter; label: string; icon?: string }[] = [
    { id: "openai", label: "OpenAI", icon: "🤖" },
    { id: "anthropic", label: "Claude", icon: "🎭" },
    { id: "google", label: "Gemini", icon: "💎" },
    { id: "meta", label: "Llama", icon: "🦙" },
    { id: "deepseek", label: "DeepSeek", icon: "🔍" },
  ]

  const CAPABILITY_FILTERS: { id: CapabilityFilter; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "fast", label: labels.capabilityFast, icon: <Zap className="h-3 w-3" />, color: "text-yellow-500 border-yellow-500/50 bg-yellow-500/10" },
    { id: "powerful", label: labels.capabilityPowerful, icon: <Sparkles className="h-3 w-3" />, color: "text-blue-500 border-blue-500/50 bg-blue-500/10" },
    { id: "reasoning", label: labels.capabilityReasoning, icon: <Brain className="h-3 w-3" />, color: "text-purple-500 border-purple-500/50 bg-purple-500/10" },
    { id: "cheap", label: labels.capabilityCheap, icon: <DollarSign className="h-3 w-3" />, color: "text-green-500 border-green-500/50 bg-green-500/10" },
  ]

  if (apiKeyMissing) {
    return <div className="text-sm text-destructive">{labels.apiKeyRequired}</div>
  }

  if (error) {
    return <div className="text-sm text-destructive">Error loading models: {error}</div>
  }

  const renderFullSelector = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        {(showSearch || showFilters) && (
          <div className="space-y-2">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={labels.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8"
                />
              </div>
            )}

            {showFilters && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {PROVIDER_FILTERS.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={providerFilter === filter.id ? "default" : "outline"}
                      size="sm"
                      className={cn("h-6 px-2 text-xs", providerFilter === filter.id && "bg-primary text-primary-foreground")}
                      onClick={() => setProviderFilter(providerFilter === filter.id ? null : filter.id)}
                    >
                      {filter.icon && <span className="mr-1">{filter.icon}</span>}
                      {filter.label}
                    </Button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1">
                  {CAPABILITY_FILTERS.map((filter) => (
                    <Button
                      key={filter.id}
                      variant="outline"
                      size="sm"
                      className={cn("h-6 px-2 text-xs border", capabilityFilter === filter.id ? filter.color : "text-muted-foreground")}
                      onClick={() => setCapabilityFilter(capabilityFilter === filter.id ? null : filter.id)}
                    >
                      {filter.icon}
                      <span className="ml-1">{filter.label}</span>
                    </Button>
                  ))}
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={clearFilters}
                  >
                    <X className="h-3 w-3 mr-1" />
                    {labels.clearFilters}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="h-[400px] overflow-y-auto border rounded-md p-2">
          {filteredCategories.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">{labels.noResults}</div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.name} className="mb-4 last:mb-0">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mb-1 rounded">{category.name}</div>
                <div className="grid grid-cols-1 gap-1">
                  {category.models.map((model) => {
                    const badge = getModelBadge(model)
                    const isSelected = value === model.id
                    return (
                      <div
                        key={model.id}
                        className={cn(
                          "flex flex-col p-2 rounded-md cursor-pointer transition-colors border",
                          isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted border-transparent"
                        )}
                        onClick={() => {
                          onValueChange(model.id)
                          if (showAllInModal) setModalOpen(false)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{model.name}</span>
                          {badge && (
                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1", badge.color, badge.bgColor)}>
                              {badge.icon}
                              {badge.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                          <span>{formatContextLength(model.context_length)} context</span>
                          {showPricing && <span>•</span>}
                          {showPricing && <span>{fmtPrice(model.pricing.prompt)}</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )

  if (showAllInModal) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2">
          <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
            <SelectTrigger className="flex-1 text-left">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{labels.loading}</span>
                </div>
              ) : (
                <SelectValue placeholder={labels.placeholder}>
                  {selectedModel && (
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate font-medium">{selectedModel.name}</span>
                      {getModelBadge(selectedModel) && (
                        <Zap className={cn("h-3 w-3 shrink-0", getModelBadge(selectedModel)!.color.split(" ")[0])} />
                      )}
                    </div>
                  )}
                </SelectValue>
              )}
            </SelectTrigger>
            <SelectContent>
              {commonModels?.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <span className="font-medium">{model.name}</span>
                </SelectItem>
              ))}
              {!commonModels?.length && !isLoading && <div className="p-2 text-xs text-muted-foreground">{labels.noResults}</div>}
            </SelectContent>
          </Select>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0" title={labels.showAllModelsTitle}>
                <Settings2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh]">
              <DialogHeader>
                <DialogTitle>{labels.libraryTitle}</DialogTitle>
              </DialogHeader>
              {renderFullSelector()}
            </DialogContent>
          </Dialog>

          {infoToggle && (
            <Button
              variant={showInfo ? "default" : "outline"}
              size="icon"
              className="shrink-0"
              onClick={() => setShowInfo(!showInfo)}
              title={labels.showDetailsTitle}
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
        </div>

        {infoToggle && showInfo && selectedModel && (
          <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded-md border mt-2 animate-in slide-in-from-top-1 fade-in duration-200">
            <div className="font-medium text-foreground mb-1">{labels.modelDetailsTitle}</div>
            {selectedModel.description ? <p className="mb-2">{selectedModel.description}</p> : <p className="mb-2 italic">{labels.noDescription}</p>}
            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className="bg-background border rounded px-1.5 py-0.5">Context: {formatContextLength(selectedModel.context_length)}</span>
              <span className="bg-background border rounded px-1.5 py-0.5">Input: {fmtPrice(selectedModel.pricing.prompt)}</span>
              <span className="bg-background border rounded px-1.5 py-0.5">Output: {fmtPrice(selectedModel.pricing.completion)}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
        <SelectTrigger className={cn(variant === "compact" && "h-8 text-sm")}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{labels.loading}</span>
            </div>
          ) : (
            <SelectValue placeholder={labels.placeholder}>
              {selectedModel && (
                <div className="flex items-center gap-2">
                  <span>{selectedModel.name}</span>
                  {getModelBadge(selectedModel) && (
                    <span className={cn("flex items-center gap-0.5 text-xs", getModelBadge(selectedModel)!.color)}>{getModelBadge(selectedModel)!.icon}</span>
                  )}
                </div>
              )}
            </SelectValue>
          )}
        </SelectTrigger>
        <SelectContent className="max-h-[500px] min-w-[var(--radix-select-trigger-width)] w-full">
          <div className="p-2 border-b space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="grid w-full gap-1 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
                {recommendedModels.map((model) => (
                  <Button
                    key={model.id}
                    size="sm"
                    variant={value === model.id ? "default" : "outline"}
                    className="h-8 px-2 text-xs justify-start"
                    onClick={(e: any) => {
                      e.stopPropagation()
                      onValueChange(model.id)
                    }}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    <span className="truncate">{model.name}</span>
                  </Button>
                ))}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={(e: any) => {
                  e.stopPropagation()
                  handleRefresh()
                }}
                title={labels.refreshTitle}
              >
                {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
            {lastUpdated && (
              <div className="text-[11px] text-muted-foreground">
                {labels.lastUpdatedPrefix}{" "}
                {new Date(lastUpdated).toLocaleTimeString(locale === "fr" ? "fr-FR" : "en-US")}
              </div>
            )}
          </div>

          {(showSearch || showFilters) && (
            <div className="p-2 border-b space-y-2">
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={labels.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e: any) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8"
                    onClick={(e: any) => e.stopPropagation()}
                    onKeyDown={(e: any) => e.stopPropagation()}
                  />
                </div>
              )}

              {showFilters && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {PROVIDER_FILTERS.map((filter) => (
                      <Button
                        key={filter.id}
                        variant={providerFilter === filter.id ? "default" : "outline"}
                        size="sm"
                        className={cn("h-6 px-2 text-xs", providerFilter === filter.id && "bg-primary text-primary-foreground")}
                        onClick={(e: any) => {
                          e.stopPropagation()
                          setProviderFilter(providerFilter === filter.id ? null : filter.id)
                        }}
                      >
                        {filter.icon && <span className="mr-1">{filter.icon}</span>}
                        {filter.label}
                      </Button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {CAPABILITY_FILTERS.map((filter) => (
                      <Button
                        key={filter.id}
                        variant="outline"
                        size="sm"
                        className={cn("h-6 px-2 text-xs border", capabilityFilter === filter.id ? filter.color : "text-muted-foreground")}
                        onClick={(e: any) => {
                          e.stopPropagation()
                          setCapabilityFilter(capabilityFilter === filter.id ? null : filter.id)
                        }}
                      >
                        {filter.icon}
                        <span className="ml-1">{filter.label}</span>
                      </Button>
                    ))}
                  </div>

                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={(e: any) => {
                        e.stopPropagation()
                        clearFilters()
                      }}
                    >
                      <X className="h-3 w-3 mr-1" />
                      {labels.clearFilters}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="max-h-[300px] overflow-y-auto">
            {filteredCategories.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">{labels.noResults}</div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.name}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                    {category.name}
                  </div>
                  {category.models.map((model) => {
                    const badge = getModelBadge(model)
                    return (
                      <SelectItem key={model.id} value={model.id} className="py-2">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{model.name}</span>
                            {badge && (
                              <span className={cn("flex items-center gap-0.5 text-xs", badge.color)}>
                                {badge.icon}
                                <span className="hidden sm:inline">{badge.label}</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatContextLength(model.context_length)}</span>
                            {showPricing && (
                              <>
                                <span>•</span>
                                <span>{fmtPrice(model.pricing.prompt)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        </SelectContent>
      </Select>

      {variant === "default" && selectedModel && (
        <div className="text-xs text-muted-foreground">{selectedModel.description && <p className="line-clamp-2">{selectedModel.description}</p>}</div>
      )}
    </div>
  )
}

export function ModelSelectorCompact({
  value,
  onValueChange,
  apiKey,
  endpoint,
  locale,
  labels,
  components,
  className,
  disabled = false,
}: Pick<ModelSelectorProps, "value" | "onValueChange" | "apiKey" | "endpoint" | "locale" | "labels" | "components" | "className" | "disabled">) {
  return (
    <ModelSelector
      value={value}
      onValueChange={onValueChange}
      apiKey={apiKey}
      endpoint={endpoint}
      locale={locale}
      labels={labels}
      components={components}
      className={className}
      disabled={disabled}
      showSearch={false}
      showPricing={false}
      variant="compact"
    />
  )
}


