import type { FC } from "react";
import type { ComponentItem, UploadZoneProps } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const defaultProps: Required<UploadZoneProps> = {
  label: "Sleep hier je bestand naartoe of klik om te kiezen",
};

const UploadZoneSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p: UploadZoneProps = { ...defaultProps, ...(comp.props as UploadZoneProps) };

  const upd = (key: keyof UploadZoneProps, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  return (
    <div className="space-y-4 p-4">
      {/* Labeltekst */}
      <div>
        <label className="block mb-1 font-medium">Label uploadzone</label>
        <input
          type="text"
          value={p.label}
          onChange={(e) => upd("label", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <p className="text-sm text-gray-500">
        Dit label wordt getoond in de preview.
      </p>
    </div>
  );
};

export default UploadZoneSettings;
