// File: src/components/settings/GridSettings.tsx

import  { useState, useEffect, type FC, type ChangeEvent } from "react";
import { toast } from "react-toastify";
import { Plus, Image as ImageIcon } from "lucide-react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import type { ComponentItem, GridProps } from "../../../types/types";
import type { MediaResponse } from "../../../api/media/types";
import { getUploads, uploadFile } from "../../../api/media";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const GridSettings: FC<Props> = ({ comp, onUpdate }) => {
  const defaults: Required<GridProps> = {
    images: [],
    columns: 3,
    gap: 8,
    borderWidth: 0,
    borderColor: "#000000",
    radius: 0,
    shadow: false,
    objectFit: "cover",
  };
  const p: Required<GridProps> = { ...defaults, ...(comp.props as GridProps) };

  const update = (k: keyof GridProps, v: any) =>
    onUpdate({ ...comp, props: { ...p, [k]: v } });

  const [uploads, setUploads] = useState<MediaResponse[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

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
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      toast.error("Selecteer eerst afbeeldingen");
      return;
    }
    setLoading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const res = await uploadFile(file, file.name, "img");
        urls.push(res.url);
      }
      update("images", [...p.images, ...urls]);
      setFiles(null);
      await fetchImages();
      toast.success("Upload geslaagd");
    } catch {
      toast.error("Upload mislukt");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: MediaResponse) => {
    if (!p.images.includes(item.url)) {
      update("images", [...p.images, item.url]);
    }
  };

  const handleRemove = (i: number) => {
    const arr = [...p.images];
    arr.splice(i, 1);
    update("images", arr);
  };

  const onDragEnd = (res: DropResult) => {
    if (!res.destination) return;
    const arr = [...p.images];
    const [m] = arr.splice(res.source.index, 1);
    arr.splice(res.destination.index, 0, m);
    update("images", arr);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="p-4 border-2 border-dashed border-gray-300 rounded bg-white">
        <h3 className="text-sm font-semibold flex items-center">
          <ImageIcon className="w-4 h-4 mr-2" /> Upload afbeelding(en)
        </h3>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mt-2 w-full"
        />
        {files && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-3 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {loading ? "Bezig met uploaden..." : `Uploaden (${files.length})`}
          </button>
        )}
      </div>

      {/* Browse Zone */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
        <h3 className="text-sm font-semibold mb-2">
          Beschikbare afbeeldingen
        </h3>
        {uploads.length ? (
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-auto">
            {uploads.map((item) => (
              <div key={item.id} className="relative group">
                <img
                  src={item.url}
                  alt={item.alt || ""}
                  className="h-20 w-full object-cover rounded border cursor-pointer"
                  onClick={() => handleSelect(item)}
                />
                {!p.images.includes(item.url) && (
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 transition"
                    onClick={() => handleSelect(item)}
                  >
                    <Plus className="w-6 h-6 text-gray-800" />
                  </button>
                )}
                {p.images.includes(item.url) && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic text-sm">
            Geen afbeeldingen gevonden
          </div>
        )}
      </div>

      {/* Selected Grid */}
      <div>
        <p className="text-sm font-medium mb-2">
          Geselecteerde afbeeldingen (sleep om te herschikken)
        </p>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="grid" direction="horizontal">
            {(prov) => (
              <div
                ref={prov.innerRef}
                {...prov.droppableProps}
                className="flex space-x-2 overflow-auto"
              >
                {p.images.map((url, i) => (
                  <Draggable key={`${url}-${i}`} draggableId={`${url}-${i}`} index={i}>
                    {(prov2) => (
                      <div
                        ref={prov2.innerRef}
                        {...prov2.draggableProps}
                        {...prov2.dragHandleProps}
                        className="relative"
                      >
                        <img
                          src={url}
                          className="h-16 w-16 object-cover rounded border"
                          style={{
                            borderWidth: p.borderWidth,
                            borderColor: p.borderColor,
                            borderStyle: "solid",
                            borderRadius: p.radius,
                            boxShadow: p.shadow
                              ? "0 2px 8px rgba(0,0,0,0.2)"
                              : undefined,
                          }}
                        />
                        <button
                          onClick={() => handleRemove(i)}
                          className="absolute top-0 right-0 text-red-500 bg-white rounded-full p-1 -mt-1 -mr-1"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {prov.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Grid Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Kolommen</label>
          <input
            type="number"
            min={1}
            max={6}
            value={p.columns}
            onChange={(e) => update("columns", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Gap (px)</label>
          <input
            type="number"
            min={0}
            max={50}
            value={p.gap}
            onChange={(e) => update("gap", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Randdikte</label>
          <input
            type="number"
            min={0}
            value={p.borderWidth}
            onChange={(e) => update("borderWidth", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Randkleur</label>
          <input
            type="color"
            value={p.borderColor}
            onChange={(e) => update("borderColor", e.target.value)}
            className="w-full h-8"
          />
        </div>
        <div>
          <label className="block mb-1">Radius</label>
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
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span>Schaduw</span>
        </label>
        <div>
          <label className="block mb-1">Object-fit</label>
          <select
            value={p.objectFit}
            onChange={(e) =>
              update("objectFit", e.target.value as GridProps["objectFit"])
            }
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

export default GridSettings;
