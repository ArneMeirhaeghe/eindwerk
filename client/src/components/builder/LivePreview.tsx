// File: src/components/LivePreview.tsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
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
import UploadZonePreview from "./previews/UploadZonePreview";
import { TextInputPreview } from "./previews/TextInputPreview";
import { TextareaPreview } from "./previews/TextareaPreview";
import DropdownPreview from "./previews/DropdownPreview";
import { RadioGroupPreview } from "./previews/RadioGroupPreview";
import { CheckboxGroupPreview } from "./previews/CheckboxGroupPreview";
import type { Fase, FaseSections, Section, ComponentItem } from "../../types/types";

interface Props {
  fases: Fase[];
  sectionsByFase: FaseSections;
}

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
  uploadzone: UploadZonePreview,
  "text-input": TextInputPreview,
  textarea: TextareaPreview,
  dropdown: DropdownPreview,
  "radio-group": RadioGroupPreview,
  "checkbox-group": CheckboxGroupPreview,
};

export default function LivePreview({ fases, sectionsByFase }: Props) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);

  const currentPhase = fases[phaseIndex];
  const sections = sectionsByFase[currentPhase] || [];
  const currentSection = sections[sectionIndex];

  const next = () => {
    if (sectionIndex < sections.length - 1) setSectionIndex(sectionIndex + 1);
    else if (phaseIndex < fases.length - 1) {
      setPhaseIndex(phaseIndex + 1);
      setSectionIndex(0);
    }
  };

  const prev = () => {
    if (sectionIndex > 0) setSectionIndex(sectionIndex - 1);
    else if (phaseIndex > 0) {
      const prevPhase = phaseIndex - 1;
      setPhaseIndex(prevPhase);
      setSectionIndex(sectionsByFase[fases[prevPhase]].length - 1);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phaseIndex, sectionIndex]);

  const handlers = useSwipeable({ onSwipedLeft: next, onSwipedRight: prev, trackMouse: true });

  const renderComponents = (items: ComponentItem[]) =>
    items.map((comp, idx) => {
      const Preview = previewMap[comp.type];
      return Preview ? (
        <React.Fragment key={comp.id}>
          <Preview p={comp.props} />
          {idx < items.length - 1 && <div className="my-4 border-t border-gray-200" />}
        </React.Fragment>
      ) : null;
    });

  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      {/* Phone container */}
      <div className="relative w-[360px] h-[720px] bg-black rounded-[48px] shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[160px] h-[30px] bg-black rounded-b-[16px] z-20" />

        {/* Screen */}
        <div className="absolute inset-4 bg-white rounded-[36px] overflow-hidden flex flex-col" {...handlers}>
          {/* Header */}
          <div className="flex flex-col items-center justify-center py-4 bg-white shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">{currentPhase}</h1>
            {currentSection && <h2 className="mt-1 text-lg text-gray-700">{currentSection.title}</h2>}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {currentSection ? renderComponents(currentSection.components) : (
              <p className="text-gray-500 italic text-center mt-8">Geen content</p>
            )}
          </div>

          {/* Footer dots */}
          <div className="flex justify-center items-center py-3 bg-white">
            {sections.map((_, idx) => (
              <span
                key={idx}
                className={`mx-1 block rounded-full transition-all ${
                  idx === sectionIndex
                    ? "w-3 h-3 bg-blue-600"
                    : "w-2 h-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prev}
          disabled={phaseIndex === 0 && sectionIndex === 0}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow disabled:opacity-50"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          disabled={phaseIndex === fases.length - 1 && sectionIndex === sections.length - 1}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow disabled:opacity-50"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
