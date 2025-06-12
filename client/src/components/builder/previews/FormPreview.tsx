// File: src/components/builder/previews/FormPreview.tsx
import React, { useEffect, useState } from "react"
import type { FormDto } from "../../../api/forms/types"
import { getForm } from "../../../api/forms"
import TextInputPreview from "./TextInputPreview"
import TextareaPreview from "./TextareaPreview"
import DropdownPreview from "./DropdownPreview"
import RadioGroupPreview from "./RadioGroupPreview"
import { CheckboxGroupPreview } from "./CheckboxGroupPreview"

// We use `any` here so we can pass through the settings blob + label without TS errors.
const fieldPreviewMap: Record<string, React.FC<{ p: any }>> = {
  "text-input":   TextInputPreview as React.FC<{ p: any }>,
  textarea:       TextareaPreview as React.FC<{ p: any }>,
  dropdown:       DropdownPreview as React.FC<{ p: any }>,
  "radio-group":  RadioGroupPreview as React.FC<{ p: any }>,
  "checkbox-group": CheckboxGroupPreview as React.FC<{ p: any }>,
}

export interface FormPreviewProps { p: { formId?: string } }

const FormPreview: React.FC<FormPreviewProps> = ({ p }) => {
  const [form, setForm] = useState<FormDto | null>(null)

  useEffect(() => {
    if (p.formId) getForm(p.formId).then(setForm)
  }, [p.formId])

  if (!form) return <div className="italic text-gray-500">Geen formulier geladen</div>

  return (
    <div className="p-3 bg-gray-50 rounded space-y-2 mb-4">
      <h4 className="text-sm font-semibold">{form.name}</h4>
      {form.fields.map(f => {
        const Preview = fieldPreviewMap[f.type]
        if (!Preview) return null
        const commonProps = { ...f.settings, label: f.label }
        return <Preview key={f.id} p={commonProps} />
      })}
    </div>
  )
}

export default FormPreview
