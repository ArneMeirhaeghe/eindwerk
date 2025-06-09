// File: src/components/builder/ComponentPalette.tsx
import React from "react";
import { CloudUpload } from "lucide-react";
import type { ComponentType } from "../../types/types";

interface Props {
  onAdd: (type: ComponentType) => void;
}

// Labels voor de knopjes
const labelMap: Record<ComponentType, string> = {
  title: "Koptekst",
  text: "Tekst",
  subheading: "Subkop",
  paragraph: "Paragraaf",
  quote: "Citaat",
  image: "Afbeelding",
  video: "Video",
  file: "Bestand",
  button: "Knop",
  checklist: "Checklist",
  divider: "Scheiding",
  "checkbox-list": "Checkbox-lijst",
  grid: "Grid",
  uploadzone: "Upload-zone",
  "text-input": "Tekst-invoer",
  textarea: "Tekstvlak",
  dropdown: "Dropdown",
  "radio-group": "Radiogroep",
  "checkbox-group": "Checkbox-groep",
};

const groups: { title: string; types: ComponentType[] }[] = [
  { title: "Tekst", types: ["title", "subheading", "paragraph", "quote"] },
  { title: "Media", types: ["image", "video", "file"] },
  { title: "Interactie", types: ["button", "checklist", "checkbox-list", "dropdown", "radio-group", "checkbox-group"] },
  { title: "Structuur", types: ["divider", "grid", "uploadzone", "text-input", "textarea"] },
];

export default function ComponentPalette({ onAdd }: Props) {
  return (
    <aside className="w-64 border-r p-4 overflow-auto">
      {groups.map((group) => (
        <section key={group.title} className="mb-6">
          <h3 className="font-semibold mb-2">{group.title}</h3>
          <div className="space-y-2">
            {group.types.map((type) => (
              <button
                key={type}
                onClick={() => onAdd(type)}
                className="flex justify-between items-center w-full px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
              >
                <span>+ {labelMap[type]}</span>
                {type === "uploadzone" && <CloudUpload size={16} />}
              </button>
            ))}
          </div>
        </section>
      ))}
    </aside>
  );
}
