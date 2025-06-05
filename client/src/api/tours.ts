// File: client/src/api/tours.ts
import API from "./axios";

// -------------------------------------------------------------
// Typedefs / DTO’s
// -------------------------------------------------------------

// Wat de lijst-endpoint terugstuurt: alleen id + naamLocatie
export interface TourListDto {
  id: string;
  naamLocatie: string;
}

// Een component in een section
export interface ComponentDto {
  id: string;
  type: string;
  props: Record<string, any>;
}

// Een section binnen een fase
export interface SectionDto {
  id: string;
  naam: string;               // “naam” komt uit de API
  components: ComponentDto[];  // lijst van componenten per section
}

// Een Tour met alle 5 fases, waarbij elke fase een array van SectionDto heeft
export interface Tour {
  id: string;
  naamLocatie: string;
  fases: Record<string, SectionDto[]>; // bv. { voor: SectionDto[], aankomst: SectionDto[], … }
}

// -------------------------------------------------------------
// 1) Bestaande Tour‐endpoints (name, lijst, get-by-id, delete)
// -------------------------------------------------------------

/**
 * GET /api/tours  
 * Haal lijst op (id + naamLocatie)
 */
export const getTours = async (): Promise<TourListDto[]> => {
  const res = await API.get<TourListDto[]>("/tours");
  return res.data;
};

/**
 * GET /api/tours/{id}  
 * Haal één tour incl. nested fases → sections → components
 */
export const getTour = async (id: string): Promise<Tour> => {
  const res = await API.get<Tour>(`/tours/${id}`);
  return res.data;
};

/**
 * POST /api/tours  
 * Maak nieuwe tour aan (alle fases beginnen automatisch leeg)
 */
export const createTour = async (
  naamLocatie: string
): Promise<TourListDto> => {
  const res = await API.post<TourListDto>("/tours", { naamLocatie });
  return res.data;
};

/**
 * DELETE /api/tours/{id}  
 * Verwijder tour
 */
export const deleteTour = async (id: string): Promise<void> => {
  await API.delete(`/tours/${id}`);
};

/**
 * PUT /api/tours/{id}  
 * Update alleen de naam (naamLocatie).  
 * Let op: de backend‐controller (UpdateTour) kijkt alleen naar naamLocatie, 
 * je kunt fases hier dus niet meer doorsturen.
 */
export const updateTourNaam = async (
  id: string,
  naamLocatie: string
): Promise<void> => {
  await API.put(`/tours/${id}`, { naamLocatie });
};

// -------------------------------------------------------------
// 2) Section-CRUD binnen fase “voor”, “aankomst”, etc.
// -------------------------------------------------------------

/**
 * POST /api/tours/{tourId}/fases/{fase}/sections  
 * Voeg een nieuwe Section toe onder fase ‘fase’ (bv. “voor”, “aankomst”, …).  
 * BODY: { naam: string }  
 * RETURN: SectionDto (met lege components[])
 */
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

/**
 * PUT /api/tours/{tourId}/fases/{fase}/sections/{sectionId}  
 * Pas de naam van een section aan. BODY: { naam: string }
 */
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

/**
 * DELETE /api/tours/{tourId}/fases/{fase}/sections/{sectionId}  
 * Verwijder een section (incl. alle componenten daarin).
 */
export const deleteSection = async (
  tourId: string,
  fase: string,
  sectionId: string
): Promise<void> => {
  await API.delete(
    `/tours/${tourId}/fases/${fase}/sections/${sectionId}`
  );
};

// -------------------------------------------------------------
// 3) Component-CRUD binnen een section
// -------------------------------------------------------------

/**
 * POST /api/tours/{tourId}/fases/{fase}/sections/{sectionId}/components  
 * Voeg een component toe in een section.  
 * BODY: { type, propsJson }  
 * RETURN: ComponentDto (met gegeneerde id, type, props)
 */
export const addComponent = async (
  tourId: string,
  fase: string,
  sectionId: string,
  type: string,
  props: Record<string, any>
): Promise<ComponentDto> => {
  const propsJson = JSON.stringify(props);
  const res = await API.post<ComponentDto>(
    `/tours/${tourId}/fases/${fase}/sections/${sectionId}/components`,
    { type, propsJson }
  );
  return res.data;
};

/**
 * PUT /api/tours/{tourId}/fases/{fase}/sections/{sectionId}/components/{componentId}  
 * Update van een component binnen een section.  
 * BODY: { type, propsJson }
 */
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
    `/tours/${tourId}/fases/${fase}/sections/${sectionId}/components/${componentId}`,
    { type, propsJson }
  );
};

/**
 * DELETE /api/tours/{tourId}/fases/{fase}/sections/{sectionId}/components/{componentId}  
 * Verwijder één component uit een section
 */
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
