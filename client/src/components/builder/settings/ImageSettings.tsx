import { useState, useEffect, useRef, type FC, type ChangeEvent  } from "react";
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

  // Tab state: upload of camera
  const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload");

  // Refs voor camera-stream en video-element
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Helper om props up te daten
  const upd = (key: keyof ImageProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  // Haal bestaande uploads (media library)
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

  // Zodra je naar camera-tab schakelt: open inline camera
  useEffect(() => {
    if (activeTab === "camera") {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
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
      // stop camera wanneer je weggaat
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, [activeTab]);

  // File-select handler voor “Upload”
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0] ?? null;
    if (chosen) {
      setFile(chosen);
      upd("url", URL.createObjectURL(chosen));
      upd("alt", chosen.name);
    }
  };

  // Shared helper voor camera-capture
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const imgFile = new File([blob], `photo_${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setFile(imgFile);
        upd("url", URL.createObjectURL(imgFile));
        upd("alt", imgFile.name);
      }
      // terug naar upload-tab voor preview & upload
      setActiveTab("upload");
    }, "image/jpeg");
  };

  // Upload-knop
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

  // Verwijder media uit library
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
      {/* Tabs bovenaan */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "upload"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("upload")}
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
        /* === Upload-zone (originele styling + logic) === */
        <div className="p-4 border-2 border-dashed border-gray-300 rounded bg-white">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm"
          />
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
      ) : (
        /* === Camera-view inline === */
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full rounded bg-black"
            autoPlay
            muted
            playsInline
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button
              onClick={capturePhoto}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              📸 Vastleggen
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              ✕ Annuleren
            </button>
          </div>
        </div>
      )}

      {/* Media bibliotheek */}
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

      {/* Alle overige settings onveranderd */}
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
        {/* … rest van de props … */}
      </div>
    </div>
  );
};

export default ImageSettings;
