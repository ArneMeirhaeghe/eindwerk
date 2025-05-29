// src/components/previews/ButtonPreview.tsx
import  { type FC } from "react";
import type { ButtonProps } from "../../types/types";

interface Props { p: ButtonProps; }

const ButtonPreview: FC<Props> = ({ p }) => (
  <button
    className="mb-2 px-4 py-2 rounded cursor-pointer"
    style={{
      fontSize: p.fontSize,
      color: p.color,
      background: p.bg,
      borderRadius: p.radius,
      fontWeight: p.bold ? "bold" : "normal",
      fontStyle: p.italic ? "italic" : "normal",
      textDecoration: p.underline ? "underline" : "none",
    }}
    onClick={() => {
      if (p.functionType === "link" && p.url) window.open(p.url, "_blank");
    }}
  >
    {p.label}
  </button>
);

export default ButtonPreview;
