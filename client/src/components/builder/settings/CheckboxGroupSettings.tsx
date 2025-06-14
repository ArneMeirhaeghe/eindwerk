// import type { FC, ChangeEvent } from "react";
// import type { ComponentItem, CheckboxGroupProps } from "../../../types/types";

// const defaultProps: CheckboxGroupProps = {
//   label: "Kies opties",
//   options: ["Optie 1", "Optie 2", "Optie 3"],
//   defaultValue: [],
//   required: false,
// };

// const CheckboxGroupSettings: FC<{
//   comp: ComponentItem;
//   onUpdate: (c: ComponentItem) => void;
// }> = ({ comp, onUpdate }) => {
//   const p: CheckboxGroupProps = { ...defaultProps, ...comp.props };

//   const updateProp = (key: keyof CheckboxGroupProps, value: any) => {
//     onUpdate({ ...comp, props: { ...p, [key]: value } });
//   };

//   const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) =>
//     updateProp("label", e.target.value);

//   const handleOptionsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
//     const lines = e.target.value
//       .split("\n")
//       .map((x) => x.trim())
//       .filter(Boolean);
//     updateProp("options", lines);
//   };

//   const handleDefaultChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const values = e.target.value
//       .split(",")
//       .map((x) => x.trim())
//       .filter(Boolean);
//     updateProp("defaultValue", values);
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {/* Label */}
//       <div>
//         <label className="block font-medium mb-1">Groepslabel</label>
//         <input
//           type="text"
//           value={p.label}
//           onChange={handleLabelChange}
//           placeholder="Bijv. Welke vakken volg je?"
//           className="w-full border border-gray-300 rounded px-2 py-1"
//         />
//       </div>

//       {/* Opties */}
//       <div>
//         <label className="block font-medium mb-1">Opties (één per regel)</label>
//         <textarea
//           rows={3}
//           value={p.options.join("\n")}
//           onChange={handleOptionsChange}
//           placeholder="Optie 1&#10;Optie 2&#10;Optie 3"
//           className="w-full border border-gray-300 rounded px-2 py-1"
//         />
//       </div>

//       {/* Verplicht */}
//       <div className="flex items-center space-x-2">
//         <input
//           type="checkbox"
//           checked={!!p.required}
//           onChange={(e) => updateProp("required", e.target.checked)}
//         />
//         <span className="text-sm">Verplicht om minstens één optie te kiezen</span>
//       </div>

//       {/* Standaardwaarden */}
//       <div>
//         <label className="block font-medium mb-1">Standaardwaarden (komma-gescheiden)</label>
//         <input
//           type="text"
//           value={p.defaultValue?.join(",") ?? ""}
//           onChange={handleDefaultChange}
//           placeholder="Optie 1, Optie 2"
//           className="w-full border border-gray-300 rounded px-2 py-1"
//         />
//       </div>
//     </div>
//   );
// };

// export default CheckboxGroupSettings;
