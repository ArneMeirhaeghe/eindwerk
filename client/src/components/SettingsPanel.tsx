// src/components/SettingsPanel.tsx
import React, { type FC } from "react";
import type { ComponentItem } from "../types/types";
import ButtonSettings from "./settings/ButtonSettings";
import ChecklistSettings from "./settings/ChecklistSettings";
import DividerSettings from "./settings/DividerSettings";
import CheckboxListSettings from "./settings/CheckboxListSettings";
import TextSettings from "./settings/TextSettings";
import ImageSettings from "./settings/ImageSettings";
import VideoSettings from "./settings/VideoSettings";
import GridSettings from "./settings/GridSettings";

interface Props {
  comp: ComponentItem | null;
  onUpdate: (c: ComponentItem) => void;
}

const SettingsPanel: FC<Props> = ({ comp, onUpdate }) => {
  return (
    <aside className="w-72 border-l p-4 overflow-auto">
      {!comp ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          Klik op een component
        </div>
      ) : (
        <>
          {(() => {
            switch (comp.type) {
              case "title":
              case "subheading":
              case "paragraph":
              case "quote":
                return <TextSettings comp={comp} onUpdate={onUpdate} />;
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
              case "grid":
                return <GridSettings comp={comp} onUpdate={onUpdate} />;
              default:
                return (
                  <div className="text-red-500">
                    Geen instellingen voor {comp.type}
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
