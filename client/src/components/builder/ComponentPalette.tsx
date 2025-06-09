// File: src/components/builder/ComponentPalette.tsx
import { CloudUpload } from "lucide-react";
import type { ComponentType } from "../../types/types";

interface Props {
  onAdd: (type: ComponentType) => void;
}

export default function ComponentPalette({ onAdd }: Props) {
  const types: ComponentType[] = [
    "title", "subheading", "paragraph", "quote",
    "image", "video", "file", "button",
    "checklist", "divider", "checkbox-list", "grid", "uploadzone",
    // nieuw:
    "text-input", "textarea", "dropdown", "radio-group", "checkbox-group",
  ];

  const labelMap: Record<ComponentType, string> = {
    title: "Titel",
    subheading: "Subkop",
    paragraph: "Paragraaf",
    quote: "Quote",
    image: "Afbeelding",
    video: "Video",
    file: "Bestand",
    button: "Knop",
    checklist: "Checklist",
    divider: "Scheiding",
    "checkbox-list": "Checkbox-lijst",
    grid: "Grid",
    uploadzone: "Upload Foto",
    // nieuw:
    "text-input": "Tekstveld",
    textarea: "Tekstvak",
    dropdown: "Dropdown",
    "radio-group": "Radioknoppen",
    "checkbox-group": "Checkboxen",
  };

  return (
    <aside className="w-60 border-r p-4 overflow-auto">
      <h3 className="font-semibold mb-2">Componenten</h3>
      <div className="flex flex-col gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onAdd(type)}
            className="text-left px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition flex items-center justify-between"
          >
            + {labelMap[type]}
            {type === "uploadzone" && <CloudUpload size={16} />}
          </button>
        ))}
      </div>
    </aside>
  );
}
