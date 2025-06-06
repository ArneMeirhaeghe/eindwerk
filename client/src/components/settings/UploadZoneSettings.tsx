// File: client/src/components/settings/UploadZoneSettings.tsx
import type { FC } from "react";
import type { ComponentItem, UploadZoneProps } from "../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const UploadZoneSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p = comp.props as UploadZoneProps;
  const upd = (key: keyof UploadZoneProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div className="space-y-4">
      {/* Labeltekst */}
      <div>
        <label className="block mb-1">Label uploadzone</label>
        <input
          type="text"
          value={p.label}
          onChange={(e) => upd("label", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <p className="text-sm text-gray-500">
        Bezoekers zien deze label in de builder‐preview.
      </p>
    </div>
  );
};

export default UploadZoneSettings;
