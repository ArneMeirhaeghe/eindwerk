import API from "../axios";
import type { VerhuurPeriode, LiveSessionDto, StartSessionDto } from "./types";

// GET  /api/FakeApi/verhuurperiodes
export const getVerhuurperiodes = async (): Promise<VerhuurPeriode[]> => {
  const res = await API.get<VerhuurPeriode[]>("/FakeApi/verhuurperiodes");
  return res.data.map((p) => ({
    ...p,
    aankomst: new Date(p.aankomst).toISOString(),
    vertrek: new Date(p.vertrek).toISOString(),
  }));
};

// GET  /api/livesession/active
export const getActiveLiveSessions = async (): Promise<LiveSessionDto[]> => {
  const res = await API.get<LiveSessionDto[]>("/livesession/active");
  return res.data.map((s) => ({
    ...s,
    aankomst: new Date(s.aankomst).toISOString(),
    vertrek: new Date(s.vertrek).toISOString(),
    startDate: new Date(s.startDate).toISOString(),
    responses: s.responses || {},
  }));
};

// GET  /api/livesession/all
export const getAllLiveSessions = async (): Promise<LiveSessionDto[]> => {
  const res = await API.get<LiveSessionDto[]>("/livesession/all");
  return res.data.map((s) => ({
    ...s,
    aankomst: new Date(s.aankomst).toISOString(),
    vertrek: new Date(s.vertrek).toISOString(),
    startDate: new Date(s.startDate).toISOString(),
    responses: s.responses || {},
  }));
};

// GET  /api/livesession/{id}
export const getLiveSession = async (
  id: string
): Promise<LiveSessionDto> => {
  const res = await API.get<LiveSessionDto>(`/livesession/${id}`);
  const s = res.data;
  return {
    ...s,
    aankomst: new Date(s.aankomst).toISOString(),
    vertrek: new Date(s.vertrek).toISOString(),
    startDate: new Date(s.startDate).toISOString(),
    responses: s.responses || {},
  };
};

// POST /api/livesession/start
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
  const s = res.data;
  return {
    ...s,
    aankomst: new Date(s.aankomst).toISOString(),
    vertrek: new Date(s.vertrek).toISOString(),
    startDate: new Date(s.startDate).toISOString(),
    responses: s.responses || {},
  };
};
