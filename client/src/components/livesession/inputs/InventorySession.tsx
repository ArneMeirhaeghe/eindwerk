import { useEffect, useState, type FC } from "react"
import { getInventoryTemplate } from "../../../api/inventory"
import type { InventoryItem, InventoryTemplateDto, Lokaal, Subsection } from "../../../api/inventory/types"

interface Props {
  templateId: string
  selectedLokalen: string[]
  selectedSubs: Record<string, string[]>
  interactive: boolean
  value?: Record<string, Record<string, Record<string, number>>>
  onChange: (updated: Record<string, Record<string, Record<string, number>>>) => void
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
  const [localValues, setLocalValues] = useState<typeof value>(value)

  useEffect(() => {
    if (templateId) {
      getInventoryTemplate(templateId).then(tpl => {
        setTemplate(tpl)
        // initialize missing values
        const init = { ...value }
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

  const handleItemChange = (lokaalName: string, subName: string, itemName: string, v: number) => {
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
    return <p className="text-sm text-gray-500 italic">Inventaris laden…</p>
  }

  const lokalsToShow = template.lokalen.filter(l => selectedLokalen.includes(l.name))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-md ring-1 ring-gray-200 p-6 hover:shadow-lg transition">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">{template.naam}</h3>
        <div className="space-y-4">
          {lokalsToShow.map((lokaal: Lokaal) => {
            const subsToShow = lokaal.subsections.filter(s =>
              (selectedSubs[lokaal.name] || []).includes(s.name)
            )
            return (
              <details key={lokaal.name} className="border rounded-lg">
                <summary className="px-4 py-2 bg-gray-100 cursor-pointer flex justify-between items-center">
                  <span className="font-medium">{lokaal.name}</span>
                </summary>
                <div className="p-4 space-y-6">
                  {subsToShow.map((sub: Subsection) => (
                    <div key={sub.name} className="space-y-3">
                      <h4 className="text-lg font-medium text-gray-700">{sub.name}</h4>
                      <table className="w-full text-sm table-auto border-collapse">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="text-left px-3 py-2">Item</th>
                            <th className="text-left px-3 py-2">Gewenst</th>
                            <th className="text-left px-3 py-2">Eigenlijk</th>
                            {interactive && <th className="text-left px-3 py-2">Invullen</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {sub.items.map((it: InventoryItem) => {
                            const actual = localValues[lokaal.name]?.[sub.name]?.[it.name] ?? 0
                            const rowHover = interactive ? "hover:bg-gray-50" : ""
                            return (
                              <tr key={it.name} className={`${rowHover}`}>
                                <td className="px-3 py-2">{it.name}</td>
                                <td className="px-3 py-2">{it.desired}</td>
                                <td className="px-3 py-2">{actual}</td>
                                {interactive && (
                                  <td className="px-3 py-2">
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
                                      className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
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
      </div>
    </div>
  )
}

export default InventorySession
