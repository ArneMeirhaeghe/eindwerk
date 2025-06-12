// File: src/components/builder/previews/FilePreview.tsx
import React from "react"
import type { FileProps } from "../../../types/types"

const FilePreview: React.FC<{ p: FileProps }> = ({ p }) => {
  if (!p.url) return <div className="italic text-gray-400 mb-2">Geen bestand</div>
  return (
    <div className="mb-2 text-center">
      <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline block">
        {p.filename || "Download bestand"}
      </a>
      {p.showName && p.filename && (
        <div className="text-sm text-gray-600 mt-1">{p.filename}</div>
      )}
    </div>
  )
}

export default FilePreview
