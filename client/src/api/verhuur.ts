// File: client/src/api/verhuur.ts
import API from "./axios";

export interface VerantwoordelijkeDto {
  naam: string;
  tel: string;
  mail: string;
}

export interface VerhuurPeriode {
  id: string;
  verhuurderId: string;
  groep: string;
  verantwoordelijke: VerantwoordelijkeDto;
  aankomst: string;
  vertrek: string;
}

export interface TourListDto {
  id: string;
  naamLocatie: string;
}

export interface ComponentSnapshot {
  id: string;
  type: string;
  props: Record<string, any>;
}

export interface SectionSnapshot {
  id: string;
  naam: string;
  components: ComponentSnapshot[];
}

export interface LiveSessionDto {
  id: string;
  verhuurderId: string;
  groep: string;
  verantwoordelijkeNaam: string;
  verantwoordelijkeTel: string;
  verantwoordelijkeMail: string;
  aankomst: string;
  vertrek: string;
  tourId: string;
  tourName: string;
  startDate: string;
  isActive: boolean;
  creatorId: string;
  fases: Record<string, SectionSnapshot[]>;
  publicUrl: string;
}

export const getVerhuurperiodes = async (): Promise<VerhuurPeriode[]> => {
  const res = await API.get<VerhuurPeriode[]>("/FakeApi/verhuurperiodes");
  return res.data.map((p) => ({
    ...p,
    aankomst: new Date(p.aankomst).toISOString(),
    vertrek: new Date(p.vertrek).toISOString(),
  }));
};

export const getToursList = async (): Promise<TourListDto[]> => {
  const res = await API.get<TourListDto[]>("/Tours");
  return res.data;
};

export const getActiveLiveSessions = async (): Promise<LiveSessionDto[]> => {
  const res = await API.get<LiveSessionDto[]>("/LiveSession/active");
  return res.data.map((s) => ({
    ...s,
    aankomst: new Date(s.aankomst).toISOString(),
    vertrek: new Date(s.vertrek).toISOString(),
    startDate: new Date(s.startDate).toISOString(),
  }));
};

export interface StartSessionDto {
  verhuurderId: string;
  groep: string;
  verantwoordelijkeNaam: string;
  verantwoordelijkeTel: string;
  verantwoordelijkeMail: string;
  aankomst: string;
  vertrek: string;
  tourId: string;
  tourName: string;
  sectionIds: string[];
}

export const startLiveSession = async (
  periode: VerhuurPeriode,
  tourId: string,
  tourName: string,
  sectionIds: string[]
): Promise<LiveSessionDto> => {
  const payload: StartSessionDto = {
    verhuurderId: periode.verhuurderId,
    groep: periode.groep,
    verantwoordelijkeNaam: periode.verantwoordelijke.naam,
    verantwoordelijkeTel: periode.verantwoordelijke.tel,
    verantwoordelijkeMail: periode.verantwoordelijke.mail,
    aankomst: periode.aankomst,
    vertrek: periode.vertrek,
    tourId,
    tourName,
    sectionIds,
  };
  const res = await API.post<LiveSessionDto>("/LiveSession/start", payload);
  const data = res.data;
  return {
    ...data,
    aankomst: new Date(data.aankomst).toISOString(),
    vertrek: new Date(data.vertrek).toISOString(),
    startDate: new Date(data.startDate).toISOString(),
  };
};

export const getPublicSession = async (
  id: string
): Promise<LiveSessionDto> => {
  const res = await API.get<LiveSessionDto>(`/LiveSession/public/${id}`);
  const data = res.data;
  return {
    ...data,
    aankomst: new Date(data.aankomst).toISOString(),
    vertrek: new Date(data.vertrek).toISOString(),
    startDate: new Date(data.startDate).toISOString(),
  };
};
