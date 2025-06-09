// File: src/api/liveSession/index.ts

import API from "../axios";
import type {
  LiveSessionDto,
  StartSessionDto,
  PatchFieldDto,
  BulkResponsesDto,
  MediaItemDto,
} from "./types";

// 1) Start een nieuwe live-sessie
//    POST /api/LiveSession/start
export const startLiveSession = async (
  dto: StartSessionDto
): Promise<LiveSessionDto> => {
  const res = await API.post<LiveSessionDto>("/livesession/start", dto);
  return res.data;
};

// 2) Haal alle actieve sessies voor de ingelogde creator op
//    GET /api/LiveSession/active
export const getActiveLiveSessions = async (): Promise<LiveSessionDto[]> => {
  const res = await API.get<LiveSessionDto[]>("/livesession/active");
  return res.data;
};

// 3) Haal een private sessie op (creator-only)
//    GET /api/LiveSession/{id}
export const getLiveSession = async (
  id: string
): Promise<LiveSessionDto> => {
  const res = await API.get<LiveSessionDto>(`/livesession/${id}`);
  return res.data;
};

// 4) Haal een publieke, actieve sessie op (anoniem toegankelijke endpoint)
//    GET /api/LiveSession/public/{id}
export const getPublicSession = async (
  sessionId: string
): Promise<LiveSessionDto> => {
  const res = await API.get<LiveSessionDto>(
    `/livesession/public/${sessionId}`
  );
  return res.data;
};

// 5) Beëindig een sessie
//    PATCH /api/LiveSession/{id}/end
export const endLiveSession = async (
  sessionId: string
): Promise<void> => {
  await API.patch(`/livesession/${sessionId}/end`);
};

// 6) Patch één veld in de responses
//    PATCH /api/LiveSession/{id}/sections/{sectionId}/components/{componentId}
export const patchField = async (
  sessionId: string,
  sectionId: string,
  componentId: string,
  value: any
): Promise<void> => {
  const dto: PatchFieldDto = { sectionId, componentId, value };
  await API.patch(
    `/livesession/${sessionId}/sections/${sectionId}/components/${componentId}`,
    dto
  );
};

// 7) Bulk-opslaan van meerdere veld-waarden per sessie
//    POST /api/LiveSession/{id}/responses/bulk
export const bulkSubmit = async (
  sessionId: string,
  responses: Record<string, any>
): Promise<void> => {
  const dto: BulkResponsesDto = { responses };
  await API.post(`/livesession/${sessionId}/responses/bulk`, dto);
};

// 8) Upload een bestand en koppel het aan een component-response
//    POST /api/LiveSession/{id}/sections/{sectionId}/components/{componentId}/upload
export const uploadResponseFile = async (
  sessionId: string,
  sectionId: string,
  componentId: string,
  file: File
): Promise<MediaItemDto> => {
  const form = new FormData();
  form.append("file", file);
  const res = await API.post<MediaItemDto>(
    `/livesession/${sessionId}/sections/${sectionId}/components/${componentId}/upload`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};
