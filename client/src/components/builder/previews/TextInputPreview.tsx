import React from "react";
import type { TextInputProps } from "../../../types/types";

const defaultProps: Required<TextInputProps> = {
  label: "Naam",
  placeholder: "Vul je naam in",
  required: false,
  defaultValue: "",
};

const TextInputPreview: React.FC<{ p: Partial<TextInputProps> }> = ({ p }) => {
  const props = { ...defaultProps, ...p };

  return (
    <div className="mb-4">
      {props.label && (
        <label className="block mb-1 font-medium">
          {props.label}
          {props.required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <input
        type="text"
        disabled
        placeholder={props.placeholder}
        value={props.defaultValue}
        className="w-full border rounded px-2 py-1 bg-gray-100"
        aria-label={props.label}
      />
    </div>
  );
};

export default TextInputPreview;
