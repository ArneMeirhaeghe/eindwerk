import { useState, useEffect, useRef, type FC, type ChangeEvent } from "react";
import { toast } from "react-toastify";
import type { ComponentItem, ImageProps } from "../../../types/types";
import type { MediaResponse } from "../../../api/media/types";
import { deleteUpload, getUploads, uploadFile } from "../../../api/media";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

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

const ImageSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p = { ...defaultProps, ...(comp.props as ImageProps) };

  const [uploads, setUploads] = useState<MediaResponse[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // **Nieuwe state + ref voor radiobuttons & camera-trigger**
  const [mode, setMode] = useState<"upload" | "capture">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ruimt afbeeldingen in state op
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

  // Zodra je “Foto maken” kiest, triggert de camera
  useEffect(() => {
    if (mode === "capture" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [mode]);

  const upd = (key: keyof ImageProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0] ?? null;
    setFile(chosen);
    if (chosen) {
      upd("url", URL.createObjectURL(chosen));
      upd("alt", chosen.name);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await uploadFile(file, file.name, "img");
      upd("url", res.url);
      upd("alt", res.alt || file.name);
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
    <div className="space-y-6 p-4">
      {/* ➤ Radiobuttons kiezen tussen uploaden of camera */}
      <div className="flex space-x-6 mb-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="mode"
            value="upload"
            checked={mode === "upload"}
            onChange={() => setMode("upload")}
            className="mr-2"
          />
          Foto uploaden
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="mode"
            value="capture"
            checked={mode === "capture"}
            onChange={() => setMode("capture")}
            className="mr-2"
          />
          Foto maken
        </label>
      </div>

      {/* Upload-zone */}
      <div className="p-4 border-2 border-dashed border-gray-300 rounded bg-white">
        {/* Één verborgen input, met capture attribuut alleen in capture-mode */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture={mode === "capture" ? "environment" : undefined}
          onChange={handleFileChange}
          className={mode === "upload" ? "w-full text-sm" : "hidden"}
        />

        {/* Upload-knop verschijnt zodra er een bestand/foto gekozen is */}
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

      {/* Beschikbare afbeeldingen */}
      <div>
        <p className="text-sm font-medium mb-2">Media bibliotheek</p>
        <div className="grid grid-cols-3 gap-2">
          {uploads.map((item) => (
            <div key={item.id} className="relative">
              <img
                src={item.url}
                alt={item.alt || ""}
                onClick={() => upd("url", item.url)}
                className={`h-20 w-full object-cover rounded border cursor-pointer ${
                  p.url === item.url
                    ? "ring-4 ring-blue-500"
                    : "hover:ring-2 hover:ring-blue-300"
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

      {/* Instellingen */}
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
        {/* … de rest van de settings ongewijzigd … */}
      </div>
    </div>
  );
};

export default ImageSettings;
