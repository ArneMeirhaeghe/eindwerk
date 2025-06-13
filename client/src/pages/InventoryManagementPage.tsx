import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  getInventoryTemplates,
  deleteInventoryTemplate
} from "../api/inventory"
import type { InventoryTemplateDto } from "../api/inventory/types"

export default function InventoryManagementPage() {
  const [templates, setTemplates] = useState<InventoryTemplateDto[]>([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  // Haal alle templates op bij mount
  useEffect(() => {
    getInventoryTemplates()
      .then(setTemplates)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je het zeker?")) return
    await deleteInventoryTemplate(id)
    setTemplates((t) => t.filter((x) => x.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header-kaart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col sm:flex-row items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
          Inventaris Templates
        </h1>
        <Link
          to="/inventory/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 text-white font-medium px-4 py-2 rounded-lg shadow transition"
        >
          + Nieuw template
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Laden…</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Naam
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                  # Lokalen
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {templates.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Naam en aantal lokalen */}
                  <td className="px-6 py-4 text-sm text-gray-800">{t.naam}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-800">
                    {t.lokalen.length}
                  </td>
                  {/* Actieknoppen */}
                  <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                    {/* Edit-knop in blauwtinten zoals de rest van de app */}
                    <button
                      onClick={() => nav(`/inventory/${t.id}/edit`)}
                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 text-white font-medium px-3 py-1.5 rounded-lg shadow transition"
                    >
                      Edit
                    </button>
                    {/* Delete-knop subtiel */}
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg transition"
                    >
                      Delete
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
