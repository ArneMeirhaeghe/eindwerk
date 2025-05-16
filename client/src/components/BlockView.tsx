import type { BlockData } from "../types/Plan"

function BlockView({ block }: { block: BlockData }) {
  return (
    <div className="border p-3 rounded bg-gray-50">
      <p><strong>Type:</strong> {block.type}</p>
      <p><strong>Inhoud:</strong> {block.content || "(leeg)"}</p>
    </div>
  )
}

export default BlockView
