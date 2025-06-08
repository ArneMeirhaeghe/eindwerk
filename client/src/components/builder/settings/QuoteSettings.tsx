// File: src/components/settings/QuoteSettings.tsx

import type { FC } from "react";
import type { ComponentItem, QuoteProps } from "../../../types/types";

interface Props {
  comp: ComponentItem;
  onUpdate: (c: ComponentItem) => void;
}

const QuoteSettings: FC<Props> = ({ comp, onUpdate }) => {
  // We proberen alle props uit comp.props te fetchen, maar valbacks naar lege string/nummer
  const p = comp.props as Partial<QuoteProps>;

  // Helper om één sleutel te updaten
  const upd = (key: keyof QuoteProps, value: any) =>
    onUpdate({
      ...comp,
      props: { 
        // Kopieer bestaande props, en overschrijf enkel het key-veld
        ...(p as QuoteProps), 
        [key]: value 
      },
    });

  return (
    <div className="space-y-4">
      {/* 1) Quote-tekst */}
      <div>
        <label className="block mb-1">Quote</label>
        <textarea
          // Fallback naar lege string als p.text undefined is
          value={p.text ?? ""}
          onChange={(e) => upd("text", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* 2) Auteur */}
      <div>
        <label className="block mb-1">Auteur</label>
        <input
          type="text"
          // Fallback naar lege string
          value={p.author ?? ""}
          onChange={(e) => upd("author", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* 3) Font-size */}
      <div>
        <label className="block mb-1">Grootte (px)</label>
        <input
          type="number"
          min={14}
          // Fallback naar 14 als p.fontSize undefined is
          value={p.fontSize ?? 14}
          onChange={(e) => {
            const num = parseInt(e.target.value, 10);
            // Als parseInt faalt (bv. lege waarde), val terug op 14
            upd("fontSize", isNaN(num) ? 14 : num);
          }}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* 4) Kleur */}
      <div>
        <label className="block mb-1">Kleur</label>
        <input
          type="color"
          // Fallback naar zwart ("#000000") als p.color undefined is
          value={p.color ?? "#000000"}
          onChange={(e) => upd("color", e.target.value)}
          className="w-full h-10"
        />
      </div>

      {/* 5) Uitlijning */}
      <div>
        <label className="block mb-1">Uitlijning</label>
        <select
          // Fallback naar "left" als p.align undefined is
          value={p.align ?? "left"}
          onChange={(e) => upd("align", e.target.value as QuoteProps["align"])}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="left">Links</option>
          <option value="center">Centreren</option>
          <option value="right">Rechts</option>
        </select>
      </div>

      {/* 6) Italic */}
      <label className="flex items-center space-x-1">
        <input
          type="checkbox"
          // Fallback naar false als p.italic undefined is
          checked={p.italic ?? false}
          onChange={(e) => upd("italic", e.target.checked)}
        />
        <span>Italic</span>
      </label>
    </div>
  );
};

export default QuoteSettings;
