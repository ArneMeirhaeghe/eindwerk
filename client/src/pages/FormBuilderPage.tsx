// File: src/pages/FormBuilderPage.tsx

import { useState } from "react"
import { Trash2, Plus, X } from "lucide-react"
import LivePreview from "../components/formbuilder/LivePreview"
import ComponentPalette from "../components/formbuilder/ComponentPalette"
import BuilderCanvas from "../components/formbuilder/BuilderCanvas"
import SettingsPanel from "../components/formbuilder/SettingsPanel"
import { useFormBuilder } from "../hooks/useFormBuilder"

export default function FormBuilderPage() {
  const {
    loading,
    formsList,
    formId,
    formName,
    fields,
    selectedField,
    previewMode,
    handlers
  } = useFormBuilder()

  const [showPaletteMobile, setShowPaletteMobile] = useState(false)
  const [showSettingsMobile, setShowSettingsMobile] = useState(false)

  if (loading) return <div className="p-4 animate-pulse">Laden…</div>

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
          <LivePreview name={formName} fields={fields} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center px-4 py-3 border-b bg-white gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={formId ?? "__new__"}
            onChange={e => {
              e.target.value === "__new__"
                ? handlers.createNewForm()
                : handlers.loadForm(e.target.value)
            }}
            className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
          >
            <option value="__new__">+ Nieuw formulier</option>
            {formsList.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={formName}
            onChange={e => handlers.setFormName(e.target.value)}
            placeholder="Formulier naam"
            className="px-3 py-2 border rounded shadow-sm w-60 focus:outline-none focus:ring"
          />
          {formId && (
            <button
              onClick={() => {
                if (confirm("Weet je zeker dat je dit formulier wilt verwijderen?")) {
                  handlers.removeForm()
                }
              }}
              className="p-2 hover:bg-red-50 rounded"
            >
              <Trash2 size={20} className="text-red-500" />
            </button>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlers.setPreviewMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow"
          >
            Preview
          </button>
          <button
            onClick={handlers.saveForm}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded shadow disabled:opacity-50"
          >
            {loading ? "Opslaan…" : "Opslaan"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop: componenten */}
        <aside className="hidden lg:flex lg:flex-col w-64 border-r bg-white overflow-y-auto">
          <ComponentPalette onAdd={handlers.onAddField} />
        </aside>

        {/* Canvas */}
        <main className="flex-1 overflow-auto p-4">
          <BuilderCanvas
            components={fields}
            onSelect={(f) => {
              handlers.onSelectField(f)
              if (window.innerWidth < 1024) setShowSettingsMobile(true)
            }}
            onDelete={handlers.onDeleteField}
            onDragEnd={handlers.onDragEndField}
          />
        </main>

        {/* Desktop: settings */}
        <aside className="hidden lg:flex lg:flex-col w-72 border-l bg-white overflow-y-auto">
          <SettingsPanel
            comp={selectedField}
            onUpdate={handlers.handleSettingsChange}
          />
        </aside>
      </div>

      {/* Mobiel: add button */}
      <button
        onClick={() => setShowPaletteMobile(true)}
        className="fixed bottom-24 right-4 lg:hidden p-4 bg-blue-600 text-white rounded-full shadow-lg"
        aria-label="Open componenten"
      >
        <Plus size={24} />
      </button>

      {/* Mobiel: component modal */}
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
                handlers.onAddField(type)
                setShowPaletteMobile(false)
              }}
            />
          </div>
        </div>
      )}

      {/* Mobiel: instellingen modal */}
      {showSettingsMobile && selectedField && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Instellingen</h2>
            <button onClick={() => setShowSettingsMobile(false)}>
              <X />
            </button>
          </div>
          <div className="p-4">
            <SettingsPanel
              comp={selectedField}
              onUpdate={handlers.handleSettingsChange}
            />
          </div>
        </div>
      )}
    </div>
  )
}
