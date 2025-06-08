import type { FC } from "react";
import type { ComponentItem, TitleProps } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const TitleSettings: FC<Props> = ({ comp, onUpdate }) => {
  // Props voor deze component
  const p = comp.props as TitleProps;
  // Helper om props bij te werken
  const upd = (key: keyof TitleProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div className="space-y-4">
      {/* Titeltekst */}
      <div>
        <label className="block mb-1">Titeltekst</label>
        <input
          type="text"
          value={p.text}
          onChange={(e) => upd("text", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* Lettertype */}
      <div>
        <label className="block mb-1">Lettertype</label>
        <select
          value={p.fontFamily}
          onChange={(e) => upd("fontFamily", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="sans-serif">Sans-serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
      </div>

      {/* Grootte & regelhoogte */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Grootte (px)</label>
          <input
            type="number"
            min={16}
            value={p.fontSize}
            onChange={(e) => upd("fontSize", +e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Regelhoogte</label>
          <input
            type="number"
            step={0.1}
            min={1}
            value={p.lineHeight}
            onChange={(e) => upd("lineHeight", +e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
      </div>

      {/* Kleur & achtergrond */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Tekstkleur</label>
          <input
            type="color"
            value={p.color}
            onChange={(e) => upd("color", e.target.value)}
            className="w-full h-10"
          />
        </div>
        <div>
          <label className="block mb-1">Achtergrondkleur</label>
          <input
            type="color"
            value={p.bg}
            onChange={(e) => upd("bg", e.target.value)}
            className="w-full h-10"
          />
        </div>
      </div>

      {/* Uitlijning */}
      <div>
        <label className="block mb-1">Uitlijning</label>
        <select
          value={p.align}
          onChange={(e) => upd("align", e.target.value as TitleProps["align"])}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="left">Links</option>
          <option value="center">Centreren</option>
          <option value="right">Rechts</option>
        </select>
      </div>

      {/* Stijl */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={p.bold}
            onChange={(e) => upd("bold", e.target.checked)}
          />
          <span>Bold</span>
        </label>
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={p.italic}
            onChange={(e) => upd("italic", e.target.checked)}
          />
          <span>Italic</span>
        </label>
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={p.underline}
            onChange={(e) => upd("underline", e.target.checked)}
          />
          <span>Underline</span>
        </label>
      </div>
    </div>
  );
};

export default TitleSettings;
