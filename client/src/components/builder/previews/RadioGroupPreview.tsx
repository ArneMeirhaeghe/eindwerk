import React from "react";
import type { RadioGroupProps } from "../../../types/types";

const defaultProps: Required<RadioGroupProps> = {
  label: "Kies een optie",
  options: ["Optie 1", "Optie 2"],
  required: false,
  defaultValue: "",
  layout: "vertical",
  gap: 8,
};

const RadioGroupPreview: React.FC<{ p: Partial<RadioGroupProps> }> = ({ p }) => {
  const props = { ...defaultProps, ...p };

  const wrapperStyle: React.CSSProperties =
    props.layout === "horizontal"
      ? { display: "flex", gap: `${props.gap}px`, flexWrap: "wrap" }
      : { display: "flex", flexDirection: "column", gap: "0.5rem" };

  return (
    <fieldset className="mb-4">
      {props.label && (
        <legend className="mb-2 font-medium">
          {props.label}
          {props.required && <span className="text-red-500"> *</span>}
        </legend>
      )}
      <div style={wrapperStyle}>
        {props.options.map((opt, idx) => (
          <label key={idx} className="inline-flex items-center space-x-2">
            <input
              type="radio"
              disabled
              name={props.label}
              value={opt}
              checked={props.defaultValue === opt}
              className="form-radio"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

export default RadioGroupPreview;
