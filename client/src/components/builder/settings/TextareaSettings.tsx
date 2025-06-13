// import type { FC } from "react";
// import type { ComponentItem, TextareaProps } from "../../../types/types";

// const defaultProps: Required<TextareaProps> = {
//   label: "Bericht",
//   placeholder: "Typ hier je bericht...",
//   required: false,
//   rows: 4,
//   defaultValue: "",
// };

// const TextareaSettings: FC<{
//   comp: ComponentItem;
//   onUpdate: (c: ComponentItem) => void;
// }> = ({ comp, onUpdate }) => {
//   const p: TextareaProps = { ...defaultProps, ...(comp.props as TextareaProps) };
//   const upd = (key: keyof TextareaProps, v: any) =>
//     onUpdate({ ...comp, props: { ...p, [key]: v } });

//   return (
//     <div className="space-y-6 p-4">
//       {/* Label */}
//       <div>
//         <label className="block mb-1 font-medium">Label</label>
//         <input
//           type="text"
//           value={p.label}
//           onChange={(e) => upd("label", e.target.value)}
//           className="w-full border px-2 py-1 rounded"
//         />
//       </div>

//       {/* Placeholder en rows */}
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block mb-1 font-medium">Placeholder</label>
//           <input
//             type="text"
//             value={p.placeholder}
//             onChange={(e) => upd("placeholder", e.target.value)}
//             className="w-full border px-2 py-1 rounded"
//           />
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Aantal rijen</label>
//           <input
//             type="number"
//             min={1}
//             value={p.rows}
//             onChange={(e) => upd("rows", +e.target.value)}
//             className="w-full border px-2 py-1 rounded"
//           />
//         </div>
//       </div>

//       {/* Verplicht */}
//       <label className="flex items-center space-x-2">
//         <input
//           type="checkbox"
//           checked={p.required}
//           onChange={(e) => upd("required", e.target.checked)}
//           className="h-4 w-4"
//         />
//         <span>Verplicht veld</span>
//       </label>

//       {/* Default value */}
//       <div>
//         <label className="block mb-1 font-medium">Standaardwaarde</label>
//         <textarea
//           rows={2}
//           value={p.defaultValue}
//           onChange={(e) => upd("defaultValue", e.target.value)}
//           className="w-full border px-2 py-1 rounded"
//         />
//       </div>
//     </div>
//   );
// };

// export default TextareaSettings;
