// File: src/components/settings/FileSettings.tsx

import React, { useState, useEffect, type FC, type ChangeEvent } from "react";
import { toast } from "react-toastify";
import { FileText } from "lucide-react";
import type { ComponentItem, FileProps } from "../../types/types";
import type { MediaResponse } from "../../api/media/types";
import { deleteUpload, getUploads, uploadFile } from "../../api/media";



interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const FileSettings: FC<Props> = ({ comp, onUpdate }) => {
  const defaults: Required<FileProps> = {
    url: "",
    filename: "",
    showName: true,
  };
  const p = { ...defaults, ...(comp.props as FileProps) };

  const [uploads, setUploads] = useState<MediaResponse[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // alleen bestanden (geen afbeeldingen/video)
  const fetchFiles = async () => {
    try {
      const all = await getUploads();
      setUploads(
        all.filter(
          (m) =>
            !m.contentType.startsWith("image/") &&
            !m.contentType.startsWith("video/")
        )
      );
    } catch {
      toast.error("Media laden mislukt");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0] ?? null;
    setFile(chosen);
    if (chosen) {
      onUpdate({
        ...comp,
        props: { ...p, url: URL.createObjectURL(chosen), filename: chosen.name },
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Selecteer eerst een bestand");
      return;
    }
    setLoading(true);
    try {
      const res = await uploadFile(file, p.filename || file.name, "files");
      onUpdate({
        ...comp,
        props: { ...p, url: res.url, filename: res.filename },
      });
      setFile(null);
      await fetchFiles();
      toast.success("Upload geslaagd");
    } catch {
      toast.error("Upload mislukt");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: MediaResponse) =>
    onUpdate({ ...comp, props: { ...p, url: item.url, filename: item.filename } });

  const handleDelete = async (id: string) => {
    try {
      await deleteUpload(id);
      await fetchFiles();
      toast.success("Verwijderd");
    } catch {
      toast.error("Verwijderen mislukt");
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="p-4 border-2 border-dashed border-gray-300 rounded bg-white">
        <h3 className="text-sm font-semibold mb-2">Upload nieuw bestand</h3>
        <input type="file" onChange={handleFileChange} className="w-full" />
        {file && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-3 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {loading ? "Bezig met uploaden..." : "Uploaden"}
          </button>
        )}
      </div>

      {/* Browse Zone */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
        <h3 className="text-sm font-semibold mb-2">Beschikbare bestanden</h3>
        {uploads.length ? (
          <ul className="max-h-48 overflow-y-auto space-y-1">
            {uploads.map((item) => (
              <li
                key={item.id}
                className={`flex items-center px-3 py-2 rounded cursor-pointer hover:bg-gray-100 transition ${
                  p.url === item.url ? "bg-blue-100 border-l-4 border-blue-500" : ""
                }`}
                onClick={() => handleSelect(item)}
              >
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
                <span className="flex-1 text-sm text-gray-800">
                  {item.filename}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 italic text-sm">Geen bestanden gevonden</div>
        )}
      </div>

      {/* Custom Filename */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">Bestandsnaam</label>
        <input
          type="text"
          value={p.filename}
          onChange={(e) =>
            onUpdate({ ...comp, props: { ...p, filename: e.target.value } })
          }
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Toggle Filename Display */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={p.showName}
          onChange={(e) =>
            onUpdate({ ...comp, props: { ...p, showName: e.target.checked } })
          }
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label className="text-sm">Toon bestandsnaam onder link</label>
      </div>
    </div>
  );
};

export default FileSettings;
