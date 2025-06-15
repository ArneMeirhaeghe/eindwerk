import type { FC } from "react"

interface Props {
  label: string
  placeholder?: string
  required?: boolean
  value?: string
  onChange: (v: string) => void
}

const TextInput: FC<Props> = ({
  label,
  placeholder,
  required,
  value = "",
  onChange,
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
)

export default TextInput
