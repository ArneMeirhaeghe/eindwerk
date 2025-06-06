// File: src/api/tours/types.ts

export interface ComponentDto {
  id: string;
  type: string;
  props: Record<string, any>;
}

export interface SectionDto {
  id: string;
  naam: string;
  components: ComponentDto[];
}

export interface TourListDto {
  id: string;
  naamLocatie: string;
}

export interface Tour {
  id: string;
  naamLocatie: string;
  fases: Record<string, SectionDto[]>;
}
