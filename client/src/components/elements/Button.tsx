import React from "react";
import type { ComponentItem } from "../../types/types";

interface Props {
  comp: ComponentItem;
}

const Button: React.FC<Props> = ({ comp }) => {
  const {
    label,
    fontSize,
    color,
    bg,
    radius,
    bold,
    italic,
    underline,
    functionType = "dummy",
    url = "",
  } = comp.props as {
    label: string;
    fontSize: number;
    color: string;
    bg: string;
    radius: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    functionType?: "dummy" | "link";
    url?: string;
  };

  const style: React.CSSProperties = {
    fontSize,
    color,
    backgroundColor: bg,
    borderRadius: radius,
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline ? "underline" : "none",
    padding: "0.5rem 1rem",
    cursor: functionType === "link" && url ? "pointer" : "default",
  };

  const handleClick = () => {
    if (functionType === "link" && url) {
      window.open(url, "_blank");
    }
  };

  return (
    <button style={style} onClick={handleClick}>
      {label}
    </button>
  );
};

export default Button;
