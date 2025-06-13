import type { FC } from "react";
import type { ComponentItem } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const defaultProps = {
  color: "#e5e7eb", // grijs-300
  thickness: 2,
};

const DividerSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p = { ...defaultProps, ...comp.props };

  const updateProp = (key: keyof typeof p, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div className="space-y-6 p-4">
      {/* Kleur */}
      <div>
        <label className="block mb-1 font-medium">Kleur</label>
        <input
          type="color"
          value={p.color}
          onChange={(e) => updateProp("color", e.target.value)}
          className="w-full h-10"
        />
      </div>

      {/* Dikte */}
      <div>
        <label className="block mb-1 font-medium">Dikte (px)</label>
        <input
          type="number"
          value={p.thickness}
          onChange={(e) => updateProp("thickness", +e.target.value)}
          className="w-full border border-gray-300 px-2 py-1 rounded"
        />
      </div>
    </div>
  );
};

export default DividerSettings;
