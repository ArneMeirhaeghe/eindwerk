import type { CSSProperties, FC } from "react";
import type { QuoteProps } from "../../types/types";

interface Props {
  p: QuoteProps;
}

const QuotePreview: FC<Props> = ({ p }) => {
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
    borderLeft: "4px solid currentColor",
    paddingLeft: "1rem",
  };

  return (
    <blockquote style={style}>
      {p.text}
      {p.author && (
        <footer className="mt-2 text-sm italic" style={{ color: p.color }}>
          — {p.author}
        </footer>
      )}
    </blockquote>
  );
};

export default QuotePreview;
