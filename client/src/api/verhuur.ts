// File: client/src/api/verhuur.ts
import API from './axios'

export interface VerantwoordelijkeDto {
  naam: string
  tel: string
  mail: string
}

export interface VerhuurPeriode {
  id: string
  groep: string
  verantwoordelijke: VerantwoordelijkeDto
  aankomst: string   // ISO-datum als string
  vertrek: string    // ISO-datum als string
}

export interface TourListDto {
  id: string
  naamLocatie: string
}

export interface LiveSessionDto {
  id: string
  groep: string
  tourId: string
  startDate: string  // ISO-datum als string
  isActive: boolean
}

/**
 * Haalt de verhuurperiodes op van FakeApiController:
 * GET /api/FakeApi/verhuurperiodes
 */
export const getVerhuurperiodes = async (): Promise<VerhuurPeriode[]> => {
  const res = await API.get<VerhuurPeriode[]>('/FakeApi/verhuurperiodes')
  // Een enkele periode comeert binnen met Date object, maar we returnen hier strings
  return res.data.map(p => ({
    ...p,
    aankomst: new Date(p.aankomst).toISOString(),
    vertrek: new Date(p.vertrek).toISOString(),
  }))
}

/**
 * Haalt de lijst tours op voor de ingelogde verhuurder:
 * GET /api/Tours
 */
export const getToursList = async (): Promise<TourListDto[]> => {
  const res = await API.get<TourListDto[]>('/Tours')
  return res.data
}

/**
 * Haalt actieve live-sessies op:
 * GET /api/LiveSession/active
 */
export const getActiveLiveSessions = async (): Promise<LiveSessionDto[]> => {
  const res = await API.get<LiveSessionDto[]>('/LiveSession/active')
  // Converteer eventueel startDate naar ISO-string
  return res.data.map(s => ({
    ...s,
    startDate: new Date(s.startDate).toISOString(),
  }))
}

/**
 * Start een nieuwe live-sessie:
 * POST /api/LiveSession/start
 */
export const startLiveSession = async (
  groep: string,
  tourId: string
): Promise<LiveSessionDto> => {
  const res = await API.post<LiveSessionDto>('/LiveSession/start', {
    groep,
    tourId,
  })
  return {
    ...res.data,
    startDate: new Date(res.data.startDate).toISOString(),
  }
}
