// File: client/src/components/SettingsPanel.tsx
import type { ComponentItem } from "../types/types";
import TitleSettings from "./settings/TitleSettings";
import SubheadingSettings from "./settings/SubheadingSettings";
import ParagraphSettings from "./settings/ParagraphSettings";
import QuoteSettings from "./settings/QuoteSettings";
import ButtonSettings from "./settings/ButtonSettings";
import ChecklistSettings from "./settings/ChecklistSettings";
import CheckboxListSettings from "./settings/CheckboxListSettings";
import DividerSettings from "./settings/DividerSettings";
import ImageSettings from "./settings/ImageSettings";
import VideoSettings from "./settings/VideoSettings";
import FileSettings from "./settings/FileSettings";
import GridSettings from "./settings/GridSettings";
import type { FC } from "react";
import UploadZoneSettings from "./settings/UploadZoneSettings";

interface Props {
  comp: ComponentItem | null;
  onUpdate: (c: ComponentItem) => void;
}

const SettingsPanel: FC<Props> = ({ comp, onUpdate }) => {
  if (!comp) {
    return (
      <aside className="w-72 border-l p-4 flex items-center justify-center text-gray-500">
        Klik op een component
      </aside>
    );
  }

  return (
    <aside className="w-72 border-l p-4 overflow-auto">
      {(() => {
        switch (comp.type) {
          case "title":
            return <TitleSettings comp={comp} onUpdate={onUpdate} />;
          case "subheading":
            return <SubheadingSettings comp={comp} onUpdate={onUpdate} />;
          case "paragraph":
            return <ParagraphSettings comp={comp} onUpdate={onUpdate} />;
          case "quote":
            return <QuoteSettings comp={comp} onUpdate={onUpdate} />;
          case "button":
            return <ButtonSettings comp={comp} onUpdate={onUpdate} />;
          case "checklist":
            return <ChecklistSettings comp={comp} onUpdate={onUpdate} />;
          case "checkbox-list":
            return <CheckboxListSettings comp={comp} onUpdate={onUpdate} />;
          case "divider":
            return <DividerSettings comp={comp} onUpdate={onUpdate} />;
          case "image":
            return <ImageSettings comp={comp} onUpdate={onUpdate} />;
          case "video":
            return <VideoSettings comp={comp} onUpdate={onUpdate} />;
          case "file":
            return <FileSettings comp={comp} onUpdate={onUpdate} />;
          case "grid":
            return <GridSettings comp={comp} onUpdate={onUpdate} />;
          case "uploadzone":
            return <UploadZoneSettings comp={comp} onUpdate={onUpdate} />;
          default:
            return (
              <div className="text-red-500">
                Geen instellingen voor {comp.type}
              </div>
            );
        }
      })()}
    </aside>
  );
};

export default SettingsPanel;
