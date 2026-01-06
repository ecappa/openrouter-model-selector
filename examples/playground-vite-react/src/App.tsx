import { useMemo, useState } from 'react'

import { ModelSelector } from '@cappasoft/openrouter-model-selector'
import '@cappasoft/openrouter-model-selector/styles.css'

type Locale = 'en' | 'fr'

export default function App() {
  // Use a draft input so we don't spam the API while the user is typing/pasting the key.
  const initialKey = (import.meta as any).env?.VITE_OPENROUTER_API_KEY ?? ''
  const [apiKeyDraft, setApiKeyDraft] = useState<string>(initialKey)
  const [apiKey, setApiKey] = useState<string>(initialKey)
  const [model, setModel] = useState<string>('openai/gpt-4o')
  const [locale, setLocale] = useState<Locale>('en')
  const [showAllInModal, setShowAllInModal] = useState(true)
  const [infoToggle, setInfoToggle] = useState(true)
  const [highContrast, setHighContrast] = useState(false)

  const masked = useMemo(() => {
    if (!apiKey) return ''
    if (apiKey.length <= 8) return '********'
    return `${apiKey.slice(0, 4)}…${apiKey.slice(-4)}`
  }, [apiKey])

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="title">OpenRouter Model Selector Playground</h1>
          <p className="subtitle">Test manuel avant publication (UI + fetch OpenRouter)</p>
        </div>
        <div className="row">
          <label className="label">
            Locale
            <select className="select" value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
              <option value="en">en</option>
              <option value="fr">fr</option>
            </select>
          </label>
          <label className="label checkbox">
            <input type="checkbox" checked={showAllInModal} onChange={(e) => setShowAllInModal(e.target.checked)} />
            showAllInModal
          </label>
          <label className="label checkbox">
            <input type="checkbox" checked={infoToggle} onChange={(e) => setInfoToggle(e.target.checked)} />
            infoToggle
          </label>
          <label className="label checkbox">
            <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
            highContrast
          </label>
        </div>
      </header>

      <section className="card">
        <h2 className="h2">API Key</h2>
        <p className="muted">
          Fourni via <code>VITE_OPENROUTER_API_KEY</code> ou colle-la ici. (Elle reste locale, pas commitée.)
        </p>
        <div className="row">
          <input
            className="input"
            placeholder="sk-or-v1-..."
            value={apiKeyDraft}
            onChange={(e) => setApiKeyDraft(e.target.value)}
          />
          <button
            className="button"
            type="button"
            onClick={() => setApiKey(apiKeyDraft.trim())}
            title="Apply key to the ModelSelector"
          >
            Apply
          </button>
          <button
            className="button"
            type="button"
            onClick={() => {
              setApiKeyDraft('')
              setApiKey('')
            }}
          >
            Clear
          </button>
        </div>
        {apiKey && <div className="muted">Loaded key: {masked}</div>}
      </section>

      <section className="card">
        <h2 className="h2">ModelSelector</h2>
        <div style={{ maxWidth: 720 }}>
          <ModelSelector
            value={model}
            onValueChange={setModel}
            apiKey={apiKey}
            locale={locale}
            showAllInModal={showAllInModal}
            infoToggle={infoToggle}
            contrast={highContrast ? 'high-contrast' : 'default'}
          />
        </div>
        <div className="result">
          <span className="muted">Selected model:</span> <code>{model}</code>
        </div>
      </section>
    </div>
  )
}


