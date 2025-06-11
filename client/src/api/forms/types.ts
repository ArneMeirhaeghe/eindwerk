// File: src/api/forms/types.ts
export interface FieldDto {
  id: string;
  type: string;
  label: string;
  settings: { [key: string]: any };
  order: number;
}

export interface FormDto {
  id: string;
  name: string;
  fields: FieldDto[];
}
