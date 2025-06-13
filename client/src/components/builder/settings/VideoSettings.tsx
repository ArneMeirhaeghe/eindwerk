import React, { useState, useEffect, type FC, type ChangeEvent } from "react";
import { toast } from "react-toastify";
import type { ComponentItem, VideoProps } from "../../../types/types";
import type { MediaResponse } from "../../../api/media/types";
import { deleteUpload, getUploads, uploadFile } from "../../../api/media";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const defaultProps: Required<VideoProps> = {
  url: "",
  alt: "",
  controls: true,
  autoplay: false,
  loop: false,
  width: 300,
  height: 200,
  radius: 0,
  shadow: false,
  objectFit: "cover",
  showAlt: false,
};

const VideoSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p: Required<VideoProps> = { ...defaultProps, ...(comp.props as VideoProps) };

  const [uploads, setUploads] = useState<MediaResponse[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const upd = (key: keyof VideoProps, value: unknown) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  const fetchVideos = async () => {
    try {
      const all = await getUploads();
      setUploads(all.filter((m) => m.contentType.startsWith("video/")));
    } catch {
      toast.error("Media laden mislukt");
    }
  };

  useEffect(() => {
    fetchVideos();
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
    if (!file) return toast.error("Selecteer eerst een video");
    setLoading(true);
    try {
      const res = await uploadFile(file, file.name, "video");
      upd("url", res.url);
      upd("alt", res.alt);
      setFile(null);
      await fetchVideos();
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
      await fetchVideos();
      toast.success("Verwijderd");
    } catch {
      toast.error("Verwijderen mislukt");
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Upload zone */}
      <div className="p-4 border-2 border-dashed border-gray-400 rounded bg-white">
        <input
          type="file"
          accept="video/mp4"
          onChange={handleFileChange}
          className="w-full"
        />
        {file && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-2 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {loading ? "Bezig..." : "Uploaden"}
          </button>
        )}
      </div>

      {/* Video overzicht */}
      <div>
        <label className="block mb-1 font-semibold">Beschikbare video’s</label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto">
          {uploads.map((item) => (
            <div key={item.id} className="relative">
              <video
                src={item.url}
                muted
                onClick={() => upd("url", item.url)}
                className={`h-24 w-full object-cover rounded cursor-pointer border ${
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

      {/* Preview */}
      {p.url && (
        <div>
          <video
            src={p.url}
            controls={p.controls}
            autoPlay={p.autoplay}
            loop={p.loop}
            className="w-full h-auto mb-2"
            style={{
              width: `${p.width}px`,
              height: `${p.height}px`,
              objectFit: p.objectFit,
              borderRadius: p.radius,
              boxShadow: p.shadow ? "0 4px 6px rgba(0,0,0,0.1)" : undefined,
            }}
          />
          {p.showAlt && p.alt && (
            <div className="text-sm text-gray-600 italic">{p.alt}</div>
          )}
        </div>
      )}

      {/* Instellingen */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Alt-tekst</label>
          <input
            type="text"
            value={p.alt}
            onChange={(e) => upd("alt", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={p.controls}
            onChange={(e) => upd("controls", e.target.checked)}
          />
          <span>Toon controls</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={p.autoplay}
            onChange={(e) => upd("autoplay", e.target.checked)}
          />
          <span>Autoplay</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={p.loop}
            onChange={(e) => upd("loop", e.target.checked)}
          />
          <span>Loop</span>
        </div>

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
            onChange={(e) =>
              upd("objectFit", e.target.value as VideoProps["objectFit"])
            }
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
          <span>Toon alt-tekst</span>
        </div>
      </div>
    </div>
  );
};

export default VideoSettings;
