// File: src/components/livesession/LiveSection.tsx
import React, {  useState, type FC } from "react"
import TitlePreview from "../builder/previews/TitlePreview"
import SubheadingPreview from "../builder/previews/SubheadingPreview"
import ParagraphPreview from "../builder/previews/ParagraphPreview"
import QuotePreview from "../builder/previews/QuotePreview"
import ImagePreview from "../builder/previews/ImagePreview"
import VideoPreview from "../builder/previews/VideoPreview"
import FilePreview from "../builder/previews/FilePreview"
import GridPreview from "../builder/previews/GridPreview"
import UploadZonePreview from "../builder/previews/UploadZonePreview"
import FormSession from "./inputs/FormSession"
import TextInput from "./inputs/TextInput"
import Textarea from "./inputs/Textarea"
import Dropdown from "./inputs/Dropdown"
import CheckboxGroup from "./inputs/CheckboxGroup"
import FileUpload from "./inputs/FileUpload"

import type {
  TitleProps,
  SubheadingProps,
  ParagraphProps,
  QuoteProps,
  ImageProps,
  VideoProps,
  FileProps,
  GridProps,
  UploadZoneProps,
} from "../../types/types"
import type { FlatSection } from "../../hooks/useLiveSession"
import type { ComponentSnapshot } from "../../api/liveSession/types"
import RadioGroup from "./inputs/RadioGroup"
import InventorySession from "./inputs/InventorySession"

interface Props {
  sessionId: string
  sectionData: FlatSection
  saved: Record<string, any>
  onFieldSave: (componentId: string, value: any) => Promise<void>
  onUploadFile: (file: File, componentId: string) => Promise<void>
}

const LiveSection: FC<Props> = ({
  sessionId,
  sectionData,
  saved,
  onFieldSave,
  onUploadFile,
}) => {
  const { section } = sectionData
  const [local, setLocal] = useState<Record<string, any>>(saved)

  const handleSave = async (componentId: string, value: any) => {
    const updated = { ...local, [componentId]: value }
    setLocal(updated)
    await onFieldSave(componentId, value)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-8">
      <h2 className="text-2xl font-bold">{section.naam}</h2>
      <div className="space-y-6">
        {section.components.map((comp: ComponentSnapshot) => {
          const val = local[comp.id]

          switch (comp.type) {
            // Read-only previews
            case "title":
              return (
                <TitlePreview
                  key={comp.id}
                  p={comp.props as TitleProps}
                />
              )
            case "subheading":
              return (
                <SubheadingPreview
                  key={comp.id}
                  p={comp.props as SubheadingProps}
                />
              )
            case "paragraph":
              return (
                <ParagraphPreview
                  key={comp.id}
                  p={comp.props as ParagraphProps}
                />
              )
            case "quote":
              return (
                <QuotePreview
                  key={comp.id}
                  p={comp.props as QuoteProps}
                />
              )
            case "image":
              return (
                <ImagePreview
                  key={comp.id}
                  p={comp.props as ImageProps}
                />
              )
            case "video":
              return (
                <VideoPreview
                  key={comp.id}
                  p={comp.props as VideoProps}
                />
              )
            case "file":
              return (
                <FilePreview
                  key={comp.id}
                  p={comp.props as FileProps}
                />
              )
            case "grid":
              return (
                <GridPreview
                  key={comp.id}
                  p={comp.props as GridProps}
                />
              )
            case "uploadzone":
              return (
                <UploadZonePreview
                  key={comp.id}
                  p={comp.props as UploadZoneProps}
                />
              )

            // Interactive inputs
            case "text-input":
              return (
                <TextInput
                  key={comp.id}
                  label={comp.props.label}
                  placeholder={comp.props.placeholder}
                  value={val ?? ""}
                  onChange={(v: string) => handleSave(comp.id, v)}
                />
              )
            case "textarea":
              return (
                <Textarea
                  key={comp.id}
                  label={comp.props.label}
                  placeholder={comp.props.placeholder}
                  rows={comp.props.rows}
                  value={val ?? ""}
                  onChange={(v: string) => handleSave(comp.id, v)}
                />
              )
            case "dropdown":
              return (
                <Dropdown
                  key={comp.id}
                  label={comp.props.label}
                  options={comp.props.options as string[]}
                  value={val ?? ""}
                  onChange={(v: string) => handleSave(comp.id, v)}
                />
              )
            case "radio-group":
              return (
                <RadioGroup
                  key={comp.id}
                  label={comp.props.label}
                  options={comp.props.options as string[]}
                  value={val ?? ""}
                  onChange={(v: string) => handleSave(comp.id, v)}
                />
              )
            case "checkbox-group":
              return (
                <CheckboxGroup
                  key={comp.id}
                  label={comp.props.label}
                  options={comp.props.options as string[]}
                  values={Array.isArray(val) ? (val as string[]) : []}
                  onChange={(v: string[]) => handleSave(comp.id, v)}
                />
              )
            case "uploadzone":
              return (
                <FileUpload
                  key={comp.id}
                  componentId={comp.id}
                  savedValue={val}
                  onUpload={async (files: File[]) => {
                    await onUploadFile(files[0], comp.id)
                    handleSave(comp.id, { url: URL.createObjectURL(files[0]) })
                  }}
                />
              )

            // Nested form component
            case "form":
              return (
                <FormSession
                  key={comp.id}
                  formId={comp.props.formId as string}
                  value={val as Record<string, any>}
                  onChange={(v) => handleSave(comp.id, v)}
                  sessionId={sessionId}
                  sectionId={section.id}
                  componentId={comp.id}
                  onUploadFile={onUploadFile}
                />
              )

            // Inventory component
            case "inventory":
              return (
                <InventorySession
                  key={comp.id}
                  templateId={comp.props.templateId as string}
                  selectedLokalen={comp.props.selectedLokalen as string[]}
                  selectedSubs={comp.props.selectedSubs as Record<string, string[]>}
                  interactive={comp.props.interactive as boolean}
                  value={val as Record<string, any>}
                  onChange={(v: Record<string, any>) => handleSave(comp.id, v)}
                />
              )
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}

export default LiveSection
