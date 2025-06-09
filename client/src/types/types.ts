// File: src/types/types.ts

// Alle component-typen
export type ComponentType =
  | "title"
  | "text"
  | "subheading"
  | "paragraph"
  | "quote"
  | "image"
  | "video"
  | "file"
  | "button"
  | "checklist"
  | "checkbox-list"
  | "divider"
  | "grid"
  | "uploadzone"
  | "text-input"
  | "textarea"
  | "dropdown"
  | "radio-group"
  | "checkbox-group";

// Props voor elk component
export interface ComponentProps {
  // Tekst-achtige
  text?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;

  // Media
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  showAlt?: boolean;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;

  // Grid
  images?: string[];
  columns?: number;
  gap?: number;

  // Checklist / lijst
  items?: string[];

  // Divider
  thickness?: number;

  // File / upload
  filename?: string;
  showName?: boolean;
  label?: string;

  // Button
  functionType?: string;

  // Form inputs
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  options?: string[];
}

// Eén instance van een component
export interface ComponentItem {
  id: string;
  type: ComponentType;
  props: ComponentProps;
}

// Section met title i.p.v. naam
export interface Section {
  id: string;
  title: string;
  components: ComponentItem[];
}

// 5 fases
export type Fase = "voor" | "aankomst" | "terwijl" | "vertrek" | "na";
export type FaseSections = Record<Fase, Section[]>;
