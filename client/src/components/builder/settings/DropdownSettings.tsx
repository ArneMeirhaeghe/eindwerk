import type { FC } from "react";
import type { ComponentItem, DropdownProps } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const defaultProps: Required<DropdownProps> = {
  label: "Maak een keuze",
  placeholder: "Selecteer...",
  options: ["Optie 1", "Optie 2"],
  defaultValue: "",
  required: false,
};

const DropdownSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p: DropdownProps = { ...defaultProps, ...comp.props };

  const updateProp = (key: keyof DropdownProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  const updateOption = (idx: number, value: string) => {
    const opts = [...p.options];
    opts[idx] = value;
    updateProp("options", opts);
  };

  const addOption = () =>
    updateProp("options", [...p.options, `Optie ${p.options.length + 1}`]);

  const removeOption = (idx: number) => {
    const opts = p.options.filter((_, i) => i !== idx);
    updateProp("options", opts);
    // clear defaultValue als die net verwijderd is
    if (p.defaultValue === p.options[idx]) {
      updateProp("defaultValue", "");
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Label */}
      <div>
        <label className="block mb-1 font-medium">Label</label>
        <input
          type="text"
          value={p.label}
          onChange={(e) => updateProp("label", e.target.value)}
          placeholder="Bijv. Welke opleiding volg je?"
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* Placeholder */}
      <div>
        <label className="block mb-1 font-medium">Placeholder</label>
        <input
          type="text"
          value={p.placeholder}
          onChange={(e) => updateProp("placeholder", e.target.value)}
          placeholder="Bijv. Selecteer een optie"
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* Dynamische Opties */}
      <div>
        <label className="block mb-1 font-medium">Opties</label>
        {p.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Optie ${i + 1}`}
              className="flex-1 border px-2 py-1 rounded"
            />
            <button
              type="button"
              onClick={() => removeOption(i)}
              className="text-red-500 text-sm"
            >
              Verwijder
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addOption}
          className="text-blue-500 text-sm"
        >
          + Voeg optie toe
        </button>
      </div>

      {/* Verplicht */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={p.required}
          onChange={(e) => updateProp("required", e.target.checked)}
        />
        <span className="text-sm">Verplicht veld</span>
      </div>

      {/* Standaardwaarde */}
      <div>
        <label className="block mb-1 font-medium">Standaardwaarde</label>
        <select
          value={p.defaultValue}
          onChange={(e) => updateProp("defaultValue", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="">{p.placeholder}</option>
          {p.options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DropdownSettings;
