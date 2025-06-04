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

// DTO die backend nu retourneert voor Tour
export interface TourDto {
  id: string;
  naamLocatie: string;
  fases: Record<string, any[]>; // BsonDocument[] komt als any[]
}

// DTO die backend nu retourneert voor LiveSession
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
    // tour en publicUrl blijven ongewijzigd
  }));
};

/**
 * Start een nieuwe live-sessie:
 * POST /api/LiveSession/start
 */
export const startLiveSession = async (
  groep: string,
  tourId: string
): Promise<LiveSessionDto> => {
  const res = await API.post<LiveSessionDto>('/LiveSession/start', { groep, tourId });
  const data = res.data;
  return {
    ...data,
    startDate: new Date(data.startDate).toISOString(),
  };
};
