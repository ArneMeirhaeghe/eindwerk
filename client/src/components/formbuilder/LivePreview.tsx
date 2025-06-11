// File: src/components/formbuilder/LivePreview.tsx
import React from "react";
import type { FieldDto } from "../../api/forms/types";
import TextInputPreview from "./previews/TextInputPreview";
import TextareaPreview from "./previews/TextareaPreview";
import DropdownPreview from "./previews/DropdownPreview";
import RadioGroupPreview from "./previews/RadioGroupPreview";
import CheckboxGroupPreview from "./previews/CheckboxGroupPreview";


const previewMap: Record<FieldDto["type"], React.FC<{ label: string; p: any }>> = {
  "text-input": TextInputPreview,
  textarea: TextareaPreview,
  dropdown: DropdownPreview,
  "radio-group": RadioGroupPreview,
  "checkbox-group": CheckboxGroupPreview,
};

interface Props {
  name: string;
  fields: FieldDto[];
}

export default function LivePreview({ name, fields }: Props) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="relative w-[360px] h-[720px] bg-black rounded-[48px] shadow-2xl">
        <div className="absolute inset-4 bg-white rounded-[36px] overflow-y-auto p-4 space-y-6">
          <h2 className="text-xl font-semibold">{name}</h2>
          {fields
            .sort((a, b) => a.order - b.order)
            .map((f) => {
              const Preview = previewMap[f.type];
              return (
                <div key={f.id}>
                  <Preview label={f.label} p={f.settings} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
