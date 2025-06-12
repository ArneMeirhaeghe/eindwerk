// File: src/components/builder/previews/QuotePreview.tsx
import React from "react"
import type { QuoteProps } from "../../../types/types"

const QuotePreview: React.FC<{ p: QuoteProps }> = ({ p }) => {
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
    borderLeft: "4px solid currentColor",
    paddingLeft: "1rem",
  }
  return (
    <blockquote style={style}>
      {p.text}
      {p.author && <footer className="mt-2 text-sm italic">— {p.author}</footer>}
    </blockquote>
  )
}

export default QuotePreview
