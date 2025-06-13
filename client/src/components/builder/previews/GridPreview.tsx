import React from "react";
import type { GridProps } from "../../../types/types";

const defaultProps: Required<GridProps> = {
  images: [],
  columns: 3,
  gap: 8,
  borderWidth: 0,
  borderColor: "#000000",
  radius: 0,
  shadow: false,
  objectFit: "cover",
};

const GridPreview: React.FC<{ p: Partial<GridProps> }> = ({ p }) => {
  const props = { ...defaultProps, ...p };
  const imgs = (props.images || []).filter((u) => !!u);

  if (imgs.length === 0) {
    return (
      <div className="italic text-gray-400 mb-2">Geen afbeeldingen</div>
    );
  }

  return (
    <div
      className="mb-4 grid w-full"
      style={{
        gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`,
        gap: `${props.gap}px`,
      }}
    >
      {imgs.map((url, i) => (
        <img
          key={i}
          src={url}
          alt=""
          className="w-full h-auto object-cover"
          style={{
            objectFit: props.objectFit,
            border: `${props.borderWidth}px solid ${props.borderColor}`,
            borderRadius: `${props.radius}px`,
            boxShadow: props.shadow
              ? "0 2px 8px rgba(0,0,0,0.2)"
              : undefined,
          }}
        />
      ))}
    </div>
  );
};

export default GridPreview;
