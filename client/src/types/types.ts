// src/types/types.ts
export type ComponentType =
  | "title"
  | "subheading"
  | "paragraph"
  | "quote"
  | "image"
  | "video"
  | "button"
  | "checklist"
  | "divider";

export interface ComponentItem {
  id: string;
  type: ComponentType;
  props: any;
}

export interface Section {
  id: string;
  title: string;
  components: ComponentItem[];
}

export type Fase = "voor" | "aankomst" | "terwijl" | "vertrek" | "na";
export type FaseSections = Record<Fase, Section[]>;
