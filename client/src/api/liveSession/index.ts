// File: src/api/liveSession/index.ts
import API from "../axios";
import type { LiveSessionPublicDto } from "./types";

// Functienaam en onderliggend endpoint blijven onveranderd:
export const getPublicSession = async (
  id: string
): Promise<LiveSessionPublicDto> => {
  const res = await API.get<LiveSessionPublicDto>(
    `/livesession/public/${id}`
  );
  return {
    ...res.data,
    startDate: new Date(res.data.startDate).toISOString(),
  };
};
