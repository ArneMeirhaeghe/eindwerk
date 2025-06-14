import  { useEffect, useState } from "react";
import type { ComponentItem } from "../../../types/types";
import type { FormDto } from "../../../api/forms/types";
import { getForms } from "../../../api/forms";

export default function FormSettings({
  comp,
  onUpdate,
}: {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}) {
  const [forms, setForms] = useState<FormDto[]>([]);

  useEffect(() => {
    getForms().then(setForms).catch(() => setForms([]));
  }, []);

  const handleChange = (formId: string) => {
    onUpdate({
      ...comp,
      props: { ...comp.props, formId },
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Koppel formulier
        </label>
        <select
          value={comp.props.formId ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white"
        >
          <option value="">— Kies formulier —</option>
          {forms.length > 0 ? (
            forms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))
          ) : (
            <option disabled>(geen formulieren beschikbaar)</option>
          )}
        </select>
      </div>
    </div>
  );
}
