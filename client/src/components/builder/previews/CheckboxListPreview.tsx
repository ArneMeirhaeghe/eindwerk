// import React from "react";
// import type { CheckboxListProps } from "../../../types/types";

// const defaultProps: CheckboxListProps & { color?: string; bg?: string } = {
//   items: [{ label: "Voorbeeld 1", good: false }],
//   color: "#000000",
//   bg: "#ffffff",
// };

// const CheckboxListPreview: React.FC<{ p: Partial<CheckboxListProps> & { color?: string; bg?: string } }> = ({ p }) => {
//   const props = { ...defaultProps, ...p };

//   return (
//     <div
//       className="mb-4 space-y-2 p-3 rounded"
//       style={{ backgroundColor: props.bg, color: props.color }}
//     >
//       {props.items.map((it, i) => (
//         <label key={i} className="flex items-center space-x-2 text-sm">
//           <input
//             type="checkbox"
//             disabled
//             defaultChecked={it.good}
//             className="form-checkbox text-blue-600"
//           />
//           <span>{it.label}</span>
//         </label>
//       ))}
//     </div>
//   );
// };

// export default CheckboxListPreview;
