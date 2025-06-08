import type { CSSProperties, FC } from "react";
import type { TitleProps } from "../../../types/types";

interface Props {
  p: TitleProps;
}

const TitlePreview: FC<Props> = ({ p }) => {
  const style: CSSProperties = {
    fontFamily: p.fontFamily,
    fontSize: p.fontSize,
    lineHeight: p.lineHeight,
    color: p.color,
    backgroundColor: p.bg,
    textAlign: p.align,
    fontWeight: p.bold ? "bold" : "normal",
    fontStyle: p.italic ? "italic" : "normal",
    textDecoration: p.underline ? "underline" : "none",
  };

  return <h1 style={style}>{p.text}</h1>;
};

export default TitlePreview;
