// src/components/settings/TextSettings.tsx
import React, { type FC } from "react";
import type { ComponentItem } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const TextSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p = comp.props as any;

  return (
    <div>
      {/* Tekstveld */}
      <label className="block mb-1">Tekst</label>
      <textarea
        value={p.text ?? ""}
        onChange={(e) =>
          onUpdate({ ...comp, props: { ...p, text: e.target.value } })
        }
        className="w-full border px-2 py-1 rounded mb-4"
      />

      {/* Lettertype & font size */}
      <label className="block mb-1">Lettertype</label>
      <select
        value={p.fontFamily}
        onChange={(e) =>
          onUpdate({ ...comp, props: { ...p, fontFamily: e.target.value } })
        }
        className="w-full border px-2 py-1 rounded mb-4"
      >
        {["sans-serif", "serif", "monospace"].map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="block mb-1">Font size</label>
          <input
            type="number"
            value={p.fontSize ?? 16}
            onChange={(e) =>
              onUpdate({
                ...comp,
                props: { ...p, fontSize: +e.target.value },
              })
            }
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Kleur</label>
          <input
            type="color"
            value={p.color ?? "#000000"}
            onChange={(e) =>
              onUpdate({ ...comp, props: { ...p, color: e.target.value } })
            }
            className="w-full h-10"
          />
        </div>
      </div>

      {/* Bold & Italic */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={p.bold}
            onChange={(e) =>
              onUpdate({ ...comp, props: { ...p, bold: e.target.checked } })
            }
          />
          <span>Bold</span>
        </label>
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={p.italic}
            onChange={(e) =>
              onUpdate({ ...comp, props: { ...p, italic: e.target.checked } })
            }
          />
          <span>Italic</span>
        </label>
      </div>
    </div>
);
}
export default TextSettings;
