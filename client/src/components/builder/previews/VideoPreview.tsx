// File: src/components/builder/previews/VideoPreview.tsx
import React from "react"
import type { VideoProps } from "../../../types/types"

const VideoPreview: React.FC<{ p: VideoProps }> = ({ p }) => {
  if (!p.url) return <div className="italic text-gray-400 mb-2">Geen video</div>
  return (
    <div className="mb-2">
      <video
        src={p.url}
        controls={p.controls}
        autoPlay={p.autoplay}
        loop={p.loop}
        className="mx-auto rounded overflow-hidden"
        style={{
          width: p.width,
          height: p.height,
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

export default VideoPreview
