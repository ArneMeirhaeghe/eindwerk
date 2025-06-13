import React from "react";
import type { DividerProps } from "../../../types/types";

const defaultProps: DividerProps = {
  color: "#e5e7eb", // grijs-300
  thickness: 2,
};

const DividerPreview: React.FC<{ p: Partial<DividerProps> }> = ({ p }) => {
  const props = { ...defaultProps, ...p };

  return (
    <hr
      className="mb-4 border-t-0"
      style={{
        borderTopColor: props.color,
        borderTopWidth: `${props.thickness}px`,
      }}
    />
  );
};

export default DividerPreview;
