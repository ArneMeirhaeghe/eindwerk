// File: src/components/formbuilder/previews/RadioGroupPreview.tsx

interface Props {
  label: string;
  p: { options?: string[] };
}

export default function RadioGroupPreview({ label, p }: Props) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <div className="space-y-1">
        {(p.options || []).map((o, i) => (
          <label key={`${label}-radio-${i}`} className="flex items-center space-x-2 text-sm">
            <input type="radio" disabled />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
