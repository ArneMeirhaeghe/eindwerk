// File: src/api/inventory.ts
import axios from "../axios"
import type { CreateInventoryTemplateDto, InventoryTemplateDto, UpdateInventoryTemplateDto } from "./types"


export const getInventoryTemplates = () =>
  axios.get<InventoryTemplateDto[]>("/inventory").then(res => res.data)

export const getInventoryTemplate = (id: string) =>
  axios.get<InventoryTemplateDto>(`/inventory/${id}`).then(res => res.data)

export const createInventoryTemplate = (dto: CreateInventoryTemplateDto) =>
  axios.post<InventoryTemplateDto>("/inventory", dto).then(res => res.data)

export const updateInventoryTemplate = (id: string, dto: UpdateInventoryTemplateDto) =>
  axios.put(`/inventory/${id}`, dto)

export const deleteInventoryTemplate = (id: string) =>
  axios.delete(`/inventory/${id}`)
