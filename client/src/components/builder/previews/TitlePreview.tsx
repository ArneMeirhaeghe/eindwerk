import  { type CSSProperties, type FC } from "react";
import type { TitleProps } from "../../../types/types";

interface Props {
  p: Partial<TitleProps>;
}

const defaultProps: Required<TitleProps> = {
  text: "Titel voorbeeld",
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

const TitlePreview: FC<Props> = ({ p }) => {
  const props = { ...defaultProps, ...p };

  const style: CSSProperties = {
    fontFamily: props.fontFamily,
    fontSize: props.fontSize,
    lineHeight: props.lineHeight,
    color: props.color,
    backgroundColor: props.bg,
    textAlign: props.align,
    fontWeight: props.bold ? "bold" : "normal",
    fontStyle: props.italic ? "italic" : "normal",
    textDecoration: props.underline ? "underline" : "none",
    marginBottom: "0.75rem",
  };

  return <h1 style={style}>{props.text}</h1>;
};

export default TitlePreview;
