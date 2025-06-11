// File: src/api/forms/index.ts
import API from "../axios";
import type { FormDto } from "./types";

export async function getForms(): Promise<FormDto[]> {
  const res = await API.get<FormDto[]>("/forms");
  return res.data;
}

export async function getForm(id: string): Promise<FormDto> {
  const res = await API.get<FormDto>(`/forms/${id}`);
  return res.data;
}

export async function createForm(form: Omit<FormDto, "id">): Promise<FormDto> {
  const res = await API.post<FormDto>("/forms", form);
  return res.data;
}

export async function updateForm(id: string, form: Omit<FormDto, "id">): Promise<void> {
  await API.put(`/forms/${id}`, form);
}

export async function deleteForm(id: string): Promise<void> {
  await API.delete(`/forms/${id}`);
}
