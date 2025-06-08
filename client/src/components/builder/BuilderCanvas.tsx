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
import type { ComponentItem } from "../../types/types";

interface Props {
  components: ComponentItem[];
  sectionTitle: string;
  preview: boolean;
  onSelect: (c: ComponentItem) => void;
  onDelete: (id: string) => void;
  onDragEnd: (res: DropResult) => void;
  onSectionTitleClick: () => void;
}

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
      <div
        className="absolute inset-0 overflow-auto p-4"
        style={{ top: 120, bottom: 120, left: 40, right: 40 }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSectionTitleClick();
          }}
          className="w-full mb-4 text-xl font-semibold text-left px-2 py-1 focus:outline-none cursor-pointer"
        >
          {sectionTitle || "Sectietitel"}
        </button>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col items-center space-y-4 w-full"
              >
                {components.map((comp, i) => {
                  const PreviewComponent = previewMap[comp.type];
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
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!preview) onSelect(comp);
                            }}
                          >
                            {PreviewComponent && <PreviewComponent p={comp.props} />}
                          </div>
                          {!preview && (
                            <div className="flex flex-col space-y-2 p-2">
                              <div {...prov.dragHandleProps} className="cursor-move" title="Versleep">
                                <GripVertical className="text-gray-500" />
                              </div>
                              <div onClick={() => onDelete(comp.id)} title="Verwijder component">
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
