import { useEffect, useState, type FC } from "react"
import type { FormDto, FieldDto } from "../../../api/forms/types"
import { getForm } from "../../../api/forms"
import TextInput from "./TextInput"
import Textarea from "./Textarea"
import Dropdown from "./Dropdown"
import CheckboxGroup from "./CheckboxGroup"
import FileUpload from "./FileUpload"
import RadioGroup from "./RadioGroup"

interface Props {
  formId: string
  value?: Record<string, any>
  onChange: (newValues: Record<string, any>) => void
  componentId: string
  onUploadFile: (file: File, fieldId: string) => Promise<void>
}

const FormSession: FC<Props> = ({
  formId,
  value = {},
  onChange,
  componentId,
  onUploadFile
}) => {
  const [form, setForm] = useState<FormDto | null>(null)
  const [local, setLocal] = useState<Record<string, any>>(value)

  useEffect(() => {
    if (formId) getForm(formId).then(setForm)
  }, [formId])

  useEffect(() => {
    setLocal(value)
  }, [value])

  if (!form) return <p className="text-sm text-gray-500 italic">Formulier laden…</p>

  const handleFieldChange = (fieldId: string, v: any) => {
    const updated = { ...local, [fieldId]: v }
    setLocal(updated)
    onChange(updated)
  }

  return (
    <div className="space-y-6 mb-6">
      <div className="bg-white rounded-2xl shadow-md ring-1 ring-gray-200 p-6 hover:shadow-lg transition">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">{form.name}</h3>
        <div className="space-y-5">
          {form.fields.map((f: FieldDto) => {
            const val = local[f.id] ?? ""
            const common = {
              label: f.label,
              placeholder: f.settings.placeholder,
              required: f.settings.required,
              value: val,
              onChange: (v: any) => handleFieldChange(f.id, v)
            }
            switch (f.type) {
              case "text-input":
                return <TextInput key={f.id} {...common} />
              case "textarea":
                return <Textarea key={f.id} {...common} rows={f.settings.rows} />
              case "dropdown":
                return (
                  <Dropdown
                    key={f.id}
                    {...common}
                    options={f.settings.options || []}
                  />
                )
              case "radio-group":
                return (
                  <RadioGroup
                    key={f.id}
                    {...common}
                    options={f.settings.options || []}
                  />
                )
              case "checkbox-group":
                return (
                  <CheckboxGroup
                    key={f.id}
                    {...common}
                    options={f.settings.options || []}
                    values={Array.isArray(val) ? val : []}
                  />
                )
              case "uploadzone":
                return (
                  <FileUpload
                    key={f.id}
                    componentId={componentId}
                    savedValue={val}
                    onUpload={async files => {
                      await onUploadFile(files[0], f.id)
                      handleFieldChange(f.id, URL.createObjectURL(files[0]))
                    }}
                  />
                )
              default:
                return null
            }
          })}
        </div>
      </div>
    </div>
  )
}

export default FormSession
