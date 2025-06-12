// File: src/components/builder/previews/DividerPreview.tsx
import React from "react"
import type { DividerProps } from "../../../types/types"

const DividerPreview: React.FC<{ p: DividerProps }> = ({ p }) => (
  <hr
    className="mb-4"
    style={{
      borderColor: p.color,
      borderWidth: p.thickness,
    }}
  />
)

export default DividerPreview
