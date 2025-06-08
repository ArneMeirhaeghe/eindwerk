import React, { type FC, type ChangeEvent } from "react";
import type { ComponentItem } from "../../../types/types";

type ButtonFunctionType = "dummy" | "link";

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
    functionType?: ButtonFunctionType;
    url?: string;
  };

  const updateProp = (key: string, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  const handleFunctionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const fn = e.target.value as ButtonFunctionType;
    updateProp("functionType", fn);
    if (fn !== "link") updateProp("url", undefined);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Label */}
      <div>
        <label className="block mb-1 font-medium">Label</label>
        <input
          type="text"
          value={p.label}
          onChange={e => updateProp("label", e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Font size */}
      <div>
        <label className="block mb-1 font-medium">Font size</label>
        <input
          type="number"
          value={p.fontSize}
          onChange={e => updateProp("fontSize", +e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Color & Background */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block mb-1 font-medium">Tekstkleur</label>
          <input
            type="color"
            value={p.color}
            onChange={e => updateProp("color", e.target.value)}
            className="w-full h-10"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Achtergrond</label>
          <input
            type="color"
            value={p.bg}
            onChange={e => updateProp("bg", e.target.value)}
            className="w-full h-10"
          />
        </div>
      </div>

      {/* Radius */}
      <div>
        <label className="block mb-1 font-medium">Radius</label>
        <input
          type="number"
          value={p.radius}
          onChange={e => updateProp("radius", +e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Bold / Italic / Underline */}
      <div className="flex items-center space-x-4">
        {(["bold", "italic", "underline"] as const).map(sty => (
          <label key={sty} className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={p[sty]}
              onChange={e => updateProp(sty, e.target.checked)}
            />
            <span className="capitalize">{sty}</span>
          </label>
        ))}
      </div>

      {/* Actie dropdown */}
      <div>
        <label className="block mb-1 font-medium">Actie</label>
        <select
          value={p.functionType ?? "dummy"}
          onChange={handleFunctionChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value="dummy">Dummy knop (doet niets)</option>
          <option value="link">Link</option>
        </select>
      </div>

      {/* URL-invoer bij ‘Link’ */}
      {p.functionType === "link" && (
        <div>
          <label className="block mb-1 font-medium">URL</label>
          <input
            type="text"
            placeholder="https://example.com"
            value={p.url ?? ""}
            onChange={e => updateProp("url", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      )}
    </div>
  );
};

export default ButtonSettings;
