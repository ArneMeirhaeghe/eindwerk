// import React, { useEffect, useState } from "react";
// import type { FormDto } from "../../../api/forms/types";
// import { getForm } from "../../../api/forms";

// import TextInputPreview from "./TextInputPreview";
// import TextareaPreview from "./TextareaPreview";
// import DropdownPreview from "./DropdownPreview";
// import RadioGroupPreview from "./RadioGroupPreview";
// import { CheckboxGroupPreview } from "./CheckboxGroupPreview";

// const fieldPreviewMap: Record<string, React.FC<{ p: any }>> = {
//   "text-input": TextInputPreview,
//   textarea: TextareaPreview,
//   dropdown: DropdownPreview,
//   "radio-group": RadioGroupPreview,
//   "checkbox-group": CheckboxGroupPreview,
// };

// export interface FormPreviewProps {
//   p: {
//     formId?: string;
//   };
// }

// const FormPreview: React.FC<FormPreviewProps> = ({ p }) => {
//   const [form, setForm] = useState<FormDto | null>(null);

//   useEffect(() => {
//     let active = true;
//     const fetch = async () => {
//       if (!p.formId) return;
//       try {
//         const res = await getForm(p.formId);
//         if (active) setForm(res);
//       } catch {
//         setForm(null);
//       }
//     };
//     fetch();
//     return () => {
//       active = false;
//     };
//   }, [p.formId]);

//   if (!p.formId) {
//     return (
//       <div className="italic text-gray-400 mb-2">Geen formulier gekoppeld</div>
//     );
//   }

//   if (!form) {
//     return (
//       <div className="italic text-gray-400 mb-2">Formulier wordt geladen…</div>
//     );
//   }

//   return (
//     <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4 mb-4">
//       <h4 className="text-sm font-semibold text-gray-700">{form.name}</h4>
//       {form.fields.map((f) => {
//         const Preview = fieldPreviewMap[f.type];
//         if (!Preview) return null;
//         const commonProps = { ...f.settings, label: f.label };
//         return <Preview key={f.id} p={commonProps} />;
//       })}
//     </div>
//   );
// };

// export default FormPreview;
