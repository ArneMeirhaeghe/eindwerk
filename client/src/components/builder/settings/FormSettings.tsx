// File: src/components/builder/settings/FormSettings.tsx
import React, { useEffect, useState } from "react"
import type { ComponentItem } from "../../../types/types"
import type { FormDto } from "../../../api/forms/types"
import { getForms } from "../../../api/forms"

export default function FormSettings({
  comp,
  onUpdate
}: {
  comp: ComponentItem
  onUpdate: (c: ComponentItem) => void
}) {
  const [forms, setForms] = useState<FormDto[]>([])
  useEffect(() => { getForms().then(setForms) }, [])
  return (
    <div className="p-4 space-y-2">
      <label className="block text-sm font-medium">Onderdeel Formulier</label>
      <select
        value={comp.props.formId ?? ""}
        onChange={e => onUpdate({ ...comp, props: { ...comp.props, formId: e.target.value } })}
        className="w-full border rounded px-2 py-1"
      >
        <option value="">— Kies formulier —</option>
        {forms.map(f => (
          <option key={f.id} value={f.id}>{f.name}</option>
        ))}
      </select>
    </div>
  )
}
