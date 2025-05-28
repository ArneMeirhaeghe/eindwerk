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
  | "checkbox-list"
  | "grid"; // nieuw component voor checkbox lijst

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

// Single-image props
export interface ImageProps {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  borderWidth?: number;
  borderColor?: string;
  radius?: number;
  shadow?: boolean;
  objectFit?: "cover" | "contain";
}

// Single-video props
export interface VideoProps {
  url: string;
  alt?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  width?: number;
  height?: number;
  radius?: number;
  shadow?: boolean;
  objectFit?: "cover" | "contain";
}

// Grid (multi-image) props
export interface GridProps {
  images: string[];
  columns: number;
  gap: number;
  borderWidth: number;
  borderColor: string;
  radius: number;
  shadow: boolean;
  objectFit: "cover" | "contain";
}