// File: src/components/builder/previews/CheckboxListPreview.tsx
import React from "react"
import type { CheckboxListProps } from "../../../types/types"

const CheckboxListPreview: React.FC<{ p: CheckboxListProps }> = ({ p }) => (
  <div className="mb-4 space-y-1">
    {p.items.map((it, i) => (
      <label key={i} className="inline-flex items-center space-x-2">
        <input type="checkbox" disabled defaultChecked={it.good} className="form-checkbox" />
        <span>{it.label}</span>
      </label>
    ))}
  </div>
)

export default CheckboxListPreview
