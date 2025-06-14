// import React from "react";
// import type { CheckboxGroupProps } from "../../../types/types";

// interface Props {
//   p: Partial<CheckboxGroupProps> & { [key: string]: any };
// }

// export const CheckboxGroupPreview: React.FC<Props> = ({ p }) => {
//   const label = p.label ?? "Meerkeuze";
//   const options = p.options ?? ["Optie 1", "Optie 2", "Optie 3"];
//   const required = !!p.required;

//   return (
//     <div className="space-y-2">
//       {/* Groepslabel */}
//       <label className="block font-medium text-sm text-gray-700">
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>

//       {/* Checkbox opties */}
//       <div className="space-y-1 pl-1">
//         {options.map((opt, idx) => (
//           <label
//             key={idx}
//             className="flex items-center space-x-2 text-gray-800"
//           >
//             <input
//               type="checkbox"
//               disabled
//               className="form-checkbox text-blue-600"
//             />
//             <span className="text-sm">{opt}</span>
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };
