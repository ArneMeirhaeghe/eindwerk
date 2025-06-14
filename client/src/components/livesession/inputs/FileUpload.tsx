import { useEffect, useRef, useState, type ChangeEvent, type FC } from "react";

interface Props {
  componentId: string;
  savedValue?: { url: string };
  onUpload: (files: File[]) => Promise<void>;
}

const FileUpload: FC<Props> = ({ savedValue, onUpload }) => {
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    savedValue?.url
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream>(null);

  // start camera stream when mode === "camera"
  useEffect(() => {
    if (mode === "camera") {
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
          setMode("upload"); // fallback if camera denied
        });
    }
    return () => {
      // cleanup stream on switch/ unmount
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [mode]);

  // handle file picker upload
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    await onUpload([file]);
  };

  // capture photo from video stream
  const takePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `photo_${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      await onUpload([file]);
      // stop camera after capture
      streamRef.current?.getTracks().forEach((t) => t.stop());
      setMode("upload");
    }, "image/jpeg");
  };

  return (
    <div className="space-y-2">
      {/* Keuze modus */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex-1 px-3 py-2 rounded ${
            mode === "upload"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Bestand uploaden
        </button>
        <button
          type="button"
          onClick={() => setMode("camera")}
          className={`flex-1 px-3 py-2 rounded ${
            mode === "camera"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Foto nemen
        </button>
      </div>

      {/* Upload of camera UI */}
      {mode === "upload" ? (
        <input
          key="upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-600"
        />
      ) : (
        <div className="space-y-2">
          <video ref={videoRef} className="w-full rounded border" />
          <button
            type="button"
            onClick={takePhoto}
            className="w-full px-3 py-2 bg-green-500 text-white rounded"
          >
            Neem foto
          </button>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="mt-2 w-full max-h-64 object-contain rounded border"
        />
      )}
    </div>
  );
};

export default FileUpload;
