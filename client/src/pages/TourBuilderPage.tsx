// File: src/pages/TourBuilderPage.tsx
import React from "react";
import LivePreview from "../components/builder/LivePreview";
import ComponentPalette from "../components/builder/ComponentPalette";
import BuilderCanvas from "../components/builder/BuilderCanvas";
import BottomNav from "../components/builder/BottomNav";
import SettingsPanel from "../components/builder/SettingsPanel";
import EditSectionModal from "../components/builder/EditSectionModal";
import { useTourBuilder } from "../hooks/useTourBuilder";

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
  } = useTourBuilder();

  if (loading) return <div className="p-4 animate-pulse">Laden…</div>;

  if (previewMode) {
    return (
      <div className="relative h-full bg-gray-100">
        <div className="p-4">
          <button
            onClick={() => handlers.setPreviewMode(false)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Terug naar bewerken
          </button>
          <LivePreview fases={fasesList} sectionsByFase={sectionsByFase} />
        </div>
      </div>
    );
  }

  const current = sectionsByFase[activeFase][activeSectionIndex];

  return (
    <div className="flex flex-col h-full">
      {/* Header: Preview knop links, sectie/titel midden */}
      <div className="grid grid-cols-3 items-center px-4 py-2 border-b">
        <div className="flex justify-start">
          <button
            onClick={() => handlers.setPreviewMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Preview
          </button>
        </div>
        <div className="flex flex-col items-center">
          <h1
            className="text-lg font-semibold cursor-pointer"
            onClick={() => handlers.openSectionModal(activeSectionIndex)}
          >
            {current.title}
          </h1>
         
        </div>
        <div />
      </div>

      {/* Scrollable area: Palette, Canvas & Settings scroll together */}
            {/* Layout: Palette, Canvas (scrollable), Settings (fixed) */}
      <div className="flex flex-1 justify-between">
        {/* Component Palette */}
        <div className=" border-r overflow-y-auto">
          <ComponentPalette onAdd={handlers.onAddComponent} />
        </div>

        {/* Builder Canvas */}
        <div className=" h-full overflow-y-auto">
          <BuilderCanvas
            components={current.components}
            sectionTitle={current.title}
            preview={false}
            onSelect={handlers.onSelectComponent}
            onDelete={handlers.onDeleteComponent}
            onDragEnd={handlers.onDragEnd}
            onSectionTitleClick={() => handlers.openSectionModal(activeSectionIndex)}
          />
        </div>

        {/* Settings Panel */}
        <div className=" border-l">
          <SettingsPanel
            comp={selectedComp}
            onUpdate={handlers.handleSettingsChange}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="h-16 border-t">
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

      {/* Modals */}
      <EditSectionModal
        isOpen={modalOpen}
        initialValue={modalValue}
        onSave={handlers.submitSectionModal}
        onClose={handlers.closeSectionModal}
      />
    </div>
  );
}
