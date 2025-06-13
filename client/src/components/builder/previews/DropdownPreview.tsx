import React from "react";
import type { DropdownProps } from "../../../types/types";

const defaultProps: DropdownProps = {
  label: "Kies een optie",
  options: ["Optie 1", "Optie 2"],
  placeholder: "Selecteer...",
  defaultValue: "",
  required: false,
};

const DropdownPreview: React.FC<{ p: Partial<DropdownProps> }> = ({ p }) => {
  const props = { ...defaultProps, ...p };

  const showPlaceholder = props.placeholder && !props.defaultValue;

  return (
    <div className="mb-4">
      {props.label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {props.label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        disabled
        value={props.defaultValue || ""}
        className="w-full border border-gray-300 rounded px-2 py-1 bg-white text-sm"
      >
        {showPlaceholder && (
          <option value="" disabled hidden>
            {props.placeholder}
          </option>
        )}
        {props.options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownPreview;
