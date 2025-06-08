// src/components/settings/ChecklistSettings.tsx
import React, { type FC } from "react";
import type { ComponentItem } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const ChecklistSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p = comp.props as any;

  const updateItems = (items: string[]) =>
    onUpdate({ ...comp, props: { ...p, items } });
  const updateProp = (key: string, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div>
      <label className="block mb-1">Items</label>
      {p.items.map((item: string, i: number) => (
        <div key={i} className="flex items-center mb-2 space-x-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const items = [...p.items];
              items[i] = e.target.value;
              updateItems(items);
            }}
            className="flex-1 border px-2 py-1 rounded"
          />
          <button
            onClick={() => {
              const items = p.items.filter((_: any, idx: number) => idx !== i);
              updateItems(items);
            }}
            className="text-red-500"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={() => updateItems([...p.items, ""])}
        className="text-blue-600 hover:underline text-sm mb-4"
      >
        Item toevoegen
      </button>

      <label className="block mb-1">Font size</label>
      <input
        type="number"
        value={p.fontSize}
        onChange={(e) => updateProp("fontSize", +e.target.value)}
        className="w-full border px-2 py-1 rounded mb-4"
      />

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="block mb-1">Tekstkleur</label>
          <input
            type="color"
            value={p.color}
            onChange={(e) => updateProp("color", e.target.value)}
            className="w-full h-10"
          />
        </div>
        <div>
          <label className="block mb-1">Achtergrond</label>
          <input
            type="color"
            value={p.bg}
            onChange={(e) => updateProp("bg", e.target.value)}
            className="w-full h-10"
          />
        </div>
      </div>
    </div>
);
}
export default ChecklistSettings;
