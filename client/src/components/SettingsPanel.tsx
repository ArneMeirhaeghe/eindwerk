// src/components/SettingsPanel.tsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { uploadFile } from "../api/files";
import type { ComponentItem } from "../types/types";

interface Props {
  comp: ComponentItem | null;
  onUpdate: (c: ComponentItem) => void;
  sectionTitle: string;
  onSectionTitleChange: (t: string) => void;
}

export default function SettingsPanel({
  comp,
  onUpdate,
  sectionTitle,
  onSectionTitleChange,
}: Props) {
  const [uploading, setUploading] = useState(false);

  if (!comp) {
    return <div className="p-4 text-gray-500">Selecteer een component</div>;
  }

  const p = comp.props;

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "url"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onUpdate({ ...comp, props: { ...p, [field]: url } });
      toast.success("Upload geslaagd");
    } catch {
      toast.error("Upload mislukt");
    } finally {
      setUploading(false);
    }
  };

  return (
    <aside className="w-72 border-l p-4 overflow-auto">
      <h3 className="font-semibold mb-4">Instellingen: {comp.type}</h3>

      {/* TITLE, SUBHEADING, PARAGRAPH, QUOTE */}
      {["title", "subheading", "paragraph", "quote"].includes(comp.type) && (
        <>
          <div className="mb-4">
            <label className="block mb-1">Tekst</label>
            <textarea
              value={p.text}
              onChange={(e) =>
                onUpdate({ ...comp, props: { ...p, text: e.target.value } })
              }
              className="w-full border px-2 py-1 rounded"
              rows={3}
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1">Font size</label>
              <input
                type="number"
                value={p.fontSize}
                onChange={(e) =>
                  onUpdate({
                    ...comp,
                    props: { ...p, fontSize: Number(e.target.value) },
                  })
                }
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Line height</label>
              <input
                type="number"
                step="0.1"
                value={p.lineHeight}
                onChange={(e) =>
                  onUpdate({
                    ...comp,
                    props: { ...p, lineHeight: Number(e.target.value) },
                  })
                }
                className="w-full border px-2 py-1 rounded"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1">Text color</label>
              <input
                type="color"
                value={p.color}
                onChange={(e) =>
                  onUpdate({ ...comp, props: { ...p, color: e.target.value } })
                }
                className="w-full h-10"
              />
            </div>
            <div>
              <label className="block mb-1">Background</label>
              <input
                type="color"
                value={p.bg}
                onChange={(e) =>
                  onUpdate({ ...comp, props: { ...p, bg: e.target.value } })
                }
                className="w-full h-10"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Align</label>
            <select
              value={p.align}
              onChange={(e) =>
                onUpdate({ ...comp, props: { ...p, align: e.target.value } })
              }
              className="w-full border px-2 py-1 rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="mb-4 flex items-center space-x-4">
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={p.bold}
                onChange={(e) =>
                  onUpdate({
                    ...comp,
                    props: { ...p, bold: e.target.checked },
                  })
                }
              />
              <span>Bold</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={p.italic}
                onChange={(e) =>
                  onUpdate({
                    ...comp,
                    props: { ...p, italic: e.target.checked },
                  })
                }
              />
              <span>Italic</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={p.underline}
                onChange={(e) =>
                  onUpdate({
                    ...comp,
                    props: { ...p, underline: e.target.checked },
                  })
                }
              />
              <span>Underline</span>
            </label>
          </div>
        </>
      )}

      {/* IMAGE */}
      {comp.type === "image" && (
        <>
          <div className="mb-4">
            <label className="block mb-1">Upload afbeelding</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "url")}
              disabled={uploading}
              className="w-full"
            />
          </div>
          {uploading && <p className="mb-4">Uploaden…</p>}
          {p.url && (
            <>
              <img
                src={p.url}
                alt={p.alt || ""}
                className="w-full h-auto mb-4 border rounded"
              />
              <div className="mb-4">
                <label className="block mb-1">Alt text</label>
                <input
                  value={p.alt}
                  onChange={(e) =>
                    onUpdate({ ...comp, props: { ...p, alt: e.target.value } })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
            </>
          )}
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1">Width</label>
              <select
                value={p.width}
                onChange={(e) =>
                  onUpdate({
                    ...comp,
                    props: { ...p, width: e.target.value },
                  })
                }
                className="w-full border px-2 py-1 rounded"
              >
                <option value="full">Full</option>
                <option value="1/2">1/2</option>
                <option value="1/3">1/3</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Object fit</label>
              <select
                value={p.objectFit}
                onChange={(e) =>
                  onUpdate({
                    ...comp,
                    props: { ...p, objectFit: e.target.value },
                  })
                }
                className="w-full border px-2 py-1 rounded"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* VIDEO */}
      {comp.type === "video" && (
        <>
          <div className="mb-4">
            <label className="block mb-1">Upload video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload(e, "url")}
              disabled={uploading}
              className="w-full"
            />
          </div>
          {uploading && <p className="mb-4">Uploaden…</p>}
          {p.url && (
            <video
              src={p.url}
              controls={p.controls}
              autoPlay={p.autoplay}
              loop={p.loop}
              className="w-full h-auto mb-4 border rounded"
            />
          )}
          <div className="mb-4 flex space-x-4">
            {["controls", "autoplay", "loop"].map((opt) => (
              <label key={opt} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={p[opt]}
                  onChange={(e) =>
                    onUpdate({
                      ...comp,
                      props: { ...p, [opt]: e.target.checked },
                    })
                  }
                />
                <span className="capitalize">{opt}</span>
              </label>
            ))}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Width</label>
            <select
              value={p.width}
              onChange={(e) =>
                onUpdate({ ...comp, props: { ...p, width: e.target.value } })
              }
              className="w-full border px-2 py-1 rounded"
            >
              <option value="full">Full</option>
              <option value="1/2">1/2</option>
              <option value="1/3">1/3</option>
            </select>
          </div>
        </>
      )}

      {/* BUTTON */}
      {comp.type === "button" && (
        <>
          <div className="mb-4">
            <label className="block mb-1">Label</label>
            <input
              value={p.label}
              onChange={(e) =>
                onUpdate({ ...comp, props: { ...p, label: e.target.value } })
              }
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1">Font size</label>
              <input
                type="number"
                value={p.fontSize}
                onChange={(e) =>
                  onUpdate({
                    ...comp,
                    props: { ...p, fontSize: Number(e.target.value) },
                  })
                }
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Border radius</label>
              <input
                type="number"
                value={p.radius}
                onChange={(e) =>
                  onUpdate({
                    ...comp,
                    props: { ...p, radius: Number(e.target.value) },
                  })
                }
                className="w-full border px-2 py-1 rounded"
              />
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1">Text color</label>
              <input
                type="color"
                value={p.color}
                onChange={(e) =>
                  onUpdate({ ...comp, props: { ...p, color: e.target.value } })
                }
                className="w-full h-10"
              />
            </div>
            <div>
              <label className="block mb-1">Background</label>
              <input
                type="color"
                value={p.bg}
                onChange={(e) =>
                  onUpdate({ ...comp, props: { ...p, bg: e.target.value } })
                }
                className="w-full h-10"
              />
            </div>
          </div>
          <div className="mb-4 flex items-center space-x-4">
            {["bold", "italic", "underline"].map((opt) => (
              <label key={opt} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={p[opt]}
                  onChange={(e) =>
                    onUpdate({
                      ...comp,
                      props: { ...p, [opt]: e.target.checked },
                    })
                  }
                />
                <span className="capitalize">{opt}</span>
              </label>
            ))}
          </div>
          <div className="mb-4 flex items-center">
            <label className="mr-2">Disabled</label>
            <input
              type="checkbox"
              checked={p.disabled}
              onChange={(e) =>
                onUpdate({ ...comp, props: { ...p, disabled: e.target.checked } })
              }
            />
          </div>
        </>
      )}

      
      {/* CHECKLIST */}
     {/* CHECKLIST */}
{comp.type === "checklist" && Array.isArray(p.items) && (
  <>
    <div className="mb-4">
      <label className="block mb-1 font-medium">Items</label>

      {p.items.map((item: string, idx: number) => (
        <div key={idx} className="flex items-center mb-2 space-x-2">
          <input
            type="text"
            value={item}
            onChange={e => {
              const items = [...p.items];
              items[idx] = e.target.value;
              onUpdate({ ...comp, props: { ...p, items } });
            }}
            className="flex-1 border px-2 py-1 rounded"
          />
          <button
            onClick={() => {
              // hier expliciet ( _: string, i: number )
              const items = p.items.filter((_: string, i: number) => i !== idx);
              onUpdate({ ...comp, props: { ...p, items } });
            }}
            className="text-red-500 px-2"
          >
            ×
          </button>
        </div>
      ))}

      <button
        onClick={() => {
          const items = [...p.items, ""];
          onUpdate({ ...comp, props: { ...p, items } });
        }}
        className="text-sm text-blue-600 hover:underline"
      >
        Item toevoegen
      </button>
    </div>

    <div className="mb-4">
      <label className="block mb-1">Font size</label>
      <input
        type="number"
        value={p.fontSize}
        onChange={e =>
          onUpdate({
            ...comp,
            props: { ...p, fontSize: Number(e.target.value) },
          })
        }
        className="w-full border px-2 py-1 rounded"
      />
    </div>

    <div className="mb-4">
      <label className="block mb-1">Tekstkleur</label>
      <input
        type="color"
        value={p.color}
        onChange={e =>
          onUpdate({ ...comp, props: { ...p, color: e.target.value } })
        }
        className="w-full h-10"
      />
    </div>

    <div className="mb-4">
      <label className="block mb-1">Achtergrond</label>
      <input
        type="color"
        value={p.bg}
        onChange={e =>
          onUpdate({ ...comp, props: { ...p, bg: e.target.value } })
        }
        className="w-full h-10"
      />
    </div>

    <div className="mb-4">
      <label className="block mb-1">Spacing (afstand tussen items)</label>
      <input
        type="number"
        value={p.spacing}
        onChange={e =>
          onUpdate({
            ...comp,
            props: { ...p, spacing: Number(e.target.value) },
          })
        }
        className="w-full border px-2 py-1 rounded"
      />
    </div>
  </>
)}


      {/* DIVIDER */}
      {comp.type === "divider" && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1">Thickness</label>
              <input
                type="number"
                value={p.thickness}
                onChange={(e) =>
                  onUpdate({
                    ...comp,
                    props: { ...p, thickness: Number(e.target.value) },
                  })
                }
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Margin Y</label>
              <input
                type="number"
                value={p.marginY}
                onChange={(e) =>
                  onUpdate({
                    ...comp,
                    props: { ...p, marginY: Number(e.target.value) },
                  })
                }
                className="w-full border px-2 py-1 rounded"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Color</label>
            <input
              type="color"
              value={p.color}
              onChange={(e) =>
                onUpdate({ ...comp, props: { ...p, color: e.target.value } })
              }
              className="w-full h-10"
            />
          </div>
        </>
      )}

      {/* Sectie titel */}
      <div className="mt-6">
        <label className="block mb-1 font-semibold">Sectie titel</label>
        <input
          value={sectionTitle}
          onChange={(e) => onSectionTitleChange(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
    </aside>
  );
}
