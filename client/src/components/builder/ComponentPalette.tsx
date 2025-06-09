// File: src/components/builder/ComponentPalette.tsx

import { CloudUpload } from "lucide-react";
import type { ComponentType } from "../../types/types";

interface Props {
  onAdd: (type: ComponentType) => void;
}

// Groepeer componenten per categorie voor betere UX
const groups: {
  title: string;
  types: ComponentType[];
}[] = [
  {
    title: "Tekst",
    types: ["title", "subheading", "paragraph", "quote"],
  },
  {
    title: "Media",
    types: ["image", "video", "uploadzone", "file"],
  },
  {
    title: "Input",
    types: ["text-input", "textarea", "dropdown", "radio-group", "checkbox-group"],
  },
  {
    title: "Interactief",
    types: ["button", "grid"],
  },
  {
    title: "Lijsten",
    types: ["checklist", "checkbox-list"],
  },
  {
    title: "Overig",
    types: ["divider"],
  },
];

const labelMap: Record<ComponentType, string> = {
  title: "Titel",
  subheading: "Subkop",
  paragraph: "Paragraaf",
  quote: "Quote",
  image: "Afbeelding",
  video: "Video",
  uploadzone: "Upload Foto",
  file: "Bestand",
  "text-input": "Tekstveld",
  textarea: "Tekstvak",
  dropdown: "Dropdown",
  "radio-group": "Radioknoppen",
  "checkbox-group": "Checkboxen",
  button: "Knop",
  grid: "Grid",
  checklist: "Checklist",
  "checkbox-list": "Checkbox-lijst",
  divider: "Scheiding",
};

export default function ComponentPalette({ onAdd }: Props) {
  return (
    <aside className="w-60 border-r p-4 overflow-auto">
      <h3 className="font-semibold mb-3">Componenten</h3>

      {groups.map(({ title, types }) => (
        <div key={title} className="mb-4">
          <h4 className="text-sm font-medium mb-2">{title}</h4>
          <div className="flex flex-col gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => onAdd(type)}
                className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
              >
                <span>+ {labelMap[type]}</span>
                {type === "uploadzone" && <CloudUpload size={16} />}
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
