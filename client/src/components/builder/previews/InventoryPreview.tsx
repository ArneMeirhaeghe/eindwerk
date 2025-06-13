import React, { useEffect, useState, type FC } from "react";
import { getInventoryTemplate } from "../../../api/inventory";
import type {
  InventoryItem,
  InventoryTemplateDto,
  Lokaal,
  Subsection,
} from "../../../api/inventory/types";

interface Props {
  p: {
    templateId?: string;
    selectedLokalen?: string[];
    selectedSubs?: Record<string, string[]>;
    interactive?: boolean;
  };
}

const InventoryPreview: FC<Props> = ({ p }) => {
  const {
    templateId,
    selectedLokalen = [],
    selectedSubs = {},
    interactive = false,
  } = p;

  const [tmpl, setTmpl] = useState<InventoryTemplateDto | null>(null);

  useEffect(() => {
    if (!templateId) return setTmpl(null);
    getInventoryTemplate(templateId)
      .then(setTmpl)
      .catch(() => setTmpl(null));
  }, [templateId]);

  if (!templateId) {
    return (
      <div className="italic text-gray-400 mb-2">Kies eerst een template</div>
    );
  }

  if (!tmpl) {
    return (
      <div className="italic text-gray-400 mb-2">Template wordt geladen…</div>
    );
  }

  const lokalenToShow = tmpl.lokalen.filter((l) =>
    selectedLokalen.includes(l.name)
  );

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-6">
      <h4 className="text-lg font-semibold text-gray-800">{tmpl.naam}</h4>

      {lokalenToShow.map((lokaal) => {
        const subsToShow = lokaal.subsections.filter((sub) =>
          (selectedSubs[lokaal.name] || []).includes(sub.name)
        );

        return (
          <details key={lokaal.name} className="border rounded overflow-hidden">
            <summary className="px-3 py-2 bg-gray-100 font-medium cursor-pointer">
              {lokaal.name}
            </summary>
            <div className="p-3 space-y-4">
              {subsToShow.map((sub) => (
                <div key={sub.name} className="space-y-2">
                  <div className="font-medium text-gray-700">{sub.name}</div>
                  <table className="w-full text-sm table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-200 text-gray-700">
                        <th className="text-left px-2 py-1">Item</th>
                        <th className="text-left px-2 py-1">Gewenst</th>
                        {interactive && (
                          <th className="text-left px-2 py-1">Invulveld</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {sub.items.map((it, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-2 py-1">{it.name}</td>
                          <td className="px-2 py-1">{it.desired}</td>
                          {interactive && (
                            <td className="px-2 py-1">
                              <input
                                type="number"
                                disabled
                                placeholder="…"
                                className="w-20 border rounded px-2 py-1 text-center bg-white"
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
};

export default InventoryPreview;
