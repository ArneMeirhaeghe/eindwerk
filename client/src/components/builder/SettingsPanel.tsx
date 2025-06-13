// File: src/components/builder/SettingsPanel.tsx
import type { FC } from "react";
import type { ComponentItem } from "../../types/types";

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
import UploadZoneSettings from "./settings/UploadZoneSettings";
import TextInputSettings from "./settings/TextInputSettings";
import TextareaSettings from "./settings/TextareaSettings";
import DropdownSettings from "./settings/DropdownSettings";
import RadioGroupSettings from "./settings/RadioGroupSettings";
import CheckboxGroupSettings from "./settings/CheckboxGroupSettings";
import FormSettings from "./settings/FormSettings";
import InventorySettings from "./settings/InventorySettings";

interface Props {
  comp: ComponentItem | null;
  onUpdate: (c: ComponentItem) => void;
}

const SettingsPanel: FC<Props> = ({ comp, onUpdate }) => {
  return (
    <aside className="w-72 border-l border-gray-300 bg-white overflow-y-auto max-h-[600px] p-4">
      {!comp ? (
        <div className="flex items-center justify-center text-gray-400 h-full text-sm italic">
          Klik op een component om instellingen te tonen
        </div>
      ) : (
        <>
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
                return (
                  <CheckboxListSettings comp={comp} onUpdate={onUpdate} />
                );
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
              case "text-input":
                return <TextInputSettings comp={comp} onUpdate={onUpdate} />;
              case "textarea":
                return <TextareaSettings comp={comp} onUpdate={onUpdate} />;
              case "dropdown":
                return <DropdownSettings comp={comp} onUpdate={onUpdate} />;
              case "radio-group":
                return <RadioGroupSettings comp={comp} onUpdate={onUpdate} />;
              case "checkbox-group":
                return (
                  <CheckboxGroupSettings comp={comp} onUpdate={onUpdate} />
                );
              case "form":
                return <FormSettings comp={comp} onUpdate={onUpdate} />;
              case "inventory":
                return (
                  <InventorySettings comp={comp} onUpdate={onUpdate} />
                );
              default:
                return (
                  <div className="text-red-500 text-sm">
                    Geen instellingen beschikbaar voor type: {comp.type}
                  </div>
                );
            }
          })()}
        </>
      )}
    </aside>
  );
};

export default SettingsPanel;
