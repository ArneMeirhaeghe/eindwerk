// File: src/pages/InventoryManagementPage.tsx
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

  useEffect(() => {
    getInventoryTemplates()
      .then(setTemplates)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je het zeker?")) return
    await deleteInventoryTemplate(id)
    setTemplates(t => t.filter(x => x.id !== id))
  }

  if (loading) return <p className="p-4">Laden…</p>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventaris templates</h1>
        <Link
          to="/inventory/new"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Nieuw template
        </Link>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2 text-left">Naam</th>
            <th className="border px-3 py-2"># Lokalen</th>
            <th className="border px-3 py-2">Acties</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(t => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{t.naam}</td>
              <td className="border px-3 py-2">{t.lokalen.length}</td>
              <td className="border px-3 py-2 space-x-2">
                <button
                  onClick={() => nav(`/inventory/${t.id}/edit`)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
