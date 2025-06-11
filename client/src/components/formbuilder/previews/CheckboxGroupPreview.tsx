// File: src/components/formbuilder/previews/CheckboxGroupPreview.tsx
import React from "react";

interface Props {
  label: string;
  p: { options?: string[] };
}

export default function CheckboxGroupPreview({ label, p }: Props) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <div className="space-y-1">
        {(p.options || []).map((o, i) => (
          <label key={`${label}-chk-${i}`} className="flex items-center space-x-2 text-sm">
            <input type="checkbox" disabled />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
