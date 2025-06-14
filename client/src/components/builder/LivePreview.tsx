// File: src/components/builder/LivePreview.tsx
import React from "react"

import TitlePreview from "./previews/TitlePreview"
//import SubheadingPreview from "./previews/SubheadingPreview"
import ParagraphPreview from "./previews/ParagraphPreview"
import QuotePreview from "./previews/QuotePreview"
//import ButtonPreview from "./previews/ButtonPreview"
import ChecklistPreview from "./previews/ChecklistPreview"
import DividerPreview from "./previews/DividerPreview"
import ImagePreview from "./previews/ImagePreview"
import VideoPreview from "./previews/VideoPreview"
import FilePreview from "./previews/FilePreview"
import GridPreview from "./previews/GridPreview"
import UploadZonePreview from "./previews/UploadZonePreview"
import DropdownPreview from "./previews/DropdownPreview"
//import FormPreview from "./previews/FormPreview"
import InventoryPreview from "./previews/InventoryPreview"
import type { ComponentItem } from "../../types/types"

interface Props {
  components?: ComponentItem[]
}

const previewMap: Record<string, React.ComponentType<any>> = {
  title:          TitlePreview,
  //subheading:     SubheadingPreview,
  paragraph:      ParagraphPreview,
  quote:          QuotePreview,
  //button:         ButtonPreview,
  checklist:      ChecklistPreview,
  divider:        DividerPreview,
  image:          ImagePreview,
  video:          VideoPreview,
  file:           FilePreview,
  grid:           GridPreview,
  uploadzone:     UploadZonePreview,
  dropdown:       DropdownPreview,
  //form:           FormPreview,
  inventory:      InventoryPreview,
}

export default function LivePreview({ components = [] }: Props) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 p-4">
      <div className="relative w-[360px] max-w-full h-[720px] bg-black rounded-[2rem] shadow-2xl border-4 border-black overflow-hidden">
        <div className="absolute inset-4 bg-white rounded-[1.5rem] overflow-y-auto p-4 space-y-5">
          {components.length === 0 ? (
            <p className="text-gray-400 italic text-center">Geen preview</p>
          ) : (
            components.map((comp, idx) => {
              const Preview = previewMap[comp.type]
              if (!Preview) return null
              return <Preview key={comp.id ?? idx} p={comp.props} />
            })
          )}
          <div className="h-12" /> {/* ruimte onderaan zodat niets onder sticky elementen valt */}
        </div>
      </div>
    </div>
  )
}
