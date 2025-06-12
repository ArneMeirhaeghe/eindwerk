// File: src/types/inventory.ts
export interface InventoryItem {
  name: string
  desired: number
  actual?: number
}

export interface Subsection {
  name: string
  items: InventoryItem[]
}

export interface Lokaal {
  name: string
  subsections: Subsection[]
}

export interface InventoryTemplateDto {
  id: string
  naam: string
  lokalen: Lokaal[]
}

export interface CreateInventoryTemplateDto {
  naam: string
  lokalen: Lokaal[]
}

export interface UpdateInventoryTemplateDto {
  naam: string
  lokalen: Lokaal[]
}
