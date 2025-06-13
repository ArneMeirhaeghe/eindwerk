import React, { useState, type FC } from "react"
import { FaPlus, FaSave } from "react-icons/fa"
import type {
  CreateInventoryTemplateDto,
  InventoryItem,
  InventoryTemplateDto,
  Lokaal,
  Subsection,
  UpdateInventoryTemplateDto,
} from "../../api/inventory/types"

interface Props {
  initial?: InventoryTemplateDto
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
      className="space-y-8 relative"
    >
      {/* Template naam kaart */}
      <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200 p-6 hover:shadow-2xl transition">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Naam template
        </label>
        <input
          type="text"
          value={naam}
          onChange={e => setNaam(e.target.value)}
          placeholder="Bijv. Kantoorinventaris"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
        />
      </div>

      {/* Lokalen */}
      {lokalen.map((lokaal, li) => (
        <div
          key={li}
          className="bg-gray-50 rounded-2xl shadow-2xl ring-1 ring-gray-200 p-6 space-y-6 hover:shadow-2xl transition"
        >
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-800">
              Lokaal #{li + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeLokaal(li)}
              className="text-red-600 hover:text-red-700 transition"
            >
              Verwijder
            </button>
          </div>

          {/* Naam lokaal */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Naam lokaal
            </label>
            <input
              type="text"
              value={lokaal.name}
              onChange={e =>
                updateLokaal(li, { ...lokaal, name: e.target.value })
              }
              placeholder="Bijv. Keuken"
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
            />
          </div>

          {/* Subsecties */}
          {lokaal.subsections.map((sub, si) => (
            <div
              key={si}
              className="bg-white rounded-xl shadow-lg ring-1 ring-gray-200 p-6 space-y-4 hover:shadow-2xl transition"
            >
              <div className="flex justify-between items-center">
                <h5 className="text-md font-medium text-gray-800">
                  Subsectie #{si + 1}
                </h5>
                <button
                  type="button"
                  onClick={() => {
                    const newSubs = lokaal.subsections.filter((_, i) => i !== si)
                    updateLokaal(li, { ...lokaal, subsections: newSubs })
                  }}
                  className="text-red-600 hover:text-red-700 transition"
                >
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
                placeholder="Bijv. Kookgerei"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
              />

              {/* Items lijst */}
              <div className="space-y-4 divide-y divide-gray-200">
                {sub.items.map((item, ii) => (
                  <div key={ii} className="flex flex-wrap gap-3 items-end pt-4">
                    {/* Item naam */}
                    <div className="flex-1 space-y-1">
                      <label className="block text-xs font-medium text-gray-600">
                        Item naam
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => {
                          const newItems = sub.items.map((old, j) =>
                            j === ii ? { ...old, name: e.target.value } : old
                          )
                          const newSubs = lokaal.subsections.map((old, i) =>
                            i === si ? { ...old, items: newItems } : old
                          )
                          updateLokaal(li, { ...lokaal, subsections: newSubs })
                        }}
                        placeholder="Bijv. Vorken"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                      />
                    </div>

                    {/* Gewenst aantal */}
                    <div className="w-24 space-y-1">
                      <label className="block text-xs font-medium text-gray-600">
                        Gewenst aantal
                      </label>
                      <input
                        type="number"
                        value={item.desired}
                        onChange={e => {
                          const v = +e.target.value
                          const newItems = sub.items.map((old, j) =>
                            j === ii ? { ...old, desired: v } : old
                          )
                          const newSubs = lokaal.subsections.map((old, i) =>
                            i === si ? { ...old, items: newItems } : old
                          )
                          updateLokaal(li, { ...lokaal, subsections: newSubs })
                        }}
                        placeholder="0"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition text-center"
                      />
                    </div>

                    {/* Verwijder item */}
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = sub.items.filter((_, j) => j !== ii)
                        const newSubs = lokaal.subsections.map((old, i) =>
                          i === si ? { ...old, items: newItems } : old
                        )
                        updateLokaal(li, { ...lokaal, subsections: newSubs })
                      }}
                      className="text-red-600 hover:text-red-700 transition self-start mt-4"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* + Item toevoegen */}
              <button
                type="button"
                onClick={() => {
                  const newItems = [...sub.items, blankItem()]
                  const newSubs = lokaal.subsections.map((old, i) =>
                    i === si ? { ...old, items: newItems } : old
                  )
                  updateLokaal(li, { ...lokaal, subsections: newSubs })
                }}
                className="mt-4 inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition"
              >
                <FaPlus className="text-xs" /> Item toevoegen
              </button>
            </div>
          ))}

          {/* + Subsectie toevoegen */}
          <button
            type="button"
            onClick={() => {
              const newSubs = [...lokaal.subsections, blankSub()]
              updateLokaal(li, { ...lokaal, subsections: newSubs })
            }}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition"
          >
            <FaPlus className="text-xs" /> Subsectie toevoegen
          </button>
        </div>
      ))}

      {/* Actie­balk onderaan (sticky) */}
      <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <button
          type="button"
          onClick={addLokaal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-white font-medium px-4 py-2 rounded-xl shadow-lg transition-transform hover:-translate-y-1"
        >
          <FaPlus /> Lokaal toevoegen
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-white font-medium px-6 py-3 rounded-2xl shadow-lg transition-transform hover:-translate-y-1"
        >
          <FaSave /> Opslaan
        </button>
      </div>
    </form>
  )
}

export default InventoryTemplateForm
