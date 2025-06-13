import type { FC, ChangeEvent } from "react";
import type { ComponentItem, DropdownProps } from "../../../types/types";

const defaultProps: DropdownProps = {
  label: "Maak een keuze",
  placeholder: "Selecteer...",
  options: ["Optie 1", "Optie 2"],
  defaultValue: "",
  required: false,
};

const DropdownSettings: FC<{
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}> = ({ comp, onUpdate }) => {
  const p: DropdownProps = { ...defaultProps, ...comp.props };

  const updateProp = (key: keyof DropdownProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  const handleOptionsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value
      .split("\n")
      .map((opt) => opt.trim())
      .filter(Boolean);
    updateProp("options", lines);
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
          className="w-full border border-gray-300 px-2 py-1 rounded"
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
          className="w-full border border-gray-300 px-2 py-1 rounded"
        />
      </div>

      {/* Opties */}
      <div>
        <label className="block mb-1 font-medium">Opties (één per regel)</label>
        <textarea
          rows={3}
          value={p.options.join("\n")}
          onChange={handleOptionsChange}
          className="w-full border border-gray-300 px-2 py-1 rounded"
        />
      </div>

      {/* Verplicht */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={p.required}
          onChange={(e) => updateProp("required", e.target.checked)}
        />
        <span className="text-sm">Verplicht veld</span>
      </div>

      {/* Default waarde */}
      <div>
        <label className="block mb-1 font-medium">Standaardwaarde</label>
        <input
          type="text"
          value={p.defaultValue ?? ""}
          onChange={(e) => updateProp("defaultValue", e.target.value)}
          placeholder="Bijv. Optie 1"
          className="w-full border border-gray-300 px-2 py-1 rounded"
        />
      </div>
    </div>
  );
};

export default DropdownSettings;
