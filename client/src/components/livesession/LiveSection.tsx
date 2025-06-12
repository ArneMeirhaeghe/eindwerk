// File: src/components/livesession/LiveSection.tsx

import React, {  useState, useEffect, type FC } from "react"
import type { FlatSection } from "../../hooks/useLiveSession"
import TextInput from "./inputs/TextInput"
import Textarea from "./inputs/Textarea"
import Dropdown from "./inputs/Dropdown"
import RadioGroup from "./inputs/RadioGroup"
import CheckboxGroup from "./inputs/CheckboxGroup"
import FileUpload from "./inputs/FileUpload"
import FormSession from "./inputs/FormSession"  // ← form-input component
import type { FormDto } from "../../api/forms/types"
import { getForm } from "../../api/forms"

interface Props {
  sessionId: string
  sectionData: FlatSection
  saved: Record<string, any>
  onFieldSave: (componentId: string, value: any) => Promise<void>
  onSectionSave: (values: Record<string, any>) => Promise<void>
  onUploadFile: (file: File, componentId: string) => Promise<void>
}

const inputMap: Record<string, any> = {
  "text-input": TextInput,
  textarea: Textarea,
  dropdown: Dropdown,
  "radio-group": RadioGroup,
  "checkbox-group": CheckboxGroup,
  uploadzone: FileUpload,
  form: FormSession
}

const LiveSection: FC<Props> = ({
  sessionId,
  sectionData,
  saved,
  onFieldSave,
  onSectionSave,
  onUploadFile
}) => {
  const { section } = sectionData
  const [local, setLocal] = useState({ ...saved })

  const handleFieldSave = async (componentId: string, value: any) => {
    const updated = { ...local, [componentId]: value }
    setLocal(updated)
    await onFieldSave(componentId, value)
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">{section.naam}</h2>

      {section.components.map(comp => {
        const val = local[comp.id]

        if (comp.type === "form") {
          // alleen het form-input renderen, geen overzicht hier
          return (
            <FormSession
              key={comp.id}
              formId={comp.props.formId}
              value={val}
              onChange={v => handleFieldSave(comp.id, v)}
              sessionId={sessionId}
              sectionId={section.id}
              componentId={comp.id}
              onUploadFile={(file, fieldId) =>
                onUploadFile(file, `${comp.id}.${fieldId}`)
              }
            />
          )
        }

        const Input = inputMap[comp.type]
        if (!Input) return null

        return (
          <Input
            key={comp.id}
            {...comp.props}
            value={val}
            sessionId={sessionId}
            sectionId={section.id}
            componentId={comp.id}
           onChange={(v: any) => handleFieldSave(comp.id, v)}          // ← explicit `any`
            onUpload={(file: File) => onUploadFile(file, comp.id)}      // ← typed `File`
          />
        )
      })}
    </div>
  )
}

export default LiveSection
