// src/api/inventory.ts
import axios from "./axios"
import type { InventorySection, NewInventorySection } from "../types/Inventory"

/** Haal alle secties voor een verhuurder op */
export const getSectionsByUser = async (
  ownerId: string
): Promise<InventorySection[]> => {
  const res = await axios.get(`/inventory/user/${ownerId}`)
  return res.data
}

/** Haal één sectie op */
export const getSectionById = async (
  id: string
): Promise<InventorySection> => {
  const res = await axios.get(`/inventory/${id}`)
  return res.data
}

/** Maak een nieuwe sectie */
export const createSection = async (
  section: NewInventorySection
): Promise<InventorySection> => {
  const res = await axios.post("/inventory", section)
  return res.data
}

/** Update een bestaande sectie */
export const updateSection = async (
  id: string,
  section: InventorySection
): Promise<void> => {
  await axios.put(`/inventory/${id}`, section)
}

/** Verwijder een sectie */
export const deleteSection = async (id: string): Promise<void> => {
  await axios.delete(`/inventory/${id}`)
}
