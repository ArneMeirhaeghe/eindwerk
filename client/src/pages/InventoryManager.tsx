// src/pages/InventoryManager.tsx
import { useEffect, useState, useRef, KeyboardEvent } from "react"
import { useAuth } from "../context/AuthContext"
import {
  getSectionsByUser,
  createSection,
  updateSection,
  deleteSection,
} from "../api/inventory"
import type {
  InventorySection,
  InventoryItem,
  NewInventorySection,
} from "../types/Inventory"
import { v4 as uuidv4 } from "uuid"

export default function InventoryManager() {
  const { token, userId } = useAuth()

  const [sections, setSections] = useState<InventorySection[]>([])
  const [selected, setSelected] = useState<InventorySection | null>(null)

  const [title, setTitle] = useState("")
  const [items, setItems] = useState<InventoryItem[]>([])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ref voor focusing new item input
  const newItemNameRef = useRef<HTMLInputElement>(null)

  // 1) laad alle secties
  const loadSections = async () => {
    if (!token || !userId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getSectionsByUser(userId)
      setSections(data)
    } catch (err: any) {
      setError(err.response?.data ?? err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadSections()
  }, [token, userId])

  // 2) sync selected → form
  useEffect(() => {
    if (selected) {
      setTitle(selected.title)
      setItems(selected.items)
    } else {
      setTitle("")
      setItems([])
    }
    setError(null)
  }, [selected])

  // 3) secties actions
  const handleNew = () => setSelected(null)
  const handleSelect = (sec: InventorySection) => setSelected(sec)
  const handleDeleteSection = async (sec: InventorySection) => {
    if (!confirm("Sectie écht verwijderen?")) return
    setSaving(true)
    try {
      await deleteSection(sec.id)
      if (selected?.id === sec.id) setSelected(null)
      await loadSections()
    } catch (err: any) {
      setError(err.response?.data ?? err.message)
    } finally {
      setSaving(false)
    }
  }

  // 4) items actions
  const handleAddItem = () => {
    const newIt: InventoryItem = {
      id: uuidv4(),
      name: "",
      currentCount: 0,
      expectedCount: 0,
    }
    setItems((prev) => [...prev, newIt])
    // focus nieuwe naam‐input nadat state gerenderd is
    setTimeout(() => newItemNameRef.current?.focus(), 0)
  }
  const handleUpdateItem = (
    id: string,
    field: keyof Omit<InventoryItem, "id">,
    value: string | number
  ) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    )
  const handleRemoveItem = (id: string) =>
    setItems((prev) => prev.filter((it) => it.id !== id))

  // 5) save / create / update
  const handleSave = async () => {
    if (!title.trim()) {
      setError("Voer een titel in.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      if (selected) {
        // update bestaande sectie
        await updateSection(selected.id, { ...selected, title, items })
      } else {
        // nieuwe sectie
        const newSec = await createSection({ title, items })
        setSelected(newSec)
        setSections((prev) => [...prev, newSec])
      }
      await loadSections()
    } catch (err: any) {
      setError(err.response?.data ?? err.message)
    } finally {
      setSaving(false)
    }
  }

  // 6) delete button in detail
  const handleDeleteDetail = async () => {
    if (!selected) return
    await handleDeleteSection(selected)
  }

  // 7) onEnter voor laatste rij
  const onExpectedKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Enter" && idx === items.length - 1) {
      e.preventDefault()
      handleAddItem()
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar: secties */}
      <aside className="w-1/4 bg-gray-50 p-4 overflow-auto border-r">
        <h2 className="text-xl font-semibold mb-4">📂 Secties</h2>
        <button
          onClick={handleNew}
          disabled={saving}
          className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
        >
          ➕ Nieuwe sectie
        </button>
        {loading ? (
          <p>Laden…</p>
        ) : (
          <ul className="space-y-2">
            {sections.map((sec) => (
              <li key={sec.id} className="flex justify-between items-center">
                <button
                  onClick={() => handleSelect(sec)}
                  className={`text-left px-2 py-1 rounded flex-1 ${
                    selected?.id === sec.id
                      ? "bg-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {sec.title}
                </button>
                <button
                  onClick={() => handleDeleteSection(sec)}
                  disabled={saving}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Main: detail/form */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">
          {selected ? "✏️ Sectie bewerken" : "🆕 Nieuwe sectie"}
        </h1>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Titel */}
          <div>
            <label className="block font-medium mb-1">Titel</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={saving}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Items */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-medium">Items</h2>
              <button
                onClick={handleAddItem}
                disabled={saving}
                className="text-blue-600 hover:underline"
              >
                ➕ Item (Enter)
              </button>
            </div>
            {items.length === 0 && (
              <p className="text-gray-500">Nog geen items</p>
            )}
            <div className="space-y-3">
              {items.map((it, idx) => (
                <div
                  key={it.id}
                  className="grid grid-cols-4 gap-3 items-end"
                >
                  <input
                    ref={idx === items.length - 1 ? newItemNameRef : null}
                    type="text"
                    placeholder="Naam"
                    value={it.name}
                    onChange={(e) =>
                      handleUpdateItem(it.id, "name", e.target.value)
                    }
                    disabled={saving}
                    className="border p-2 rounded col-span-2"
                  />
                  <input
                    type="number"
                    placeholder="Huidig"
                    value={it.currentCount}
                    onChange={(e) =>
                      handleUpdateItem(
                        it.id,
                        "currentCount",
                        parseInt(e.target.value) || 0
                      )
                    }
                    disabled={saving}
                    className="border p-2 rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Verwacht"
                      value={it.expectedCount}
                      onChange={(e) =>
                        handleUpdateItem(
                          it.id,
                          "expectedCount",
                          parseInt(e.target.value) || 0
                        )
                      }
                      onKeyDown={(e) => onExpectedKeyDown(e, idx)}
                      disabled={saving}
                      className="border p-2 rounded"
                    />
                    <button
                      onClick={() => handleRemoveItem(it.id)}
                      disabled={saving}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acties */}
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {saving ? "Opslaan…" : "💾 Opslaan"}
            </button>
            {selected && (
              <button
                onClick={handleDeleteDetail}
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                🗑️ Verwijderen
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
