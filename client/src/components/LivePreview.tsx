// src/components/LivePreview.tsx
// src/components/LivePreview.tsx
import React from "react";
import type { ComponentItem } from "../types/types";

interface Props {
  components: ComponentItem[];
}

export default function LivePreview({ components }: Props) {
  const renderComponent = (comp: ComponentItem) => {
    const p = comp.props as any;
    switch (comp.type) {
      case "title":
        return (
          <h1 style={{
            fontFamily: p.fontFamily,
            fontSize: p.fontSize,
            color: p.color,
            background: p.bg,
            textAlign: p.align,
            fontWeight: p.bold ? "bold" : "normal",
            fontStyle: p.italic ? "italic" : "normal",
            textDecoration: p.underline ? "underline" : "none",
            lineHeight: p.lineHeight,
            margin: "1rem 0",
          }}>
            {p.text}
          </h1>
        );
      case "subheading":
        return (
          <h2 style={{
            fontFamily: p.fontFamily,
            fontSize: p.fontSize,
            color: p.color,
            background: p.bg,
            textAlign: p.align,
            fontWeight: p.bold ? "bold" : "normal",
            fontStyle: p.italic ? "italic" : "normal",
            textDecoration: p.underline ? "underline" : "none",
            lineHeight: p.lineHeight,
            margin: "0.75rem 0",
          }}>
            {p.text}
          </h2>
        );
      case "paragraph":
        return (
          <p style={{
            fontFamily: p.fontFamily,
            fontSize: p.fontSize,
            color: p.color,
            background: p.bg,
            textAlign: p.align,
            fontWeight: p.bold ? "bold" : "normal",
            fontStyle: p.italic ? "italic" : "normal",
            textDecoration: p.underline ? "underline" : "none",
            lineHeight: p.lineHeight,
            margin: "0.5rem 0",
          }}>
            {p.text}
          </p>
        );
      case "quote":
        return (
          <blockquote style={{
            fontFamily: p.fontFamily,
            fontSize: p.fontSize,
            color: p.color,
            background: p.bg,
            textAlign: p.align,
            fontStyle: "italic",
            lineHeight: p.lineHeight,
            borderLeft: "4px solid #ccc",
            paddingLeft: "1em",
            margin: "1rem 0",
          }}>
            {p.text}
          </blockquote>
        );
      case "button":
        return (
          <button style={{
            fontSize: p.fontSize,
            color: p.color,
            background: p.bg,
            borderRadius: p.radius,
            fontWeight: p.bold ? "bold" : "normal",
            fontStyle: p.italic ? "italic" : "normal",
            textDecoration: p.underline ? "underline" : "none",
            padding: "0.75rem 1.5rem",
            border: "none",
            cursor: "pointer",
            display: "block",
            margin: "1rem auto",
          }} onClick={() => {
            if (p.functionType === "link" && p.url) window.open(p.url, "_blank");
          }}>
            {p.label}
          </button>
        );
      case "divider":
        return <hr style={{
          borderColor: p.color,
          borderWidth: p.thickness,
          background: p.color,
          margin: "1rem 0",
        }} />;
      case "checklist":
        return (
          <ul style={{
            listStyleType: "disc",
            paddingLeft: "1.5rem",
            fontSize: p.fontSize,
            color: p.color,
            background: p.bg,
            margin: "0.5rem 0",
          }}>
            {p.items.map((it: string, i: number) => <li key={i}>{it}</li>)}
          </ul>
        );
      case "checkbox-list":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", margin: "0.5rem 0" }}>
            {p.items.map((it: any, i: number) => (
              <label key={i}>
                <input type="checkbox" defaultChecked={it.good} /> {it.label}
              </label>
            ))}
          </div>
        );
      case "image":
        if (!p.url?.trim()) return null;
        return (
          <img
            src={p.url}
            alt={p.alt}
            style={{
              width: p.width,
              height: p.height,
              objectFit: p.objectFit,
              border: `${p.borderWidth}px solid ${p.borderColor}`,
              borderRadius: p.radius,
              boxShadow: p.shadow ? "0 4px 12px rgba(0,0,0,0.3)" : undefined,
              display: "block",
              margin: "1rem auto",
            }}
          />
        );
      case "video":
        if (!p.url?.trim()) return null;
        return (
          <video
            src={p.url}
            style={{
              width: p.width,
              height: p.height,
              borderRadius: p.radius,
              boxShadow: p.shadow ? "0 4px 12px rgba(0,0,0,0.3)" : undefined,
              display: "block",
              margin: "1rem auto",
            }}
            controls
            autoPlay={p.autoplay}
            loop={p.loop}
          />
        );
      case "grid":
        const imgs: string[] = Array.isArray(p.images) ? p.images.filter((u: string) => u.trim()) : [];
        if (!imgs.length) return null;
        return (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${p.columns}, 1fr)`,
            gap: p.gap,
            margin: "1rem 0",
          }}>
            {imgs.map((url, i) => (
              <img
                key={`${url}-${i}`}
                src={url}
                alt=""
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: p.objectFit,
                  border: `${p.borderWidth}px solid ${p.borderColor}`,
                  borderRadius: p.radius,
                  boxShadow: p.shadow ? "0 4px 12px rgba(0,0,0,0.3)" : undefined,
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="relative"
      style={{
        width: 420,
        height: 880,
        margin: "20px auto",
        backgroundColor: "#fff",
        backgroundImage: "url('/phonemockup.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute overflow-auto"
        style={{ top: 120, bottom: 120, left: 40, right: 40 }}
      >
        {components.map((comp) => (
          <div key={comp.id}>{renderComponent(comp)}</div>
        ))}
      </div>
    </div>
  );
}