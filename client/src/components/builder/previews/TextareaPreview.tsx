// import React from "react";
// import type { TextareaProps } from "../../../types/types";

// const defaultProps: Required<TextareaProps> = {
//   label: "Bericht",
//   placeholder: "Typ hier je bericht...",
//   required: false,
//   rows: 4,
//   defaultValue: "",
// };

// const TextareaPreview: React.FC<{ p: Partial<TextareaProps> }> = ({ p }) => {
//   const props = { ...defaultProps, ...p };

//   return (
//     <div className="mb-4">
//       {props.label && (
//         <label className="block mb-1 font-medium">
//           {props.label}
//           {props.required && <span className="text-red-500"> *</span>}
//         </label>
//       )}
//       <textarea
//         disabled
//         rows={props.rows}
//         placeholder={props.placeholder}
//         value={props.defaultValue}
//         className="w-full border rounded px-2 py-1 bg-gray-100 resize-none"
//         aria-label={props.label}
//       />
//     </div>
//   );
// };

// export default TextareaPreview;
