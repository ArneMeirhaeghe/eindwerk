// src/components/BuilderCanvas.tsx
import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { ChevronsUpDown, Trash2 } from "lucide-react";
import type { ComponentItem } from "../types/types";

interface Props {
  components: ComponentItem[];
  sectionTitle: string;
  onDragEnd: (result: DropResult) => void;
  onSelect: (comp: ComponentItem) => void;
  onDelete: (id: string) => void;
  onSectionTitleChange: (title: string) => void;
  preview: boolean;
}

export default function BuilderCanvas({
  components,
  sectionTitle,
  onDragEnd,
  onSelect,
  onDelete,
  onSectionTitleChange,
  preview,
}: Props) {
  const renderPreview = (comp: ComponentItem) => {
    const p = comp.props as any;
    switch (comp.type) {
      case "title":
      case "subheading":
      case "paragraph":
      case "quote":
        return (
          <div
            style={{
              fontFamily: p.fontFamily,
              fontSize: p.fontSize,
              color: p.color,
              background: p.bg,
              textAlign: p.align,
              fontWeight: p.bold ? "bold" : "normal",
              fontStyle: p.italic ? "italic" : "normal",
              textDecoration: p.underline ? "underline" : "none",
              lineHeight: p.lineHeight,
            }}
          >
            {p.text}
          </div>
        );
      case "image":
        return p.url ? (
          <img
            src={p.url}
            alt={p.alt || ""}
            className="max-w-full h-auto rounded"
            style={{ objectFit: p.objectFit }}
          />
        ) : null;
      case "video":
        return p.url ? (
          <video
            src={p.url}
            controls={p.controls}
            autoPlay={p.autoplay}
            loop={p.loop}
            className="max-w-full h-auto rounded"
          />
        ) : null;
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
            }}
            className="px-4 py-2"
          >
            {p.label}
          </button>
        );
      case "checklist":
        return (
          <ul
            className="list-disc pl-5"
            style={{ color: p.color, background: p.bg }}
          >
            {p.items.map((it: string, i: number) => (
              <li key={i} style={{ fontSize: p.fontSize }}>
                {it}
              </li>
            ))}
          </ul>
        );
      case "checkbox-list":
        return (
          <ul
            className="list-none pl-0"
            style={{ color: p.color, background: p.bg }}
          >
            {p.items.map((item: any, i: number) => (
              <li key={i} className="flex items-center mb-2">
                <input type="checkbox" checked={item.good} disabled />
                <span className="ml-2">{item.label}</span>
              </li>
            ))}
          </ul>
        );
      case "divider":
        return (
          <hr
            style={{ borderTopWidth: p.thickness, borderColor: p.color }}
          />
        );
      default:
        return null;
    }
  };

  const TitleHeader = (
    <h2
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) =>
        onSectionTitleChange((e.target as HTMLElement).innerText)
      }
      className="text-xl font-semibold mb-4 outline-none"
    >
      {sectionTitle}
    </h2>
  );

  if (preview) {
    return (
      <section className="space-y-6 p-4 overflow-auto flex-1">
        {TitleHeader}
        {components.map((comp) => (
          <div key={comp.id}>{renderPreview(comp)}</div>
        ))}
      </section>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="components">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-1 overflow-y-auto p-4 space-y-4 pb-20"
            >
              {TitleHeader}
              {components.map((comp, idx) => (
                <Draggable key={comp.id} draggableId={comp.id} index={idx}>
                  {(pDrag) => (
                    <div
                      ref={pDrag.innerRef}
                      {...pDrag.draggableProps}
                      {...pDrag.dragHandleProps}
                      onClick={() => onSelect(comp)}
                      className="relative p-4 border rounded bg-white hover:shadow cursor-pointer"
                    >
                      <ChevronsUpDown
                        size={20}
                        className="absolute left-2 top-2 text-gray-400"
                      />
                      <div className="pointer-events-none">
                        {renderPreview(comp)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(comp.id);
                        }}
                        className="absolute top-2 right-2 text-red-500"
                        aria-label="Verwijder component"
                      >
                        <Trash2 size={16} />
                      </button>
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
  );
}
