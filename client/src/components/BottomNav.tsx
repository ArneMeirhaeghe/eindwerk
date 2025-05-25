// src/components/BottomNav.tsx

import type { Fase } from "../types/types";

interface Props {
  fases: Fase[];
  sectionsByFase: Record<Fase, any[]>;
  activeFase: Fase;
  activeSectionIndex: number;
  onFaseChange: (f: Fase) => void;
  onSectionChange: (i: number) => void;
  onAddSection: () => void;
}

export default function BottomNav({
  fases, sectionsByFase, activeFase, activeSectionIndex,
  onFaseChange, onSectionChange, onAddSection
}: Props) {
  return (
    <footer className="fixed bottom-0 left-0 w-full border-t bg-white p-4 flex items-center space-x-4 overflow-x-auto z-10">
      {fases.map(f => (
        <div key={f} className="flex items-center space-x-2">
          <button
            onClick={() => onFaseChange(f)}
            className={`px-3 py-1 rounded ${
              f === activeFase ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {f}
          </button>
          {f === activeFase && sectionsByFase[f].map((_, i) => (
            <button
              key={i}
              onClick={() => onSectionChange(i)}
              className={`px-2 py-1 rounded ${
                i === activeSectionIndex ? "bg-blue-400 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      ))}
      <button
        onClick={onAddSection}
        className="ml-auto px-3 py-1 bg-green-200 rounded"
      >
        + Sectie
      </button>
    </footer>
  );
}
