// File: src/components/formbuilder/settings/DropdownSettings.tsx
import React from "react";
import type { FieldDto } from "../../../api/forms/types";

interface Props {
  comp: FieldDto;
  onUpdate: (c: FieldDto) => void;
}

export default function DropdownSettings({ comp, onUpdate }: Props) {
  const opts = (comp.settings.options as string[]) || [];
  return (
    <div className="space-y-4 p-2">
      <h4 className="text-sm font-semibold">Dropdown</h4>
      <div>
        <label className="block text-xs mb-1">Label</label>
        <input
          type="text"
          value={comp.label}
          onChange={e => onUpdate({ ...comp, label: e.target.value })}
          className="w-full px-2 py-1 border rounded text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs mb-1">Opties</label>
        {opts.map((o, i) => (
          <input
            key={i}
            type="text"
            value={o}
            onChange={e => {
              const arr = [...opts]; arr[i] = e.target.value;
              onUpdate({ ...comp, settings: { ...comp.settings, options: arr } });
            }}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        ))}
        <button
          onClick={() =>
            onUpdate({ ...comp, settings: { ...comp.settings, options: [...opts, ""] } })
          }
          className="px-2 py-1 bg-gray-200 rounded text-sm"
        >
          + Optie
        </button>
      </div>
    </div>
  );
}
