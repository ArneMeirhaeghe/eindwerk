// File: src/components/formbuilder/previews/DropdownPreview.tsx
import React from "react";

interface Props {
  label: string;
  p: { options?: string[] };
}

export default function DropdownPreview({ label, p }: Props) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <select disabled className="w-full px-2 py-1 border rounded bg-gray-100 text-gray-700 text-sm">
        {(p.options || []).map((o, i) => (
          <option key={`${label}-opt-${i}`}>{o}</option>
        ))}
      </select>
    </div>
  );
}
