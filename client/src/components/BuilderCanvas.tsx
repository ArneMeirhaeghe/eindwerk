// src/components/BuilderCanvas.tsx
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
  onDragEnd: (result: DropResult) => void;
  onSelect: (comp: ComponentItem) => void;
  onDelete: (id: string) => void;
  preview: boolean;
}

export default function BuilderCanvas({
  components,
  onDragEnd,
  onSelect,
  onDelete,
  preview,
}: Props) {
  if (preview) {
    return (
      <section className="space-y-6 p-4 overflow-auto flex-1">
        {components.map(comp => {
          const p = comp.props;

          if (["title","subheading","paragraph","quote"].includes(comp.type)) {
            return (
              <div
                key={comp.id}
                style={{
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
          }

          if (comp.type === "image" && p.url) {
            return (
              <div key={comp.id} className="text-center">
                <img
                  src={p.url}
                  alt={p.alt || ""}
                  className="max-w-full h-auto rounded"
                  style={{ objectFit: p.objectFit }}
                />
              </div>
            );
          }

          if (comp.type === "video" && p.url) {
            return (
              <div key={comp.id} className="text-center">
                <video
                  src={p.url}
                  controls={p.controls}
                  autoPlay={p.autoplay}
                  loop={p.loop}
                  className="max-w-full h-auto rounded"
                />
              </div>
            );
          }

          if (comp.type === "button") {
            return (
              <div key={comp.id} className="text-center">
                <button
                  disabled={p.disabled}
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
              </div>
            );
          }

          if (comp.type === "checklist" && Array.isArray(p.items)) {
            return (
              <ul key={comp.id} className="list-disc pl-5">
                {p.items.map((it: string, i: number) => (
                  <li
                    key={i}
                    style={{
                      fontSize: p.fontSize,
                      color: p.color,
                      background: p.bg,
                    }}
                  >
                    {it}
                  </li>
                ))}
              </ul>
            );
          }

          if (comp.type === "divider") {
            return (
              <hr
                key={comp.id}
                style={{
                  borderTopWidth: p.thickness,
                  borderColor: p.color,
                  marginTop: p.marginY,
                  marginBottom: p.marginY,
                }}
              />
            );
          }

          return null;
        })}
      </section>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="components">
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4 p-4 overflow-auto flex-1"
          >
            {components.map((comp, idx) => (
              <Draggable key={comp.id} draggableId={comp.id} index={idx}>
                {p => (
                  <div
                    ref={p.innerRef}
                    {...p.draggableProps}
                    {...p.dragHandleProps}
                    onClick={() => onSelect(comp)}
                    className="relative p-4 border rounded bg-white hover:shadow cursor-pointer"
                  >
                    <ChevronsUpDown
                      size={20}
                      className="absolute left-2 top-2 text-gray-400"
                    />

                    {["title","subheading","paragraph","quote"].includes(comp.type) && (
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onInput={e => {
                          const text = (e.target as HTMLElement).innerText;
                          onSelect({ ...comp, props: { ...comp.props, text } });
                        }}
                        style={{
                          fontSize: comp.props.fontSize,
                          color: comp.props.color,
                          background: comp.props.bg,
                          textAlign: comp.props.align,
                          fontWeight: comp.props.bold ? "bold" : "normal",
                          fontStyle: comp.props.italic ? "italic" : "normal",
                          textDecoration: comp.props.underline ? "underline" : "none",
                          lineHeight: comp.props.lineHeight,
                        }}
                        className="outline-none"
                      >
                        {comp.props.text}
                      </div>
                    )}

                    {comp.type === "image" && comp.props.url && (
                      <img
                        src={comp.props.url}
                        alt={comp.props.alt || ""}
                        className="w-24 h-24 object-cover mx-auto rounded"
                      />
                    )}

                    {comp.type === "video" && (
                      <div className="text-center text-sm text-gray-500">
                        {comp.props.url ? `Video: ${comp.props.url}` : "Geen URL"}
                      </div>
                    )}

                    <button
                      onClick={e => { e.stopPropagation(); onDelete(comp.id); }}
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
  );
}
