// import type { FC } from "react";
// import type { ComponentItem, SubheadingProps } from "../../../types/types";

// interface Props {
//   comp: ComponentItem;
//   onUpdate: (c: ComponentItem) => void;
// }

// const defaultProps: Required<SubheadingProps> = {
//   text: "Subtitel voorbeeld",
//   fontSize: 20,
//   color: "#000000",
//   align: "left",
//   italic: false,
//   bold: false,
//   underline: false,
// };

// const SubheadingSettings: FC<Props> = ({ comp, onUpdate }) => {
//   const p: SubheadingProps = { ...defaultProps, ...(comp.props as SubheadingProps) };

//   const upd = (key: keyof SubheadingProps, value: any) =>
//     onUpdate({ ...comp, props: { ...p, [key]: value } });

//   return (
//     <div className="space-y-6 p-4">
//       {/* Tekst */}
//       <div>
//         <label className="block mb-1 font-medium">Subheading tekst</label>
//         <input
//           type="text"
//           value={p.text}
//           onChange={(e) => upd("text", e.target.value)}
//           className="w-full border px-2 py-1 rounded"
//           placeholder="Bijv. Belangrijke info"
//         />
//       </div>

//       {/* Grootte en kleur */}
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block mb-1 font-medium">Tekengrootte (px)</label>
//           <input
//             type="number"
//             min={12}
//             value={p.fontSize}
//             onChange={(e) => upd("fontSize", +e.target.value)}
//             className="w-full border px-2 py-1 rounded"
//           />
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Tekstkleur</label>
//           <input
//             type="color"
//             value={p.color}
//             onChange={(e) => upd("color", e.target.value)}
//             className="w-full h-10"
//           />
//         </div>
//       </div>

//       {/* Uitlijning */}
//       <div>
//         <label className="block mb-1 font-medium">Uitlijning</label>
//         <select
//           value={p.align}
//           onChange={(e) => upd("align", e.target.value as SubheadingProps["align"])}
//           className="w-full border px-2 py-1 rounded"
//         >
//           <option value="left">Links</option>
//           <option value="center">Gecentreerd</option>
//           <option value="right">Rechts</option>
//         </select>
//       </div>

//       {/* Tekstopmaak */}
//       <div className="flex items-center gap-6">
//         {(["bold", "italic", "underline"] as const).map((style) => (
//           <label key={style} className="flex items-center space-x-2 text-sm">
//             <input
//               type="checkbox"
//               checked={p[style]}
//               onChange={(e) => upd(style, e.target.checked)}
//               className="h-4 w-4"
//             />
//             <span className="capitalize">{style}</span>
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SubheadingSettings;
