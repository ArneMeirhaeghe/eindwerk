import React from "react";
import type { ChecklistProps } from "../../../types/types";

const defaultProps: ChecklistProps & { fontSize?: number; color?: string; bg?: string } = {
  items: ["Voorbeeld 1", "Voorbeeld 2"],
  fontSize: 16,
  color: "#000000",
  bg: "#ffffff",
};

const ChecklistPreview: React.FC<{ p: Partial<ChecklistProps> & { fontSize?: number; color?: string; bg?: string } }> = ({ p }) => {
  const props = { ...defaultProps, ...p };

  return (
    <div
      className="mb-4 p-3 rounded"
      style={{
        backgroundColor: props.bg,
        color: props.color,
        fontSize: `${props.fontSize}px`,
      }}
    >
      <ul className="list-disc pl-5 space-y-1">
        {props.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChecklistPreview;
