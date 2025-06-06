// File: client/src/components/LivePreview.tsx
import React from "react";
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
import UploadZonePreview from "./previews/UploadZonePreview";

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
};

export default function LivePreview({ fases, sectionsByFase }: Props) {
  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-4 space-y-8">
      {fases.map((fase) => (
        <div key={fase}>
          {/* Fase-titel */}
          <h2 className="text-2xl font-bold capitalize mb-4">{fase}</h2>
          {/* Secties binnen deze fase */}
          {sectionsByFase[fase]?.map((sec) => (
            <div key={sec.id} className="mb-6">
              {/* Sectietitel */}
              <h3 className="text-xl font-semibold mb-2">{sec.title}</h3>
              <div className="space-y-4">
                {/* Components binnen sectie */}
                {sec.components.map((comp) => {
                  const Preview = previewMap[comp.type];
                  return Preview ? <Preview key={comp.id} p={comp.props} /> : null;
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
