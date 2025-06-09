// File: src/components/builder/previews/TextInputPreview.tsx
import type { FC } from "react";
import type { TextInputProps } from "../../../types/types";

export const TextInputPreview: FC<{ p: TextInputProps }> = ({ p }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium">{p.label}{p.required && "*"}</label>
    <input
      type="text"
      placeholder={p.placeholder}
      className="border rounded px-2 py-1 w-full"
      disabled
      value={p.defaultValue as string || ""}
    />
  </div>
);