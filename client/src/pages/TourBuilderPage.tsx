import React, { useState } from "react"
import ComponentPalette from "../components/builder/ComponentPalette"
import BuilderCanvas from "../components/builder/BuilderCanvas"
import BottomNav from "../components/builder/BottomNav"
import SettingsPanel from "../components/builder/SettingsPanel"
import EditSectionModal from "../components/builder/EditSectionModal"
import { useTourBuilder } from "../hooks/useTourBuilder"
import LivePreview from "../components/builder/LivePreview"
import { X, Plus } from "lucide-react"

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

  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showPaletteMobile, setShowPaletteMobile] = useState(false)

  if (loading)
    return (
      <div className="p-4 animate-pulse text-center">Laden…</div>
    )

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 flex flex-col items-center">
        <button
          onClick={() => handlers.setPreviewMode(false)}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Terug naar bewerken
        </button>
        <div className="w-full max-w-3xl mt-8 p-4 bg-white rounded-xl shadow-lg">
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 text-center">
        <h1
          className="text-xl font-bold text-white cursor-pointer inline-block"
          onClick={() => handlers.openSectionModal(activeSectionIndex)}
        >
          {current.title}
        </h1>
        <button
          onClick={() => handlers.setPreviewMode(true)}
          className="ml-4 px-4 py-1 bg-white text-blue-600 rounded-full shadow hidden lg:inline-block hover:bg-gray-100 transition"
        >
          Preview
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop: palette */}
        <aside className="hidden lg:flex lg:flex-col w-64 border-r bg-white overflow-y-auto">
          <ComponentPalette onAdd={handlers.onAddComponent} />
        </aside>

        {/* Canvas */}
        <main className="flex-1 p-4 overflow-auto flex justify-center">
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
            selectedId={selectedComp?.id}
          />
        </main>

        {/* Desktop: settings */}
        <aside className="hidden lg:flex lg:flex-col w-72 border-l bg-white overflow-y-auto">
          <SettingsPanel
            comp={selectedComp}
            onUpdate={handlers.handleSettingsChange}
          />
        </aside>
      </div>

      {/* Mobiele componentenkiezer */}
      <button
        onClick={() => setShowPaletteMobile(true)}
        className="fixed bottom-24 right-4 lg:hidden p-4 bg-blue-600 text-white rounded-full shadow-lg"
        aria-label="Open componenten"
      >
        <Plus size={24} />
      </button>
      {showPaletteMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="w-full max-h-[80vh] bg-white rounded-t-2xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Componenten</h2>
              <button
                onClick={() => setShowPaletteMobile(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Sluiten
              </button>
            </div>
            <ComponentPalette
              onAdd={(type) => {
                handlers.onAddComponent(type)
                setShowPaletteMobile(false)
              }}
            />
          </div>
        </div>
      )}

      {/* Mobiele settings */}
      {showSettingsModal && selectedComp && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Instellingen</h2>
            <button onClick={() => setShowSettingsModal(false)}>
              <X />
            </button>
          </div>
          <div className="p-4">
            <SettingsPanel
              comp={selectedComp}
              onUpdate={(c) => handlers.handleSettingsChange(c)}
            />
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow p-2">
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
      </footer>

      {/* Sectie modal */}
      <EditSectionModal
        isOpen={modalOpen}
        initialValue={modalValue}
        onSave={handlers.submitSectionModal}
        onClose={handlers.closeSectionModal}
      />
    </div>
  )
}
