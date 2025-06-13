import  { type FC } from "react";
import type { CheckboxListItem, ComponentItem } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const defaultProps = {
  items: [{ label: "Voorbeeld", good: true }],
  color: "#000000",
  bg: "#ffffff",
};

const CheckboxListSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p = { ...defaultProps, ...comp.props };

  const updateItems = (items: CheckboxListItem[]) =>
    onUpdate({ ...comp, props: { ...p, items } });

  const updateProp = <K extends keyof typeof p>(key: K, value: typeof p[K]) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div className="space-y-6 p-4">
      {/* Kleurinstellingen */}
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

      {/* Items bewerken */}
      <div>
        <h3 className="text-md font-semibold mb-2">Checklist items</h3>

        {p.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={item.label}
              placeholder={`Item ${i + 1}`}
              onChange={(e) => {
                const items = [...p.items];
                items[i] = { ...items[i], label: e.target.value };
                updateItems(items);
              }}
              className="flex-1 border border-gray-300 px-2 py-1 rounded"
            />

            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={item.good}
                onChange={(e) => {
                  const items = [...p.items];
                  items[i] = { ...items[i], good: e.target.checked };
                  updateItems(items);
                }}
              />
              Goed
            </label>

            <button
              onClick={() =>
                updateItems(p.items.filter((_, idx) => idx !== i))
              }
              className="text-red-500 text-lg leading-none px-2 hover:opacity-80"
              aria-label="Verwijder item"
            >
              ×
            </button>
          </div>
        ))}

        {/* Item toevoegen */}
        <button
          onClick={() =>
            updateItems([...p.items, { label: "", good: false }])
          }
          className="text-blue-600 hover:underline text-sm mt-2"
        >
          Item toevoegen
        </button>
      </div>
    </div>
  );
};

export default CheckboxListSettings;
