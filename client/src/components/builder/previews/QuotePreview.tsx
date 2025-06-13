import React from "react";
import type { QuoteProps } from "../../../types/types";

const defaultProps: Required<QuoteProps> = {
  text: "“Een voorbeeldquote die indruk maakt.”",
  author: "Auteur Naam",
  fontSize: 16,
  lineHeight: 1.5,
  color: "#000000",
  bg: "#ffffff",
  align: "left",
  bold: false,
  italic: true,
  underline: false,
  fontFamily: "",
};

const QuotePreview: React.FC<{ p: Partial<QuoteProps> }> = ({ p }) => {
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
    borderLeft: "4px solid currentColor",
    paddingLeft: "1rem",
    borderRadius: "0.25rem",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
  };

  return (
    <blockquote style={style} className="mb-4">
      <p>{props.text}</p>
      {props.author && (
        <footer className="mt-2 text-sm italic text-gray-600">— {props.author}</footer>
      )}
    </blockquote>
  );
};

export default QuotePreview;
