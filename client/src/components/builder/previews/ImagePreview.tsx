// File: src/components/builder/previews/ImagePreview.tsx
import React from "react"
import type { ImageProps } from "../../../types/types"

const ImagePreview: React.FC<{ p: ImageProps }> = ({ p }) => {
  if (!p.url) return <div className="italic text-gray-400 mb-2">Geen afbeelding</div>
  return (
    <div className="mb-2">
      <img
        src={p.url}
        alt={p.alt}
        className="mx-auto"
        style={{
          width: p.width,
          height: p.height,
          border: `${p.borderWidth}px solid ${p.borderColor}`,
          borderRadius: p.radius,
          objectFit: p.objectFit,
          boxShadow: p.shadow ? "0 4px 6px rgba(0,0,0,0.1)" : undefined,
        }}
      />
      {p.showAlt && p.alt && (
        <div className="text-sm text-gray-600 italic mt-1 text-center">{p.alt}</div>
      )}
    </div>
  )
}

export default ImagePreview
