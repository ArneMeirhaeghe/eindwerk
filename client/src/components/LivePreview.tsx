// File: src/components/LivePreview.tsx
import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ComponentItem, FaseSections, Fase } from "../types/types";
import TitlePreview from "./previews/TitlePreview";
import SubheadingPreview from "./previews/SubheadingPreview";
import ParagraphPreview from "./previews/ParagraphPreview";
import QuotePreview from "./previews/QuotePreview";
import ButtonPreview from "./previews/ButtonPreview";
import ChecklistPreview from "./previews/ChecklistPreview";
import CheckboxListPreview from "./previews/CheckboxListPreview";
import DividerPreview from "./previews/DividerPreview";
import ImagePreview from "./previews/ImagePreview";
import VideoPreview from "./previews/VideoPreview";
import FilePreview from "./previews/FilePreview";
import GridPreview from "./previews/GridPreview";

const previewMap: Record<string, React.FC<{ p: any }>> = {
  title: TitlePreview,
  subheading: SubheadingPreview,
  paragraph: ParagraphPreview,
  quote: QuotePreview,
  button: ButtonPreview,
  checklist: ChecklistPreview,
  "checkbox-list": CheckboxListPreview,
  divider: DividerPreview,
  image: ImagePreview,
  video: VideoPreview,
  file: FilePreview,
  grid: GridPreview,
};

interface FlatSection {
  fase: Fase;
  sectionIndex: number;
  section: { id: string; title: string; components: ComponentItem[] };
}

interface Props {
  fases: Fase[];
  sectionsByFase: FaseSections;
}

export default function LivePreview({ fases, sectionsByFase }: Props) {
  // Maak een platte lijst van alle sections over alle fases
  const flatList = useMemo<FlatSection[]>(() => {
    const arr: FlatSection[] = [];
    fases.forEach((f) => {
      const secs = sectionsByFase[f] || [];
      secs.forEach((s, idx) => {
        arr.push({ fase: f, sectionIndex: idx, section: s });
      });
    });
    return arr;
  }, [fases, sectionsByFase]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const total = flatList.length;
  const current = flatList[currentIndex];

  return (
    <div
      className="relative mx-auto"
      style={{
        width: 420,
        height: 880,
        backgroundImage: "url('/phonemockup.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute bg-white rounded-xl shadow-inner"
        style={{
          top: 110,       // Begin van het “scherm” in de mockup
          bottom: 110,    // Einde van het “scherm” in de mockup
          left: 40,       // Offset vanaf linkerzijde mockup naar scherm
          right: 40,      // Offset vanaf rechterzijde mockup naar scherm
        }}
      >
        {total === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500 text-lg">Geen secties beschikbaar</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* HEADER: Fase */}
            <header className="flex justify-center items-center py-3 px-4 bg-gradient-to-r from-blue-600 to-teal-400 rounded-t-xl">
              <h2 className="text-xl font-bold text-white capitalize">
                {current.fase}
              </h2>
            </header>

            {/* SUBHEADER: Sectienaam */}
            <div className="flex justify-center items-center py-2 px-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                {current.section.title}
              </h3>
            </div>

            {/* CONTENT: Componenten */}
            <div className="flex-1 overflow-auto px-4 py-2">
              {current.section.components.map((comp) => {
                const Preview = previewMap[comp.type];
                return (
                  <div key={comp.id} className="mb-6 last:mb-0">
                    {Preview && <Preview p={comp.props} />}
                  </div>
                );
              })}
            </div>

            {/* FOOTER: Navigatie */}
            <nav className="flex justify-between items-center px-6 py-3 bg-gray-100 rounded-b-xl border-t border-gray-200">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                disabled={currentIndex === 0}
                className={`p-2 rounded-full transition ${
                  currentIndex === 0
                    ? "cursor-not-allowed opacity-50"
                    : "bg-white hover:bg-gray-200"
                }`}
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>

              <span className="text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded-full">
                {currentIndex + 1} / {total}
              </span>

              <button
                onClick={() => setCurrentIndex((i) => Math.min(i + 1, total - 1))}
                disabled={currentIndex === total - 1}
                className={`p-2 rounded-full transition ${
                  currentIndex === total - 1
                    ? "cursor-not-allowed opacity-50"
                    : "bg-white hover:bg-gray-200"
                }`}
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
