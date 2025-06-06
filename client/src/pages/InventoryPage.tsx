// File: src/pages/InventoryPage.tsx

import React, { useEffect, useState } from 'react';
import {
  getSections,
  createSection,
  updateSection,
  deleteSection,
  createItem,
  deleteItem,

} from '../api/inventory';
import type { Item, Section } from '../api/inventory/types';

export default function InventoryPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [editingSection, setEditingSection] = useState<Section | null>(
    null
  );
  const [newItem, setNewItem] = useState<Record<string, Omit<Item, 'id'>>>(
    {}
  );

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setSections(await getSections());
  };

  const handleAddSection = async () => {
    if (!newSectionName) return;
    await createSection(newSectionName);
    setNewSectionName('');
    loadSections();
  };

  const handleSaveSection = async () => {
    if (!editingSection) return;
    await updateSection(editingSection);
    setEditingSection(null);
    loadSections();
  };

  const handleDeleteSection = async (id: string) => {
    await deleteSection(id);
    loadSections();
  };

  const handleAddItem = async (sec: Section) => {
    const itm = newItem[sec.id];
    if (!itm?.name) return;
    await createItem(sec.id, itm);
    setNewItem({
      ...newItem,
      [sec.id]: { name: '', quantity: 0, lastQuantity: 0 },
    });
    loadSections();
  };

  const handleDeleteItem = async (secId: string, itemId: string) => {
    await deleteItem(secId, itemId);
    loadSections();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Manager</h1>

      {/* Nieuwe sectie */}
      <div className="flex mb-6">
        <input
          type="text"
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
          placeholder="Nieuwe sectie"
          className="border rounded p-2 flex-grow mr-2"
        />
        <button
          onClick={handleAddSection}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Voeg sectie toe
        </button>
      </div>

      {/* Secties overzicht */}
      {sections.map((sec) => (
        <div key={sec.id} className="border rounded p-4 mb-4">
          <div className="flex justify-between items-center">
            {editingSection?.id === sec.id ? (
              <input
                type="text"
                value={editingSection.name}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    name: e.target.value,
                  })
                }
                className="border rounded p-1 flex-grow mr-2"
              />
            ) : (
              <h2 className="text-xl font-semibold">{sec.name}</h2>
            )}
            <div>
              {editingSection?.id === sec.id ? (
                <>
                  <button
                    onClick={handleSaveSection}
                    className="text-green-600 mr-2"
                  >
                    Opslaan
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="text-red-600"
                  >
                    Annuleer
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditingSection(sec)}
                    className="text-blue-600 mr-2"
                  >
                    Bewerken
                  </button>
                  <button
                    onClick={() => handleDeleteSection(sec.id)}
                    className="text-red-600"
                  >
                    Verwijder
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Items lijst */}
          <ul className="mt-4">
            {sec.items.map((itm) => (
              <li
                key={itm.id}
                className="flex justify-between py-2"
              >
                <span>
                  <span className="font-medium">{itm.name}</span>  
                  {' '}
                  (Nu: {itm.quantity}, Laatst: {itm.lastQuantity})
                </span>
                <button
                  onClick={() =>
                    handleDeleteItem(sec.id, itm.id)
                  }
                  className="text-red-600"
                >
                  Verwijder
                </button>
              </li>
            ))}
          </ul>

          {/* Nieuw item toevoegen */}
          <div className="flex items-center mt-4">
            <input
              type="text"
              value={newItem[sec.id]?.name || ''}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  [sec.id]: {
                    name: e.target.value,
                    quantity: newItem[sec.id]?.quantity || 0,
                    lastQuantity:
                      newItem[sec.id]?.lastQuantity || 0,
                  },
                })
              }
              placeholder="Item naam"
              className="border rounded p-2 mr-2"
            />
            <input
              type="number"
              value={newItem[sec.id]?.quantity || 0}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  [sec.id]: {
                    name: newItem[sec.id]?.name || '',
                    quantity: Number(e.target.value),
                    lastQuantity:
                      newItem[sec.id]?.lastQuantity || 0,
                  },
                })
              }
              placeholder="Aantal"
              className="border rounded p-2 w-24 mr-2"
            />
            <input
              type="number"
              value={newItem[sec.id]?.lastQuantity || 0}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  [sec.id]: {
                    name: newItem[sec.id]?.name || '',
                    quantity: newItem[sec.id]?.quantity || 0,
                    lastQuantity: Number(e.target.value),
                  },
                })
              }
              placeholder="Laatst"
              className="border rounded p-2 w-24 mr-2"
            />
            <button
              onClick={() => handleAddItem(sec)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Voeg item toe
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
