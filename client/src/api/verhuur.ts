// File: client/src/api/verhuur.ts
import API from './axios';

export interface VerantwoordelijkeDto {
  naam: string;
  tel: string;
  mail: string;
}

export interface VerhuurPeriode {
  id: string;
  groep: string;
  verantwoordelijke: VerantwoordelijkeDto;
  aankomst: string; // ISO-string
  vertrek: string;  // ISO-string
}

export interface TourListDto {
  id: string;
  naamLocatie: string;
}

// DTO voor Tour in live sessie
export interface TourDto {
  id: string;
  naamLocatie: string;
  fases: Record<string, any[]>;
}

// DTO voor LiveSession
export interface LiveSessionDto {
  id: string;
  groep: string;
  startDate: string; // ISO-string
  isActive: boolean;
  creatorId: string;
  tour: TourDto;
  publicUrl: string;
}

/**
 * Haalt verhuurperiodes op (Fake API):
 * GET /api/FakeApi/verhuurperiodes
 */
export const getVerhuurperiodes = async (): Promise<VerhuurPeriode[]> => {
  const res = await API.get<VerhuurPeriode[]>('/FakeApi/verhuurperiodes');
  return res.data.map(p => ({
    ...p,
    aankomst: new Date(p.aankomst).toISOString(),
    vertrek: new Date(p.vertrek).toISOString(),
  }));
};

/**
 * Haalt lijst tours op:
 * GET /api/Tours
 */
export const getToursList = async (): Promise<TourListDto[]> => {
  const res = await API.get<TourListDto[]>('/Tours');
  return res.data;
};

/**
 * Haalt actieve live-sessies op:
 * GET /api/LiveSession/active
 */
export const getActiveLiveSessions = async (): Promise<LiveSessionDto[]> => {
  const res = await API.get<LiveSessionDto[]>('/LiveSession/active');
  return res.data.map(s => ({
    ...s,
    startDate: new Date(s.startDate).toISOString(),
  }));
};

/**
 * Start een nieuwe live-sessie met geselecteerde secties:
 * POST /api/LiveSession/start
 */
export interface StartSessionDto {
  groep: string;
  tourId: string;
  sectionIds: string[];
}
export const startLiveSession = async (
  groep: string,
  tourId: string,
  sectionIds: string[]
): Promise<LiveSessionDto> => {
  const payload: StartSessionDto = { groep, tourId, sectionIds };
  const res = await API.post<LiveSessionDto>('/LiveSession/start', payload);
  const data = res.data;
  return {
    ...data,
    startDate: new Date(data.startDate).toISOString(),
  };
};
