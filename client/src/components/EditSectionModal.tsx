// File: src/components/EditSectionModal.tsx
import React, { useState, useEffect, type FC } from "react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  initialValue: string;
  onSave: (newTitle: string) => void;
  onClose: () => void;
}

const EditSectionModal: FC<Props> = ({ isOpen, initialValue, onSave, onClose }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="bg-white rounded-lg shadow-lg w-80">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h3 className="text-lg font-semibold">Sectienaam bewerken</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none"
            placeholder="Nieuwe naam sectie"
          />
        </div>
        <div className="flex justify-end px-4 py-2 border-t">
          <button
            onClick={() => {
              const trimmed = value.trim();
              if (trimmed) {
                onSave(trimmed);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Opslaan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSectionModal;
