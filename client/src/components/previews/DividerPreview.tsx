// src/components/previews/DividerPreview.tsx
import  { type FC } from "react";
import type { DividerProps } from "../../types/types";

interface Props { p: DividerProps; }

const DividerPreview: FC<Props> = ({ p }) => (
  <hr
    className="mb-2"
    style={{
      borderColor: p.color,
      borderWidth: p.thickness,
    }}
  />
);

export default DividerPreview;
