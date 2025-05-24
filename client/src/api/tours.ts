// src/api/tours.ts

import API from "./axios";

export interface TourListDto {
  id: string;
  naamLocatie: string;
}

export interface Tour {
  id: string;
  naamLocatie: string;
  fases: Record<string, any>;
}

export const getTours = async (): Promise<TourListDto[]> => {
  const res = await API.get<TourListDto[]>("/tours");
  return res.data;
};

export const getTour = async (id: string): Promise<Tour> => {
  const res = await API.get<Tour>(`/tours/${id}`);
  return res.data;
};

export const createTour = async (naamLocatie: string): Promise<Tour> => {
  const res = await API.post<Tour>("/tours", { naamLocatie });
  return res.data;
};

export const updateTour = async (
  id: string,
  dto: { naamLocatie: string; fases: Record<string, any> }
): Promise<Tour> => {
  const res = await API.put<Tour>(`/tours/${id}`, {
    naamLocatie: dto.naamLocatie,
    fases: dto.fases,
  });
  return res.data;
};

export const deleteTour = async (id: string): Promise<void> => {
  await API.delete(`/tours/${id}`);
};
