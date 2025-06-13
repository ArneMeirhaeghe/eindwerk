import type { FC } from "react";
import type { ComponentItem } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const defaultProps = {
  items: ["Voorbeeld 1", "Voorbeeld 2"],
  fontSize: 16,
  color: "#000000",
  bg: "#ffffff",
};

const ChecklistSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p = { ...defaultProps, ...comp.props };

  const updateItems = (items: string[]) =>
    onUpdate({ ...comp, props: { ...p, items } });

  const updateProp = (key: keyof typeof p, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div className="space-y-6 p-4">
      {/* Checklist items */}
      <div>
        <h3 className="text-md font-semibold mb-2">Checklist</h3>
        {p.items.map((item: string, i: number) => (
          <div key={i} className="flex items-center mb-2 gap-2">
            <input
              type="text"
              value={item}
              placeholder={`Item ${i + 1}`}
              onChange={(e) => {
                const items = [...p.items];
                items[i] = e.target.value;
                updateItems(items);
              }}
              className="flex-1 border border-gray-300 px-2 py-1 rounded"
            />
            <button
              onClick={() =>
                updateItems(p.items.filter((_, idx) => idx !== i))
              }
              className="text-red-500 text-lg px-2 hover:opacity-80"
              aria-label="Verwijder item"
            >
              ×
            </button>
          </div>
        ))}

        <button
          onClick={() => updateItems([...p.items, ""])}
          className="text-blue-600 hover:underline text-sm mt-1"
        >
          Item toevoegen
        </button>
      </div>

      {/* Lettergrootte */}
      <div>
        <label className="block mb-1 font-medium">Lettergrootte (px)</label>
        <input
          type="number"
          value={p.fontSize}
          onChange={(e) => updateProp("fontSize", +e.target.value)}
          className="w-full border border-gray-300 px-2 py-1 rounded"
        />
      </div>

      {/* Kleuren */}
      <div>
        <h3 className="text-md font-semibold mb-2">Kleuren</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Tekstkleur</label>
            <input
              type="color"
              value={p.color}
              onChange={(e) => updateProp("color", e.target.value)}
              className="w-full h-10"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Achtergrondkleur</label>
            <input
              type="color"
              value={p.bg}
              onChange={(e) => updateProp("bg", e.target.value)}
              className="w-full h-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistSettings;
