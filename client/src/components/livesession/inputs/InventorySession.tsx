import { useEffect, useState, type FC } from "react"
import { getInventoryTemplate } from "../../../api/inventory"
import type {
  
  InventoryTemplateDto,
  Lokaal,
  Subsection,
} from "../../../api/inventory/types"

interface Props {
  templateId: string
  selectedLokalen: string[]
  selectedSubs: Record<string, string[]>
  interactive: boolean
  value?: Record<string, Record<string, Record<string, number>>>
  onChange: (u: Record<string, Record<string, Record<string, number>>>) => void
}

const InventorySession: FC<Props> = ({
  templateId,
  selectedLokalen,
  selectedSubs,
  interactive,
  value = {},
  onChange,
}) => {
  const [template, setTemplate] = useState<InventoryTemplateDto | null>(null)
  const [localVals, setLocalVals] = useState<typeof value>(value)

  useEffect(() => {
    getInventoryTemplate(templateId).then(tpl => {
      setTemplate(tpl)
      // initialize missing
      const init = { ...value }
      tpl.lokalen.forEach((l: Lokaal) => {
        if (!init[l.name]) init[l.name] = {}
        l.subsections.forEach((s: Subsection) => {
          if (!init[l.name][s.name]) init[l.name][s.name] = {}
          s.items.forEach(it => {
            if (init[l.name][s.name][it.name] == null)
              init[l.name][s.name][it.name] = 0
          })
        })
      })
      setLocalVals(init)
    })
  }, [templateId])

  const handleItem = (
    lokaalName: string,
    subName: string,
    itemName: string,
    v: number
  ) => {
    setLocalVals(prev => {
      const next = {
        ...prev,
        [lokaalName]: {
          ...prev[lokaalName],
          [subName]: { ...prev[lokaalName][subName], [itemName]: v },
        },
      }
      onChange(next)
      return next
    })
  }

  if (!template)
    return <p className="text-sm text-gray-500 italic">Inventaris laden…</p>

  const lokals = template.lokalen.filter(l =>
    selectedLokalen.includes(l.name)
  )

  return (
    <div className="bg-white rounded-2xl shadow-md ring-1 ring-gray-200 p-6 space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">{template.naam}</h3>
      {lokals.map(lokaal => {
        const subs = lokaal.subsections.filter(s =>
          (selectedSubs[lokaal.name] || []).includes(s.name)
        )
        return (
          <details
            key={lokaal.name}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <summary className="px-4 py-2 bg-gray-100 cursor-pointer text-gray-800 font-medium">
              {lokaal.name}
            </summary>
            <div className="p-4 space-y-4">
              {subs.map(sub => (
                <div key={sub.name} className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-700">
                    {sub.name}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="px-3 py-2 text-left">Item</th>
                          <th className="px-3 py-2 text-left">
                            {interactive ? "Invullen" : "Aantal"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sub.items.map(it => {
                          const actual =
                            localVals[lokaal.name]?.[sub.name]?.[it.name] ?? 0
                          return (
                            <tr
                              key={it.name}
                              className={interactive ? "hover:bg-gray-50" : ""}
                            >
                              <td className="px-3 py-2">{it.name}</td>
                              <td className="px-3 py-2">
                                {interactive ? (
                                  <input
                                    type="number"
                                    value={actual}
                                    onChange={e =>
                                      handleItem(
                                        lokaal.name,
                                        sub.name,
                                        it.name,
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                                  />
                                ) : (
                                  it.desired
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
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
