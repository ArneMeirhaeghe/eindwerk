// File: src/components/livesession/inputs/Dropdown.tsx

import type { FC } from "react";

interface Props {
  label: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange: (v: string) => void;
}

const Dropdown: FC<Props> = ({
  label,
  options,
  placeholder,
  required,
  value = "",
  onChange,
}) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>
        {placeholder || "Selecteer…"}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default Dropdown;
