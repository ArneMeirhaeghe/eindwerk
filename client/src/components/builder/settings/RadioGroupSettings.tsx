import type { FC } from "react";
import type { ComponentItem, RadioGroupProps } from "../../../types/types";

const defaultProps: Required<RadioGroupProps> = {
  label: "Kies een optie",
  options: ["Optie 1", "Optie 2"],
  required: false,
  defaultValue: "",
  layout: "vertical",
  gap: 8,
};

const RadioGroupSettings: FC<{
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}> = ({ comp, onUpdate }) => {
  const p: RadioGroupProps = { ...defaultProps, ...(comp.props as RadioGroupProps) };

  const upd = (key: keyof RadioGroupProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div className="space-y-6 p-4">
      {/* Label */}
      <div>
        <label className="block mb-1 font-medium">Label</label>
        <input
          type="text"
          value={p.label}
          onChange={(e) => upd("label", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* Opties */}
      <div>
        <label className="block mb-1 font-medium">Opties (één per regel)</label>
        <textarea
          rows={3}
          value={p.options.join("\n")}
          onChange={(e) => upd("options", e.target.value.split("\n"))}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* Verplicht */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={p.required}
          onChange={(e) => upd("required", e.target.checked)}
          className="h-4 w-4"
        />
        <span>Verplicht veld</span>
      </label>

      {/* Standaardwaarde */}
      <div>
        <label className="block mb-1 font-medium">Standaardwaarde</label>
        <input
          type="text"
          value={p.defaultValue}
          onChange={(e) => upd("defaultValue", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* Layout keuze */}
      <div>
        <label className="block mb-1 font-medium">Weergave</label>
        <select
          value={p.layout}
          onChange={(e) => upd("layout", e.target.value as "vertical" | "horizontal")}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="vertical">Onder elkaar</option>
          <option value="horizontal">Naast elkaar</option>
        </select>
      </div>

      {/* Gap (alleen bij horizontal) */}
      {p.layout === "horizontal" && (
        <div>
          <label className="block mb-1 font-medium">Tussenruimte (gap in px)</label>
          <input
            type="number"
            min={0}
            value={p.gap}
            onChange={(e) => upd("gap", +e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
      )}
    </div>
  );
};

export default RadioGroupSettings;
