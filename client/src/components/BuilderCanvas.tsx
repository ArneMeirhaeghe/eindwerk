// src/components/BuilderCanvas.tsx
import React from "react";
import type { ComponentItem } from "../types/types";
import type { DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash2 } from "lucide-react";

interface Props {
  components: ComponentItem[];
  sectionTitle: string;
  preview: boolean;
  onSelect: (c: ComponentItem) => void;
  onDelete: (id: string) => void;
  onDragEnd: (res: DropResult) => void;
  onSectionTitleChange: (t: string) => void;
}

export default function BuilderCanvas({
  components,
  sectionTitle,
  preview,
  onSelect,
  onDelete,
  onDragEnd,
  onSectionTitleChange,
}: Props) {
  const renderPreview = (comp: ComponentItem) => {
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
          }}>
            {p.text}
          </blockquote>
        );

      case "button":
        return (
          <button
            style={{
              fontSize: p.fontSize,
              color: p.color,
              background: p.bg,
              borderRadius: p.radius,
              fontWeight: p.bold ? "bold" : "normal",
              fontStyle: p.italic ? "italic" : "normal",
              textDecoration: p.underline ? "underline" : "none",
              padding: "0.5em 1em",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              if (p.functionType === "link" && p.url) {
                window.open(p.url, "_blank");
              }
            }}
          >
            {p.label}
          </button>
        );

      case "checklist":
        return (
          <ul style={{
            listStyleType: "disc",
            paddingLeft: "1.5em",
            fontSize: p.fontSize,
            color: p.color,
            background: p.bg,
            gap: p.spacing,
          }}>
            {p.items.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );

      case "checkbox-list":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
            {p.items.map((it: any, idx: number) => (
              <label key={idx} style={{ color: p.color, background: p.bg }}>
                <input type="checkbox" defaultChecked={it.good} /> {it.label}
              </label>
            ))}
          </div>
        );

      case "divider":
        return (
          <hr style={{
            borderColor: p.color,
            borderWidth: p.thickness,
            background: p.color,
          }} />
        );

      case "image":
        if (!p.url?.trim()) {
          return <div className="italic text-gray-400">Geen afbeelding</div>;
        }
        return (
          <img
            src={p.url || undefined}
            alt={p.alt}
            style={{
              width: p.width,
              height: p.height,
              objectFit: p.objectFit,
              border: `${p.borderWidth}px solid ${p.borderColor}`,
              borderRadius: p.radius,
              boxShadow: p.shadow ? "0 2px 8px rgba(0,0,0,0.2)" : undefined,
            }}
          />
        );

      case "video":
        if (!p.url?.trim()) {
          return <div className="italic text-gray-400">Geen video</div>;
        }
        return (
          <video
            src={p.url || undefined}
            style={{
              width: p.width,
              height: p.height,
              borderRadius: p.radius,
              boxShadow: p.shadow ? "0 2px 8px rgba(0,0,0,0.2)" : undefined,
            }}
            controls={p.controls}
            autoPlay={p.autoplay}
            loop={p.loop}
          />
        );

      case "grid":
        const imgs: string[] = Array.isArray(p.images)
          ? p.images.filter((u: string) => u.trim())
          : [];
        if (imgs.length === 0) {
          return <div className="italic text-gray-400">Geen afbeeldingen</div>;
        }
        const cols = typeof p.columns === "number" ? p.columns : 1;
        const gap = typeof p.gap === "number" ? p.gap : 0;
        return (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap,
          }}>
            {imgs.map((url, i) => (
              <img
                key={`${url}-${i}`}
                src={url || undefined}
                alt=""
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: p.objectFit,
                  border: `${p.borderWidth}px solid ${p.borderColor}`,
                  borderRadius: p.radius,
                  boxShadow: p.shadow ? "0 2px 8px rgba(0,0,0,0.2)" : undefined,
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
      className="relative mx-auto"
      style={{
        width: 420,
        height: 880,
        backgroundImage: "url('/phonemockup.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* schermcutout */}
      <div
        className="absolute overflow-auto"
        style={{ top: 120, bottom: 120, left: 40, right: 40 }}
      >
        <input
          value={sectionTitle}
          onChange={(e) => onSectionTitleChange(e.target.value)}
          className="w-full mb-4 text-xl font-semibold border-b px-2 py-1"
        />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col items-center space-y-4 w-full"
              >
                {components.map((comp, index) => (
                  <Draggable key={comp.id} draggableId={comp.id} index={index}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        className="bg-white w-full rounded shadow flex justify-between items-start"
                      >
                        <div
                          className={`flex-1 p-3 ${preview ? "" : "cursor-pointer"}`}
                          onClick={() => !preview && onSelect(comp)}
                        >
                          {renderPreview(comp)}
                        </div>
                        {!preview && (
                          <div className="flex flex-col space-y-2 p-2">
                            <div {...prov.dragHandleProps} className="cursor-move">
                              <GripVertical className="text-gray-500" />
                            </div>
                            <div onClick={() => onDelete(comp.id)}>
                              <Trash2 className="cursor-pointer text-red-600" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
