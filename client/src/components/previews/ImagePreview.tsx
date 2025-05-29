// /src/components/previews/ImagePreview.tsx
import type { CSSProperties, FC } from "react";
import type { ImageProps } from "../../types/types";

const ImagePreview: FC<{ p: ImageProps }> = ({ p }) => {
  if (!p.url) {
    return <div className="italic text-gray-400 mb-2">Geen afbeelding</div>;
  }
  const style: CSSProperties = {
    width: `${p.width}px`,
    height: `${p.height}px`,
    borderWidth: `${p.borderWidth}px`,
    borderColor: p.borderColor,
    borderStyle: "solid",
    borderRadius: `${p.radius}px`,
    objectFit: p.objectFit,
    ...(p.shadow ? { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" } : {}),
  };
  return (
    <div className="mb-2">
      <img src={p.url} alt={p.alt} style={style} className="mx-auto" />
      {p.showAlt && p.alt && (
        <div className="text-sm text-gray-600 italic mt-1 text-center">
          {p.alt}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
