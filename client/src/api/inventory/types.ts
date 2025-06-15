// File: client/src/api/types.ts
// Interfaces voor inventory-functionaliteit

// Eén item in een subsection
export interface InventoryItem {
  name: string           // Naam van het item
  desired: number        // Gewenst aantal
  actual?: number        // Actueel geteld aantal (optioneel)
}

// Onderdelen in een lokaal
export interface Subsection {
  name: string           // Naam van de subsectie
  items: InventoryItem[] // Lijst van items
}

// Eén lokaal in de template
export interface Lokaal {
  name: string             // Naam van het lokaal
  subsections: Subsection[]// Lijst van subsections
}

// DTO uit backend voor weergeven/bewerken
export interface InventoryTemplateDto {
  id: string
  naam: string
  lokalen: Lokaal[]
}

// Payload voor maken
export interface CreateInventoryTemplateDto {
  naam: string
  lokalen: Lokaal[]
}

// Payload voor bijwerken
export interface UpdateInventoryTemplateDto {
  naam: string
  lokalen: Lokaal[]
}
