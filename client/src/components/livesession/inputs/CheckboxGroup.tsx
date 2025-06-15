import type { FC } from "react"
import { CheckIcon } from "lucide-react"

interface Props {
  label: string
  options: string[]
  required?: boolean
  values?: string[]
  onChange: (v: string[]) => void
}

const CheckboxGroup: FC<Props> = ({
  label,
  options,
  required,
  values = [],
  onChange,
}) => {
  const toggle = (opt: string) =>
    values.includes(opt)
      ? onChange(values.filter(v => v !== opt))
      : onChange([...values, opt])

  return (
    <fieldset className="mb-6">
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </legend>
      <div className="space-y-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`w-full flex justify-between items-center px-4 py-2 text-sm rounded-lg border transition ${
              values.includes(opt)
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
            }`}
          >
            <span>{opt}</span>
            {values.includes(opt) && <CheckIcon size={16} className="text-blue-600" />}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export default CheckboxGroup
