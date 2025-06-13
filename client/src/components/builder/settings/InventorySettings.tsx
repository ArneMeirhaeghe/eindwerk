import React, { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import type { ComponentItem, InventoryProps } from "../../../types/types";
import {
  getInventoryTemplates,
  getInventoryTemplate,
} from "../../../api/inventory";
import type {
  InventoryTemplateDto,
  Lokaal,
  Subsection,
} from "../../../api/inventory/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const defaultProps: Required<InventoryProps> = {
  templateId: "",
  selectedLokalen: [],
  selectedSubs: {},
  interactive: false,
};

const InventorySettings: FC<Props> = ({ comp, onUpdate }) => {
  const navigate = useNavigate();

  const inventoryProps = { ...defaultProps, ...(comp.props as InventoryProps) };

  const selectedId = inventoryProps.templateId;

  const [templates, setTemplates] = useState<InventoryTemplateDto[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [template, setTemplate] = useState<InventoryTemplateDto | null>(null);
  const [selectedLokalen, setSelectedLokalen] = useState<string[]>(
    inventoryProps.selectedLokalen
  );
  const [selectedSubs, setSelectedSubs] = useState<Record<string, string[]>>(
    inventoryProps.selectedSubs
  );
  const [interactive, setInteractive] = useState(inventoryProps.interactive);

  useEffect(() => {
    getInventoryTemplates()
      .then(setTemplates)
      .finally(() => setLoadingTemplates(false));
  }, []);

  useEffect(() => {
    if (selectedId) {
      getInventoryTemplate(selectedId).then((tpl) => {
        setTemplate(tpl);

        if (!comp.props.selectedLokalen) {
          const all = tpl.lokalen.map((l) => l.name);
          setSelectedLokalen(all);
          onUpdate({ ...comp, props: { ...inventoryProps, selectedLokalen: all } });
        }

        if (!comp.props.selectedSubs) {
          const init: Record<string, string[]> = {};
          tpl.lokalen.forEach((l) => {
            init[l.name] = l.subsections.map((s) => s.name);
          });
          setSelectedSubs(init);
          onUpdate({ ...comp, props: { ...inventoryProps, selectedSubs: init } });
        }
      });
    } else {
      setTemplate(null);
      setSelectedLokalen([]);
      setSelectedSubs({});
    }
  }, [selectedId]);

  if (loadingTemplates) {
    return <div className="p-4 text-gray-500">Laden…</div>;
  }

  return (
    <div className="space-y-6 p-4">
      {/* Link naar beheerpagina */}
      <button
        type="button"
        onClick={() => navigate("/admin/inventory")}
        className="w-full mb-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Beheer inventaris-templates
      </button>

      {/* Template selectie */}
      <div>
        <label className="block mb-1 font-medium">Template</label>
        <select
          value={selectedId ?? ""}
          onChange={(e) =>
            onUpdate({
              ...comp,
              props: { ...inventoryProps, templateId: e.target.value },
            })
          }
          className="w-full border rounded px-2 py-1"
        >
          <option value="">— Kies template —</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.naam}
            </option>
          ))}
        </select>
      </div>

      {/* Toggle invulvelden */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={interactive}
          onChange={(e) => {
            const next = e.target.checked;
            setInteractive(next);
            onUpdate({ ...comp, props: { ...inventoryProps, interactive: next } });
          }}
          className="h-4 w-4"
        />
        <span className="font-medium">Invulvelden tonen</span>
      </label>

      {/* Lokalen selectie */}
      {template && (
        <fieldset className="border rounded p-3">
          <legend className="px-1 font-medium">Toon lokalen</legend>
          {template.lokalen.map((l) => (
            <label key={l.name} className="flex items-center space-x-2 mb-1">
              <input
                type="checkbox"
                checked={selectedLokalen.includes(l.name)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...selectedLokalen, l.name]
                    : selectedLokalen.filter((n) => n !== l.name);
                  setSelectedLokalen(next);
                  onUpdate({
                    ...comp,
                    props: { ...inventoryProps, selectedLokalen: next },
                  });
                }}
                className="h-4 w-4"
              />
              <span>{l.name}</span>
            </label>
          ))}
        </fieldset>
      )}

      {/* Subsecties per lokaal */}
      {template &&
        selectedLokalen.map((lokaalName) => {
          const lokaal = template.lokalen.find((l) => l.name === lokaalName);
          const subs = selectedSubs[lokaalName] ?? [];

          if (!lokaal) return null;

          return (
            <fieldset key={lokaalName} className="border rounded p-3">
              <legend className="px-1 font-medium">
                Subsecties in {lokaalName}
              </legend>
              {lokaal.subsections.map((sub) => (
                <label
                  key={sub.name}
                  className="flex items-center space-x-2 mb-1"
                >
                  <input
                    type="checkbox"
                    checked={subs.includes(sub.name)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...subs, sub.name]
                        : subs.filter((n) => n !== sub.name);
                      const updated = { ...selectedSubs, [lokaalName]: next };
                      setSelectedSubs(updated);
                      onUpdate({
                        ...comp,
                        props: { ...inventoryProps, selectedSubs: updated },
                      });
                    }}
                    className="h-4 w-4"
                  />
                  <span>{sub.name}</span>
                </label>
              ))}
            </fieldset>
          );
        })}
    </div>
  );
};

export default InventorySettings;
