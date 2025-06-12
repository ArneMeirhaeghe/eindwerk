// File: src/components/builder/previews/DropdownPreview.tsx
import React from "react"
import type { DropdownProps } from "../../../types/types"

const DropdownPreview: React.FC<{ p: DropdownProps }> = ({ p }) => (
  <div className="mb-4">
    {p.label && <label className="block mb-1 text-sm">{p.label}{p.required && "*"}</label>}
    <select value={p.defaultValue || ""} disabled className="w-full border rounded px-2 py-1">
      {p.placeholder && !p.defaultValue && <option value="" disabled hidden>{p.placeholder}</option>}
      {p.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
    </select>
  </div>
)

export default DropdownPreview
