// File: src/components/livesession/inputs/FormResponseSummary.tsx
import React, { type FC } from "react"
import type { FormDto, FieldDto } from "../../../api/forms/types"

interface Props {
  form: FormDto
  values: Record<string, any>
}

const FormResponseSummary: FC<Props> = ({ form, values }) => (
  <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded shadow-inner">
    <h3 className="text-lg font-semibold">{form.name} (overzicht)</h3>
    {form.fields.map((f: FieldDto) => {
      const val = values[f.id]
      return (
        <div key={f.id} className="flex flex-col md:flex-row md:items-start space-y-1 md:space-y-0 md:space-x-4">
          <span className="font-medium w-32">{f.label}:</span>
          <div className="flex-1">
            {f.type === "uploadzone" && val?.url ? (
              <img src={val.url} alt={f.label} className="max-w-xs rounded" />
            ) : Array.isArray(val) ? (
              <ul className="list-disc list-inside">
                {val.map((v: any, i: number) => <li key={i}>{v}</li>)}
              </ul>
            ) : (
              <span className="break-words">{val ?? "-"}</span>
            )}
          </div>
        </div>
      )
    })}
  </div>
)

export default FormResponseSummary
