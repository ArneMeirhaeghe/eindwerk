// /src/components/BuilderCanvas.tsx
import React from "react";
import type { ComponentItem } from "../types/types";
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
import GridPreview from "./previews/GridPreview";
import FilePreview from "./previews/FilePreview"; // toegevoegd

interface Props {
  components: ComponentItem[];
  sectionTitle: string;
  preview: boolean;
  onSelect: (c: ComponentItem) => void;
  onDelete: (id: string) => void;
  onDragEnd: (res: DropResult) => void;
  onSectionTitleChange: (t: string) => void;
}

// Map each component type to zijn Preview-component
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
  file: FilePreview,       // toegevoegd
  grid: GridPreview,
};

export default function BuilderCanvas({
  components,
  sectionTitle,
  preview,
  onSelect,
  onDelete,
  onDragEnd,
  onSectionTitleChange,
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
      <div
        className="absolute inset-0 overflow-auto p-4"
        style={{ top: 120, bottom: 120, left: 40, right: 40 }}
      >
        <input
          value={sectionTitle}
          onChange={(e) => onSectionTitleChange(e.target.value)}
          className="w-full mb-4 text-xl font-semibold border-b px-2 py-1 focus:outline-none"
          placeholder="Sectietitel"
        />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col items-center space-y-4 w-full"
              >
                {components.map((comp, i) => {
                  const Preview = previewMap[comp.type];
                  return (
                    <Draggable key={comp.id} draggableId={comp.id} index={i}>
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          className="bg-white w-full rounded shadow flex justify-between items-start"
                        >
                          <div
                            className={`flex-1 p-3 ${preview ? "" : "cursor-pointer"}`}
                            onClick={() => !preview && onSelect(comp)}
                          >
                            {Preview && <Preview p={comp.props} />}
                          </div>
                          {!preview && (
                            <div className="flex flex-col space-y-2 p-2">
                              <div {...prov.dragHandleProps} className="cursor-move">
                                <GripVertical className="text-gray-500" />
                              </div>
                              <div onClick={() => onDelete(comp.id)}>
                                <Trash2 className="cursor-pointer text-red-600" />
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
