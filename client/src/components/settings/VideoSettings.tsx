import { useState, useEffect, useRef, type FC, type ChangeEvent } from "react";
import { uploadFile, getUploads, type MediaResponse } from "../../api/uploads";
import { toast } from "react-toastify";
import type { ComponentItem, VideoProps } from "../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const VideoSettings: FC<Props> = ({ comp, onUpdate }) => {
  const [tab, setTab] = useState<"upload" | "browse" | "camera">("upload");
  const [uploads, setUploads] = useState<MediaResponse[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const p: VideoProps = {
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
    ...(comp.props as Partial<VideoProps>),
  };
  const update = (k: keyof VideoProps, v: any) =>
    onUpdate({ ...comp, props: { ...p, [k]: v } });

  useEffect(() => {
    if (tab === "browse") {
      getUploads()
        .then(setUploads)
        .catch(() => toast.error("Kon media niet laden"));
    }
    setFile(null);
  }, [tab]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0] ?? null);

  const doUpload = async () => {
    if (!file) return toast.error("Selecteer eerst een bestand");
    setLoading(true);
    try {
      const res = await uploadFile(file, file.name);
      update("url", res.url);
      update("alt", res.alt);
      toast.success("Upload geslaagd");
      setFile(null);
    } catch {
      toast.error("Upload mislukt");
    } finally {
      setLoading(false);
    }
  };

  // Camera snapshot (zelfde als ImageSettings)
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) videoRef.current.srcObject = s;
      setCapturing(true);
    } catch {
      toast.error("Kon camera niet openen");
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
      if (blob) setFile(new File([blob], `photo.png`, { type: "image/png" }));
    }, "image/png");
    (v.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    setCapturing(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Tabs */}
      <div className="flex space-x-2">
        {(["upload", "browse", "camera"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded ${
              tab === t ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {t === "upload" ? "Upload" : t === "browse" ? "Bladeren" : "Camera"}
          </button>
        ))}
      </div>

      {/* Upload */}
      {tab === "upload" && (
        <div className="space-y-2">
          <input
            type="file"
            accept="video/*"
            onChange={onFileChange}
            disabled={loading}
            className="w-full border rounded px-2 py-1"
          />
          {file && (
            <>
              <video
                src={URL.createObjectURL(file)}
                controls
                className="h-24 w-auto rounded mb-2"
              />
              <button
                onClick={doUpload}
                disabled={loading}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                {loading ? "Uploaden..." : "Voeg toe"}
              </button>
            </>
          )}
        </div>
      )}

      {/* Browse */}
      {tab === "browse" && (
        <div className="grid grid-cols-2 gap-2">
          {uploads.map((m) => (
            <video
              key={m.id}
              src={m.url}
              controls
              onClick={() => update("url", m.url)}
              className="h-24 w-full rounded cursor-pointer border hover:ring-2"
            />
          ))}
        </div>
      )}

      {/* Camera */}
      {tab === "camera" && (
        <div className="space-y-2">
          {!capturing ? (
            <button
              onClick={startCamera}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Open camera
            </button>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                className="w-full h-48 bg-black rounded"
              />
              <button
                onClick={capturePhoto}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                📸 Maak foto
              </button>
            </>
          )}
          {file && (
            <>
              <video
                src={URL.createObjectURL(file)}
                controls
                className="h-24 w-auto rounded mb-2"
              />
              <button
                onClick={doUpload}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Voeg toe
              </button>
            </>
          )}
        </div>
      )}

      {/* Style & Controls */}
      <div className="border-t pt-4 space-y-3">
        <div>
          <label className="block mb-1">Breedte (px)</label>
          <input
            type="number"
            min={50}
            value={p.width}
            onChange={(e) => update("width", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Hoogte (px)</label>
          <input
            type="number"
            min={50}
            value={p.height}
            onChange={(e) => update("height", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Radius (px)</label>
          <input
            type="number"
            min={0}
            value={p.radius}
            onChange={(e) => update("radius", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={p.shadow}
            onChange={(e) => update("shadow", e.target.checked)}
          />
          <span>Shadow</span>
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={p.controls}
              onChange={(e) => update("controls", e.target.checked)}
            />
            <span>Controls</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={p.autoplay}
              onChange={(e) => update("autoplay", e.target.checked)}
            />
            <span>Autoplay</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={p.loop}
              onChange={(e) => update("loop", e.target.checked)}
            />
            <span>Loop</span>
          </label>
        </div>
        <div>
          <label className="block mb-1">Object-fit</label>
          <select
            value={p.objectFit}
            onChange={(e) => update("objectFit", e.target.value)}
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

export default VideoSettings;
