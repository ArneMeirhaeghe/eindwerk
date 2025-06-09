// File: src/components/builder/settings/TextareaSettings.tsx
import type { FC } from "react";
import type { ComponentItem, TextareaProps } from "../../../types/types";

export default function TextareaSettings({ comp, onUpdate }: { comp: ComponentItem; onUpdate: (c: ComponentItem) => void; }) {
  const p = comp.props as TextareaProps;
  const upd = (key: keyof TextareaProps, v: any) => onUpdate({ ...comp, props: { ...p, [key]: v } });

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1">Label</label>
        <input type="text" value={p.label} onChange={e => upd("label", e.target.value)} className="w-full border px-2 py-1 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Placeholder</label>
          <input type="text" value={p.placeholder || ""} onChange={e => upd("placeholder", e.target.value)} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block mb-1">Rijen</label>
          <input type="number" value={p.rows || 3} min={1} onChange={e => upd("rows", +e.target.value)} className="w-full border px-2 py-1 rounded" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input type="checkbox" checked={!!p.required} onChange={e => upd("required", e.target.checked)} />
        <span>Verplicht</span>
      </div>
      <div>
        <label className="block mb-1">Standaardwaarde</label>
        <textarea rows={2} value={p.defaultValue as string || ""} onChange={e => upd("defaultValue", e.target.value)} className="w-full border px-2 py-1 rounded" />
      </div>
    </div>
  );
}