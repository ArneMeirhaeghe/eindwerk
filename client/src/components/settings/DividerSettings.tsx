// src/components/settings/DividerSettings.tsx
import React, { type FC } from "react";
import type { ComponentItem } from "../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const DividerSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p = comp.props as any;

  return (
    <div>
      {/* Kleur */}
      <label className="block mb-1">Kleur</label>
      <input
        type="color"
        value={p.color}
        onChange={(e) =>
          onUpdate({ ...comp, props: { ...p, color: e.target.value } })
        }
        className="w-full h-10 mb-4"
      />

      {/* Dikte */}
      <label className="block mb-1">Dikte</label>
      <input
        type="number"
        value={p.thickness}
        onChange={(e) =>
          onUpdate({ ...comp, props: { ...p, thickness: +e.target.value } })
        }
        className="w-full border px-2 py-1 rounded mb-4"
      />
    </div>
);
}
export default DividerSettings;
