import type { FC } from "react"

interface Props {
  label: string
  options: string[]
  required?: boolean
  value?: string
  onChange: (v: string) => void
}

const RadioGroup: FC<Props> = ({
  label,
  options,
  required,
  value,
  onChange,
}) => (
  <fieldset className="mb-6">
    <legend className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </legend>
    <div className="space-y-2">
      {options.map(opt => (
        <label
          key={opt}
          className="flex items-center space-x-2 text-sm text-gray-800"
        >
          <input
            type="radio"
            name={label}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-300"
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  </fieldset>
)

export default RadioGroup
