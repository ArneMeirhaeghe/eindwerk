// File: src/components/builder/previews/InventoryPreview.tsx
import React, { useEffect, useState, type FC } from "react"
import { getInventoryTemplate } from "../../../api/inventory"
import type { InventoryTemplateDto } from "../../../api/inventory/types"

interface Props {
  p: {
    templateId?: string
  }
}

const InventoryPreview: FC<Props> = ({ p }) => {
  const [tmpl, setTmpl] = useState<InventoryTemplateDto | null>(null)

  useEffect(() => {
    if (p.templateId) {
      getInventoryTemplate(p.templateId).then(setTmpl)
    }
  }, [p.templateId])

  if (!p.templateId) {
    return <div className="italic text-gray-500">Kies een inventaris-template</div>
  }
  if (!tmpl) {
    return <div className="italic text-gray-500">Template laden…</div>
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-4">
      <h4 className="font-semibold text-lg">{tmpl.naam}</h4>
      {tmpl.lokalen.map((l, i) => (
        <details key={i} className="border rounded">
          <summary className="px-3 py-1 bg-gray-100 cursor-pointer">
            {l.name}
          </summary>
          {l.subsections.map((s, si) => (
            <div key={si} className="pl-4 py-2">
              <div className="font-medium mb-1">{s.name}</div>
              <ul className="list-disc list-inside space-y-1">
                {s.items.map((it, j) => (
                  <li key={j}>
                    {it.name} — gewenst: {it.desired}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </details>
      ))}
    </div>
  )
}

export default InventoryPreview
