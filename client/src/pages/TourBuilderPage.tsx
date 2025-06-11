// File: src/pages/TourBuilderPage.tsx
import React from "react";
import { ToastContainer } from "react-toastify";
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
    <div className="flex flex-col h-full ">
      {/* Top columns: Palette, Canvas, Settings */}
      <div className="flex flex-1 overflow-hidden justify-between"> 
        {/* Component Palette: 1/5 width */}
        <div className=" border-r overflow-auto">
          <ComponentPalette onAdd={handlers.onAddComponent} />
        </div>

        {/* Builder Canvas: 3/5 width */}
        <div className=" overflow-auto">
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

        {/* Settings Panel: 1/5 width */}
        <div className=" border-l overflow-auto">
          <SettingsPanel comp={selectedComp} onUpdate={handlers.handleSettingsChange} />
        </div>
      </div>

      {/* Bottom Navigation: fixed height */}
      <div className="h-32 border-t">
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

      {/* Modals and toasts */}
      <EditSectionModal
        isOpen={modalOpen}
        initialValue={modalValue}
        onSave={handlers.submitSectionModal}
        onClose={handlers.closeSectionModal}
      />
      {/* <ToastContainer position="bottom-right" autoClose={3000} /> */}
    </div>
  );
}
