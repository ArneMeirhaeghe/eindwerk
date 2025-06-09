// File: src/components/builder/previews/DropdownPreview.tsx
import type { FC } from "react";
import type { DropdownProps } from "../../../types/types";

export const DropdownPreview: FC<{ p: DropdownProps }> = ({ p }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium">{p.label}{p.required && "*"}</label>
    <select disabled className="border rounded px-2 py-1 w-full" value={p.defaultValue as string || ""}>
      <option value="" disabled>{p.placeholder || "Selecteer..."}</option>
      {p.options.map((opt) => <option key={opt}>{opt}</option>)}
    </select>
  </div>
);