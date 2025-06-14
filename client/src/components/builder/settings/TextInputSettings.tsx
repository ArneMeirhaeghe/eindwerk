// import React, { useState, useEffect, type FC } from "react";
// import type { ComponentItem, TextInputProps } from "../../../types/types";

// interface Props {
//   comp: ComponentItem;
//   onUpdate: (c: ComponentItem) => void;
// }

// const defaultProps: Required<TextInputProps> = {
//   label: "Naam",
//   placeholder: "Vul je naam in",
//   required: false,
//   defaultValue: "",
// };

// const TextInputSettings: FC<Props> = ({ comp, onUpdate }) => {
//   const p: TextInputProps = { ...defaultProps, ...(comp.props as TextInputProps) };

//   const [value, setValue] = useState(p.defaultValue);

//   useEffect(() => {
//     setValue(p.defaultValue);
//   }, [p.defaultValue]);

//   const update = (key: keyof TextInputProps, val: any) => {
//     onUpdate({ ...comp, props: { ...p, [key]: val } });
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {/* Label */}
//       <div>
//         <label className="block mb-1 font-medium">Label</label>
//         <input
//           type="text"
//           value={p.label}
//           onChange={(e) => update("label", e.target.value)}
//           className="w-full border px-2 py-1 rounded"
//         />
//       </div>

//       {/* Placeholder */}
//       <div>
//         <label className="block mb-1 font-medium">Placeholder</label>
//         <input
//           type="text"
//           value={p.placeholder}
//           onChange={(e) => update("placeholder", e.target.value)}
//           className="w-full border px-2 py-1 rounded"
//         />
//       </div>

//       {/* Verplicht */}
//       <label className="flex items-center space-x-2">
//         <input
//           type="checkbox"
//           checked={p.required}
//           onChange={(e) => update("required", e.target.checked)}
//           className="h-4 w-4"
//         />
//         <span>Verplicht veld</span>
//       </label>

//       {/* Default value */}
//       <div>
//         <label className="block mb-1 font-medium">Standaardwaarde</label>
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => {
//             setValue(e.target.value);
//             update("defaultValue", e.target.value);
//           }}
//           className="w-full border px-2 py-1 rounded"
//         />
//       </div>
//     </div>
//   );
// };

// export default TextInputSettings;
