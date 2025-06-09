// File: src/components/livesession/inputs/TextInput.tsx

import type { FC } from "react";

interface Props {
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange: (v: string) => void;
}

const TextInput: FC<Props> = ({
  label,
  placeholder,
  required,
  value = "",
  onChange,
}) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default TextInput;
