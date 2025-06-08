// File: client/src/components/previews/UploadZonePreview.tsx
import type { FC, CSSProperties } from "react";
import type { UploadZoneProps } from "../../../types/types";

interface Props {
  p: UploadZoneProps;
}

const UploadZonePreview: FC<Props> = ({ p }) => {
  const style: CSSProperties = {
    border: "2px dashed #9CA3AF",
    borderRadius: "0.375rem",
    padding: "1rem",
    textAlign: "center",
    color: "#4B5563",
    backgroundColor: "#F9FAFB",
  };

  return (
    <div style={style}>
      <p className="font-medium">{p.label || "Upload Foto"}</p>
      <p className="text-xs text-gray-500 mt-1">Klik om bestand te kiezen</p>
    </div>
  );
};

export default UploadZonePreview;
