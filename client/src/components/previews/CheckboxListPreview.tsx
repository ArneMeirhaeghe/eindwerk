// src/components/previews/CheckboxListPreview.tsx
import  { type FC } from "react";
import type { CheckboxListProps } from "../../types/types";

interface Props { p: CheckboxListProps; }

const CheckboxListPreview: FC<Props> = ({ p }) => (
  <div className="mb-2 flex flex-col gap-1">
    {p.items.map((it, i) => (
      <label key={i} className="flex items-center space-x-2">
        <input type="checkbox" defaultChecked={it.good} />
        <span>{it.label}</span>
      </label>
    ))}
  </div>
);

export default CheckboxListPreview;
