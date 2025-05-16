// client/src/hooks/usePlan.ts

import { useState, useEffect } from "react"
import type { Plan } from "../types/Plan"
import {
  getPlanById,
  updatePlan,
  createPlan,
} from "../api/api"

// Haal of maak één plan
export function usePlan(id?: string) {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getPlanById(id)
      .then((p) => setPlan(p))
      .finally(() => setLoading(false))
  }, [id])

  const savePlan = async (p: Plan) => {
    const updated = await updatePlan(p)
    setPlan(updated)
    return updated
  }

  const createNew = async (ownerId: string, p: Omit<Plan, "id">) => {
    const created = await createPlan(ownerId, p)
    setPlan(created)
    return created
  }

  return { plan, loading, savePlan, createNew }
}
