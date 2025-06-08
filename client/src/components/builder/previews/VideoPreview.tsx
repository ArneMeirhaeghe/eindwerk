// /src/components/previews/VideoPreview.tsx
import type { CSSProperties, FC } from "react";
import type { VideoProps } from "../../../types/types";

const VideoPreview: FC<{ p: VideoProps }> = ({ p }) => {
  if (!p.url) {
    return <div className="italic text-gray-400 mb-2">Geen video</div>;
  }
  const style: CSSProperties = {
    width: p.width ? `${p.width}px` : "auto",
    height: p.height ? `${p.height}px` : "auto",
    borderRadius: `${p.radius}px`,
    objectFit: p.objectFit,
    ...(p.shadow ? { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" } : {}),
  };
  return (
    <div className="mb-2">
      <video
        src={p.url}
        style={style}
        controls={p.controls}
        autoPlay={p.autoplay}
        loop={p.loop}
        className="mx-auto rounded overflow-hidden"
      />
      {p.showAlt && p.alt && (
        <div className="text-sm text-gray-600 italic mt-1 text-center">
          {p.alt}
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
