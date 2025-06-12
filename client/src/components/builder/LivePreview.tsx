// File: src/components/builder/LivePreview.tsx
import React from "react"
import type { ComponentItem } from "../../types/types"
import TitlePreview from "./previews/TitlePreview"
import ParagraphPreview from "./previews/ParagraphPreview"
import QuotePreview from "./previews/QuotePreview"
import ButtonPreview from "./previews/ButtonPreview"
import ChecklistPreview from "./previews/ChecklistPreview"
import CheckboxListPreview from "./previews/CheckboxListPreview"
import DividerPreview from "./previews/DividerPreview"
import ImagePreview from "./previews/ImagePreview"
import VideoPreview from "./previews/VideoPreview"
import FilePreview from "./previews/FilePreview"
import GridPreview from "./previews/GridPreview"
import UploadZonePreview from "./previews/UploadZonePreview"
import TextInputPreview from "./previews/TextInputPreview"
import TextareaPreview from "./previews/TextareaPreview"
import DropdownPreview from "./previews/DropdownPreview"
import RadioGroupPreview from "./previews/RadioGroupPreview"
import { CheckboxGroupPreview } from "./previews/CheckboxGroupPreview"
import FormPreview from "./previews/FormPreview"
import InventoryPreview from "./previews/InventoryPreview"  // ← toegevoegd
import SubheadingPreview from "./previews/SubheadingPreview"

interface Props {
  components?: ComponentItem[]   // optional array; defaults to []
}

const previewMap: Record<string, React.ComponentType<any>> = {
  title:            TitlePreview,
  subheading:       SubheadingPreview,
  paragraph:        ParagraphPreview,
  quote:            QuotePreview,
  button:           ButtonPreview,
  checklist:        ChecklistPreview,
  "checkbox-list":  CheckboxListPreview,
  divider:          DividerPreview,
  image:            ImagePreview,
  video:            VideoPreview,
  file:             FilePreview,
  grid:             GridPreview,
  uploadzone:       UploadZonePreview,
  "text-input":     TextInputPreview,
  textarea:         TextareaPreview,
  dropdown:         DropdownPreview,
  "radio-group":    RadioGroupPreview,
  "checkbox-group": CheckboxGroupPreview,
  form:             FormPreview,
  inventory:        InventoryPreview     // ← toegevoegd
}

export default function LivePreview({ components = [] }: Props) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 p-4">
      <div className="relative w-[360px] h-[720px] bg-black rounded-3xl shadow-xl">
        <div className="absolute inset-4 bg-white rounded-2xl overflow-auto p-4 space-y-6">
          {components.map((comp, idx) => {
            const Preview = previewMap[comp.type]
            if (!Preview) return null
            return <Preview key={comp.id ?? idx} p={comp.props} />
          })}
        </div>
      </div>
    </div>
  )
}
