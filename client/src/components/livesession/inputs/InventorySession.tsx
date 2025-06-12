// File: src/components/livesession/inputs/InventorySession.tsx
import React, {  useEffect, useState, type FC } from "react"
import { getInventoryTemplate } from "../../../api/inventory"
import type { InventoryItem, InventoryTemplateDto, Lokaal, Subsection } from "../../../api/inventory/types"


interface Props {
  templateId: string
  selectedLokalen: string[]
  selectedSubs: Record<string, string[]>
  interactive: boolean
  value?: Record<string, Record<string, Record<string, number>>>
  onChange: (
    updated: Record<string, Record<string, Record<string, number>>>
  ) => void
}

const InventorySession: FC<Props> = ({
  templateId,
  selectedLokalen,
  selectedSubs,
  interactive,
  value = {},
  onChange
}) => {
  const [template, setTemplate] = useState<InventoryTemplateDto | null>(null)
  // nested actual values: lokaal → subsection → itemName → number
  const [localValues, setLocalValues] = useState<
    Record<string, Record<string, Record<string, number>>>
  >(value)

  // load template metadata
  useEffect(() => {
    if (templateId) {
      getInventoryTemplate(templateId).then(tpl => {
        setTemplate(tpl)
        // initialize missing branches in localValues
        const init: typeof localValues = { ...value }
        tpl.lokalen.forEach((l: Lokaal) => {
          if (!init[l.name]) init[l.name] = {}
          l.subsections.forEach((s: Subsection) => {
            if (!init[l.name][s.name]) init[l.name][s.name] = {}
            s.items.forEach((it: InventoryItem) => {
              if (init[l.name][s.name][it.name] == null) {
                init[l.name][s.name][it.name] = 0
              }
            })
          })
        })
        setLocalValues(init)
      })
    }
  }, [templateId])

  // handle one item change
  const handleItemChange = (
    lokaalName: string,
    subName: string,
    itemName: string,
    v: number
  ) => {
    setLocalValues(prev => {
      const next = {
        ...prev,
        [lokaalName]: {
          ...prev[lokaalName],
          [subName]: {
            ...prev[lokaalName][subName],
            [itemName]: v
          }
        }
      }
      onChange(next)
      return next
    })
  }

  if (!template) {
    return <p className="text-gray-500">Inventaris laden…</p>
  }

  // filter geselecteerde lokalen
  const lokalsToShow = template.lokalen.filter(l =>
    selectedLokalen.includes(l.name)
  )

  return (
    <div className="space-y-6 bg-gray-50 p-4 rounded-lg shadow-inner">
      <h3 className="text-xl font-semibold">{template.naam}</h3>
      {lokalsToShow.map((lokaal: Lokaal) => {
        const subsToShow = lokaal.subsections.filter(s =>
          (selectedSubs[lokaal.name] || []).includes(s.name)
        )
        return (
          <details key={lokaal.name} className="border rounded">
            <summary className="px-3 py-1 bg-gray-100 cursor-pointer">
              {lokaal.name}
            </summary>
            <div className="p-4 space-y-4">
              {subsToShow.map((sub: Subsection) => (
                <div key={sub.name} className="space-y-2">
                  <div className="font-medium">{sub.name}</div>
                  <table className="w-full text-sm table-auto">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="text-left px-2 py-1">Item</th>
                        <th className="text-left px-2 py-1">Gewenst</th>
                        <th className="text-left px-2 py-1">Eigenlijk</th>
                        {interactive && (
                          <th className="text-left px-2 py-1">Invullen</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {sub.items.map((it: InventoryItem) => {
                        const actual =
                          localValues[lokaal.name]?.[sub.name]?.[it.name] ?? 0
                        return (
                          <tr key={it.name} className="border-t">
                            <td className="px-2 py-1">{it.name}</td>
                            <td className="px-2 py-1">{it.desired}</td>
                            <td className="px-2 py-1">{actual}</td>
                            {interactive && (
                              <td className="px-2 py-1">
                                <input
                                  type="number"
                                  value={actual}
                                  onChange={e =>
                                    handleItemChange(
                                      lokaal.name,
                                      sub.name,
                                      it.name,
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-16 border rounded px-1 py-0.5 text-center"
                                />
                              </td>
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </details>
        )
      })}
    </div>
  )
}

export default InventorySession
