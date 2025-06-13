import type { FC } from "react";
import type { ComponentItem, QuoteProps } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const defaultProps: Required<QuoteProps> = {
  text: "“Voorbeeldquote die indruk maakt.”",
  fontFamily: "sans-serif",
  author: "Auteur Naam",
  fontSize: 16,
  lineHeight: 1.5,
  color: "#000000",
  bg: "#ffffff",
  align: "left",
  bold: false,
  italic: true,
  underline: false,
};

const QuoteSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p: QuoteProps = { ...defaultProps, ...(comp.props as QuoteProps) };

  const upd = (key: keyof QuoteProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div className="space-y-6 p-4">
      {/* Quote tekst */}
      <div>
        <label className="block mb-1 font-medium">Quote</label>
        <textarea
          value={p.text}
          onChange={(e) => upd("text", e.target.value)}
          className="w-full border border-gray-300 px-2 py-1 rounded"
          rows={3}
        />
      </div>

      {/* Auteur */}
      <div>
        <label className="block mb-1 font-medium">Auteur</label>
        <input
          type="text"
          value={p.author}
          onChange={(e) => upd("author", e.target.value)}
          className="w-full border border-gray-300 px-2 py-1 rounded"
        />
      </div>

      {/* Grootte + kleur */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Tekengrootte (px)</label>
          <input
            type="number"
            min={10}
            value={p.fontSize}
            onChange={(e) => upd("fontSize", +e.target.value)}
            className="w-full border border-gray-300 px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Tekstkleur</label>
          <input
            type="color"
            value={p.color}
            onChange={(e) => upd("color", e.target.value)}
            className="w-full h-10"
          />
        </div>
      </div>

      {/* Uitlijning */}
      <div>
        <label className="block mb-1 font-medium">Uitlijning</label>
        <select
          value={p.align}
          onChange={(e) => upd("align", e.target.value as QuoteProps["align"])}
          className="w-full border border-gray-300 px-2 py-1 rounded"
        >
          <option value="left">Links</option>
          <option value="center">Centreren</option>
          <option value="right">Rechts</option>
        </select>
      </div>

      {/* Stijlopties */}
      <div className="flex items-center gap-6">
        {(["bold", "italic", "underline"] as const).map((style) => (
          <label key={style} className="flex items-center gap-2 text-sm">
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

export default QuoteSettings;
