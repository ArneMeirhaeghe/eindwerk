// File: src/components/BottomNav.tsx

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2 } from "lucide-react";
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
  onRenameSection: (index: number, newTitle: string) => void;
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
  onRenameSection,
  onDeleteSection,
}: Props) {
  const faseRef = useRef<HTMLDivElement>(null);
  const sectieRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (
    ref: React.RefObject<HTMLDivElement | null>,
    dir: "left" | "right"
  ) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -150 : 150, behavior: "smooth" });
  };

  const sections = sectionsByFase[activeFase] || [];
  const displaySections =
    sections.length > 0
      ? sections
      : [{ id: "", title: "Nieuwe sectie", components: [] }];

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white shadow-t z-20">
      {/* Fase-keuzebalk */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
        <div
          className="flex items-center space-x-2 overflow-x-auto scrollbar-hide"
          ref={faseRef}
        >
          {fases.map((f) => (
            <button
              key={f}
              onClick={() => onFaseChange(f)}
              className={`flex-shrink-0 px-4 py-2 font-medium rounded-t-lg border-b-2 transition ${
                f === activeFase
                  ? "border-blue-500 text-blue-600 bg-gray-50"
                  : "border-transparent text-gray-700 hover:bg-gray-100"
              }`}
              title={f}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={onAddSection}
          className="flex items-center space-x-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
          title="Nieuwe sectie toevoegen"
        >
          <Plus size={16} /> <span>Sectie</span>
        </button>
      </div>

      {/* Sectie-keuzebalk */}
      <div className="flex items-center px-4 py-2 bg-white">
        <button
          onClick={() => scrollContainer(sectieRef, "left")}
          className="p-1 text-gray-500 hover:text-gray-700"
          aria-label="Scroll secties naar links"
        >
          <ChevronLeft />
        </button>

        <div
          className="flex items-center space-x-2 overflow-x-auto scrollbar-hide mx-2"
          ref={sectieRef}
        >
          {displaySections.map((section, idx) => {
            const isActive = idx === activeSectionIndex;
            const label = section.title.trim()
              ? section.title
              : `Sectie ${idx + 1}`;
            const isOnlySection = sections.length === 1;
            return (
              <div
                key={idx}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                title={label}
              >
                <button
                  onClick={() => onSectionChange(idx)}
                  className="flex-1 text-left truncate"
                  disabled={sections.length === 0}
                >
                  {idx + 1}. {label}
                </button>
                <button
                  onClick={() => onEditSection(idx)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Naam bewerken"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => {
                    if (!isOnlySection && confirm(`Verwijder sectie "${label}"?`)) {
                      onDeleteSection(idx);
                    }
                  }}
                  disabled={isOnlySection}
                  className={`p-1 ${
                    isOnlySection
                      ? "cursor-not-allowed opacity-50"
                      : "text-red-500 hover:text-red-700"
                  }`}
                  title={isOnlySection ? "Kan niet verwijderen" : "Sectie verwijderen"}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => scrollContainer(sectieRef, "right")}
          className="p-1 text-gray-500 hover:text-gray-700"
          aria-label="Scroll secties naar rechts"
        >
          <ChevronRight />
        </button>
      </div>
    </footer>
  );
}
