// File: src/components/builder/settings/InventorySettings.tsx
import React, {  useEffect, useState, type FC } from "react"
import { useNavigate } from "react-router-dom"
import type { ComponentItem } from "../../../types/types"
import type { InventoryProps } from "../../../types/types"
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

  // extract and type props from component
  const inventoryProps = comp.props as InventoryProps
  const selectedId = inventoryProps.templateId
  const initialLokalen = inventoryProps.selectedLokalen ?? []
  const initialSubs = inventoryProps.selectedSubs ?? {}
  const initialInteractive = inventoryProps.interactive ?? false

  // all templates list
  const [templates, setTemplates] = useState<InventoryTemplateDto[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(true)

  // loaded template detail
  const [template, setTemplate] = useState<InventoryTemplateDto | null>(
    null
  )

  // local UI state
  const [selectedLokalen, setSelectedLokalen] =
    useState<string[]>(initialLokalen)
  const [selectedSubs, setSelectedSubs] = useState<Record<string, string[]>>(
    initialSubs
  )
  const [interactive, setInteractive] = useState<boolean>(
    initialInteractive
  )

  // fetch templates once
  useEffect(() => {
    getInventoryTemplates()
      .then((ts: InventoryTemplateDto[]) => setTemplates(ts))
      .finally(() => setLoadingTemplates(false))
  }, [])

  // when templateId changes, fetch that template and initialize selections
  useEffect(() => {
    if (selectedId) {
      getInventoryTemplate(selectedId).then((tpl: InventoryTemplateDto) => {
        setTemplate(tpl)

        // initialize lokalen if not already in props
        if (!inventoryProps.selectedLokalen) {
          const allLokalen = tpl.lokalen.map((l: Lokaal) => l.name)
          setSelectedLokalen(allLokalen)
          onUpdate({
            ...comp,
            props: { ...inventoryProps, selectedLokalen: allLokalen },
          })
        }

        // initialize subsections if not already in props
        if (!inventoryProps.selectedSubs) {
          const initSubs: Record<string, string[]> = {}
          tpl.lokalen.forEach((l: Lokaal) => {
            initSubs[l.name] = l.subsections.map(
              (s: Subsection) => s.name
            )
          })
          setSelectedSubs(initSubs)
          onUpdate({
            ...comp,
            props: { ...inventoryProps, selectedSubs: initSubs },
          })
        }
      })
    } else {
      setTemplate(null)
      setSelectedLokalen([])
      setSelectedSubs({})
    }
    // only re-run when selectedId changes
  }, [selectedId])

  if (loadingTemplates) {
    return <div className="p-4 text-gray-500">Laden…</div>
  }

  return (
    <div className="space-y-6 p-4">
      {/* Button to manage templates */}
      <button
        type="button"
        onClick={() => navigate("/admin/inventory")}
        className="w-full mb-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Beheer inventaris-templates
      </button>

      {/* Choose template */}
      <div>
        <label className="block mb-1 font-medium">Template</label>
        <select
          value={selectedId ?? ""}
          onChange={e => {
            const newId = e.target.value
            onUpdate({
              ...comp,
              props: { ...inventoryProps, templateId: newId },
            })
          }}
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
          onChange={e => {
            const nextInteractive = e.target.checked
            setInteractive(nextInteractive)
            onUpdate({
              ...comp,
              props: { ...inventoryProps, interactive: nextInteractive },
            })
          }}
          className="h-4 w-4"
        />
        <span className="font-medium">Invulvelden tonen</span>
      </label>

      {/* Lokalen selection */}
      {template && (
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
                onChange={e => {
                  const nextLokalen = e.target.checked
                    ? [...selectedLokalen, lokaal.name]
                    : selectedLokalen.filter(n => n !== lokaal.name)
                  setSelectedLokalen(nextLokalen)
                  onUpdate({
                    ...comp,
                    props: {
                      ...inventoryProps,
                      selectedLokalen: nextLokalen,
                    },
                  })
                }}
                className="h-4 w-4"
              />
              <span>{lokaal.name}</span>
            </label>
          ))}
        </fieldset>
      )}

      {/* Subsections per lokaal */}
      {template &&
        selectedLokalen.map((lokaalName: string) => {
          const lokaal = template.lokalen.find(
            (l: Lokaal) => l.name === lokaalName
          )!
          const subs = selectedSubs[lokaalName] ?? []

          return (
            <fieldset
              key={lokaalName}
              className="border rounded p-3"
            >
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
                    onChange={e => {
                      const nextSubs = e.target.checked
                        ? [...subs, sub.name]
                        : subs.filter(n => n !== sub.name)
                      const updatedSubs = {
                        ...selectedSubs,
                        [lokaalName]: nextSubs,
                      }
                      setSelectedSubs(updatedSubs)
                      onUpdate({
                        ...comp,
                        props: {
                          ...inventoryProps,
                          selectedSubs: updatedSubs,
                        },
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
    </div>
  )
}

export default InventorySettings
