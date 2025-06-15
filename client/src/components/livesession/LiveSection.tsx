// File: src/components/livesession/LiveSection.tsx
import  { useState, type FC } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { FlatSection } from "../../hooks/useLiveSession"
import FormSession from "./inputs/FormSession"
import InventorySession from "./inputs/InventorySession"
import TextInput from "./inputs/TextInput"
import Textarea from "./inputs/Textarea"
import Dropdown from "./inputs/Dropdown"
import RadioGroup from "./inputs/RadioGroup"
import CheckboxGroup from "./inputs/CheckboxGroup"
import FileUpload from "./inputs/FileUpload"
import TitlePreview from "../builder/previews/TitlePreview"
import SubheadingPreview from "../builder/previews/SubheadingPreview"
import ParagraphPreview from "../builder/previews/ParagraphPreview"
import QuotePreview from "../builder/previews/QuotePreview"
import ImagePreview from "../builder/previews/ImagePreview"
import VideoPreview from "../builder/previews/VideoPreview"
import FilePreview from "../builder/previews/FilePreview"
import GridPreview from "../builder/previews/GridPreview"
import ChecklistPreview from "../builder/previews/ChecklistPreview"
import ButtonPreview from "../builder/previews/ButtonPreview"

interface Props {
  sessionId: string
  sectionData: FlatSection
  saved: Record<string, any>
  onFieldSave: (componentId: string, value: any) => Promise<void>
  onUploadFile: (file: File, componentId: string) => Promise<void>
  /** zet op false om section altijd geopend te tonen */
  collapsible?: boolean
}

const LiveSection: FC<Props> = ({
  sectionData,
  saved,
  onFieldSave,
  onUploadFile,
  collapsible = true,
}) => {
  const { section } = sectionData
  const [local, setLocal] = useState<Record<string, any>>(saved)
  const [open, setOpen] = useState(true)

  const toggle = () => setOpen(o => !o)

  const handleSave = async (componentId: string, value: any) => {
    const updated = { ...local, [componentId]: value }
    setLocal(updated)
    await onFieldSave(componentId, value)
  }

  return (
    <div className="bg-white rounded-xl shadow-md ring-1 ring-gray-100 mb-6 overflow-hidden">
      {collapsible ? (
        <button
          onClick={toggle}
          className="w-full flex items-center justify-between px-6 py-4 bg-blue-50 hover:bg-blue-100 transition font-semibold text-blue-600"
        >
          <div className="flex items-center space-x-2">
            {open ? <ChevronDown /> : <ChevronRight />}
            <span className="text-lg">{section.naam}</span>
          </div>
        </button>
      ) : (
        <div className="px-6 py-4 bg-blue-50 font-semibold text-blue-600">
          {section.naam}
        </div>
      )}

      {(open || !collapsible) && (
        <div className="p-6 space-y-8">
          {section.components.map(comp => {
            const val = local[comp.id]
            switch (comp.type) {
              case "title":
                return <TitlePreview key={comp.id} p={comp.props} />
              case "subheading":
                return <SubheadingPreview key={comp.id} p={comp.props} />
              case "paragraph":
                return <ParagraphPreview key={comp.id} p={comp.props} />
              case "quote":
                return <QuotePreview key={comp.id} p={comp.props} />
              case "image":
                return <ImagePreview key={comp.id} p={comp.props} />
              case "video":
                return <VideoPreview key={comp.id} p={comp.props} />
              case "file":
                return <FilePreview key={comp.id} p={comp.props} />
              case "grid":
                return <GridPreview key={comp.id} p={comp.props} />
              case "checklist":
                return <ChecklistPreview key={comp.id} p={comp.props} />
              case "button":
                return <ButtonPreview key={comp.id} p={comp.props} />

              case "text-input":
                return (
                  <TextInput
                    key={comp.id}
                    label={comp.props.label}
                    placeholder={comp.props.placeholder}
                    value={val ?? ""}
                    onChange={v => handleSave(comp.id, v)}
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
                    onChange={v => handleSave(comp.id, v)}
                  />
                )
              case "dropdown":
                return (
                  <Dropdown
                    key={comp.id}
                    label={comp.props.label}
                    options={comp.props.options || []}
                    value={val ?? ""}
                    onChange={v => handleSave(comp.id, v)}
                  />
                )
              case "radio-group":
                return (
                  <RadioGroup
                    key={comp.id}
                    label={comp.props.label}
                    options={comp.props.options || []}
                    value={val ?? ""}
                    onChange={v => handleSave(comp.id, v)}
                  />
                )
              case "checkbox-group":
                return (
                  <CheckboxGroup
                    key={comp.id}
                    label={comp.props.label}
                    options={comp.props.options || []}
                    values={Array.isArray(val) ? val : []}
                    onChange={v => handleSave(comp.id, v)}
                  />
                )
              case "uploadzone":
                return (
                  <FileUpload
                    key={comp.id}
                    componentId={comp.id}
                    savedValue={val}
                    onUpload={async files => {
                      await onUploadFile(files[0], comp.id)
                      handleSave(comp.id, { url: URL.createObjectURL(files[0]) })
                    }}
                  />
                )
              case "form":
                return (
                  <div key={comp.id} className="bg-gray-50 rounded-lg p-4 shadow-inner">
                    <FormSession
                      formId={comp.props.formId as string}
                      value={val}
                      onChange={v => handleSave(comp.id, v)}
                      componentId={comp.id}
                      onUploadFile={onUploadFile}
                    />
                  </div>
                )
              case "inventory":
                return (
                  <div key={comp.id} className="bg-gray-50 rounded-lg p-4 shadow-inner">
                    <InventorySession
                      templateId={comp.props.templateId as string}
                      selectedLokalen={comp.props.selectedLokalen}
                      selectedSubs={comp.props.selectedSubs}
                      interactive={comp.props.interactive}
                      value={val}
                      onChange={v => handleSave(comp.id, v)}
                    />
                  </div>
                )
              default:
                return null
            }
          })}
        </div>
      )}
    </div>
  )
}

export default LiveSection
