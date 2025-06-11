// File: src/components/formbuilder/settings/TextareaSettings.tsx
import React from "react";
import type { FieldDto } from "../../../api/forms/types";

interface Props {
  comp: FieldDto;
  onUpdate: (c: FieldDto) => void;
}

export default function TextareaSettings({ comp, onUpdate }: Props) {
  return (
    <div className="space-y-4 p-2">
      <h4 className="text-sm font-semibold">Tekstvak</h4>
      <div>
        <label className="block text-xs mb-1">Label</label>
        <input
          type="text"
          value={comp.label}
          onChange={e => onUpdate({ ...comp, label: e.target.value })}
          className="w-full px-2 py-1 border rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Placeholder</label>
        <input
          type="text"
          value={comp.settings.placeholder || ""}
          onChange={e =>
            onUpdate({ ...comp, settings: { ...comp.settings, placeholder: e.target.value } })
          }
          className="w-full px-2 py-1 border rounded text-sm"
        />
      </div>
    </div>
  );
}
