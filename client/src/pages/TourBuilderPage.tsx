// File: src/pages/TourBuilderPage.tsx
import React, { useState } from "react"
import ComponentPalette from "../components/builder/ComponentPalette"
import BuilderCanvas from "../components/builder/BuilderCanvas"
import BottomNav from "../components/builder/BottomNav"
import SettingsPanel from "../components/builder/SettingsPanel"
import EditSectionModal from "../components/builder/EditSectionModal"
import { useTourBuilder } from "../hooks/useTourBuilder"
import LivePreview from "../components/builder/LivePreview"
import { X, Menu } from "lucide-react"

export default function TourBuilderPage() {
  const {
    loading,
    previewMode,
    fasesList,
    sectionsByFase,
    activeFase,
    activeSectionIndex,
    selectedComp,
    modalOpen,
    modalValue,
    handlers,
  } = useTourBuilder()

  const [showPaletteMobile, setShowPaletteMobile] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  if (loading) return <div className="p-4 animate-pulse">Laden…</div>

  if (previewMode) {
    return (
      <div className="relative min-h-screen bg-gray-100 pb-32">
        <div className="p-4">
          <button
            onClick={() => handlers.setPreviewMode(false)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Terug naar bewerken
          </button>
          <LivePreview
            components={
              sectionsByFase[activeFase]?.[activeSectionIndex]?.components ?? []
            }
          />
        </div>
      </div>
    )
  }

  const current = sectionsByFase[activeFase][activeSectionIndex]

  return (
    <div className="flex flex-col h-screen pb-32">
      {/* Header */}
      <div className="grid grid-cols-3 items-center px-4 py-2 border-b bg-white">
        <div className="flex lg:hidden">
          <button
            onClick={() => setShowPaletteMobile(true)}
            className="p-2 rounded bg-gray-200"
          >
            <Menu />
          </button>
        </div>
        <div className="flex flex-col items-center">
          <h1
            className="text-lg font-semibold cursor-pointer text-center"
            onClick={() => handlers.openSectionModal(activeSectionIndex)}
          >
            {current.title}
          </h1>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => handlers.setPreviewMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hidden lg:block"
          >
            Preview
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 justify-between overflow-hidden">
        {/* Sidebar left: palette (desktop only) */}
        <div className="hidden lg:block w-64 border-r overflow-y-auto">
          <ComponentPalette onAdd={handlers.onAddComponent} />
        </div>

        {/* Canvas */}
        <div className="flex-1 flex justify-center overflow-y-auto">
          <BuilderCanvas
            components={current.components}
            sectionTitle={current.title}
            preview={false}
            onSelect={(c) => {
              handlers.onSelectComponent(c)
              if (window.innerWidth < 1024) setShowSettingsModal(true)
            }}
            onDelete={handlers.onDeleteComponent}
            onDragEnd={handlers.onDragEnd}
            onSectionTitleClick={() =>
              handlers.openSectionModal(activeSectionIndex)
            }
          />
        </div>

        {/* Sidebar right: settings (desktop only) */}
        <div className="hidden lg:block w-72 border-l overflow-y-auto">
          <SettingsPanel
            comp={selectedComp}
            onUpdate={handlers.handleSettingsChange}
          />
        </div>
      </div>

      {/* Mobile Palette Menu */}
      {showPaletteMobile && (
        <div className="fixed inset-0 z-40 bg-white shadow-lg overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold">Componenten</h2>
            <button onClick={() => setShowPaletteMobile(false)}>
              <X />
            </button>
          </div>
          <ComponentPalette
            onAdd={(type) => {
              handlers.onAddComponent(type)
              setShowPaletteMobile(false)
            }}
          />
        </div>
      )}

      {/* Mobile Settings Modal */}
      {showSettingsModal && selectedComp && (
        <div className="fixed inset-0 z-50 bg-white shadow-lg overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold">Instellingen</h2>
            <button onClick={() => setShowSettingsModal(false)}>
              <X />
            </button>
          </div>
          <div className="p-4">
            <SettingsPanel
              comp={selectedComp}
              onUpdate={(c) => {
                handlers.handleSettingsChange(c)
              }}
            />
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white z-30">
        <BottomNav
          fases={fasesList}
          sectionsByFase={sectionsByFase}
          activeFase={activeFase}
          activeSectionIndex={activeSectionIndex}
          onFaseChange={handlers.onFaseChange}
          onSectionChange={handlers.onSectionChange}
          onAddSection={handlers.onAddSection}
          onEditSection={handlers.openSectionModal}
          onDeleteSection={handlers.onDeleteSection}
        />
      </div>

      {/* Section Modal */}
      <EditSectionModal
        isOpen={modalOpen}
        initialValue={modalValue}
        onSave={handlers.submitSectionModal}
        onClose={handlers.closeSectionModal}
      />
    </div>
  )
}
