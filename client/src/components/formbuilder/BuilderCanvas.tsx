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
    <div className="p-4 flex justify-center">
      <div className="w-[360px] h-[720px] bg-white border rounded-2xl shadow overflow-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="p-4 space-y-4">
                {components.map((f, idx) => {
                  const Preview = previewMap[f.type]
                  return (
                    <Draggable key={f.id} draggableId={f.id} index={idx}>
                      {prov => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          className="relative bg-gray-100 rounded-lg p-3 cursor-pointer"
                          onClick={() => onSelect(f.id)}
                        >
                          <div className="flex justify-between">
                            <Preview label={f.label} p={f.settings} />
                            <div className="flex flex-col ml-2 space-y-1">
                              <div {...prov.dragHandleProps}><GripVertical size={16} /></div>
                              <button onClick={e => { e.stopPropagation(); onDelete(f.id) }}>
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
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
