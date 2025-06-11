// File: src/components/formbuilder/ComponentPalette.tsx
import React from "react";
import { Edit, FileText, ChevronDown, Circle, CheckCircle } from "lucide-react";
import type { FieldDto } from "../../api/forms/types";

const labelMap: Record<FieldDto["type"], string> = {
  "text-input": "Tekst-invoer",
  textarea: "Tekstvak",
  dropdown: "Dropdown",
  "radio-group": "Radiogroep",
  "checkbox-group": "Checkbox-groep",
};

const iconMap: Record<FieldDto["type"], React.FC<any>> = {
  "text-input": Edit,
  textarea: Edit,
  dropdown: ChevronDown,
  "radio-group": Circle,
  "checkbox-group": CheckCircle,
};

const TYPES = ["text-input", "textarea", "dropdown", "radio-group", "checkbox-group"] as const;

interface Props {
  onAdd: (type: FieldDto["type"]) => void;
}

export default function ComponentPalette({ onAdd }: Props) {
  return (
    <aside className="w-64 p-4 bg-white shadow-md rounded-lg overflow-auto">
      <h3 className="text-sm font-semibold mb-2 text-gray-700">Form Velden</h3>
      <div className="flex flex-col space-y-2">
        {TYPES.map((type) => {
          const Icon = iconMap[type];
          return (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <Icon size={18} className="text-gray-600" />
              <span className="text-sm text-gray-800">{labelMap[type]}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
