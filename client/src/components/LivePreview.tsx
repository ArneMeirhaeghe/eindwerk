// /src/components/LivePreview.tsx
import React from "react";
import type { ComponentItem } from "../types/types";
import TitlePreview from "./previews/TitlePreview";
import ParagraphPreview from "./previews/ParagraphPreview";
import QuotePreview from "./previews/QuotePreview";
import ButtonPreview from "./previews/ButtonPreview";
import ChecklistPreview from "./previews/ChecklistPreview";
import CheckboxListPreview from "./previews/CheckboxListPreview";
import DividerPreview from "./previews/DividerPreview";
import ImagePreview from "./previews/ImagePreview";
import VideoPreview from "./previews/VideoPreview";
import FilePreview from "./previews/FilePreview"; // toegevoegd
import GridPreview from "./previews/GridPreview";
import SubheadingPreview from "./previews/SubheadingPreview";

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
  file: FilePreview,    // toegevoegd
  grid: GridPreview,
};

interface Props {
  components: ComponentItem[];
}

export default function LivePreview({ components }: Props) {
  return (
    <div
      className="relative mx-auto bg-white shadow-lg rounded"
      style={{
        width: 420,
        height: 880,
        backgroundImage: "url('/phonemockup.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute overflow-auto"
        style={{ top: 120, bottom: 120, left: 40, right: 40 }}
      >
        {components.map((comp) => {
          const Preview = previewMap[comp.type];
          return (
            <div key={comp.id} className="mb-4">
              {Preview && <Preview p={comp.props} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
