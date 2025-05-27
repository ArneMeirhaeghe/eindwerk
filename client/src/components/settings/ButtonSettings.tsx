// src/components/settings/ButtonSettings.tsx
import React, { type FC, type ChangeEvent } from "react";
import type { ComponentItem } from "../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const ButtonSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p = comp.props as {
    label: string;
    fontSize: number;
    color: string;
    bg: string;
    radius: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };

  const updateProp = (key: string, value: any) => {
    onUpdate({ ...comp, props: { ...p, [key]: value } });
  };

  return (
    <div>
      {/* Label */}
      <label className="block mb-1">Label</label>
      <input
        type="text"
        value={p.label}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateProp("label", e.target.value)
        }
        className="w-full border px-2 py-1 rounded mb-4"
      />

      {/* Font size */}
      <label className="block mb-1">Font size</label>
      <input
        type="number"
        value={p.fontSize}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateProp("fontSize", +e.target.value)
        }
        className="w-full border px-2 py-1 rounded mb-4"
      />

      {/* Text color & Background */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="block mb-1">Tekstkleur</label>
          <input
            type="color"
            value={p.color}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateProp("color", e.target.value)
            }
            className="w-full h-10"
          />
        </div>
        <div>
          <label className="block mb-1">Achtergrond</label>
          <input
            type="color"
            value={p.bg}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateProp("bg", e.target.value)
            }
            className="w-full h-10"
          />
        </div>
      </div>

      {/* Border radius */}
      <label className="block mb-1">Radius</label>
      <input
        type="number"
        value={p.radius}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateProp("radius", +e.target.value)
        }
        className="w-full border px-2 py-1 rounded mb-4"
      />

      {/* Bold, Italic, Underline */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={p.bold}
            onChange={(e) => updateProp("bold", e.target.checked)}
          />
          <span>Bold</span>
        </label>
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={p.italic}
            onChange={(e) => updateProp("italic", e.target.checked)}
          />
          <span>Italic</span>
        </label>
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={p.underline}
            onChange={(e) => updateProp("underline", e.target.checked)}
          />
          <span>Underline</span>
        </label>
      </div>
    </div>
);
}
export default ButtonSettings;
