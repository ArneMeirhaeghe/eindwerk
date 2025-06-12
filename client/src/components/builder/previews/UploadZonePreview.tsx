// File: src/components/builder/previews/UploadZonePreview.tsx
import React from "react"
import type { UploadZoneProps } from "../../../types/types"

const UploadZonePreview: React.FC<{ p: UploadZoneProps }> = ({ p }) => (
  <div
    className="mb-2 p-4 text-center border-dashed border-2 border-gray-400 bg-gray-50"
  >
    <p className="font-medium">{p.label || "Upload Foto"}</p>
    <p className="text-xs text-gray-500 mt-1">Klik om bestand te kiezen</p>
  </div>
)

export default UploadZonePreview
