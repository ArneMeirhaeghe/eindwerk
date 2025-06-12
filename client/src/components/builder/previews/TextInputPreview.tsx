// File: src/components/builder/previews/TextInputPreview.tsx
import React from "react"
import type { TextInputProps } from "../../../types/types"

const TextInputPreview: React.FC<{ p: TextInputProps }> = ({ p }) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium">{p.label}{p.required && "*"}</label>
    <input
      type="text"
      disabled
      placeholder={p.placeholder}
      value={p.defaultValue || ""}
      className="w-full border rounded px-2 py-1"
    />
  </div>
)

export default TextInputPreview
