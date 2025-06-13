import type { FC } from "react";
import type { ComponentItem, ParagraphProps } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const defaultProps: Required<ParagraphProps> = {
  text: "Voorbeeld paragraaftekst",
  fontFamily: "sans-serif",
  fontSize: 16,
  lineHeight: 1.5,
  color: "#000000",
  bg: "#ffffff",
  align: "left",
  bold: false,
  italic: false,
  underline: false,
};

const ParagraphSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p: ParagraphProps = { ...defaultProps, ...(comp.props as ParagraphProps) };

  const upd = (key: keyof ParagraphProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div className="space-y-6 p-4">
      {/* Tekst */}
      <div>
        <label className="block mb-1 font-medium">Paragraaftekst</label>
        <textarea
          value={p.text}
          placeholder="Typ hier je tekst..."
          onChange={(e) => upd("text", e.target.value)}
          rows={4}
          className="w-full border border-gray-300 px-2 py-1 rounded"
        />
      </div>

      {/* Grootte & regelhoogte */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Tekengrootte (px)</label>
          <input
            type="number"
            min={10}
            value={p.fontSize ?? 16}
            placeholder="Bijv. 16"
            onChange={(e) => upd("fontSize", +e.target.value)}
            className="w-full border border-gray-300 px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Regelhoogte</label>
          <input
            type="number"
            step={0.1}
            min={1}
            value={p.lineHeight ?? 1.5}
            placeholder="Bijv. 1.5"
            onChange={(e) => upd("lineHeight", +e.target.value)}
            className="w-full border border-gray-300 px-2 py-1 rounded"
          />
        </div>
      </div>

      {/* Kleur & achtergrond */}
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
            value={p.bg || "#ffffff"}
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
          onChange={(e) => upd("align", e.target.value as ParagraphProps["align"])}
          className="w-full border border-gray-300 px-2 py-1 rounded"
        >
          <option value="left">Links</option>
          <option value="center">Gecentreerd</option>
          <option value="right">Rechts</option>
          <option value="justify">Uitvullen</option>
        </select>
      </div>

      {/* Tekstopmaak */}
      <div className="flex items-center gap-6">
        {(["bold", "italic", "underline"] as const).map((style) => (
          <label key={style} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={p[style]}
              onChange={(e) => upd(style, e.target.checked)}
              className="h-4 w-4"
            />
            <span className="capitalize">{style}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ParagraphSettings;
