// File: src/components/formbuilder/BuilderCanvas.tsx
import React from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { GripVertical, Trash2 } from "lucide-react";
import type { FieldDto } from "../../api/forms/types";
import TextInputPreview from "./previews/TextInputPreview";
import TextareaPreview from "./previews/TextareaPreview";
import DropdownPreview from "./previews/DropdownPreview";
import RadioGroupPreview from "./previews/RadioGroupPreview";
import CheckboxGroupPreview from "./previews/CheckboxGroupPreview";


const previewMap: Record<FieldDto["type"], React.FC<{ label: string; p: any }>> = {
  "text-input": TextInputPreview,
  textarea: TextareaPreview,
  dropdown: DropdownPreview,
  "radio-group": RadioGroupPreview,
  "checkbox-group": CheckboxGroupPreview,
};

interface Props {
  components: FieldDto[];
  onSelect(id: string): void;
  onDelete(id: string): void;
  onDragEnd(result: DropResult): void;
}

export default function BuilderCanvas({
  components,
  onSelect,
  onDelete,
  onDragEnd,
}: Props) {
  return (
    <div className="flex-1 flex justify-center items-start p-4 overflow-auto bg-gray-50">
      <div className="relative w-[360px] h-[720px] mx-auto border border-gray-300 rounded-2xl shadow-lg overflow-y-auto bg-white">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col space-y-3 p-4"
              >
                {components.map((f, idx) => {
                  const Preview = previewMap[f.type];
                  return (
                    <Draggable key={f.id} draggableId={f.id} index={idx}>
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          className="relative bg-white rounded-xl shadow p-3 cursor-pointer"
                          onClick={() => onSelect(f.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              {/* Label en preview */}
                              <Preview label={f.label} p={f.settings} />
                            </div>
                            <div className="flex flex-col items-center space-y-1 ml-2">
                              <div {...prov.dragHandleProps} className="p-1 hover:bg-gray-100 rounded">
                                <GripVertical size={16} />
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); onDelete(f.id); }}
                                className="p-1 hover:bg-gray-100 rounded"
                                aria-label="Verwijder veld"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </button>
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
