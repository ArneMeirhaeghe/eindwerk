// File: src/components/settings/ImageSettings.tsx

import React, { useState, useEffect, type FC, type ChangeEvent } from "react";
import { toast } from "react-toastify";
import type { ComponentItem, ImageProps } from "../../../types/types";
import type { MediaResponse } from "../../../api/media/types";
import { deleteUpload, getUploads, uploadFile } from "../../../api/media";


interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const ImageSettings: FC<Props> = ({ comp, onUpdate }) => {
  const defaults: Required<ImageProps> = {
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
  const p = { ...defaults, ...(comp.props as ImageProps) };

  const [uploads, setUploads] = useState<MediaResponse[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const upd = (key: keyof ImageProps, value: unknown) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  // fetch only images
  const fetchImages = async () => {
    try {
      const all = await getUploads();
      setUploads(all.filter((m) => m.contentType.startsWith("image/")));
    } catch {
      toast.error("Media laden mislukt");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0] ?? null;
    setFile(chosen);
    if (chosen) {
      upd("url", URL.createObjectURL(chosen));
      upd("alt", chosen.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Selecteer eerst een afbeelding");
      return;
    }
    setLoading(true);
    try {
      const res = await uploadFile(file, file.name, "img");
      upd("url", res.url);
      upd("alt", res.alt);
      setFile(null);
      await fetchImages();
      toast.success("Upload geslaagd");
    } catch {
      toast.error("Upload mislukt");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUpload(id);
      await fetchImages();
      toast.success("Verwijderd");
    } catch {
      toast.error("Verwijderen mislukt");
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div className="p-4 border-2 border-dashed border-gray-400 rounded">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        {file && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            {loading ? "Bezig..." : "Uploaden"}
          </button>
        )}
      </div>

      {/* Browse Zone */}
      <div>
        <div className="block mb-1 font-semibold">Beschikbare afbeeldingen</div>
        <div className="grid grid-cols-3 gap-2 max-h-40 overflow-auto">
          {uploads.map((item) => (
            <div key={item.id} className="relative">
              <img
                src={item.url}
                alt={item.alt}
                onClick={() => upd("url", item.url)}
                className={`h-20 w-full object-cover rounded cursor-pointer border ${
                  p.url === item.url ? "ring-4 ring-blue-500" : "hover:ring-2"
                }`}
              />
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview of selected */}
      {p.url && (
        <div>
          <img
            src={p.url}
            alt={p.alt}
            className="w-full h-auto mb-2 rounded border"
            style={{ objectFit: p.objectFit }}
          />
          {p.showAlt && p.alt && (
            <div className="text-sm text-gray-600 italic">{p.alt}</div>
          )}
        </div>
      )}

      {/* Additional settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Breedte (px)</label>
          <input
            type="number"
            min={50}
            value={p.width}
            onChange={(e) => upd("width", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Hoogte (px)</label>
          <input
            type="number"
            min={50}
            value={p.height}
            onChange={(e) => upd("height", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Randdikte (px)</label>
          <input
            type="number"
            min={0}
            value={p.borderWidth}
            onChange={(e) => upd("borderWidth", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Randkleur</label>
          <input
            type="color"
            value={p.borderColor}
            onChange={(e) => upd("borderColor", e.target.value)}
            className="w-full h-8"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={p.shadow}
            onChange={(e) => upd("shadow", e.target.checked)}
          />
          <label>Schaduw</label>
        </div>
        <div>
          <label className="block mb-1">Radius (px)</label>
          <input
            type="number"
            min={0}
            value={p.radius}
            onChange={(e) => upd("radius", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Object-fit</label>
          <select
            value={p.objectFit}
            onChange={(e) => upd("objectFit", e.target.value as ImageProps["objectFit"])}
            className="w-full border rounded px-2 py-1"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={p.showAlt}
            onChange={(e) => upd("showAlt", e.target.checked)}
          />
          <label>Toon alt-tekst</label>
        </div>
      </div>
    </div>
  );
};

export default ImageSettings;
