import type { FC } from "react"

interface Props {
  label: string
  placeholder?: string
  required?: boolean
  value?: string
  rows?: number
  onChange: (v: string) => void
}

const Textarea: FC<Props> = ({
  label,
  placeholder,
  required,
  value = "",
  rows = 4,
  onChange,
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
)

export default Textarea
