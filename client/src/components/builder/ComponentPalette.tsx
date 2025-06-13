// File: src/components/builder/ComponentPalette.tsx
import React, { useState } from "react"
import {
  Type, AlignLeft, Subtitles, FileText, Video, Image, File,
  RectangleHorizontal, ListChecks, CheckSquare, Minus, LayoutGrid,
  CloudUpload, Edit, ChevronDown, Circle, CheckCircle, Plus, MinusCircle, Menu
} from "lucide-react"
import type { ComponentType } from "../../types/types"

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
  form: "Formulier",
  inventory: "Inventaris"
}

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
  form: FileText,
  inventory: LayoutGrid
}

const groups: { title: string; types: ComponentType[] }[] = [
  { title: "Tekst", types: ["title", "subheading", "paragraph", "quote"] },
  { title: "Media", types: ["image", "video", "file", "grid"] },
  {
    title: "Interactie",
    types: [
      "button", "checklist", "checkbox-list",
      "dropdown", "radio-group", "checkbox-group",
      "text-input", "textarea", "uploadzone"
    ]
  },
  { title: "Structuur", types: ["divider"] },
  { title: "Formulieren", types: ["form"] },
  { title: "Inventaris", types: ["inventory"] }
]

export default function ComponentPalette({ onAdd }: { onAdd(type: ComponentType): void }) {
  const [search, setSearch] = useState("")
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map(g => [g.title, true]))
  )
  const [open, setOpen] = useState(false)

  const toggleGroup = (title: string) =>
    setCollapsed(prev => ({ ...prev, [title]: !prev[title] }))

  const matchesSearch = (label: string) =>
    label.toLowerCase().includes(search.toLowerCase())

  const renderGroupList = () => (
    <div className="space-y-4">
      {/* Zoekveld */}
      <div>
        <input
          type="text"
          placeholder="Zoek component..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm"
        />
      </div>

      {/* Componentgroepen */}
      {groups.map(group => {
        const visibleTypes = group.types.filter(type =>
          matchesSearch(labelMap[type])
        )
        const isCollapsed = collapsed[group.title]

        return (
          <section key={group.title}>
            <button
              onClick={() => toggleGroup(group.title)}
              className="flex items-center justify-between w-full text-left mb-1"
            >
              <h3 className="text-sm font-semibold">{group.title}</h3>
              {isCollapsed ? <Plus size={16} /> : <MinusCircle size={16} />}
            </button>

            {!isCollapsed && (
              <div className="space-y-2">
                {visibleTypes.map(type => {
                  const Icon = iconMap[type]
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        onAdd(type)
                        setOpen(false)
                      }}
                      className="flex items-center px-3 py-2 w-full bg-gray-50 rounded hover:bg-gray-100 text-sm"
                      aria-label={`Voeg ${labelMap[type]} toe`}
                    >
                      <Icon size={16} className="mr-2" />
                      {labelMap[type]}
                    </button>
                  )
                })}
                {visibleTypes.length === 0 && (
                  <p className="text-xs text-gray-400 italic px-1">
                    Geen resultaten
                  </p>
                )}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )

  return (
    <>
      {/* Desktop versie */}
      <aside className="hidden md:block w-64 max-h-[90vh] overflow-y-auto p-4 bg-white rounded shadow border border-gray-200 mb-12">
        {renderGroupList()}
      </aside>

      {/* Mobile hamburger menu knop */}
      <div className="fixed left-4 bottom-20 md:hidden z-50">
        <button
          onClick={() => setOpen(true)}
          className="p-3 rounded-full bg-blue-600 text-white shadow-lg"
          aria-label="Open componenten"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end">
          <div className="w-full max-h-[90vh] bg-white rounded-t-2xl p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold">Componenten</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sluiten
              </button>
            </div>
            {renderGroupList()}
          </div>
        </div>
      )}
    </>
  )
}
