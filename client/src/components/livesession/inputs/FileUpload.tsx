// File: src/components/livesession/FileUpload.tsx

import { useState, type ChangeEvent,  } from "react";

interface Props {
  componentId: string;
  savedValue: any;
  onUpload: (files: File[]) => Promise<void>;
}

export default function FileUpload({ componentId, savedValue, onUpload }: Props) {
  const [previews, setPreviews] = useState<string[]>(
    Array.isArray(savedValue) ? savedValue.map((v: any) => v.url) : []
  );
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    // Zet FileList om naar een echte array
    const files = Array.from(fileList);
    // Direct preview-URL's aanmaken
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);

    setUploading(true);
    try {
      await onUpload(files);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={componentId} className="font-medium">
        Bestand(en) uploaden
      </label>
      <input
        id={componentId}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleChange}
        className="block w-full text-sm text-gray-600"
      />
      {uploading && <p className="text-sm text-gray-500">Bezig met uploaden…</p>}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {previews.map((url, i) => (
            <div key={i} className="relative">
              <img
                src={url}
                alt={`Preview ${i + 1}`}
                className="w-full h-24 object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
