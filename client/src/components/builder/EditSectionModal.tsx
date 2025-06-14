// File: src/components/builder/EditSectionModal.tsx
import  { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  initialValue: string;
  onSave: (newTitle: string) => void;
  onClose: () => void;
}

export default function EditSectionModal({ isOpen, initialValue, onSave, onClose }: Props) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Sectie Naam Wijzigen</h2>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Annuleer
          </button>
          <button
            onClick={() => onSave(value)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Opslaan
          </button>
        </div>
      </div>
    </div>
  );
}
