// File: src/components/builder/BottomNav.tsx
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
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm z-50">
      <div className="max-w-screen-md mx-auto px-2 md:px-4 py-2 md:py-3 space-y-2 md:space-y-3">
        {/* Fasen */}
        <nav className="flex justify-center space-x-1 md:space-x-2 overflow-x-auto scrollbar-thin">
          {fases.map((fase) => (
            <button
              key={fase}
              onClick={() => onFaseChange(fase)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded text-xs md:text-sm font-medium whitespace-nowrap transition ${
                fase === activeFase
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {fase.charAt(0).toUpperCase() + fase.slice(1)}
            </button>
          ))}
        </nav>

        {/* Secties */}
        <nav className="flex justify-center space-x-1 md:space-x-2 overflow-x-auto scrollbar-thin items-center">
          {sections.map((sec, i) => (
            <div
              key={sec.id}
              className={`flex items-center space-x-1 px-2 md:px-3 py-1 rounded-lg transition ${
                i === activeSectionIndex
                  ? "bg-blue-100"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <button
                onClick={() => onSectionChange(i)}
                className={`truncate text-xs md:text-sm ${
                  i === activeSectionIndex
                    ? "font-semibold text-blue-800"
                    : "text-gray-800"
                }`}
              >
                {sec.title}
              </button>
              <button
                onClick={() => onEditSection(i)}
                className="p-0.5 hover:bg-gray-200 rounded"
                aria-label="Hernoem sectie"
              >
                <Edit2 size={12} />
              </button>
              {sections.length > 1 && (
                <button
                  onClick={() => onDeleteSection(i)}
                  className="p-0.5 hover:bg-red-100 rounded text-red-600"
                  aria-label="Verwijder sectie"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={onAddSection}
            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center"
            aria-label="Nieuwe sectie toevoegen"
          >
            <Plus size={16} />
          </button>
        </nav>
      </div>
    </footer>
  );
}
