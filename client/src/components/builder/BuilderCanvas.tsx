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
  preview,
  onSelect,
  onDelete,
  onDragEnd,
}: Props) {
  return (
    <div className="flex-1 flex justify-center items-start p-4 overflow-auto bg-gray-50">
      {/* telefoon-achtig kader */}
      <div className="relative
             w-[360px]
             max-h-[720px]
             mx-auto
             border border-gray-300
             rounded-2xl
             shadow-lg
             overflow-y-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col space-y-3 p-4 bg-white"
              >
                {components.map((comp, idx) => {
                  const Preview = previewMap[comp.type];
                  return (
                    <Draggable key={comp.id} draggableId={comp.id} index={idx}>
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          className="relative bg-white bg-opacity-90 backdrop-blur rounded-xl shadow w-full cursor-pointer min-h-[40px] my-2 mx-1"
                          onClick={() => onSelect(comp)}
                        >
                          <div className="flex justify-between items-center h-full">
                            {/* Content area */}
                            <div
                              className="flex-1 pl-4"
                              onClick={() => onSelect(comp)}
                            >
                              {Preview && <Preview p={comp.props} />}
                            </div>

                            {/* Icons vertically stacked */}
                            <div className="flex flex-col items-center space-y-2 pr-2">
                              <div
                                {...prov.dragHandleProps}
                                className="cursor-move p-1 hover:bg-gray-100 rounded"
                              >
                                <GripVertical size={16} />
                              </div>
                              {!preview && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(comp.id);
                                  }}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  aria-label="Verwijder component"
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                </button>
                              )}
                            </div>
                          </div>
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
