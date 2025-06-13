import React from "react";
import type { ImageProps } from "../../../types/types";

const defaultProps: Required<ImageProps> = {
  url: "",
  alt: "",
  width: 300,
  height: 200,
  borderWidth: 0,
  borderColor: "#000000",
  radius: 0,
  shadow: false,
  objectFit: "cover",
  showAlt: false,
};

const ImagePreview: React.FC<{ p: Partial<ImageProps> }> = ({ p }) => {
  const props = { ...defaultProps, ...p };

  if (!props.url) {
    return <div className="italic text-gray-400 mb-2">Geen afbeelding</div>;
  }

  return (
    <div className="mb-4">
      <img
        src={props.url}
        alt={props.alt}
        className="mx-auto"
        style={{
          width: props.width,
          height: props.height,
          objectFit: props.objectFit,
          border: `${props.borderWidth}px solid ${props.borderColor}`,
          borderRadius: `${props.radius}px`,
          boxShadow: props.shadow ? "0 4px 6px rgba(0,0,0,0.1)" : undefined,
        }}
      />
      {props.showAlt && props.alt && (
        <p className="text-sm text-gray-600 italic mt-1 text-center">
          {props.alt}
        </p>
      )}
    </div>
  );
};

export default ImagePreview;
