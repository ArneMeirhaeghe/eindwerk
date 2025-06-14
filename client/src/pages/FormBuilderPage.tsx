// File: src/pages/FormBuilderPage.tsx
import { Trash2 } from "lucide-react"
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

  if (loading) return <div className="p-4 animate-pulse">Laden…</div>

  if (previewMode) {
    return (
      <div className="p-4 bg-gray-100 h-full">
        <button
          onClick={() => handlers.setPreviewMode(false)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Terug bewerken
        </button>
        <LivePreview name={formName} fields={fields} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
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
        <div className="flex items-center space-x-4">
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
      </div>
      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r bg-white overflow-auto">
          <ComponentPalette onAdd={handlers.onAddField} />
        </aside>
        <main className="flex-1 bg-gray-50 overflow-auto">
          <BuilderCanvas
            components={fields}
            onSelect={handlers.onSelectField}
            onDelete={handlers.onDeleteField}
            onDragEnd={handlers.onDragEndField}
          />
        </main>
        <aside className="w-72 border-l bg-white overflow-auto">
          <SettingsPanel comp={selectedField} onUpdate={handlers.handleSettingsChange} />
        </aside>
      </div>
    </div>
  )
}
