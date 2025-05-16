// src/components/Block.tsx

import type { BlockData } from "../types/Plan"

interface Props {
  block: BlockData
  onUpdate?: (id: string, content: string) => void
}

function Block({ block, onUpdate }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onUpdate) {
      onUpdate(block.id, e.target.value)
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onUpdate) {
      const url = URL.createObjectURL(file)
      onUpdate(block.id, url)
    }
  }

  switch (block.type) {
    case "text":
      return (
        <textarea
          className="w-full border p-2 rounded"
          value={block.content}
          onChange={handleChange}
          placeholder="Typ je tekst hier..."
        />
      )
    case "image":
      return (
        <div className="space-y-2">
          {block.content && (
            <img src={block.content} alt="preview" className="max-h-48 rounded border" />
          )}
          {onUpdate && <input type="file" accept="image/*" onChange={handleFile} />}
        </div>
      )
    case "input":
      return (
        <input
          className="w-full border p-2 rounded"
          placeholder={block.content || "Input veld"}
          onChange={handleChange}
          value={block.content}
        />
      )
    case "button":
      return (
        <input
          type="text"
          className="border px-3 py-1 rounded bg-blue-500 text-white"
          value={block.content}
          onChange={handleChange}
          placeholder="Knop tekst"
        />
      )
    default:
      return <div>❓ Onbekend bloktype</div>
  }
}

export default Block
