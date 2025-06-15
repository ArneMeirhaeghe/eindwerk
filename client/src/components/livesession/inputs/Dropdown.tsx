import type { FC } from "react"

interface Props {
  label: string
  options: string[]
  placeholder?: string
  required?: boolean
  value?: string
  onChange: (v: string) => void
}

const Dropdown: FC<Props> = ({
  label,
  options,
  placeholder,
  required,
  value = "",
  onChange,
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="" disabled>
        {placeholder || "Selecteer…"}
      </option>
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
)

export default Dropdown
