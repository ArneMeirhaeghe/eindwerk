// File: src/components/inventory/InventoryTemplateForm.tsx
import React, {  useState, type FC } from "react"

import { v4 as uuid } from "uuid"
import type { CreateInventoryTemplateDto, InventoryItem, InventoryTemplateDto, Lokaal, Subsection, UpdateInventoryTemplateDto } from "../../api/inventory/types"

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
    setLokalen(ls => ls.map((old, i) => i === idx ? l : old))

  const addLokaal = () => setLokalen(ls => [...ls, blankLokaal()])
  const removeLokaal = (idx: number) =>
    setLokalen(ls => ls.filter((_, i) => i !== idx))

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        const dto = initial
          ? { naam, lokalen }
          : { naam, lokalen }
        onSubmit(dto)
      }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Naam template</label>
        <input
          type="text"
          value={naam}
          onChange={e => setNaam(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {lokalen.map((lokaal, li) => (
        <div key={li} className="border rounded p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Lokaal #{li + 1}</h4>
            <button
              type="button"
              onClick={() => removeLokaal(li)}
              className="text-red-500 hover:underline"
            >
              Verwijder
            </button>
          </div>

          <div>
            <label className="block text-sm mb-1">Naam lokaal</label>
            <input
              type="text"
              value={lokaal.name}
              onChange={e => updateLokaal(li, { ...lokaal, name: e.target.value })}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          {lokaal.subsections.map((sub, si) => (
            <div key={si} className="pl-4 border-l space-y-3">
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Subsectie #{si + 1}</h5>
                <button
                  type="button"
                  onClick={() => {
                    const newSubs = lokaal.subsections.filter((_, i) => i !== si)
                    updateLokaal(li, { ...lokaal, subsections: newSubs })
                  }}
                  className="text-red-500 hover:underline"
                >
                  Verwijder
                </button>
              </div>

              <input
                type="text"
                placeholder="Naam subsectie"
                value={sub.name}
                onChange={e => {
                  const newSubs = lokaal.subsections.map((old, i) =>
                    i === si ? { ...old, name: e.target.value } : old
                  )
                  updateLokaal(li, { ...lokaal, subsections: newSubs })
                }}
                className="w-full border rounded px-2 py-1 mb-2"
              />

              {sub.items.map((item, ii) => (
                <div key={ii} className="flex space-x-3 items-end">
                  <input
                    type="text"
                    placeholder="Item naam"
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
                    className="flex-1 border rounded px-2 py-1"
                  />
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
                    className="w-24 border rounded px-2 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = sub.items.filter((_, j) => j !== ii)
                      const newSubs = lokaal.subsections.map((old, i) =>
                        i === si ? { ...old, items: newItems } : old
                      )
                      updateLokaal(li, { ...lokaal, subsections: newSubs })
                    }}
                    className="text-red-500 hover:underline"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItems = [...sub.items, blankItem()]
                  const newSubs = lokaal.subsections.map((old, i) =>
                    i === si ? { ...old, items: newItems } : old
                  )
                  updateLokaal(li, { ...lokaal, subsections: newSubs })
                }}
                className="mt-2 text-blue-600 hover:underline"
              >
                + Item toevoegen
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              const newSubs = [...lokaal.subsections, blankSub()]
              updateLokaal(li, { ...lokaal, subsections: newSubs })
            }}
            className="text-blue-600 hover:underline"
          >
            + Subsectie toevoegen
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addLokaal}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        + Lokaal toevoegen
      </button>

      <div className="pt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          Opslaan
        </button>
      </div>
    </form>
  )
}

export default InventoryTemplateForm
