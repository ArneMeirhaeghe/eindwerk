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
  | "divider"
  | "checkbox-list"; // nieuw component voor checkbox lijst

export interface CheckboxListItem {
  label: string;   // tekst van het item
  good: boolean;   // true = goed, false = slecht
}

export interface ComponentItem {
  id: string;
  type: ComponentType;
  props: Record<string, any>; // props per componenttype
}

export interface Section {
  id: string;
  title: string;
  components: ComponentItem[];
}

export type Fase = "voor" | "aankomst" | "terwijl" | "vertrek" | "na";
export type FaseSections = Record<Fase, Section[]>;
