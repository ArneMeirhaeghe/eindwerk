// File: client/src/pages/InventoryManagementPage.tsx
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getInventoryTemplates, deleteInventoryTemplate } from "../api/inventory"
import type { InventoryTemplateDto } from "../api/inventory/types"

export default function InventoryManagementPage() {
  const [templates, setTemplates] = useState<InventoryTemplateDto[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Haal templates bij mount
  useEffect(() => {
    getInventoryTemplates()
      .then(setTemplates)
      .finally(() => setLoading(false))
  }, [])

  // Verwijder na bevestiging
  const handleDelete = async (id: string) => {
    if (!confirm("Weet je het zeker dat je dit template wilt verwijderen?")) return
    await deleteInventoryTemplate(id)
    setTemplates(t => t.filter(x => x.id !== id))
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header met knop voor nieuw template */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Inventaris Templates</h1>
        <Link
          to="/inventory/new"
          className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          + Nieuw template
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Laden…</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Naam</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700"># Lokalen</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-800">{t.naam}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-800">{t.lokalen.length}</td>
                  <td className="px-4 py-3 flex justify-center space-x-2">
                    <button
                      onClick={() => navigate(`/inventory/${t.id}/edit`)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                    >
                      Bewerken
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="px-3 py-1.5 text-red-600 hover:text-red-700 rounded-lg text-sm transition"
                    >
                      Verwijderen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
