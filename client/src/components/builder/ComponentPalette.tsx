// File: src/components/builder/ComponentPalette.tsx
import React from "react";
import {
  Type, AlignLeft, Subtitles, FileText, Video, Image, File, RectangleHorizontal, ListChecks,
  CheckSquare, Minus, LayoutGrid, CloudUpload, Edit, ChevronDown, Circle, CheckCircle
} from "lucide-react";
import type { ComponentType } from "../../types/types";

// interface Props {
//   onAdd: (type: ComponentType) => void;
// }

const labelMap: Record<ComponentType, string> = {
  title: "Koptekst",
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
    form: "Formulier"                                       // ← added

};

const iconMap: Record<ComponentType, React.FC<any>> = {
  title: Type,
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
    form: FileText                                          // ← added

};

const groups: { title: string; types: ComponentType[] }[] = [
  { title: "Tekst", types: ["title", "subheading", "paragraph", "quote"] },
  { title: "Media", types: ["image", "video", "file"] },
  {
    title: "Interactie",
    types: ["button", "checklist", "checkbox-list", "dropdown", "radio-group", "checkbox-group"],
  },
  { title: "Structuur", types: ["divider", "grid", "uploadzone", "text-input", "textarea"] },
  { title: "Formulieren", types: ["form"] }               // ← added group

];

export default function ComponentPalette({ onAdd }: { onAdd(type: ComponentType): void }) {
  return (
    <aside className="w-64 p-4 bg-white rounded shadow">
      {groups.map(g => (
        <section key={g.title} className="mb-4">
          <h3 className="text-sm font-semibold mb-2">{g.title}</h3>
          <div className="space-y-2">
            {g.types.map(type => {
              const Icon = iconMap[type]
              return (
                <button
                  key={type}
                  onClick={() => onAdd(type)}
                  className="flex items-center px-3 py-2 bg-gray-50 rounded hover:bg-gray-100"
                >
                  <Icon size={16} className="mr-2" />
                  {labelMap[type]}
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </aside>
  )
}