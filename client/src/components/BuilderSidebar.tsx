// src/components/BuilderSidebar.tsx

import type { BlockData } from "../types/Plan"

function BuilderSidebar({ onAddBlock }: { onAddBlock: (type: BlockData["type"]) => void }) {
  const types: BlockData["type"][] = ["text", "image", "input", "button"]

  return (
    <aside className="w-64 bg-gray-100 p-4 border-r space-y-2">
      <h2 className="font-bold">➕ Voeg blok toe</h2>
      {types.map(type => (
        <button
          key={type}
          onClick={() => onAddBlock(type)}
          className="w-full px-3 py-2 bg-white border rounded hover:bg-blue-100"
        >
          {type}
        </button>
      ))}
    </aside>
  )
}

export default BuilderSidebar
