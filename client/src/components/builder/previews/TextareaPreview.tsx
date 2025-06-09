// File: src/components/builder/previews/TextareaPreview.tsx
import type { FC } from "react";
import type { TextareaProps } from "../../../types/types";

export const TextareaPreview: FC<{ p: TextareaProps }> = ({ p }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium">{p.label}{p.required && "*"}</label>
    <textarea
      rows={p.rows || 3}
      placeholder={p.placeholder}
      className="border rounded px-2 py-1 w-full"
      disabled
      value={p.defaultValue as string || ""}
    />
  </div>
);