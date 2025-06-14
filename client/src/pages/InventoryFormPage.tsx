import  { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import InventoryTemplateForm from "../components/inventory/InventoryTemplateForm"
import {
  getInventoryTemplate,
  createInventoryTemplate,
  updateInventoryTemplate
} from "../api/inventory"
import type {
  CreateInventoryTemplateDto,
  InventoryTemplateDto,
  UpdateInventoryTemplateDto
} from "../api/inventory/types"

export default function InventoryFormPage() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [initial, setInitial] = useState<InventoryTemplateDto | null>(null)
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    if (id) {
      getInventoryTemplate(id)
        .then(setInitial)
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleSubmit = async (
    data: CreateInventoryTemplateDto | UpdateInventoryTemplateDto
  ) => {
    if (initial) {
      await updateInventoryTemplate(initial.id, data as UpdateInventoryTemplateDto)
    } else {
      await createInventoryTemplate(data as CreateInventoryTemplateDto)
    }
    nav("/inventory")
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Pagina-titel */}
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        {initial ? "Bewerk Inventaris Template" : "Nieuw Inventaris Template"}
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Laden…</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 p-8 hover:shadow-2xl transition">
          <InventoryTemplateForm
            initial={initial ?? undefined}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  )
}
