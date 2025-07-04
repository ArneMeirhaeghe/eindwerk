import React, { type FC } from "react";
import type { SubheadingProps } from "../../../types/types";

interface Props {
  p: Partial<SubheadingProps>;
}

const defaultProps: Required<SubheadingProps> = {
  text: "sub voorbeeld",
  fontFamily: "sans-serif",
  fontSize: 28,
  lineHeight: 1.4,
  color: "#000000",
  bg: "#ffffff",
  align: "left",
  bold: true,
  italic: false,
  underline: false,
};

const SubheadingPreview: FC<Props> = ({ p }) => {
  const props = { ...defaultProps, ...p };
  const style: React.CSSProperties = {
    fontSize: props.fontSize,
    color: props.color,
    textAlign: props.align,
    fontWeight: props.bold ? "bold" : "normal",
    fontStyle: props.italic ? "italic" : "normal",
    textDecoration: props.underline ? "underline" : "none",
    marginBottom: "0.75rem",
  };

  return <h2 style={style}>{props.text}</h2>;
};

export default SubheadingPreview;
