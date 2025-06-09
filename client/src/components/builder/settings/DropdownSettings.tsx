// File: src/components/builder/settings/DropdownSettings.tsx
import type { FC } from "react";
import type { ComponentItem, DropdownProps } from "../../../types/types";

export default function DropdownSettings({ comp, onUpdate }: { comp: ComponentItem; onUpdate: (c: ComponentItem) => void; }) {
  const p = comp.props as DropdownProps;
  const upd = (key: keyof DropdownProps, v: any) => onUpdate({ ...comp, props: { ...p, [key]: v } });

  return (
    <div className="space-y-4">
      { /* Label, placeholder, required, options[], defaultValue */ }
      <div>
        <label className="block mb-1">Label</label>
        <input type="text" value={p.label} onChange={e => upd("label", e.target.value)} className="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label className="block mb-1">Placeholder</label>
        <input type="text" value={p.placeholder || ""} onChange={e => upd("placeholder", e.target.value)} className="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label className="block mb-1">Opties (één per regel)</label>
        <textarea rows={3} value={p.options.join("\n")} onChange={e => upd("options", e.target.value.split("\n"))} className="w-full border px-2 py-1 rounded" />
      </div>
      <div className="flex items-center space-x-2">
        <input type="checkbox" checked={!!p.required} onChange={e => upd("required", e.target.checked)} />
        <span>Verplicht</span>
      </div>
      <div>
        <label className="block mb-1">Standaardwaarde</label>
        <input type="text" value={p.defaultValue as string || ""} onChange={e => upd("defaultValue", e.target.value)} className="w-full border px-2 py-1 rounded" />
      </div>
    </div>
  );
}