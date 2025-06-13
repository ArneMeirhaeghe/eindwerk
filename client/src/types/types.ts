// File: src/types/types.ts

import type { CSSProperties } from "react"

// Alle component‐typen
export type ComponentType =
  | "title" | "subheading" | "paragraph" | "quote"
  | "image" | "video" | "file" | "button" | "checklist" | "checkbox-list"
  | "divider" | "grid" | "uploadzone"
  | "text-input" | "textarea" | "dropdown" | "radio-group" | "checkbox-group"
  | "form" | "inventory"  

// Props‐interfaces per component
export interface TitleProps {
  text: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  color: string;
  bg: string;
  align: "left" | "center" | "right";
  bold: boolean;
  italic: boolean;
  underline: boolean;
}


export interface SubheadingProps {
  text: string;
  fontSize: number;
  color: string;
  align: "left" | "center" | "right";
  italic: boolean;
  bold: boolean;
  underline: boolean;
}
export type ParagraphProps = TitleProps
export interface QuoteProps extends TitleProps {
  author?: string
}

export interface ImageProps {
  url?: string
  alt?: string
  width?: number
  height?: number
  borderWidth?: number
  borderColor?: string
  objectFit?: CSSProperties["objectFit"]    // ← aangepast: gebruik React.CSSProperties type
  radius?: number
  shadow?: boolean
  showAlt?: boolean
}

export interface VideoProps {
  url?: string
  alt?: string
  width?: number
  height?: number
  radius?: number
  objectFit?: CSSProperties["objectFit"]    // ← aangepast
  shadow?: boolean
  controls?: boolean
  autoplay?: boolean
  loop?: boolean
  showAlt?: boolean
}

export interface FileProps {
  url?: string
  filename?: string
  showName?: boolean
}

export interface GridProps {
  images?: string[]
  columns?: number
  gap?: number
  objectFit?: CSSProperties["objectFit"]    // ← aangepast
  borderWidth?: number
  borderColor?: string
  radius?: number
  shadow?: boolean
}

export interface UploadZoneProps {
  label?: string
}

export interface DividerProps {
  color?: string
  thickness?: number
}

export interface ChecklistProps {
  items: string[]
}

export interface CheckboxListProps {
  items: { label: string; good: boolean }[]
}

export interface RadioGroupProps {
  label: string;
  options: string[];
  required: boolean;
  defaultValue: string;
  layout: "vertical" | "horizontal"; // nieuw: keuze onder elkaar of naast elkaar
  gap: number; // nieuw: afstand bij horizontale layout
}


export interface CheckboxGroupProps {
  label?: string;
  options: string[];
  defaultValue?: string[];
  required?: boolean;
}


export interface DropdownProps {
  label?: string
  options: string[]
  placeholder?: string
  defaultValue?: string
  required?: boolean
}

export interface TextInputProps {
  label: string;
  placeholder: string;
  required: boolean;
  defaultValue: string;
}


export interface TextareaProps {
  label: string
  placeholder?: string
  defaultValue?: string
  rows?: number
  required?: boolean
}

export interface ButtonProps {
  label: string;
  bgColor?: string;
  textColor?: string;
  radius?: number;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: "left" | "center" | "right";
}


export interface InventoryProps {
  templateId: string               // verwijzing naar gekozen template
}
// Eén instance van een component in een sectie
export interface ComponentItem {
  id: string
  type: ComponentType
  props: Record<string, any>
}

// Section binnen een fase
export interface Section {
  id: string
  title: string
  components: ComponentItem[]
}
// Props voor form‐component
export interface FormProps {
  formId: string
}

// Props voor inventory‐component
export interface InventoryProps {
  templateId: string                          // ID van gekozen inventaris‐template
  selectedLokalen?: string[]                  // optionele lijst van geselecteerde lokalen
  selectedSubs?: Record<string, string[]>     // optionele selectie subsections per lokaal
  interactive?: boolean                       // toon invulvelden of niet
}
// 5 fases in een tour
export type Fase = "voor" | "aankomst" | "terwijl" | "vertrek" | "na"
export type FaseSections = Record<Fase, Section[]>

export interface CheckboxListItem {
  label: string;
  good: boolean;
}
export interface CheckboxListProps {
  items: CheckboxListItem[];
}
