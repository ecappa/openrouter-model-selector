"use client"

import * as React from "react"

import { ModelSelector } from "@cappasoft/openrouter-model-selector"
import "@cappasoft/openrouter-model-selector/styles.css"

import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, BluetoothIcon, MoreVerticalIcon, FileIcon, FolderIcon, FolderOpenIcon, FileCodeIcon, MoreHorizontalIcon, FolderSearchIcon, SaveIcon, DownloadIcon, EyeIcon, LayoutIcon, PaletteIcon, SunIcon, MoonIcon, MonitorIcon, UserIcon, CreditCardIcon, SettingsIcon, KeyboardIcon, LanguagesIcon, BellIcon, MailIcon, ShieldIcon, HelpCircleIcon, FileTextIcon, LogOutIcon } from "lucide-react"

export function ComponentExample() {
  return (
    <ExampleWrapper>
      <ModelSelectorExample />
    </ExampleWrapper>
  )
}

function ModelSelectorExample() {
  const initialKey = (process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? "").trim()
  const [apiKeyDraft, setApiKeyDraft] = React.useState(initialKey)
  const [apiKey, setApiKey] = React.useState(initialKey)
  const [model, setModel] = React.useState("openai/gpt-4o")
  const [locale, setLocale] = React.useState<"en" | "fr">("en")
  const [showAllInModal, setShowAllInModal] = React.useState(true)
  const [infoToggle, setInfoToggle] = React.useState(true)
  const [highContrast, setHighContrast] = React.useState(false)
  const [darkMode, setDarkMode] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  const maskedKey = React.useMemo(() => {
    if (!apiKey) return ""
    if (apiKey.length <= 8) return "********"
    return `${apiKey.slice(0, 4)}…${apiKey.slice(-4)}`
  }, [apiKey])

  const toggleButtons = [
    { id: "modal", label: "Modal", value: showAllInModal, onToggle: setShowAllInModal },
    { id: "info", label: "Info toggle", value: infoToggle, onToggle: setInfoToggle },
    { id: "contrast", label: "High contrast", value: highContrast, onToggle: setHighContrast },
    { id: "dark", label: "Dark mode", value: darkMode, onToggle: setDarkMode },
  ] as const

  return (
    <Example title="Model Selector (shadcn)" className="gap-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-2">
          <CardTitle>OpenRouter Model Selector</CardTitle>
          <CardDescription>
            Teste le composant avec les tokens de couleurs shadcn/ui, sans fuite de styles.
          </CardDescription>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="secondary">Scoped CSS (.orm-root)</Badge>
            {apiKey ? (
              <Badge variant="outline">Clé chargée</Badge>
            ) : (
              <Badge variant="destructive">Clé API requise</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
            <Field>
              <FieldLabel htmlFor="orm-api-key">OpenRouter API Key</FieldLabel>
              <div className="flex flex-col gap-2">
                <Input
                  id="orm-api-key"
                  placeholder="sk-or-v1-..."
                  value={apiKeyDraft}
                  onChange={(event) => setApiKeyDraft(event.target.value)}
                  autoComplete="off"
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => setApiKey(apiKeyDraft.trim())}>
                    Appliquer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setApiKey("")
                      setApiKeyDraft("")
                    }}
                  >
                    Effacer
                  </Button>
                </div>
                {apiKey && <p className="text-xs text-muted-foreground">Clé utilisée : {maskedKey}</p>}
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="orm-locale">Locale</FieldLabel>
              <Select value={locale} onValueChange={(value) => setLocale(value as "en" | "fr")}>
                <SelectTrigger id="orm-locale">
                  <SelectValue placeholder="Pick locale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
              <p className="pt-1 text-xs text-muted-foreground">
                Options pour reproduire le playground Vite (modal, infos, contraste, dark).
              </p>
            </Field>
          </div>

          <div className="flex flex-wrap gap-2">
            {toggleButtons.map((toggle) => (
              <Button
                key={toggle.id}
                size="sm"
                variant={toggle.value ? "default" : "outline"}
                onClick={() => toggle.onToggle(!toggle.value)}
              >
                {toggle.label}
              </Button>
            ))}
          </div>

          <div className="rounded-lg border bg-card/50 p-3 shadow-sm">
            <ModelSelector
              value={model}
              onValueChange={setModel}
              apiKey={apiKey}
              locale={locale}
              showAllInModal={showAllInModal}
              infoToggle={infoToggle}
              contrast={highContrast ? "high-contrast" : "default"}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Modèle sélectionné :</span>
            <Badge variant="outline">{model || "aucun"}</Badge>
          </div>
        </CardContent>
      </Card>
    </Example>
  )
}
