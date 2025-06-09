// File: src/components/builder/LivePreview.tsx
import React from "react";
import type { Fase, Section } from "../../types/types";
import TitlePreview from "./previews/TitlePreview";
import SubheadingPreview from "./previews/SubheadingPreview";
import ParagraphPreview from "./previews/ParagraphPreview";
import QuotePreview from "./previews/QuotePreview";
import ImagePreview from "./previews/ImagePreview";
import VideoPreview from "./previews/VideoPreview";
import FilePreview from "./previews/FilePreview";
import DividerPreview from "./previews/DividerPreview";
import ChecklistPreview from "./previews/ChecklistPreview";
import CheckboxListPreview from "./previews/CheckboxListPreview";
import GridPreview from "./previews/GridPreview";
import UploadZonePreview from "./previews/UploadZonePreview";
import { TextInputPreview } from "./previews/TextInputPreview";
import { TextareaPreview } from "./previews/TextareaPreview";
import { RadioGroupPreview } from "./previews/RadioGroupPreview";
import { CheckboxGroupPreview } from "./previews/CheckboxGroupPreview";
import DropdownPreview from "./previews/DropdownPreview";


interface Props {
  fases: Fase[];
  sectionsByFase: Record<Fase, Section[]>;
}

const previewMap: Record<string, React.FC<{ p: any }>> = {
  title: TitlePreview,
  subheading: SubheadingPreview,
  paragraph: ParagraphPreview,
  quote: QuotePreview,
  image: ImagePreview,
  video: VideoPreview,
  file: FilePreview,
  divider: DividerPreview,
  checklist: ChecklistPreview,
  "checkbox-list": CheckboxListPreview,
  grid: GridPreview,
  uploadzone: UploadZonePreview,
  "text-input": TextInputPreview,
  textarea: TextareaPreview,
  dropdown: DropdownPreview,
  "radio-group": RadioGroupPreview,
  "checkbox-group": CheckboxGroupPreview,
};

export default function LivePreview({ fases, sectionsByFase }: Props) {
  return (
    <div className="p-4 space-y-8">
      {fases.map((f) => (
        <div key={f}>
          <h2 className="text-2xl font-bold mb-2">{f}</h2>
          <div className="space-y-4">
            {sectionsByFase[f].map((sec) => (
              <div key={sec.id} className="p-4 bg-white rounded shadow">
                {sec.components.map((c) => {
                  const Preview = previewMap[c.type];
                  return Preview ? <Preview key={c.id} p={c.props} /> : null;
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
