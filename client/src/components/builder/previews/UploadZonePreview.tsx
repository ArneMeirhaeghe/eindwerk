import React from "react";
import type { UploadZoneProps } from "../../../types/types";

const defaultProps: Required<UploadZoneProps> = {
  label: "Upload bestand",
};

const UploadZonePreview: React.FC<{ p: Partial<UploadZoneProps> }> = ({ p }) => {
  const props = { ...defaultProps, ...p };

  return (
    <div className="mb-2 p-4 text-center border-2 border-dashed border-gray-400 bg-gray-50 rounded">
      <p className="font-medium">{props.label}</p>
      <p className="text-xs text-gray-500 mt-1">Klik om een bestand te kiezen</p>
    </div>
  );
};

export default UploadZonePreview;
