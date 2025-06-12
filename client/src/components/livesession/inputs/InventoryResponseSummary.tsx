// File: src/components/livesession/inputs/InventoryResponseSummary.tsx
import React, { type FC } from "react"
import type { InventoryItem, InventoryTemplateDto, Lokaal, Subsection } from "../../../api/inventory/types"

interface Props {
  template: InventoryTemplateDto
  selectedLokalen: string[]
  selectedSubs: Record<string, string[]>
  values: Record<string, Record<string, Record<string, number>>>
}

const InventoryResponseSummary: FC<Props> = ({
  template,
  selectedLokalen,
  selectedSubs,
  values
}) => {
  // show only chosen lokalen
  const lokalsToShow = template.lokalen.filter(l =>
    selectedLokalen.includes(l.name)
  )

  return (
    <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded shadow-inner">
      <h3 className="text-lg font-semibold">{template.naam} (inventaris)</h3>
      {lokalsToShow.map((lokaal: Lokaal) => {
        const subsToShow: Subsection[] = lokaal.subsections.filter(s =>
          (selectedSubs[lokaal.name] || []).includes(s.name)
        )

        return (
          <div key={lokaal.name} className="space-y-2">
            <div className="font-medium text-sm">{lokaal.name}</div>
            {subsToShow.map((sub: Subsection) => (
              <div key={sub.name} className="pl-4 space-y-1">
                <div className="italic text-sm">{sub.name}</div>
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-2 py-1 text-left">Item</th>
                      <th className="px-2 py-1 text-left">Gewenst</th>
                      <th className="px-2 py-1 text-left">Eigenlijk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sub.items.map((it: InventoryItem) => {
                      const actual =
                        values[lokaal.name]?.[sub.name]?.[it.name] ?? 0
                      return (
                        <tr key={it.name} className="border-t">
                          <td className="px-2 py-1">{it.name}</td>
                          <td className="px-2 py-1">{it.desired}</td>
                          <td className="px-2 py-1">{actual}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default InventoryResponseSummary
