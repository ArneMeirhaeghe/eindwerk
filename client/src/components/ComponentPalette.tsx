// src/components/ComponentPalette.tsx
import type { ComponentType } from "../types/types";

interface Props {
  onAdd: (type: ComponentType) => void;
}

export default function ComponentPalette({ onAdd }: Props) {
  const types: ComponentType[] = [
    "title",
    "subheading",
    "paragraph",
    "quote",
    "image",
    "video",
    "file",
    "button",
    "checklist",
    "divider",
    "checkbox-list",
    "grid", // nieuwe grid component
  ];

  return (
    <aside className="w-60 border-r p-4 overflow-auto">
      <h3 className="font-semibold mb-2">Componenten</h3>
      <div className="flex flex-col gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onAdd(type)}
            className="text-left px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            +{" "}
            {type === "checkbox-list"
              ? "Checkbox lijst"
              : type === "grid"
              ? "Grid"
              : type}
          </button>
        ))}
      </div>
    </aside>
  );
}
