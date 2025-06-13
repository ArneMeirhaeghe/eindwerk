import React from "react";
import type { ParagraphProps } from "../../../types/types";

const defaultProps: Required<ParagraphProps> = {
  text: "Voorbeeld paragraaftekst",
  fontSize: 16,
  lineHeight: 1.5,
  color: "#000000",
  bg: "#ffffff",
  align: "left",
  bold: false,
  italic: false,
  underline: false,
  fontFamily: "",
};

const ParagraphPreview: React.FC<{ p: Partial<ParagraphProps> }> = ({ p }) => {
  const props = { ...defaultProps, ...p };

  const style: React.CSSProperties = {
    fontFamily: props.fontFamily || undefined,
    fontSize: props.fontSize,
    lineHeight: props.lineHeight,
    color: props.color,
    backgroundColor: props.bg,
    textAlign: props.align,
    fontWeight: props.bold ? "bold" : "normal",
    fontStyle: props.italic ? "italic" : "normal",
    textDecoration: props.underline ? "underline" : "none",
    padding: "0.25rem 0",
    borderRadius: "0.25rem",
  };

  return <p style={style}>{props.text}</p>;
};

export default ParagraphPreview;
