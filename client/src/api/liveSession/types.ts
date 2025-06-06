// File: src/api/liveSession/types.ts

// DTO voor publieke live-sessie
export interface TourDto {
  id: string;
  naamLocatie: string;
  fases: Record<string, any[]>;
}

export interface LiveSessionPublicDto {
  id: string;
  groep: string;
  startDate: string;
  tour: TourDto;
}
