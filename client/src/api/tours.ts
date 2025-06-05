// File: src/api/tours.ts
import API from "./axios";

// DTO voor tourlijst (id + naamLocatie)
export interface TourListDto {
  id: string;
  naamLocatie: string;
}

// DTO voor component in een section
export interface ComponentDto {
  id: string;
  type: string;
  props: any;
}

// DTO voor section in een fase
export interface SectionDto {
  id: string;
  naam: string;
  components: ComponentDto[];
}

// Volledige Tour met alle fases en sections
export interface Tour {
  id: string;
  naamLocatie: string;
  fases: Record<string, SectionDto[]>;
}

// Haal lijst van tours op
export const getTours = async (): Promise<TourListDto[]> => {
  const res = await API.get<TourListDto[]>("/tours");
  return res.data;
};

// Haal één tour op incl. nested fases → sections → components
export const getTour = async (id: string): Promise<Tour> => {
  const res = await API.get<Tour>(`/tours/${id}`);
  return res.data;
};

// Maak nieuwe tour aan; fases starten leeg
export const createTour = async (
  naamLocatie: string
): Promise<TourListDto> => {
  const res = await API.post<TourListDto>("/tours", { naamLocatie });
  return res.data;
};

// Verwijder tour
export const deleteTour = async (id: string): Promise<void> => {
  await API.delete(`/tours/${id}`);
};

// Update alleen de naam van een tour
export const updateTourNaam = async (
  id: string,
  naamLocatie: string
): Promise<void> => {
  await API.put(`/tours/${id}`, { naamLocatie });
};

// Voeg nieuwe section toe in fase
export const addSection = async (
  tourId: string,
  fase: string,
  naam: string
): Promise<SectionDto> => {
  const res = await API.post<SectionDto>(
    `/tours/${tourId}/fases/${fase}/sections`,
    { naam }
  );
  return res.data;
};

// Hernoem een section
export const updateSection = async (
  tourId: string,
  fase: string,
  sectionId: string,
  naam: string
): Promise<void> => {
  await API.put(
    `/tours/${tourId}/fases/${fase}/sections/${sectionId}`,
    { naam }
  );
};

// Verwijder een section inclusief componenten
export const deleteSection = async (
  tourId: string,
  fase: string,
  sectionId: string
): Promise<void> => {
  await API.delete(
    `/tours/${tourId}/fases/${fase}/sections/${sectionId}`
  );
};

// Voeg component toe in section
export const addComponent = async (
  tourId: string,
  fase: string,
  sectionId: string,
  type: string,
  props: any
): Promise<ComponentDto> => {
  const propsJson = JSON.stringify(props);
  const res = await API.post<ComponentDto>(
    `/tours/${tourId}/fases/${fase}/sections/${sectionId}/components`,
    { type, propsJson }
  );
  return res.data;
};

// Update component binnen section
export const updateComponent = async (
  tourId: string,
  fase: string,
  sectionId: string,
  componentId: string,
  type: string,
  props: any
): Promise<void> => {
  const propsJson = JSON.stringify(props);
  await API.put(
    `/tours/${tourId}/fases/${fase}/sections/${sectionId}/components/${componentId}`,
    { type, propsJson }
  );
};

// Verwijder component uit section
export const deleteComponent = async (
  tourId: string,
  fase: string,
  sectionId: string,
  componentId: string
): Promise<void> => {
  await API.delete(
    `/tours/${tourId}/fases/${fase}/sections/${sectionId}/components/${componentId}`
  );
};
