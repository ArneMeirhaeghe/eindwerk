import React from "react";
import type { FileProps } from "../../../types/types";

const defaultProps: FileProps = {
  url: "",
  filename: "bestand.pdf",
  showName: true,
};

const FilePreview: React.FC<{ p: Partial<FileProps> }> = ({ p }) => {
  const props = { ...defaultProps, ...p };

  if (!props.url) {
    return <div className="italic text-gray-400 mb-2">Geen bestand</div>;
  }

  return (
    <div className="mb-4 text-center">
      <a
        href={props.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-600 hover:text-blue-800 block"
      >
        {props.filename || "Download bestand"}
      </a>
      {props.showName && props.filename && (
        <div className="text-sm text-gray-600 mt-1">{props.filename}</div>
      )}
    </div>
  );
};

export default FilePreview;
