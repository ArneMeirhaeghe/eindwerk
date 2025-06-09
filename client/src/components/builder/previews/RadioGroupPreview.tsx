// File: src/components/builder/previews/RadioGroupPreview.tsx
import type { FC } from "react";
import type { RadioGroupProps } from "../../../types/types";

export const RadioGroupPreview: FC<{ p: RadioGroupProps }> = ({ p }) => (
  <fieldset className="flex flex-col">
    <legend className="mb-1 font-medium">{p.label}{p.required && "*"}</legend>
    {p.options.map((opt) => (
      <label key={opt} className="inline-flex items-center space-x-2">
        <input type="radio" disabled name={p.label} value={opt} checked={p.defaultValue === opt}/>
        <span>{opt}</span>
      </label>
    ))}
  </fieldset>
);