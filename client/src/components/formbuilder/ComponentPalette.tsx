// File: src/components/formbuilder/ComponentPalette.tsx
import React from "react"
import { Edit, FileText, ChevronDown, Circle, CheckCircle } from "lucide-react"
import type { FieldDto } from "../../api/forms/types"

const TYPES = ["text-input", "textarea", "dropdown", "radio-group", "checkbox-group"] as const

const labelMap: Record<FieldDto["type"], string> = {
  "text-input": "Tekst-invoer",
  textarea: "Tekstvak",
  dropdown: "Dropdown",
  "radio-group": "Radiogroep",
  "checkbox-group": "Checkbox-groep",
}
const iconMap: Record<FieldDto["type"], React.FC> = {
  "text-input": Edit,
  textarea: FileText,
  dropdown: ChevronDown,
  "radio-group": Circle,
  "checkbox-group": CheckCircle,
}

export default function ComponentPalette({ onAdd }: { onAdd(type: FieldDto["type"]): void }) {
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold mb-3">Velden toevoegen</h3>
      <div className="space-y-2">
        {TYPES.map(type => {
          const Icon = iconMap[type]
          return (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className="flex items-center w-full px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              {/* <Icon size={18} className="mr-2 text-gray-600" /> */}
              <span className="text-sm text-gray-800">{labelMap[type]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
