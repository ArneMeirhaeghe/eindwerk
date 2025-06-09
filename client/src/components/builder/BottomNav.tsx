// File: src/components/builder/BottomNav.tsx
import React from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import type { Fase, Section } from "../../types/types";

interface Props {
  fases: Fase[];
  sectionsByFase: Record<Fase, Section[]>;
  activeFase: Fase;
  activeSectionIndex: number;
  onFaseChange: (f: Fase) => void;
  onSectionChange: (i: number) => void;
  onAddSection: () => void;
  onEditSection: (index: number) => void;
  onDeleteSection: (index: number) => void;
}

export default function BottomNav({
  fases,
  sectionsByFase,
  activeFase,
  activeSectionIndex,
  onFaseChange,
  onSectionChange,
  onAddSection,
  onEditSection,
  onDeleteSection,
}: Props) {
  const sections = sectionsByFase[activeFase] || [];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex flex-col space-y-3">
      {/* Fasen bovenaan */}
      <nav className="flex space-x-2 overflow-x-auto">
        {fases.map((f) => (
          <button
            key={f}
            onClick={() => onFaseChange(f)}
            className={`px-4 py-2 whitespace-nowrap rounded-lg font-medium transition ${
              f === activeFase
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-current={f === activeFase ? "page" : undefined}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </nav>

      {/* Secties per fase daaronder */}
      <nav className="flex space-x-2 overflow-x-auto items-center">
        {sections.map((sec, i) => (
          <div
            key={sec.id}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition ${
              i === activeSectionIndex
                ? "bg-blue-100"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <button
              onClick={() => onSectionChange(i)}
              className={`truncate text-sm ${
                i === activeSectionIndex
                  ? "font-semibold text-blue-800"
                  : "text-gray-800"
              }`}
            >
              {sec.title}
            </button>
            <button
              onClick={() => onEditSection(i)}
              aria-label="Sectie hernoemen"
              className="p-1 rounded hover:bg-gray-200"
            >
              <Edit2 size={14} />
            </button>
            {/* Verberg delete als er slechts één sectie is */}
            {sections.length > 1 && (
              <button
                onClick={() => onDeleteSection(i)}
                aria-label="Sectie verwijderen"
                className="p-1 rounded hover:bg-red-100 text-red-600"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={onAddSection}
          aria-label="Nieuwe sectie toevoegen"
          className="flex items-center justify-center p-2 bg-green-100 hover:bg-green-200 rounded-lg text-green-700"
        >
          <Plus size={16} />
        </button>
      </nav>
    </footer>
  );
}
