// File: src/components/BuilderCanvas.tsx
import React from "react";
import type { DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash2 } from "lucide-react";
import TitlePreview from "./previews/TitlePreview";
import ParagraphPreview from "./previews/ParagraphPreview";
import QuotePreview from "./previews/QuotePreview";
import ButtonPreview from "./previews/ButtonPreview";
import ChecklistPreview from "./previews/ChecklistPreview";
import CheckboxListPreview from "./previews/CheckboxListPreview";
import DividerPreview from "./previews/DividerPreview";
import ImagePreview from "./previews/ImagePreview";
import VideoPreview from "./previews/VideoPreview";
import GridPreview from "./previews/GridPreview";
import FilePreview from "./previews/FilePreview";
import type { ComponentItem } from "../../types/types";
import SubheadingPreview from "./previews/SubheadingPreview";

interface Props {
  components: ComponentItem[];
  sectionTitle: string;
  preview: boolean;
  onSelect: (c: ComponentItem) => void;
  onDelete: (id: string) => void;
  onDragEnd: (res: DropResult) => void;
  onSectionTitleClick: () => void;
}

// Mapping component types to preview components
const previewMap: Record<string, React.FC<{ p: any }>> = {
  title: TitlePreview,
  subheading: SubheadingPreview,
  paragraph: ParagraphPreview,
  quote: QuotePreview,
  button: ButtonPreview,
  checklist: ChecklistPreview,
  "checkbox-list": CheckboxListPreview,
  divider: DividerPreview,
  image: ImagePreview,
  video: VideoPreview,
  file: FilePreview,
  grid: GridPreview,
};

export default function BuilderCanvas({
  components,
  sectionTitle,
  preview,
  onSelect,
  onDelete,
  onDragEnd,
  onSectionTitleClick,
}: Props) {
  return (
    <div
      className="relative mx-auto bg-white shadow-md rounded"
      style={{
        width: 420,
        height: 880,
        backgroundImage: "url('/phonemockup.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Phone interior: content margins */}
      <div
        className="absolute overflow-auto"
        style={{ top: 120, bottom: 120, left: 40, right: 40 }}
      >
        {/* Clickable section title */}
        <div
          onClick={onSectionTitleClick}
          className="w-full mb-4 text-xl font-semibold px-2 py-1 cursor-pointer bg-transparent text-gray-800"
        >
          {sectionTitle || "Sectietitel"}
        </div>

        {/* Drag & Drop context for components */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col space-y-4"
              >
                {components.map((comp, i) => {
                  const Preview = previewMap[comp.type];
                  return (
                    <Draggable key={comp.id} draggableId={comp.id} index={i}>
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          className="bg-white bg-opacity-90 rounded-xl shadow flex items-start w-full"
                        >
                          <div
                            className={`flex-1 p-3 ${preview ? '' : 'cursor-pointer'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!preview) onSelect(comp);
                            }}
                          >
                            {Preview && <Preview p={comp.props} />}
                          </div>
                          {!preview && (
                            <div className="flex flex-col space-y-2 p-2">
                              <div
                                {...prov.dragHandleProps}
                                className="cursor-move"
                                title="Versleep"
                              >
                                <GripVertical />
                              </div>
                              <div
                                onClick={() => onDelete(comp.id)}
                                title="Verwijder component"
                                className="cursor-pointer"
                              >
                                <Trash2 />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
