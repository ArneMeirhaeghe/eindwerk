// File: src/components/builder/previews/ParagraphPreview.tsx
import React from "react"
import type { ParagraphProps } from "../../../types/types"

const ParagraphPreview: React.FC<{ p: ParagraphProps }> = ({ p }) => {
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
  return <p style={style}>{p.text}</p>
}

export default ParagraphPreview
