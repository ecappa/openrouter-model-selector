export const DEFAULT_ENDPOINT = "https://openrouter.ai/api/v1/models"

// Mapping from model ID prefix to category
export const CATEGORY_MAP: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  "meta-llama": "Meta",
  mistralai: "Mistral",
  deepseek: "DeepSeek",
  cohere: "Cohere",
  qwen: "Qwen",
  "x-ai": "xAI",
  perplexity: "Perplexity",
  nvidia: "NVIDIA",
}

// Recommended models to show first (in order of preference)
export const RECOMMENDED_MODELS = [
  "google/gemini-3-pro-preview",
  "openai/gpt-4o",
  "openai/gpt-4o-mini",
  "anthropic/claude-sonnet-4-20250514",
  "anthropic/claude-3.5-sonnet",
  "x-ai/grok-2-1212",
  "x-ai/grok-3-mini-beta",
  "google/gemini-2.0-flash-001",
  "deepseek/deepseek-chat",
  "deepseek/deepseek-r1",
  "meta-llama/llama-3.3-70b-instruct",
  "mistralai/mistral-large-2411",
] as const

export const DEFAULT_CACHE_KEY = "openrouter_models_cache_v1"
export const DEFAULT_CACHE_TTL_MS = 60 * 60 * 1000 // 1h

// Models to exclude (deprecated, vision-only, etc.)
export const DEFAULT_EXCLUDED_PATTERNS: RegExp[] = [
  /vision/i,
  /image/i,
  /audio/i,
  // :free models are now allowed as some are high quality previews
  /:beta$/,
  /extended$/,
]

export const DEFAULT_CATEGORY_ORDER = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Meta",
  "Mistral",
  "DeepSeek",
  "Qwen",
  "xAI",
  "Cohere",
  "Perplexity",
  "NVIDIA",
  "Other",
] as const


