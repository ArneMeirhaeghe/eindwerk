import API from "../axios";
import type {
  VerhuurPeriode,
  TourListDto,
  LiveSessionDto,
  StartSessionDto,
} from "./types";

// 1) FakeAPI: verhuurperiodes ophalen
export const getVerhuurperiodes = async (): Promise<VerhuurPeriode[]> => {
  // let op: vóór LiveSession stond hier geen “/api/”
  const res = await API.get<VerhuurPeriode[]>("FakeApi/verhuurperiodes");
  return res.data.map((p) => ({
    ...p,
    aankomst: new Date(p.aankomst).toISOString(),
    vertrek: new Date(p.vertrek).toISOString(),
  }));
};

// 2) Tour‐lijst (voor dropdown)
export const getToursList = async (): Promise<TourListDto[]> => {
  const res = await API.get<TourListDto[]>("/tour");
  return res.data;
};

// 3) Actieve live‐sessies ophalen
export const getActiveLiveSessions = async (): Promise<LiveSessionDto[]> => {
  const res = await API.get<LiveSessionDto[]>("/livesession/active");
  return res.data.map((s) => ({
    ...s,
    aankomst: new Date(s.aankomst).toISOString(),
    vertrek: new Date(s.vertrek).toISOString(),
    startDate: new Date(s.startDate).toISOString(),
  }));
};

// 4) Nieuwe live‐sessie starten
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
  const res = await API.post<LiveSessionDto>("/livesession/start", payload);
  const data = res.data;
  return {
    ...data,
    aankomst: new Date(data.aankomst).toISOString(),
    vertrek: new Date(data.vertrek).toISOString(),
    startDate: new Date(data.startDate).toISOString(),
  };
};

// 5) Publieke live‐sessie ophalen
export const getPublicSession = async (
  id: string
): Promise<LiveSessionDto> => {
  const res = await API.get<LiveSessionDto>(`/livesession/public/${id}`);
  const data = res.data;
  return {
    ...data,
    aankomst: new Date(data.aankomst).toISOString(),
    vertrek: new Date(data.vertrek).toISOString(),
    startDate: new Date(data.startDate).toISOString(),
  };
};
