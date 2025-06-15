// File: client/src/api/inventory.ts
import API from "../axios"
import type { CreateInventoryTemplateDto, InventoryTemplateDto, UpdateInventoryTemplateDto } from "./types"

// Haal alle inventory templates op voor de ingelogde user
export const getInventoryTemplates = (): Promise<InventoryTemplateDto[]> =>
  API.get("/inventory").then(res => res.data)

// Haal één template op voor bewerken
export const getInventoryTemplate = (id: string): Promise<InventoryTemplateDto> =>
  API.get(`/inventory/${id}`).then(res => res.data)

// Maak een nieuwe template aan
export const createInventoryTemplate = (dto: CreateInventoryTemplateDto): Promise<InventoryTemplateDto> =>
  API.post("/inventory", dto).then(res => res.data)

// Werk een bestaande template bij
export const updateInventoryTemplate = (id: string, dto: UpdateInventoryTemplateDto): Promise<void> =>
  API.put(`/inventory/${id}`, dto).then(() => {})

// Verwijder een template
export const deleteInventoryTemplate = (id: string): Promise<void> =>
  API.delete(`/inventory/${id}`).then(() => {})
