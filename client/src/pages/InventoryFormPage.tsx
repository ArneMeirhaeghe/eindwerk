// File: src/pages/InventoryFormPage.tsx
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import InventoryTemplateForm from "../components/inventory/InventoryTemplateForm"
import {
  getInventoryTemplate,
  createInventoryTemplate,
  updateInventoryTemplate
} from "../api/inventory"
import type { CreateInventoryTemplateDto, InventoryTemplateDto, UpdateInventoryTemplateDto } from "../api/inventory/types"


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

  if (loading) return <p className="p-4">Laden…</p>

  const handleSubmit = async (
    data: CreateInventoryTemplateDto| UpdateInventoryTemplateDto
  ) => {
    if (initial) {
      await updateInventoryTemplate(initial.id, data as UpdateInventoryTemplateDto)
    } else {
      await createInventoryTemplate(data as CreateInventoryTemplateDto)
    }
    nav("/inventory")
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {initial ? "Template bewerken" : "Nieuw template"}
      </h1>
      <InventoryTemplateForm initial={initial ?? undefined} onSubmit={handleSubmit} />
    </div>
  )
}
