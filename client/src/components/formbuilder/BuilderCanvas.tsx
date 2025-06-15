// File: src/components/formbuilder/BuilderCanvas.tsx
import React from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { GripVertical, Trash2 } from "lucide-react"
import type { FieldDto } from "../../api/forms/types"
import TextInputPreview from "./previews/TextInputPreview"
import TextareaPreview from "./previews/TextareaPreview"
import DropdownPreview from "./previews/DropdownPreview"
import RadioGroupPreview from "./previews/RadioGroupPreview"
import CheckboxGroupPreview from "./previews/CheckboxGroupPreview"

const previewMap: Record<FieldDto["type"], React.FC<{ label: string; p: any }>> = {
  "text-input": TextInputPreview,
  textarea: TextareaPreview,
  dropdown: DropdownPreview,
  "radio-group": RadioGroupPreview,
  "checkbox-group": CheckboxGroupPreview,
}

export default function BuilderCanvas({
  components, onSelect, onDelete, onDragEnd
}: {
  components: FieldDto[]
  onSelect(id: string): void
  onDelete(id: string): void
  onDragEnd(result: DropResult): void
}) {
  return (
    <div className="flex-1 flex justify-center items-start p-4 overflow-auto bg-gray-50">
      <div className="relative w-[360px] max-w-full h-[600px] border border-gray-300 rounded-2xl shadow-lg bg-white overflow-y-auto scroll-smooth">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="p-4 space-y-4">
                {components.length === 0 && (
                  <div className="text-center text-sm text-gray-400 py-10 italic">
                    Geen velden toegevoegd
                  </div>
                )}

                {components.map((f, idx) => {
                  const Preview = previewMap[f.type]
                  return (
                    <Draggable key={f.id} draggableId={f.id} index={idx}>
                      {prov => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          className="relative bg-white border rounded-lg shadow p-3 cursor-pointer"
                          onClick={() => onSelect(f.id)}
                        >
                          <div className="flex justify-between">
                            <Preview label={f.label} p={f.settings} />
                            <div className="flex flex-col ml-2 space-y-1">
                              <div {...prov.dragHandleProps}>
                                <GripVertical size={16} />
                              </div>
                              <button
                                onClick={e => {
                                  e.stopPropagation()
                                  onDelete(f.id)
                                }}
                              >
                                <Trash2 size={14} className="text-red-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  )
                })}

                {provided.placeholder}
                <div className="h-24" />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
