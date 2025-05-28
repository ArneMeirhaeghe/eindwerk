import { type FC } from "react";
import type { ComponentItem, GridProps } from "../../types/types";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const GridSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p: GridProps = {
    images: [],
    columns: 3,
    gap: 8,
    borderWidth: 0,
    borderColor: "#000000",
    radius: 0,
    shadow: false,
    objectFit: "cover",
    ...(comp.props as Partial<GridProps>),
  };
  const update = (k: keyof GridProps, v: any) =>
    onUpdate({ ...comp, props: { ...p, [k]: v } });

  // reorder in grid
  const onDragEnd = (res: DropResult) => {
    if (!res.destination) return;
    const arr = [...p.images];
    const [m] = arr.splice(res.source.index, 1);
    arr.splice(res.destination.index, 0, m);
    update("images", arr);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Grid-preview (reordenen) */}
      <p className="font-medium mb-1">Afbeeldingen (sleep om te herschikken)</p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="grid" direction="horizontal">
          {(prov) => (
            <div ref={prov.innerRef} {...prov.droppableProps} className="flex space-x-2 overflow-auto">
              {p.images.map((url, i) => (
                <Draggable key={`${url}-${i}`} draggableId={`${url}-${i}`} index={i}>
                  {(prov2) => (
                    <div ref={prov2.innerRef} {...prov2.draggableProps} {...prov2.dragHandleProps}>
                      <img
                        src={url}
                        className="h-16 w-16 object-cover rounded border"
                        style={{
                          borderWidth: p.borderWidth,
                          borderColor: p.borderColor,
                          borderStyle: "solid",
                          borderRadius: p.radius,
                          boxShadow: p.shadow ? "0 2px 8px rgba(0,0,0,0.2)" : undefined,
                        }}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {prov.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Grid-instellingen */}
      <div className="border-t pt-4 space-y-2">
        <div>
          <label className="block mb-1">Kolommen</label>
          <input
            type="number"
            min={1}
            max={6}
            value={p.columns}
            onChange={(e) => update("columns", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Gap (px)</label>
          <input
            type="number"
            min={0}
            max={50}
            value={p.gap}
            onChange={(e) => update("gap", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Randdikte (px)</label>
          <input
            type="number"
            min={0}
            value={p.borderWidth}
            onChange={(e) => update("borderWidth", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">Randkleur</label>
          <input
            type="color"
            value={p.borderColor}
            onChange={(e) => update("borderColor", e.target.value)}
            className="w-full h-10"
          />
        </div>
        <div>
          <label className="block mb-1">Radius (px)</label>
          <input
            type="number"
            min={0}
            value={p.radius}
            onChange={(e) => update("radius", +e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={p.shadow}
            onChange={(e) => update("shadow", e.target.checked)}
          />
          <span>Shadow</span>
        </label>
        <div>
          <label className="block mb-1">Object-fit</label>
          <select
            value={p.objectFit}
            onChange={(e) => update("objectFit", e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default GridSettings;
