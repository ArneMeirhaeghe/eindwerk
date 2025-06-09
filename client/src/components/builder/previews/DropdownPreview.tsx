import React from "react";

interface Props {
  p: {
    label?: string;
    options?: string[];
    placeholder?: string;
    defaultValue?: string;
    required?: boolean;
  };
}

export default function DropdownPreview({ p }: Props) {
  const options = p.options || [];
  const value = p.defaultValue || "";

  return (
    <div className="mb-4">
      {p.label && <label className="block mb-1 text-sm">{p.label}</label>}
      <select
        value={value}
        disabled
        className="w-full border rounded px-2 py-1"
      >
        {p.placeholder && !value && (
          <option value="" disabled hidden>
            {p.placeholder}
          </option>
        )}
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
