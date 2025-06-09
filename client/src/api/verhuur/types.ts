// File: src/api/verhuur/types.ts

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
  responses: Record<string, Record<string, any>>;   // ← toegevoegd
  publicUrl?: string;
}

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
