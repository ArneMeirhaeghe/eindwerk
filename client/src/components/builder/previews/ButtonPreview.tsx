// File: src/components/builder/previews/ButtonPreview.tsx
import React from "react"
import type { ButtonProps } from "../../../types/types"

const ButtonPreview: React.FC<{ p: ButtonProps }> = ({ p }) => (
  <button
    disabled
    className="px-4 py-2 rounded shadow-sm"
    style={{
      backgroundColor: p.bgColor,
      color: p.textColor
    }}
  >
    {p.label}
  </button>
)

export default ButtonPreview
