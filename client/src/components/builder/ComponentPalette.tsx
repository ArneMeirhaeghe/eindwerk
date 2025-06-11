// File: src/components/builder/ComponentPalette.tsx
import React from "react";
import {
  Type, AlignLeft, Subtitles, FileText, Video, Image, File, RectangleHorizontal, ListChecks,
  CheckSquare, Minus, LayoutGrid, CloudUpload, Edit, ChevronDown, Circle, CheckCircle
} from "lucide-react";
import type { ComponentType } from "../../types/types";

interface Props {
  onAdd: (type: ComponentType) => void;
}

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

const iconMap: Record<ComponentType, React.FC<any>> = {
  title: Type,
  text: AlignLeft,
  subheading: Subtitles,
  paragraph: AlignLeft,
  quote: FileText,
  image: Image,
  video: Video,
  file: File,
  button: RectangleHorizontal,
  checklist: ListChecks,
  "checkbox-list": CheckSquare,
  divider: Minus,
  grid: LayoutGrid,
  uploadzone: CloudUpload,
  "text-input": Edit,
  textarea: Edit,
  dropdown: ChevronDown,
  "radio-group": Circle,
  "checkbox-group": CheckCircle,
};

const groups: { title: string; types: ComponentType[] }[] = [
  { title: "Tekst", types: ["title", "subheading", "paragraph", "quote"] },
  { title: "Media", types: ["image", "video", "file"] },
  {
    title: "Interactie",
    types: ["button", "checklist", "checkbox-list", "dropdown", "radio-group", "checkbox-group"],
  },
  { title: "Structuur", types: ["divider", "grid", "uploadzone", "text-input", "textarea"] },
];

export default function ComponentPalette({ onAdd }: Props) {
  return (
    <aside className="w-64 p-4 bg-white shadow-md rounded-lg overflow-auto">
      {groups.map((group) => (
        <section key={group.title} className="mb-6">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">{group.title}</h3>
          <div className="flex flex-col space-y-2">
            {group.types.map((type) => {
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
        </section>
      ))}
    </aside>
  );
}
