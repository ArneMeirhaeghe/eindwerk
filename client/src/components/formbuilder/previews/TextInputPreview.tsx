

interface Props {
  label: string;
  p: { placeholder?: string };
}

export default function TextInputPreview({ label, p }: Props) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <input
        type="text"
        placeholder={p.placeholder || ""}
        disabled
        className="w-full px-2 py-1 border rounded bg-gray-100 text-gray-700 text-sm"
      />
    </div>
  );
}
