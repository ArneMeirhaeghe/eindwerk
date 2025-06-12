// File: src/api/forms/index.ts
import API from "../axios"
import type { FormDto, FieldDto } from "./types"

/**
 * Haal alle formulieren van de ingelogde gebruiker op.
 */
export function getForms(): Promise<FormDto[]> {
  return API.get("/forms").then(res => res.data)
}

/**
 * Haal één formulier op op basis van ID.
 */
export function getForm(id: string): Promise<FormDto> {
  return API.get(`/forms/${id}`).then(res => res.data)
}

/**
 * Maak een nieuw formulier aan (server koppelt automatisch userId).
 */
export function createForm(payload: { name: string; fields: FieldDto[] }): Promise<FormDto> {
  return API.post("/forms", payload).then(res => res.data)
}

/**
 * Werk een bestaand formulier bij.
 */
export function updateForm(
  id: string,
  payload: { name: string; fields: FieldDto[] }
): Promise<void> {
  return API.put(`/forms/${id}`, payload).then(() => {})
}

/**
 * Verwijder een formulier.
 */
export function deleteForm(id: string): Promise<void> {
  return API.delete(`/forms/${id}`).then(() => {})
}
