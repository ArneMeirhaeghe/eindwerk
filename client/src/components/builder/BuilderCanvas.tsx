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
import TextInputPreview from "./previews/TextInputPreview";
import TextareaPreview from "./previews/TextareaPreview";
import DropdownPreview from "./previews/DropdownPreview";
import RadioGroupPreview from "./previews/RadioGroupPreview";
import { CheckboxGroupPreview } from "./previews/CheckboxGroupPreview";
import FormPreview from "./previews/FormPreview";
import InventoryPreview from "./previews/InventoryPreview";

import type { ComponentItem } from "../../types/types";

const previewMap: Record<string, React.ComponentType<any>> = {
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
  form: FormPreview,
  inventory: InventoryPreview,
};

interface Props {
  components: ComponentItem[];
  sectionTitle: string;
  preview: boolean;
  onSelect: (c: ComponentItem) => void;
  onDelete: (id: string) => void;
  onDragEnd: (res: DropResult) => void;
  onSectionTitleClick: () => void;
  selectedId?: string;
}

export default function BuilderCanvas({
  components,
  sectionTitle,
  preview,
  onSelect,
  onDelete,
  onDragEnd,
  onSectionTitleClick,
  selectedId,
}: Props) {
  return (
    <div className="flex-1 flex justify-center items-start p-4 overflow-auto bg-gray-50">
      <div className="relative w-[360px] max-w-full h-[600px] border border-gray-300 rounded-2xl shadow-lg bg-white overflow-y-auto scroll-smooth">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col space-y-3 p-4"
              >
                {components.length === 0 && (
                  <div className="text-center text-sm text-gray-400 py-10 italic">
                    Geen componenten toegevoegd
                  </div>
                )}

                {components.map((comp, idx) => {
                  const key = comp.id ?? `comp-${idx}`;
                  const Preview = previewMap[comp.type];
                  const isSelected = selectedId === comp.id;

                  return (
                    <Draggable key={key} draggableId={String(key)} index={idx}>
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          className={`relative bg-white rounded-xl shadow w-full min-h-[40px] cursor-pointer border ${
                            isSelected ? "ring-2 ring-blue-500" : "border-transparent"
                          }`}
                          onClick={() => onSelect(comp)}
                        >
                          <div className="flex justify-between items-start p-2">
                            <div className="flex-1 pr-2">
                              {Preview && <Preview p={comp.props} />}
                            </div>

                            <div className="flex flex-col items-center space-y-2">
                              <div
                                {...prov.dragHandleProps}
                                className="cursor-move p-1 hover:bg-gray-100 rounded"
                                aria-label="Versleep component"
                              >
                                <GripVertical size={16} />
                              </div>

                              {!preview && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(comp.id ?? key);
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

                {/* Extra margin zodat sticky elementen niet overlappen */}
                <div className="h-32" />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
