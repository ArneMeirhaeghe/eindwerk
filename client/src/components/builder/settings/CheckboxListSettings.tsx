// src/components/settings/CheckboxListSettings.tsx
import React, { type FC } from "react";
import type { ComponentItem, CheckboxListItem } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const CheckboxListSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p = comp.props as { items: CheckboxListItem[]; color: string; bg: string };

  const updateItems = (items: CheckboxListItem[]) =>
    onUpdate({ ...comp, props: { ...p, items } });
  const updateProp = <K extends keyof typeof p>(key: K, value: typeof p[K]) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div>
      {/* Globale kleurinstellingen */}
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

      {/* Items */}
      <label className="block mb-1">Items</label>
      {p.items.map((item, i) => (
        <div key={i} className="flex items-center mb-2 space-x-2">
          <input
            type="text"
            value={item.label}
            onChange={(e) => {
              const items = [...p.items];
              items[i] = { ...items[i], label: e.target.value };
              updateItems(items);
            }}
            className="flex-1 border px-2 py-1 rounded"
          />
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={item.good}
              onChange={(e) => {
                const items = [...p.items];
                items[i] = { ...items[i], good: e.target.checked };
                updateItems(items);
              }}
            />
            <span>Goed</span>
          </label>
          <button
            onClick={() => {
              const items = p.items.filter((_, idx) => idx !== i);
              updateItems(items);
            }}
            className="text-red-500"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={() =>
          updateItems([...p.items, { label: "", good: false }])
        }
        className="text-blue-600 hover:underline text-sm"
      >
        Item toevoegen
      </button>
    </div>
  );
};

export default CheckboxListSettings;
