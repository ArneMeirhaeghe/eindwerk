// File: src/components/builder/previews/CheckboxGroupPreview.tsx
import type { FC } from "react";
import type { CheckboxGroupProps } from "../../../types/types";

export const CheckboxGroupPreview: FC<{ p: CheckboxGroupProps }> = ({ p }) => (
  <fieldset className="flex flex-col">
    <legend className="mb-1 font-medium">{p.label}{p.required && "*"}</legend>
    {p.options.map((opt) => (
      <label key={opt} className="inline-flex items-center space-x-2">
        <input type="checkbox" disabled value={opt} checked={Array.isArray(p.defaultValue) && (p.defaultValue as string[]).includes(opt)}/>
        <span>{opt}</span>
      </label>
    ))}
  </fieldset>
);