// File: src/components/livesession/inputs/RadioGroup.tsx

import type { FC } from "react";

interface Props {
  label: string;
  options: string[];
  required?: boolean;
  value?: string;
  onChange: (v: string) => void;
}

const RadioGroup: FC<Props> = ({
  label,
  options,
  required,
  value,
  onChange,
}) => (
  <fieldset className="mb-4">
    <legend className="font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </legend>
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="inline-flex items-center space-x-2">
          <input
            type="radio"
            name={label}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="form-radio"
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  </fieldset>
);

export default RadioGroup;
