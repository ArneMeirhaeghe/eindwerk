import type { FC, ChangeEvent } from "react";
import type { ComponentItem } from "../../../types/types";

type ButtonFunctionType = "dummy" | "link";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const defaultProps = {
  label: "Klik hier",
  fontSize: 16,
  color: "#ffffff",
  bg: "#3b82f6",
  radius: 8,
  bold: false,
  italic: false,
  underline: false,
  functionType: "dummy" as ButtonFunctionType,
  url: "",
  align: "center" as "left" | "center" | "right",
};

const ButtonSettings: FC<Props> = ({ comp, onUpdate }) => {
  const p = { ...defaultProps, ...comp.props };

  const updateProp = (key: string, value: any) =>
    onUpdate({ ...comp, props: { ...p, [key]: value } });

  const handleFunctionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const fn = e.target.value as ButtonFunctionType;
    updateProp("functionType", fn);
    if (fn !== "link") updateProp("url", "");
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="p-4 space-y-6 overflow-auto">
      {/* Preview */}
      <div className="flex justify-center py-2">
        <button
          className="px-4 py-2 transition-shadow"
          style={{
            color: p.color,
            backgroundColor: p.bg,
            fontSize: `${p.fontSize}px`,
            borderRadius: `${p.radius}px`,
            fontWeight: p.bold ? "bold" : "normal",
            fontStyle: p.italic ? "italic" : "normal",
            textDecoration: p.underline ? "underline" : "none",
          }}
        >
          {p.label}
        </button>
      </div>

      {/* Tekstinstellingen */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold">Tekstinstellingen</h3>

        <input
          type="text"
          className="w-full border border-gray-300 rounded px-2 py-1"
          placeholder="Voer knoptekst in"
          value={p.label}
          onChange={(e) => updateProp("label", e.target.value)}
        />

        <div>
          <label className="block mb-1 font-medium">Lettergrootte (px)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-2 py-1"
            placeholder="16"
            value={p.fontSize}
            onChange={(e) => updateProp("fontSize", +e.target.value)}
          />
        </div>
      </div>

      {/* Stijlinstellingen */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold">Stijlinstellingen</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Tekstkleur</label>
            <input
              type="color"
              className="w-full h-10"
              value={p.color}
              onChange={(e) => updateProp("color", e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Achtergrondkleur</label>
            <input
              type="color"
              className="w-full h-10"
              value={p.bg}
              onChange={(e) => updateProp("bg", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Radius (px)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-2 py-1"
            placeholder="8"
            value={p.radius}
            onChange={(e) => updateProp("radius", +e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-4">
          {(["bold", "italic", "underline"] as const).map((style) => (
            <label key={style} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={p[style]}
                onChange={(e) => updateProp(style, e.target.checked)}
                className="h-4 w-4"
              />
              <span className="capitalize">{style}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Uitlijning */}
      <div className="space-y-2">
        <h3 className="text-md font-semibold">Uitlijning</h3>
        <select
          value={p.align}
          onChange={(e) => updateProp("align", e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 bg-white"
        >
          <option value="left">Links</option>
          <option value="center">Centreren</option>
          <option value="right">Rechts</option>
        </select>
      </div>

      {/* Actie-instellingen */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold">Actie-instellingen</h3>

        <select
          value={p.functionType}
          onChange={handleFunctionChange}
          className="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50"
        >
          <option value="dummy">Dummy knop (geen actie)</option>
          <option value="link">Link</option>
        </select>

        {p.functionType === "link" && (
          <div>
            <label className="block mb-1 font-medium">URL</label>
            <input
              type="url"
              placeholder="https://voorbeeld.nl"
              className={`w-full border rounded px-2 py-1 ${
                p.url && !isValidUrl(p.url) ? "border-red-500" : "border-gray-300"
              }`}
              value={p.url}
              onChange={(e) => updateProp("url", e.target.value)}
            />
            {p.url && !isValidUrl(p.url) && (
              <span className="text-red-500 text-sm">Ongeldige URL.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ButtonSettings;
