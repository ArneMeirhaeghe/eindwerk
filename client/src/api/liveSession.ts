// File: client/src/api/liveSession.ts
import API from './axios';

// DTO voor publieke live-sessie
export interface TourDto {
  id: string;
  naamLocatie: string;
  fases: Record<string, any[]>; // iedere fase is een array van inhoudsblokken
}

export interface LiveSessionPublicDto {
  id: string;
  groep: string;
  startDate: string;
  tour: TourDto;
}

/**
 * Haalt publieke live-sessie op (geen JWT nodig).
 * GET /api/LiveSession/public/{id}
 */
export const getPublicSession = async (
  id: string
): Promise<LiveSessionPublicDto> => {
  const res = await API.get<LiveSessionPublicDto>(`/LiveSession/public/${id}`);
  return {
    ...res.data,
    startDate: new Date(res.data.startDate).toISOString(), // zorg voor consistente ISO-string
  };
};
