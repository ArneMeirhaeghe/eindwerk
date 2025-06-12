// File: src/api/forms/types.ts
export interface FieldDto {
  id: string                    // Unieke identifier
  type: string                  // “text-input” | “textarea” | etc.
  label: string                 // Weergavetekst bij het veld
  settings: { [key: string]: any }  // Extra configuratie per type
  order: number                 // Positie in het formulier
}

export interface FormDto {
  id: string                    // Unieke form-ID
  name: string                  // Leesbare naam form
  userId: string                // Eigenaar (ingelogde user)
  fields: FieldDto[]            // Alle velden in volgorde
}
