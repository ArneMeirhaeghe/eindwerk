// /src/components/previews/FilePreview.tsx
import type { FC } from "react";
import type { FileProps } from "../../../types/types";

const FilePreview: FC<{ p: FileProps }> = ({ p }) => {
  if (!p.url) {
    return <div className="italic text-gray-400 mb-2">Geen bestand</div>;
  }
  return (
    <div className="mb-2">
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline block text-center"
      >
        {p.filename || "Download bestand"}
      </a>
      {p.showName && p.filename && (
        <div className="text-sm text-gray-600 mt-1 text-center">
          {p.filename}
        </div>
      )}
    </div>
  );
};

export default FilePreview;
