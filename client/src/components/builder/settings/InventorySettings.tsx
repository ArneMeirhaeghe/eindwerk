// File: src/components/builder/settings/InventorySettings.tsx
import React, {  useEffect, useState, type FC } from "react"
import { useNavigate } from "react-router-dom"
import type { ComponentItem } from "../../../types/types"
import {
  getInventoryTemplates,
  getInventoryTemplate
} from "../../../api/inventory"
import type { InventoryTemplateDto } from "../../../api/inventory/types"

interface Props {
  comp: ComponentItem
  onUpdate: (c: ComponentItem) => void
}

const InventorySettings: FC<Props> = ({ comp, onUpdate }) => {
  const navigate = useNavigate()

  // state for templates list
  const [templates, setTemplates] = useState<InventoryTemplateDto[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)

  // current selected template full DTO
  const [template, setTemplate] = useState<InventoryTemplateDto | null>(null)
  const selectedId = comp.props.templateId as string | undefined

  // selection state
  const [selectedLokalen, setSelectedLokalen] = useState<string[]>(
    comp.props.selectedLokalen || []
  )
  const [selectedSubs, setSelectedSubs] = useState<Record<string, string[]>>(
    comp.props.selectedSubs || {}
  )
  const [interactive, setInteractive] = useState<boolean>(
    comp.props.interactive ?? true
  )

  // load all templates
  useEffect(() => {
    getInventoryTemplates()
      .then(ts => setTemplates(ts))
      .finally(() => setLoadingTemplates(false))
  }, [])

  // when a templateId is chosen, fetch full DTO
  useEffect(() => {
    if (selectedId) {
      getInventoryTemplate(selectedId).then(t => {
        setTemplate(t)
        // reset selections if template changed
        setSelectedLokalen(comp.props.selectedLokalen || [])
        setSelectedSubs(comp.props.selectedSubs || {})
      })
    } else {
      setTemplate(null)
    }
  }, [selectedId])

  // propagate changes upstream
  useEffect(() => {
    onUpdate({
      ...comp,
      props: {
        ...comp.props,
        templateId: selectedId,
        selectedLokalen,
        selectedSubs,
        interactive
      }
    })
  }, [selectedId, selectedLokalen, selectedSubs, interactive])

  if (loadingTemplates) {
    return <div className="p-4 text-gray-500">Laden…</div>
  }

  return (
    <div className="space-y-6 p-4">
      {/* Navigate to management */}
      <button
        type="button"
        onClick={() => navigate("/admin/inventory")}
        className="mb-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Beheer Inventory-templates
      </button>

      {/* Template selector */}
      <div>
        <label className="block mb-1 font-medium">Template</label>
        <select
          value={selectedId || ""}
          onChange={e => onUpdate({ ...comp, props: { ...comp.props, templateId: e.target.value } })}
          className="w-full border rounded px-2 py-1"
        >
          <option value="" disabled>— Kies template —</option>
          {templates.map(t => (
            <option key={t.id} value={t.id}>
              {t.naam}
            </option>
          ))}
        </select>
      </div>

      {/* Interactive toggle */}
      <div className="flex items-center space-x-2">
        <input
          id="interactive"
          type="checkbox"
          checked={interactive}
          onChange={e => setInteractive(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="interactive" className="font-medium">
          Invulvelden tonen (interactive)
        </label>
      </div>

      {/* Lokalen & subsections */}
      {template && (
        <div className="space-y-4">
          <fieldset className="border rounded p-3">
            <legend className="px-1 font-medium">Te tonen lokalen</legend>
            {template.lokalen.map(l => (
              <label key={l.name} className="flex items-center space-x-2 mb-1">
                <input
                  type="checkbox"
                  checked={selectedLokalen.includes(l.name)}
                  onChange={e => {
                    const next = e.target.checked
                      ? [...selectedLokalen, l.name]
                      : selectedLokalen.filter(n => n !== l.name)
                    setSelectedLokalen(next)
                  }}
                  className="h-4 w-4"
                />
                <span>{l.name}</span>
              </label>
            ))}
          </fieldset>

          {/* For each selected lokaal, show subsections */}
          {selectedLokalen.map(lokaalName => {
            const lokaal = template.lokalen.find(l => l.name === lokaalName)!
            const subs = selectedSubs[lokaalName] || []
            return (
              <fieldset key={lokaalName} className="border rounded p-3">
                <legend className="px-1 font-medium">
                  Subsecties in {lokaalName}
                </legend>
                {lokaal.subsections.map(s => (
                  <label key={s.name} className="flex items-center space-x-2 mb-1">
                    <input
                      type="checkbox"
                      checked={subs.includes(s.name)}
                      onChange={e => {
                        const nextSubs = e.target.checked
                          ? [...subs, s.name]
                          : subs.filter(n => n !== s.name)
                        setSelectedSubs({
                          ...selectedSubs,
                          [lokaalName]: nextSubs
                        })
                      }}
                      className="h-4 w-4"
                    />
                    <span>{s.name}</span>
                  </label>
                ))}
              </fieldset>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default InventorySettings
