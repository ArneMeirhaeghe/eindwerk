import type { FC } from "react";
import type { ComponentItem, SubheadingProps } from "../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const SubheadingSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p = comp.props as SubheadingProps;
  const upd = (key: keyof SubheadingProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div className="space-y-4">
      {/* Subheading tekst */}
      <div>
        <label className="block mb-1">Subheading</label>
        <input
          type="text"
          value={p.text}
          onChange={(e) => upd("text", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* Font size */}
      <div>
        <label className="block mb-1">Grootte (px)</label>
        <input
          type="number"
          min={14}
          value={p.fontSize}
          onChange={(e) => upd("fontSize", +e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
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
          onChange={(e) => upd("align", e.target.value as SubheadingProps["align"])}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="left">Links</option>
          <option value="center">Centreren</option>
          <option value="right">Rechts</option>
        </select>
      </div>

      {/* Italic */}
      <label className="flex items-center space-x-1">
        <input
          type="checkbox"
          checked={p.italic}
          onChange={(e) => upd("italic", e.target.checked)}
        />
        <span>Italic</span>
      </label>
    </div>
  );
};

export default SubheadingSettings;
