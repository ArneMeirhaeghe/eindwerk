// File: src/components/formbuilder/LivePreview.tsx

import React from "react"
import type { FieldDto } from "../../api/forms/types"
import TextInputPreview from "./previews/TextInputPreview"
import TextareaPreview from "./previews/TextareaPreview"
import DropdownPreview from "./previews/DropdownPreview"
import RadioGroupPreview from "./previews/RadioGroupPreview"
import CheckboxGroupPreview from "./previews/CheckboxGroupPreview"

const previewMap: Record<FieldDto["type"], React.FC<{ label: string; p: any }>> = {
  "text-input": TextInputPreview,
  textarea: TextareaPreview,
  dropdown: DropdownPreview,
  "radio-group": RadioGroupPreview,
  "checkbox-group": CheckboxGroupPreview,
}

export default function LivePreview({
  name,
  fields
}: {
  name: string
  fields: FieldDto[]
}) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 p-4">
      <div className="relative w-[360px] max-w-full h-[720px] bg-black rounded-[2rem] shadow-2xl border-4 border-black overflow-hidden">
        <div className="absolute inset-4 bg-white rounded-[1.5rem] overflow-y-auto p-4 space-y-5">
          <h2 className="text-xl font-semibold">{name}</h2>
          {fields
            .sort((a, b) => a.order - b.order)
            .map(f => {
              const Preview = previewMap[f.type]
              return <Preview key={f.id} label={f.label} p={f.settings} />
            })}
          <div className="h-12" />
        </div>
      </div>
    </div>
  )
}
