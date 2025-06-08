import type { FC } from "react";
import type { ComponentItem, ParagraphProps } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const ParagraphSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p = comp.props as ParagraphProps;
  const upd = (key: keyof ParagraphProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div className="space-y-4">
      {/* Paragraaftekst */}
      <div>
        <label className="block mb-1">Paragraaf</label>
        <textarea
          value={p.text}
          onChange={(e) => upd("text", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* Font size & line height */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Grootte (px)</label>
          <input
            type="number"
            min={12}
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

      {/* Kleur */}
      <div>
        <label className="block mb-1">Kleur</label>
        <input
          type="color"
          value={p.color}
          onChange={(e) => upd("color", e.target.value)}
          className="w-full h-10"
        />
      </div>

      {/* Uitlijning */}
      <div>
        <label className="block mb-1">Uitlijning</label>
        <select
          value={p.align}
          onChange={(e) => upd("align", e.target.value as ParagraphProps["align"])}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="left">Links</option>
          <option value="justify">Uitvullen</option>
        </select>
      </div>
    </div>
  );
};

export default ParagraphSettings;
