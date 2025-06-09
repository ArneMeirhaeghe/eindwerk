// File: src/components/livesession/inputs/FileUpload.tsx

import { useRef } from "react";
import type { FC } from "react";

interface Props {
  sessionId: string;
  sectionId: string;
  componentId: string;
  files?: any[];
  onUpload: (file: File) => void;
}

const FileUpload: FC<Props> = ({
  sessionId,
  sectionId,
  componentId,
  files = [],
  onUpload,
}) => {
  const inp = useRef<HTMLInputElement>(null);
  const handleChange = () => {
    if (!inp.current) return;
    const f = inp.current.files?.[0];
    if (f) onUpload(f);
  };
  return (
    <div className="mb-4">
      <div className="flex space-x-2 mb-2">
        <button
          type="button"
          onClick={() => inp.current?.click()}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Kies bestand
        </button>
        <input
          ref={inp}
          type="file"
          className="hidden"
          onChange={handleChange}
        />
      </div>
      <ul className="list-disc list-inside">
        {files.map((f: any, i: number) => (
          <li key={i}>{f.fileName || f.url || f.blobName}</li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
