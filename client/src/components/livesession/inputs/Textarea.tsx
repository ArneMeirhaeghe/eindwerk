// File: src/components/livesession/inputs/Textarea.tsx

import type { FC } from "react";

interface Props {
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  rows?: number;
  onChange: (v: string) => void;
}

const Textarea: FC<Props> = ({
  label,
  placeholder,
  required,
  value = "",
  rows = 4,
  onChange,
}) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default Textarea;
