// src/components/settings/ImageSettings.tsx
import React, {
  useState,
  useEffect,
  useRef,
  type FC,
  type ChangeEvent,
} from "react";
import { uploadFile, getUploads, type MediaResponse } from "../../api/uploads";
import { toast } from "react-toastify";
import type { ComponentItem, ImageProps } from "../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const ImageSettings: FC<Props> = ({ comp, onUpdate }) => {
  const [uploads, setUploads] = useState<MediaResponse[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string>(
    (comp.props as Partial<ImageProps>).url || ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Props met defaults
  const p: ImageProps = {
    url: "",
    alt: "",
    width: 300,
    height: 200,
    borderWidth: 0,
    borderColor: "#000000",
    radius: 0,
    shadow: false,
    objectFit: "cover",
    ...(comp.props as Partial<ImageProps>),
  };

  const upd = (k: keyof ImageProps, v: any) =>
    onUpdate({ ...comp, props: { ...p, [k]: v } });

  // laad bestaande uploads
  useEffect(() => {
    getUploads().then(setUploads).catch(() => toast.error("Media laden mislukt"));
  }, []);

  // stop camera op unmount
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0] || null);

  const doUpload = async () => {
    if (!file) return toast.error("Selecteer eerst een bestand");
    setLoading(true);
    try {
      const res = await uploadFile(file, file.name);
      upd("url", res.url);
      upd("alt", res.alt);
      setSelectedUrl(res.url);
      toast.success("Upload geslaagd");
      setFile(null);
      const list = await getUploads();
      setUploads(list);
    } catch {
      toast.error("Upload mislukt");
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCapturing(true);
    } catch {
      toast.error("Kan camera niet openen");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0);
    c.toBlob((blob) => {
      if (blob) setFile(new File([blob], "photo.png", { type: "image/png" }));
    });
    (v.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    setCapturing(false);
  };

  const selectExisting = (m: MediaResponse) => {
    upd("url", m.url);
    upd("alt", m.alt);
    setSelectedUrl(m.url);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Upload + Camera */}
      <div className="flex space-x-4">
        <div className="flex-1 border border-gray-300 rounded h-32 p-2 flex flex-col justify-center items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={loading}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="px-3 py-1 bg-gray-100 border rounded cursor-pointer"
          >
            Bestand kiezen
          </label>
          <span className="text-gray-500 mt-2">sleep hier</span>
          <button
            onClick={doUpload}
            disabled={loading || !file}
            className="mt-3 px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
          >
            Upload
          </button>
        </div>
        <div className="border border-gray-300 rounded h-32 flex-1 p-2 flex items-center justify-center">
          {capturing ? (
            <div className="w-full h-full relative">
              <video
                ref={videoRef}
                autoPlay
                className="w-full h-full object-cover rounded"
              />
              <button
                onClick={capturePhoto}
                className="absolute bottom-2 right-2 bg-yellow-500 p-2 rounded-full"
              >
                📸
              </button>
            </div>
          ) : (
            <button
              onClick={startCamera}
              className="px-3 py-1 bg-indigo-500 text-white rounded"
            >
              Camera openen
            </button>
          )}
        </div>
      </div>

      <hr />

      {/* Browse galerie */}
      <div className="grid grid-cols-3 gap-2 max-h-40 overflow-auto">
        {uploads.map((m) => (
          <img
            key={m.url}
            src={m.url}
            alt={m.alt}
            onClick={() => selectExisting(m)}
            className={`h-20 w-full object-cover rounded cursor-pointer border ${
              selectedUrl === m.url ? "ring-4 ring-blue-500" : "hover:ring-2"
            }`}
          />
        ))}
      </div>

      <hr />

      {/* Preview geselecteerde */}
      {p.url && (
        <img
          src={p.url}
          alt={p.alt}
          className="w-full h-auto mb-4 rounded border"
        />
      )}

      <hr />

      {/* Style-instellingen */}
      <div className="space-y-4">
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
            className="w-full h-10"
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
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={p.shadow}
            onChange={(e) => upd("shadow", e.target.checked)}
          />
          <span>Schaduw</span>
        </label>
        <div>
          <label className="block mb-1">Object-fit</label>
          <select
            value={p.objectFit}
            onChange={(e) => upd("objectFit", e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ImageSettings;
