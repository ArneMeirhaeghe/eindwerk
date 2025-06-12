// File: src/components/builder/previews/InventoryPreview.tsx
import React, {  useEffect, useState, type FC } from "react"

import { getInventoryTemplate } from "../../../api/inventory"
import type { InventoryItem, InventoryTemplateDto, Lokaal, Subsection } from "../../../api/inventory/types"

interface Props {
  p: {
    templateId?: string
    selectedLokalen?: string[]
    selectedSubs?: Record<string, string[]>
    interactive?: boolean
  }
}

const InventoryPreview: FC<Props> = ({ p }) => {
  const {
    templateId,
    selectedLokalen = [],
    selectedSubs = {},
    interactive = false,
  } = p

  const [tmpl, setTmpl] = useState<InventoryTemplateDto | null>(null)

  useEffect(() => {
    if (templateId) {
      getInventoryTemplate(templateId).then((tpl: InventoryTemplateDto) => {
        setTmpl(tpl)
      })
    } else {
      setTmpl(null)
    }
  }, [templateId])

  if (!templateId) {
    return <div className="italic text-gray-500">Kies eerst een template</div>
  }
  if (!tmpl) {
    return <div className="italic text-gray-500">Template laden…</div>
  }

  // filter alleen de geselecteerde lokalen
  const lokalenToShow: Lokaal[] = tmpl.lokalen.filter((lokaal: Lokaal) =>
    selectedLokalen.includes(lokaal.name)
  )

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-6">
      <h4 className="text-lg font-semibold">{tmpl.naam}</h4>

      {lokalenToShow.map((lokaal: Lokaal) => {
        // bepaal welke subsections we tonen voor dit lokaal
        const subsToShow: Subsection[] = lokaal.subsections.filter(
          (sub: Subsection) =>
            (selectedSubs[lokaal.name] || []).includes(sub.name)
        )

        return (
          <details key={lokaal.name} className="border rounded">
            <summary className="px-3 py-1 bg-gray-100 cursor-pointer">
              {lokaal.name}
            </summary>
            <div className="p-3 space-y-4">
              {subsToShow.map((sub: Subsection) => (
                <div key={sub.name} className="space-y-2">
                  <div className="font-medium">{sub.name}</div>
                  <table className="w-full text-sm table-auto">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="text-left px-2 py-1">Item</th>
                        <th className="text-left px-2 py-1">Gewenst</th>
                        {interactive && (
                          <th className="text-left px-2 py-1">Invulveld</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {sub.items.map((it: InventoryItem, idx: number) => (
                        <tr key={idx} className="border-t">
                          <td className="px-2 py-1">{it.name}</td>
                          <td className="px-2 py-1">{it.desired}</td>
                          {interactive && (
                            <td className="px-2 py-1">
                              <input
                                type="number"
                                disabled
                                placeholder="...invullen"
                                className="w-16 border rounded px-1 py-0.5 text-center bg-white"
                              />
                            </td>
                          )}
                        </tr>
                      ))}
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

export default InventoryPreview
