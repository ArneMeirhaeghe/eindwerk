// src/components/settings/MediaSettings.tsx
import React, { useState, useEffect, type FC, type ChangeEvent, } from "react";
import { uploadFile, getUploads, type MediaResponse } from "../../api/uploads";
import { toast } from "react-toastify";
import type { ComponentItem } from "../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const MediaSettings: FC<Props> = ({ comp, onUpdate }) => {
  const [tab, setTab] = useState<"upload" | "browse">("upload");
  const [mediaList, setMediaList] = useState<MediaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const p = comp.props as any;

  useEffect(() => {
    if (tab === "browse") {
      getUploads().then(setMediaList).catch(() => toast.error("Media niet geladen"));
    }
  }, [tab]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const alt = prompt("Alt-tekst", file.name)?.trim() || "";
      if (!alt) throw new Error();
      const res = await uploadFile(file, alt);
      onUpdate({ ...comp, props: { ...p, url: res.url, alt: res.alt } });
      toast.success("Upload geslaagd");
    } catch {
      toast.error("Upload mislukt");
    } finally {
      setLoading(false);
    }
  };

  const selectMedia = (m: MediaResponse) => {
    onUpdate({ ...comp, props: { ...p, url: m.url, alt: m.alt } });
    toast.info("Geselecteerd");
  };

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex mb-4 space-x-2">
        {(["upload", "browse"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded ${
              tab === t ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {t === "upload" ? "Upload" : "Bladeren"}
          </button>
        ))}
      </div>

      {/* Upload of browse */}
      {tab === "upload" ? (
        <input
          type="file"
          accept={`${comp.type}/*`}
          onChange={handleUpload}
          disabled={loading}
          className="w-full border rounded px-2 py-1 mb-4"
        />
      ) : (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {mediaList
            .filter((m) =>
              comp.type === "image"
                ? /\.(png|jpe?g|gif)$/i.test(m.url)
                : /\.(mp4|webm|ogg)$/i.test(m.url)
            )
            .map((m) =>
              comp.type === "image" ? (
                <img
                  key={m.id}
                  src={m.url}
                  alt={m.alt}
                  onClick={() => selectMedia(m)}
                  className="h-20 w-full object-cover rounded cursor-pointer border hover:ring-2"
                />
              ) : (
                <video
                  key={m.id}
                  src={m.url}
                  onClick={() => selectMedia(m)}
                  className="h-20 w-full object-cover rounded cursor-pointer border hover:ring-2"
                />
              )
            )}
        </div>
      )}

      {/* Preview & alt-tekst */}
      {p.url && (
        <>
          {comp.type === "image" ? (
            <img src={p.url} alt={p.alt} className="w-full h-auto mb-4 rounded" />
          ) : (
            <video src={p.url} controls className="w-full h-auto mb-4 rounded" />
          )}
          {comp.type === "image" && (
            <input
              type="text"
              value={p.alt}
              onChange={(e) =>
                onUpdate({ ...comp, props: { ...p, alt: e.target.value } })
              }
              placeholder="Alt-tekst"
              className="w-full border px-2 py-1 rounded mb-4"
            />
          )}
        </>
      )}
    </div>
);
}
export default MediaSettings;
