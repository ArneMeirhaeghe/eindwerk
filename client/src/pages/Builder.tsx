// client/src/pages/Builder.tsx

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { usePlan } from "../hooks/usePlan"
import { v4 as uuidv4 } from "uuid"
import Canvas from "../components/Canvas"
import BuilderSidebar from "../components/BuilderSidebar"
import Block from "../components/Block"
import type { BlockData, Plan } from "../types/Plan"

function Builder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === undefined || id === "new"
  const { plan, loading, savePlan, createNew } = usePlan(isNew ? undefined : id)
  const [title, setTitle] = useState("Nuevo plan")
  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  // Initialise
  useEffect(() => {
    if (plan) {
      setTitle(plan.title)
      setBlocks(plan.blocks)
    } else if (isNew) {
      setTitle("Nieuw plan")
      setBlocks([])
    }
  }, [plan, isNew])

  const handleAddBlock = (type: BlockData["type"]) => {
    setBlocks((p) => [...p, { id: uuidv4(), type, content: "" }])
  }

  const handleUpdateBlock = (blockId: string, content: string) =>
    setBlocks((p) =>
      p.map((b) => (b.id === blockId ? { ...b, content } : b))
    )

  const handleReorder = (newOrder: BlockData[]) => setBlocks(newOrder)
  const handleDelete = (blockId: string) =>
    setBlocks((p) => p.filter((b) => b.id !== blockId))

  const handleSave = async () => {
    if (!title.trim()) return alert("Titel mag niet leeg zijn.")
    if (blocks.length === 0) return alert("Voeg blokken toe.")
    setSaving(true)

    try {
      const payload: Omit<Plan, "id"> = {
        ownerId: plan?.ownerId ?? "",
        title,
        blocks,
        publicId: plan?.publicId,
      }

      if (isNew) {
        const created = await createNew(payload.ownerId, payload)
        navigate(`/plans/${created.id}`)
      } else if (plan) {
        const updated = await savePlan({ ...plan, title, blocks })
        alert("Opgeslagen!")
      }
    } catch (err) {
      console.error(err)
      alert("Opslaan mislukt.")
    } finally {
      setSaving(false)
    }
  }

  if (!isNew && loading) return <p className="p-6">Laden…</p>

  return (
    <div className="flex h-screen">
      {!preview && <BuilderSidebar onAddBlock={handleAddBlock} />}
      <main className="flex-1 p-6 space-y-4 overflow-auto">
        <div className="flex justify-between items-center">
          <input
            className="text-2xl font-bold border-b flex-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
          />
          <div className="space-x-2">
            <button
              onClick={() => setPreview((f) => !f)}
              className="px-4 py-2 border rounded"
            >
              {preview ? "✏️ Bewerk" : "👁️ Preview"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {saving ? "Opslaan…" : "💾 Opslaan"}
            </button>
          </div>
        </div>

        {preview ? (
          <div className="space-y-4">
            {blocks.map((b) => (
              <Block key={b.id} block={b} />
            ))}
          </div>
        ) : (
          <Canvas
            blocks={blocks}
            onUpdateBlock={handleUpdateBlock}
            onReorder={handleReorder}
            onDeleteBlock={handleDelete}
          />
        )}
      </main>
    </div>
  )
}

export default Builder
