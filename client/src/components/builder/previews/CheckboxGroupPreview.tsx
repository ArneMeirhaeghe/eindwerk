// File: src/components/builder/previews/CheckboxGroupPreview.tsx
import React from "react"

interface Props {
  p: {
    options?: string[]
    [key: string]: any
  }
}

export const CheckboxGroupPreview: React.FC<Props> = ({ p }) => {
  const opts = p.options || []
  return (
    <div className="space-y-1">
      {opts.map((opt, idx) => (
        // ← Changed: use index as key to avoid duplicate-key errors
        <label key={idx} className="flex items-center space-x-2 text-gray-800">
          <input type="checkbox" disabled className="form-checkbox" />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  )
}
