// File: src/components/builder/settings/InventorySettings.tsx
import React, {  useEffect, useState, type FC } from "react"
import { useNavigate } from "react-router-dom"
import type { ComponentItem } from "../../../types/types"
import {
  getInventoryTemplates,
  getInventoryTemplate,
} from "../../../api/inventory"
import type { InventoryTemplateDto, Lokaal, Subsection } from "../../../api/inventory/types"


interface Props {
  comp: ComponentItem
  onUpdate: (c: ComponentItem) => void
}

const InventorySettings: FC<Props> = ({ comp, onUpdate }) => {
  const navigate = useNavigate()

  const [templates, setTemplates] = useState<InventoryTemplateDto[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(true)

  const selectedId = comp.props.templateId as string | undefined
  const [template, setTemplate] = useState<InventoryTemplateDto | null>(null)

  const [selectedLokalen, setSelectedLokalen] = useState<string[]>(
    comp.props.selectedLokalen ?? []
  )
  const [selectedSubs, setSelectedSubs] = useState<Record<string, string[]>>(
    comp.props.selectedSubs ?? {}
  )
  const [interactive, setInteractive] = useState<boolean>(
    comp.props.interactive ?? false
  )

  // laad alle templates
  useEffect(() => {
    getInventoryTemplates()
      .then((ts: InventoryTemplateDto[]) => setTemplates(ts))
      .finally(() => setLoadingTemplates(false))
  }, [])

  // als templateId verandert, haal volledige template en init selecties
  useEffect(() => {
    if (selectedId) {
      getInventoryTemplate(selectedId).then((tpl: InventoryTemplateDto) => {
        setTemplate(tpl)
        // initieer gekozen lokalen en subs als nog niet gezet
        if (!comp.props.selectedLokalen) {
          setSelectedLokalen(tpl.lokalen.map((l: Lokaal) => l.name))
        }
        if (!comp.props.selectedSubs) {
          const initSubs: Record<string, string[]> = {}
          tpl.lokalen.forEach((l: Lokaal) => {
            initSubs[l.name] = l.subsections.map((s: Subsection) => s.name)
          })
          setSelectedSubs(initSubs)
        }
      })
    } else {
      setTemplate(null)
      setSelectedLokalen([])
      setSelectedSubs({})
    }
  }, [selectedId])

  // push alle wijzigingen naar parent
  useEffect(() => {
    onUpdate({
      ...comp,
      props: {
        ...comp.props,
        templateId: selectedId,
        selectedLokalen,
        selectedSubs,
        interactive,
      },
    })
  }, [selectedId, selectedLokalen, selectedSubs, interactive])

  if (loadingTemplates) {
    return <div className="p-4 text-gray-500">Laden…</div>
  }

  return (
    <div className="space-y-6 p-4">
      <button
        type="button"
        onClick={() => navigate("/inventory")}
        className="w-full mb-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Beheer inventaris-templates
      </button>

      {/* Template select */}
      <div>
        <label className="block mb-1 font-medium">Template</label>
        <select
          value={selectedId ?? ""}
          onChange={(e) =>
            onUpdate({
              ...comp,
              props: { ...comp.props, templateId: e.target.value },
            })
          }
          className="w-full border rounded px-2 py-1"
        >
          <option value="" disabled>
            — Kies template —
          </option>
          {templates.map((t: InventoryTemplateDto) => (
            <option key={t.id} value={t.id}>
              {t.naam}
            </option>
          ))}
        </select>
      </div>

      {/* Interactive toggle */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={interactive}
          onChange={(e) => setInteractive(e.target.checked)}
          className="h-4 w-4"
        />
        <span className="font-medium">Invulvelden tonen</span>
      </label>

      {template && (
        <>
          {/* Lokalen select */}
          <fieldset className="border rounded p-3">
            <legend className="px-1 font-medium">Toon lokalen</legend>
            {template.lokalen.map((lokaal: Lokaal) => (
              <label
                key={lokaal.name}
                className="flex items-center space-x-2 mb-1"
              >
                <input
                  type="checkbox"
                  checked={selectedLokalen.includes(lokaal.name)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...selectedLokalen, lokaal.name]
                      : selectedLokalen.filter((n) => n !== lokaal.name)
                    setSelectedLokalen(next)
                  }}
                  className="h-4 w-4"
                />
                <span>{lokaal.name}</span>
              </label>
            ))}
          </fieldset>

          {/* Subsecties per lokaal */}
          {selectedLokalen.map((lokaalName: string) => {
            const lokaal = template.lokalen.find(
              (l: Lokaal) => l.name === lokaalName
            )!
            const subs = selectedSubs[lokaalName] ?? []

            return (
              <fieldset key={lokaalName} className="border rounded p-3">
                <legend className="px-1 font-medium">
                  Subsecties in {lokaalName}
                </legend>
                {lokaal.subsections.map((sub: Subsection) => (
                  <label
                    key={sub.name}
                    className="flex items-center space-x-2 mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={subs.includes(sub.name)}
                      onChange={(e) => {
                        const nextSubs = e.target.checked
                          ? [...subs, sub.name]
                          : subs.filter((n) => n !== sub.name)
                        setSelectedSubs({
                          ...selectedSubs,
                          [lokaalName]: nextSubs,
                        })
                      }}
                      className="h-4 w-4"
                    />
                    <span>{sub.name}</span>
                  </label>
                ))}
              </fieldset>
            )
          })}
        </>
      )}
    </div>
  )
}

export default InventorySettings
