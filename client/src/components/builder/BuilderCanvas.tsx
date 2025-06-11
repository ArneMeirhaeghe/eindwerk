// File: src/components/builder/BuilderCanvas.tsx
import React from "react";
import type { DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash2 } from "lucide-react";

import TitlePreview from "./previews/TitlePreview";
import SubheadingPreview from "./previews/SubheadingPreview";
import ParagraphPreview from "./previews/ParagraphPreview";
import QuotePreview from "./previews/QuotePreview";
import ButtonPreview from "./previews/ButtonPreview";
import ChecklistPreview from "./previews/ChecklistPreview";
import CheckboxListPreview from "./previews/CheckboxListPreview";
import DividerPreview from "./previews/DividerPreview";
import ImagePreview from "./previews/ImagePreview";
import VideoPreview from "./previews/VideoPreview";
import FilePreview from "./previews/FilePreview";
import GridPreview from "./previews/GridPreview";
import UploadZonePreview from "./previews/UploadZonePreview";
import { TextInputPreview } from "./previews/TextInputPreview";
import { TextareaPreview } from "./previews/TextareaPreview";
import DropdownPreview from "./previews/DropdownPreview";
import { RadioGroupPreview } from "./previews/RadioGroupPreview";
import { CheckboxGroupPreview } from "./previews/CheckboxGroupPreview";
import type { ComponentItem } from "../../types/types";

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
  uploadzone: UploadZonePreview,
  "text-input": TextInputPreview,
  textarea: TextareaPreview,
  dropdown: DropdownPreview,
  "radio-group": RadioGroupPreview,
  "checkbox-group": CheckboxGroupPreview,
};

interface Props {
  components: ComponentItem[];
  sectionTitle: string;
  preview: boolean;
  onSelect: (c: ComponentItem) => void;
  onDelete: (id: string) => void;
  onDragEnd: (res: DropResult) => void;
  onSectionTitleClick: () => void;
}

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
    <div className="flex-1 flex justify-center items-start p-4 overflow-auto">
      {/* wrapper met minimale hoogte */}
      <div className="relative w-[360px] min-h-[720px] mx-auto">
        {/* Sectie-titel klikbaar voor modal */}
        <h2
          onClick={onSectionTitleClick}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-4 py-1 rounded-full text-sm font-semibold cursor-pointer shadow"
        >
          {sectionTitle}
        </h2>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col space-y-3"
              >
                {components.map((comp, idx) => {
                  const Preview = previewMap[comp.type];
                  return (
                    <Draggable key={comp.id} draggableId={comp.id} index={idx}>
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          onClick={() => onSelect(comp)}
                          className="relative bg-white bg-opacity-90 backdrop-blur px-3 py-2 rounded-xl shadow w-full cursor-pointer min-h-[40px]"
                        >
                          {/* Drag-handle met preventPropagation */}
                          <div
                            {...prov.dragHandleProps}
                            className="absolute top-2 left-2 cursor-move text-gray-400"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GripVertical size={16} />
                          </div>

                          {/* Preview zelf */}
                          {Preview && <Preview p={comp.props} />}

                          {/* Delete-knop met preventPropagation */}
                          {!preview && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(comp.id);
                              }}
                              className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-1 rounded-full"
                              aria-label="Verwijder component"
                            >
                              <Trash2 size={14} />
                            </button>
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
