// File: src/api/verhuur.ts
import API from "./axios"
import type { TourListDto } from "./tours"

export interface Verantwoordelijke {
  naam: string
  tel: string
  mail: string
}

export interface VerhuurPeriode {
  groep: string
  verantwoordelijke: Verantwoordelijke
  aankomst: string
  vertrek: string
  tourId?: string
}

export interface LiveSessionDto {
  id: string
  groep: string
  tourId: string | null
  tourNaam: string | null
  startDate: string
  isActive: boolean
}

export const getVerhuurperiodes = async (): Promise<VerhuurPeriode[]> => {
  const res = await API.get<VerhuurPeriode[]>("/fakeapi/verhuurperiodes")
  return res.data
}

export const getToursList = async (): Promise<TourListDto[]> => {
  const res = await API.get<TourListDto[]>("/tours")
  return res.data
}

export const getActiveLiveSessions = async (): Promise<LiveSessionDto[]> => {
  const res = await API.get<LiveSessionDto[]>("/LiveSession/active")
  return res.data
}

export const startLiveSession = async (
  groep: string,
  tourId: string
): Promise<void> => {
  await API.post("/LiveSession/start", { groep, tourId })
}
