// client/src/api/api.ts

import axios from "./axios"
import type { Plan } from "../types/Plan"

// Haal alle plannen van een user
export const getAllPlansByUser = async (ownerId: string): Promise<Plan[]> => {
  const res = await axios.get(`/plans/user/${ownerId}`)
  return res.data
}

// Haal één plan op
export const getPlanById = async (id: string): Promise<Plan> => {
  const res = await axios.get(`/plans/${id}`)
  return res.data
}

// Maak nieuw plan
export const createPlan = async (
  ownerId: string,
  plan?: Omit<Plan, "id">
): Promise<Plan> => {
  const payload = plan ?? {
    ownerId,
    title: "Nieuw plan",
    blocks: [],
  }
  const res = await axios.post("/plans", payload)
  return res.data
}

// Update bestaand plan
export const updatePlan = async (plan: Plan): Promise<Plan> => {
  const res = await axios.put(`/plans/${plan.id}`, plan)
  return res.data
}

// Verwijder plan
export const deletePlan = async (id: string): Promise<void> => {
  await axios.delete(`/plans/${id}`)
}
