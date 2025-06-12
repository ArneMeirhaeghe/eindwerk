// File: src/components/builder/previews/GridPreview.tsx
import React from "react"
import type { GridProps } from "../../../types/types"

const GridPreview: React.FC<{ p: GridProps }> = ({ p }) => {
  const imgs = (p.images || []).filter(u => u)
  if (imgs.length === 0) return <div className="italic text-gray-400 mb-2">Geen afbeeldingen</div>
  return (
    <div
      className="mb-2 grid w-full"
      style={{
        gridTemplateColumns: `repeat(${p.columns}, 1fr)`,
        gap: p.gap,
      }}
    >
      {imgs.map((url, i) => (
        <img
          key={i}
          src={url}
          alt=""
          className="w-full h-auto object-cover"
          style={{
            objectFit: p.objectFit,
            border: `${p.borderWidth}px solid ${p.borderColor}`,
            borderRadius: p.radius,
            boxShadow: p.shadow ? "0 2px 8px rgba(0,0,0,0.2)" : undefined,
          }}
        />
      ))}
    </div>
  )
}

export default GridPreview
