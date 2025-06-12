// File: src/components/builder/settings/TextInputSettings.tsx
import React, { useState, useEffect, type FC } from "react"
import type { ComponentItem, TextInputProps } from "../../../types/types"

interface Props {
  comp: ComponentItem
  onUpdate: (c: ComponentItem) => void
}

const TextInputSettings: FC<Props> = ({ comp, onUpdate }) => {
  const props = comp.props as TextInputProps

  // ← controlled state with fallback
  const [value, setValue] = useState(props.defaultValue ?? "")

  // ← sync if comp.props change
  useEffect(() => {
    setValue(props.defaultValue ?? "")
  }, [props.defaultValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value
    setValue(newVal)
    onUpdate({ ...comp, props: { ...props, defaultValue: newVal } })
  }

  return (
    <div className="space-y-4">
      <label className="block mb-1">{props.label}</label>
      <input
        type="text"
        value={value}                   // never undefined
        onChange={handleChange}
        className="w-full border px-2 py-1 rounded"
      />
    </div>
  )
}

export default TextInputSettings
