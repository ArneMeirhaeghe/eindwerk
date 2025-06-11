// File: src/components/formbuilder/SettingsPanel.tsx
import type { FieldDto } from "../../api/forms/types";
import TextInputSettings from "./settings/TextInputSettings";
import TextareaSettings from "./settings/TextareaSettings";
import DropdownSettings from "./settings/DropdownSettings";
import RadioGroupSettings from "./settings/RadioGroupSettings";
import CheckboxSettings from "./settings/CheckboxSettings";


interface Props {
  comp: FieldDto | null;
  onUpdate: (c: FieldDto) => void;
}

export default function SettingsPanel({ comp, onUpdate }: Props) {
  if (!comp) {
    return (
      <aside className="w-72 border-l p-4 flex items-center justify-center text-gray-500">
        Klik op een veld
      </aside>
    );
  }

  return (
    <aside className="w-72 border-l p-4 overflow-auto">
      {(() => {
        switch (comp.type) {
          case "text-input":
            return <TextInputSettings comp={comp} onUpdate={onUpdate} />;
          case "textarea":
            return <TextareaSettings comp={comp} onUpdate={onUpdate} />;
          case "dropdown":
            return <DropdownSettings comp={comp} onUpdate={onUpdate} />;
          case "radio-group":
            return <RadioGroupSettings comp={comp} onUpdate={onUpdate} />;
          case "checkbox-group":
            return <CheckboxSettings comp={comp} onUpdate={onUpdate} />;
          default:
            return <div className="text-red-500">Geen instellingen voor {comp.type}</div>;
        }
      })()}
    </aside>
  );
}
