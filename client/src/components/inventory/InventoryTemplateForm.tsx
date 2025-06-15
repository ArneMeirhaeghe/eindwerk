// File: client/src/components/inventory/InventoryTemplateForm.tsx
import { useState, type FC } from "react"
import { FaPlus, FaSave } from "react-icons/fa"
import type { CreateInventoryTemplateDto, InventoryItem, Lokaal, Subsection, UpdateInventoryTemplateDto } from "../../api/inventory/types"

interface Props {
  initial?: CreateInventoryTemplateDto | UpdateInventoryTemplateDto
  onSubmit: (data: CreateInventoryTemplateDto | UpdateInventoryTemplateDto) => void
}

const blankItem = (): InventoryItem => ({ name: "", desired: 0, actual: 0 })
const blankSub = (): Subsection => ({ name: "", items: [blankItem()] })
const blankLokaal = (): Lokaal => ({ name: "", subsections: [blankSub()] })

const InventoryTemplateForm: FC<Props> = ({ initial, onSubmit }) => {
  const [naam, setNaam] = useState(initial?.naam ?? "")
  const [lokalen, setLokalen] = useState<Lokaal[]>(initial?.lokalen ?? [blankLokaal()])

  const updateLokaal = (idx: number, l: Lokaal) =>
    setLokalen(ls => ls.map((old, i) => (i === idx ? l : old)))
  const addLokaal = () => setLokalen(ls => [...ls, blankLokaal()])
  const removeLokaal = (idx: number) =>
    setLokalen(ls => ls.filter((_, i) => i !== idx))

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSubmit({ naam, lokalen })
      }}
      className="space-y-6 relative"
    >
      {/* Naam template */}
      <div className="bg-white rounded-2xl shadow ring-1 ring-gray-200 p-4 sm:p-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Naam template</label>
        <input
          type="text"
          value={naam}
          onChange={e => setNaam(e.target.value)}
          placeholder="Bijv. Kantoorinventaris"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 transition"
          required
        />
      </div>

      {/* Dynamische lokalen */}
      {lokalen.map((lokaal, li) => (
        <div key={li} className="bg-gray-50 rounded-2xl shadow ring-1 ring-gray-200 p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h4 className="text-lg font-semibold text-gray-800">Lokaal #{li + 1}</h4>
            <button type="button" onClick={() => removeLokaal(li)} className="text-red-600 hover:text-red-700 mt-2 sm:mt-0">
              Verwijder
            </button>
          </div>

          {/* Naam lokaal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Naam lokaal</label>
            <input
              type="text"
              value={lokaal.name}
              onChange={e => updateLokaal(li, { ...lokaal, name: e.target.value })}
              placeholder="Bijv. Keuken"
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 transition"
              required
            />
          </div>

          {/* Subsecties */}
          {lokaal.subsections.map((sub, si) => (
            <div key={si} className="bg-white rounded-xl shadow ring-1 ring-gray-200 p-4 sm:p-6 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h5 className="text-md font-medium text-gray-800">Subsectie #{si + 1}</h5>
                <button type="button" onClick={() => {
                  const newSubs = lokaal.subsections.filter((_, i) => i !== si)
                  updateLokaal(li, { ...lokaal, subsections: newSubs })
                }} className="text-red-600 hover:text-red-700 mt-1 sm:mt-0">
                  Verwijder
                </button>
              </div>

              <input
                type="text"
                value={sub.name}
                onChange={e => {
                  const newSubs = lokaal.subsections.map((old, i) =>
                    i === si ? { ...old, name: e.target.value } : old
                  )
                  updateLokaal(li, { ...lokaal, subsections: newSubs })
                }}
                placeholder="Bijv. kookgerief"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 transition"
                required
              />

              {/* Items */}
              <div className="space-y-4 divide-y divide-gray-200 pt-4">
                {sub.items.map((item, ii) => (
                  <div key={ii} className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                    <div className="flex-1 w-full sm:w-auto">
                      <label className="block text-xs font-medium text-gray-600">Item naam</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => {
                          const newItems = sub.items.map((old, j) =>
                            j === ii ? { ...old, name: e.target.value } : old
                          )
                          updateLokaal(li, {
                            ...lokaal,
                            subsections: lokaal.subsections.map((old, i) =>
                              i === si ? { ...old, items: newItems } : old
                            )
                          })
                        }}
                        placeholder="Bijv. vorken"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 transition"
                        required
                      />
                    </div>
                    <div className="w-full sm:w-24">
                      <label className="block text-xs font-medium text-gray-600">Aantal</label>
                      <input
                        type="number"
                        value={item.desired}
                        onChange={e => {
                          const v = Number(e.target.value)
                          const newItems = sub.items.map((old, j) =>
                            j === ii ? { ...old, desired: v } : old
                          )
                          updateLokaal(li, {
                            ...lokaal,
                            subsections: lokaal.subsections.map((old, i) =>
                              i === si ? { ...old, items: newItems } : old
                            )
                          })
                        }}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-center text-sm focus:ring-2 focus:ring-blue-300 transition"
                        min={0}
                        required
                      />
                    </div>
                    <button type="button" onClick={() => {
                      const newItems = sub.items.filter((_, j) => j !== ii)
                      updateLokaal(li, {
                        ...lokaal,
                        subsections: lokaal.subsections.map((old, i) =>
                          i === si ? { ...old, items: newItems } : old
                        )
                      })
                    }} className="text-red-600 hover:text-red-700 self-start">
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* + Item */}
              <button type="button" onClick={() => {
                const newItems = [...sub.items, blankItem()]
                updateLokaal(li, {
                  ...lokaal,
                  subsections: lokaal.subsections.map((old, i) =>
                    i === si ? { ...old, items: newItems } : old
                  )
                })
              }} className="mt-4 inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                <FaPlus className="text-xs" /> Item toevoegen
              </button>
            </div>
          ))}

          {/* + Subsectie */}
          <button type="button" onClick={() => {
            const newSubs = [...lokaal.subsections, blankSub()]
            updateLokaal(li, { ...lokaal, subsections: newSubs })
          }} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
            <FaPlus className="text-xs" /> Subsectie toevoegen
          </button>
        </div>
      ))}

      {/* Sticky actie­balk mobiel-friendly */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 z-50">
        <button type="button" onClick={addLokaal} className="w-full sm:w-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl">
          <FaPlus /> Lokaal toevoegen
        </button>
        <button type="submit" className="w-full sm:w-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-2xl">
          <FaSave /> Opslaan
        </button>
      </div>
    </form>
  )
}

export default InventoryTemplateForm
