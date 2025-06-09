// File: src/components/livesession/inputs/CheckboxGroup.tsx

import type { FC } from "react";

interface Props {
  label: string;
  options: string[];
  required?: boolean;
  values?: string[];
  onChange: (v: string[]) => void;
}

const CheckboxGroup: FC<Props> = ({
  label,
  options,
  required,
  values = [],
  onChange,
}) => {
  const toggle = (opt: string) => {
    if (values.includes(opt)) {
      onChange(values.filter((v) => v !== opt));
    } else {
      onChange([...values, opt]);
    }
  };
  return (
    <fieldset className="mb-4">
      <legend className="font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </legend>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              value={opt}
              checked={values.includes(opt)}
              onChange={() => toggle(opt)}
              className="form-checkbox"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

export default CheckboxGroup;
