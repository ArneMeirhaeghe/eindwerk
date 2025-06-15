// File: src/components/formbuilder/SettingsPanel.tsx

import type { FieldDto } from "../../api/forms/types"
import TextInputSettings from "./settings/TextInputSettings"
import TextareaSettings from "./settings/TextareaSettings"
import DropdownSettings from "./settings/DropdownSettings"
import RadioGroupSettings from "./settings/RadioGroupSettings"
import CheckboxSettings from "./settings/CheckboxSettings"

export default function SettingsPanel({
  comp,
  onUpdate
}: {
  comp: FieldDto | null
  onUpdate(updated: FieldDto): void
}) {
  return (
    <aside className="w-full lg:w-72 border-l border-gray-300 bg-white overflow-y-auto max-h-[600px] p-4">
      {!comp ? (
        <div className="flex items-center justify-center text-gray-400 h-full text-sm italic">
          Klik op een veld om instellingen te bewerken
        </div>
      ) : (
        <>
          {(() => {
            switch (comp.type) {
              case "text-input":
                return <TextInputSettings comp={comp} onUpdate={onUpdate} />
              case "textarea":
                return <TextareaSettings comp={comp} onUpdate={onUpdate} />
              case "dropdown":
                return <DropdownSettings comp={comp} onUpdate={onUpdate} />
              case "radio-group":
                return <RadioGroupSettings comp={comp} onUpdate={onUpdate} />
              case "checkbox-group":
                return <CheckboxSettings comp={comp} onUpdate={onUpdate} />
              default:
                return (
                  <div className="p-4 text-red-500 text-sm">
                    Geen instellingen beschikbaar voor type: {comp.type}
                  </div>
                )
            }
          })()}
        </>
      )}
    </aside>
  )
}
