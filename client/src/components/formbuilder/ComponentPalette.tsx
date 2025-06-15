// File: src/components/formbuilder/ComponentPalette.tsx

import type { FieldDto } from "../../api/forms/types"

const TYPES = ["text-input", "textarea", "dropdown", "radio-group", "checkbox-group"] as const

const labelMap: Record<FieldDto["type"], string> = {
  "text-input": "Tekst-invoer",
  textarea: "Tekstvak",
  dropdown: "Dropdown",
  "radio-group": "Radiogroep",
  "checkbox-group": "Checkbox-groep",
}

export default function ComponentPalette({ onAdd }: { onAdd(type: FieldDto["type"]): void }) {
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold mb-3">Velden toevoegen</h3>
      <div className="space-y-2">
        {TYPES.map(type => (
          <button
            key={type}
            onClick={() => onAdd(type)}
            className="flex items-center w-full px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm transition"
            aria-label={`Voeg ${labelMap[type]} toe`}
          >
            {labelMap[type]}
          </button>
        ))}
      </div>
    </div>
  )
}
