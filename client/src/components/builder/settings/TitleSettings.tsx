import type { FC } from "react";
import type { ComponentItem, TitleProps } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const defaultProps: Required<TitleProps> = {
  text: "Titel voorbeeld",
  fontFamily: "sans-serif",
  fontSize: 28,
  lineHeight: 1.4,
  color: "#000000",
  bg: "#ffffff",
  align: "left",
  bold: true,
  italic: false,
  underline: false,
};

const TitleSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p: TitleProps = { ...defaultProps, ...(comp.props as TitleProps) };

  const upd = (key: keyof TitleProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div className="space-y-6 p-4">
      {/* Tekst */}
      <div>
        <label className="block mb-1 font-medium">Titeltekst</label>
        <input
          type="text"
          value={p.text}
          onChange={(e) => upd("text", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* Lettertype */}
      <div>
        <label className="block mb-1 font-medium">Lettertype</label>
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
          <label className="block mb-1 font-medium">Lettergrootte (px)</label>
          <input
            type="number"
            min={16}
            value={p.fontSize}
            onChange={(e) => upd("fontSize", +e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Regelhoogte</label>
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

      {/* Kleur & achtergrondkleur */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Tekstkleur</label>
          <input
            type="color"
            value={p.color}
            onChange={(e) => upd("color", e.target.value)}
            className="w-full h-10"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Achtergrondkleur</label>
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
        <label className="block mb-1 font-medium">Uitlijning</label>
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

      {/* Stijlopties */}
      <div className="flex items-center gap-6">
        {(["bold", "italic", "underline"] as const).map((key) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={p[key]}
              onChange={(e) => upd(key, e.target.checked)}
              className="h-4 w-4"
            />
            <span className="capitalize">{key}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TitleSettings;
