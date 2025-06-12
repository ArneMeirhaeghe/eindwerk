// File: src/components/builder/previews/SubheadingPreview.tsx
import React from "react"
import type { SubheadingProps } from "../../../types/types"

const SubheadingPreview: React.FC<{ p: SubheadingProps }> = ({ p }) => {
  const style = {
    fontFamily: p.fontFamily,
    fontSize: p.fontSize,
    lineHeight: p.lineHeight,
    color: p.color,
    backgroundColor: p.bg,
    textAlign: p.align,
    fontWeight: p.bold ? "bold" : "normal",
    fontStyle: p.italic ? "italic" : "normal",
    textDecoration: p.underline ? "underline" : "none",
  }
  return <h2 style={style}>{p.text}</h2>
}

export default SubheadingPreview
