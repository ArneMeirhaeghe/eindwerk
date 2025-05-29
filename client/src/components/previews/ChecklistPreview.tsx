// src/components/previews/ChecklistPreview.tsx
import  { type FC } from "react";
import type { ChecklistProps } from "../../types/types";

interface Props { p: ChecklistProps; }

const ChecklistPreview: FC<Props> = ({ p }) => (
  <ul className="mb-2 list-disc pl-5" style={{ gap: p.spacing }}>
    {p.items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

export default ChecklistPreview;
