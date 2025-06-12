// File: src/components/builder/previews/TextareaPreview.tsx
import React from "react"
import type { TextareaProps } from "../../../types/types"

const TextareaPreview: React.FC<{ p: TextareaProps }> = ({ p }) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium">{p.label}{p.required && "*"}</label>
    <textarea
      disabled
      rows={p.rows || 3}
      placeholder={p.placeholder}
      value={p.defaultValue || ""}
      className="w-full border rounded px-2 py-1"
    />
  </div>
)

export default TextareaPreview
