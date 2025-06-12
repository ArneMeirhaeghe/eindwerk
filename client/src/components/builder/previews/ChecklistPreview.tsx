// File: src/components/builder/previews/ChecklistPreview.tsx
import React from "react"
import type { ChecklistProps } from "../../../types/types"

const ChecklistPreview: React.FC<{ p: ChecklistProps }> = ({ p }) => (
  <ul className="mb-4 list-disc pl-5">
    {p.items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
)

export default ChecklistPreview
