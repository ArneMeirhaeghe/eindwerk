// File: src/api/tours/index.ts

import API from "../axios";
import type { TourListDto, Tour, SectionDto, ComponentDto } from "./types";

// 1) Alle tours (id + naamLocatie)
export const getToursList = async (): Promise<TourListDto[]> => {
  const res = await API.get<TourListDto[]>("/tour");
  return res.data;
};

// 2) Eén tour ophalen (inclusief fases & secties)
export const getTour = async (id: string): Promise<Tour> => {
  const res = await API.get<Tour>(`/tour/${id}`);
  return res.data;
};

// 3) Tour aanmaken
export const createTour = async (
  naamLocatie: string
): Promise<TourListDto> => {
  const res = await API.post<TourListDto>("/tour", { naamLocatie });
  return res.data;
};

// 4) Tour verwijderen
export const deleteTour = async (id: string): Promise<void> => {
  await API.delete(`/tour/${id}`);
};

// 5) Tournaam updaten
export const updateTourNaam = async (
  id: string,
  naamLocatie: string
): Promise<void> => {
  await API.put(`/tour/${id}`, { naamLocatie });
};

// 6) Section‐CRUD (binnen fases)
export const addSection = async (
  tourId: string,
  fase: string,
  naam: string
): Promise<SectionDto> => {
  const res = await API.post<SectionDto>(
    `/tour/${tourId}/fases/${fase}/sections`,
    { naam }
  );
  return res.data;
};

export const updateSection = async (
  tourId: string,
  fase: string,
  sectionId: string,
  naam: string
): Promise<void> => {
  await API.put(
    `/tour/${tourId}/fases/${fase}/sections/${sectionId}`,
    { naam }
  );
};

export const deleteSection = async (
  tourId: string,
  fase: string,
  sectionId: string
): Promise<void> => {
  await API.delete(
    `/tour/${tourId}/fases/${fase}/sections/${sectionId}`
  );
};

// 7) Component‐CRUD (binnen section)
export const addComponent = async (
  tourId: string,
  fase: string,
  sectionId: string,
  type: string,
  props: Record<string, any>
): Promise<ComponentDto> => {
  const propsJson = JSON.stringify(props);
  const res = await API.post<ComponentDto>(
    `/tour/${tourId}/fases/${fase}/sections/${sectionId}/components`,
    { type, propsJson }
  );
  return res.data;
};

export const updateComponent = async (
  tourId: string,
  fase: string,
  sectionId: string,
  componentId: string,
  type: string,
  props: Record<string, any>
): Promise<void> => {
  const propsJson = JSON.stringify(props);
  await API.put(
    `/tour/${tourId}/fases/${fase}/sections/${sectionId}/components/${componentId}`,
    { type, propsJson }
  );
};

export const deleteComponent = async (
  tourId: string,
  fase: string,
  sectionId: string,
  componentId: string
): Promise<void> => {
  await API.delete(
    `/tour/${tourId}/fases/${fase}/sections/${sectionId}/components/${componentId}`
  );
};
