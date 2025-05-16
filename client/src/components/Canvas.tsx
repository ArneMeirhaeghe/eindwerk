// src/components/Canvas.tsx

import type { BlockData } from "../types/Plan"
import Block from "./Block"
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Props {
  blocks: BlockData[]
  onUpdateBlock: (id: string, content: string) => void
  onReorder: (blocks: BlockData[]) => void
  onDeleteBlock: (id: string) => void
}

function Canvas({ blocks, onUpdateBlock, onReorder, onDeleteBlock }: Props) {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)
    const newOrder = arrayMove(blocks, oldIndex, newIndex)
    onReorder(newOrder)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              onUpdate={onUpdateBlock}
              onDelete={onDeleteBlock}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

interface SortableBlockProps {
  block: BlockData
  onUpdate: (id: string, content: string) => void
  onDelete: (id: string) => void
}

function SortableBlock({ block, onUpdate, onDelete }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative border p-4 rounded bg-white"
    >
      <Block block={block} onUpdate={onUpdate} />
      <button
        onClick={() => onDelete(block.id)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        🗑️
      </button>
    </div>
  )
}

export default Canvas
