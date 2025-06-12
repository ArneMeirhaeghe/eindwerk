// File: src/components/builder/previews/RadioGroupPreview.tsx
import React from "react"
import type { RadioGroupProps } from "../../../types/types"

const RadioGroupPreview: React.FC<{ p: RadioGroupProps }> = ({ p }) => (
  <fieldset className="mb-4 space-y-1">
    {p.label && <legend className="mb-1 font-medium">{p.label}{p.required && "*"}</legend>}
    {p.options.map((opt, idx) => (
      <label key={idx} className="inline-flex items-center space-x-2">
        <input type="radio" disabled name={p.label} value={opt} checked={p.defaultValue === opt} className="form-radio" />
        <span>{opt}</span>
      </label>
    ))}
  </fieldset>
)

export default RadioGroupPreview
