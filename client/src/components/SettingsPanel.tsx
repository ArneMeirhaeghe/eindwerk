// src/components/SettingsPanel.tsx
import React, { type FC } from "react";
import type { ComponentItem } from "../types/types";
import TextSettings from "./settings/TextSettings";
import MediaSettings from "./settings/MediaSettings";
import ChecklistSettings from "./settings/ChecklistSettings";
import CheckboxListSettings from "./settings/CheckboxListSettings";
import DividerSettings from "./settings/DividerSettings";
import ButtonSettings from "./settings/ButtonSettings";

interface Props {
  comp: ComponentItem | null;
  onUpdate: (c: ComponentItem) => void;
}

const SettingsPanel: FC<Props> = ({ comp, onUpdate }) => {
  if (!comp) return <div className="p-4 text-gray-500">Selecteer een component</div>;

  return (
    <aside className="w-72 border-l p-4 overflow-auto">
      <h3 className="font-semibold mb-4">Instellingen: {comp.type}</h3>
      {["title", "subheading", "paragraph", "quote"].includes(comp.type) && (
        <TextSettings comp={comp} onUpdate={onUpdate} />
      )}
      {["image", "video"].includes(comp.type) && (
        <MediaSettings comp={comp} onUpdate={onUpdate} />
      )}
      {comp.type === "checklist" && <ChecklistSettings comp={comp} onUpdate={onUpdate} />}
    
      {comp.type === "divider" && <DividerSettings comp={comp} onUpdate={onUpdate} />}
   {comp.type === "checkbox-list" && (
         <CheckboxListSettings comp={comp} onUpdate={onUpdate} />
       )}
      {comp.type === "button" && (
        <ButtonSettings comp={comp} onUpdate={onUpdate} />
      )}
    </aside>
  );
};

export default SettingsPanel;
