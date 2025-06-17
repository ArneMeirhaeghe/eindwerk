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
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const upd = (key: keyof ImageProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  // fetch media library
  const fetchImages = async () => {
    try {
      const all = await getUploads();
      setUploads(all.filter(m => m.contentType.startsWith("image/")));
    } catch {
      toast.error("Media laden mislukt");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // start/stop camera when switching tabs
  useEffect(() => {
    if (activeTab === "camera" && !file) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(() => {
          toast.error("Kan camera niet openen");
          setActiveTab("upload");
        });
    } else {
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, [activeTab, file]);

  // choose file from disk
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      const url = URL.createObjectURL(f);
      setFile(f);
      setPreview(url);
      upd("url", url);
      upd("alt", f.name);
    }
  };

  // take snapshot
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      if (blob) {
        const imgFile = new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" });
        const url = URL.createObjectURL(imgFile);
        setFile(imgFile);
        setPreview(url);
        upd("url", url);
        upd("alt", imgFile.name);
      }
    }, "image/jpeg");
  };

  // upload file
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await uploadFile(file, file.name, "img");
      upd("url", res.url);
      upd("alt", res.alt || file.name);
      setFile(null);
      setPreview("");
      await fetchImages();
      toast.success("Upload geslaagd");
      setActiveTab("upload");
    } catch {
      toast.error("Upload mislukt");
    } finally {
      setLoading(false);
    }
  };

  // retake snapshot
  const handleRetake = () => {
    setFile(null);
    setPreview("");
    // stay in camera tab
  };

  // delete from library
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
      {/* tabs */}
      <div className="flex space-x-3 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "upload"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => { setActiveTab("upload"); setFile(null); setPreview(""); }}
        >
          Foto uploaden
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "camera"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("camera")}
        >
          Foto maken
        </button>
      </div>

      {activeTab === "upload" ? (
        // upload zone
        <div className="p-4 border-2 border-dashed rounded bg-white">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm"
          />
          {preview && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-3 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex justify-center"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full" />
              ) : (
                "Uploaden"
              )}
            </button>
          )}
        </div>
      ) : file ? (
        // preview + upload / retake
        <div className="p-4 border rounded bg-white flex flex-col items-center">
          <img
            src={preview}
            alt={p.alt}
            className="max-h-64 w-full object-contain rounded mb-4"
          />
          <div className="flex space-x-3">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full" />
              ) : (
                "Uploaden"
              )}
            </button>
            <button
              onClick={handleRetake}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Neem opnieuw
            </button>
          </div>
        </div>
      ) : (
        // inline camera view as photo frame
        <div className="relative w-full pb-[75%] overflow-hidden rounded-lg border-4 border-white shadow-lg mx-auto max-w-sm">
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
          {/* grid overlay */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
            <div className="col-start-2 border-l border-white opacity-50"></div>
            <div className="col-start-3 border-l border-white opacity-50"></div>
            <div className="row-start-2 border-t border-white opacity-50"></div>
            <div className="row-start-3 border-t border-white opacity-50"></div>
          </div>
          {/* capture button */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <button
              onClick={capturePhoto}
              aria-label="Foto vastleggen"
              className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center shadow-lg hover:border-gray-400 transition"
            >
              <div className="w-10 h-10 bg-red-600 rounded-full"></div>
            </button>
          </div>
        </div>
      )}

      {/* media library */}
      <div>
        <p className="text-sm font-medium mb-2">Media bibliotheek</p>
        <div className="grid grid-cols-3 gap-2">
          {uploads.map(item => (
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

      {/* overige instellingen */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Alt tekst</label>
          <input
            type="text"
            value={p.alt}
            onChange={e => upd("alt", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Breedte (px)</label>
          <input
            type="number"
            min={50}
            value={p.width}
            onChange={e => upd("width", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Hoogte (px)</label>
          <input
            type="number"
            min={50}
            value={p.height}
            onChange={e => upd("height", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Border dikte (px)</label>
          <input
            type="number"
            min={0}
            value={p.borderWidth}
            onChange={e => upd("borderWidth", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Border kleur</label>
          <input
            type="color"
            value={p.borderColor}
            onChange={e => upd("borderColor", e.target.value)}
            className="w-full h-8 p-0 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Radius (px)</label>
          <input
            type="number"
            min={0}
            value={p.radius}
            onChange={e => upd("radius", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={p.shadow}
            onChange={e => upd("shadow", e.target.checked)}
            id="shadow"
          />
          <label htmlFor="shadow">Schaduw</label>
        </div>
        <div>
          <label className="block mb-1">Object fit</label>
          <select
            value={p.objectFit}
            onChange={e => upd("objectFit", e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="cover">cover</option>
            <option value="contain">contain</option>
            <option value="fill">fill</option>
            <option value="none">none</option>
            <option value="scale-down">scale-down</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={p.showAlt}
            onChange={e => upd("showAlt", e.target.checked)}
            id="showAlt"
          />
          <label htmlFor="showAlt">Toon alt</label>
        </div>
      </div>
    </div>
  );
};

export default ImageSettings;