// File: src/types/types.ts
export type ComponentType =
  | "title"
  | "subheading"
  | "paragraph"
  | "quote"
  | "image"
  | "video"
  | "file"
  | "button"
  | "checklist"
  | "divider"
  | "checkbox-list"
  | "grid";

// Item voor checkbox-list
export interface CheckboxListItem {
  label: string;
  good: boolean;
}

// Basis-text props gedeeld door meerdere componenten
interface TextStyleProps {
  fontFamily: string;
  fontSize: number;
  color: string;
  bg?: string;
  align?: "left" | "center" | "right";
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  lineHeight?: number;
}

// Title component props
export interface TitleProps extends TextStyleProps {
  text: string;
}

// Subheading component props
export interface SubheadingProps extends TextStyleProps {
  text: string;
}

// Paragraph component props
export interface ParagraphProps extends TextStyleProps {
  text: string;
}

// Quote component props
export interface QuoteProps extends TextStyleProps {
  text: string;
  author?: string;
}

// Button component props
export interface ButtonProps {
  label: string;
  functionType?: "link" | "action";
  url?: string;
  fontSize?: number;
  color?: string;
  bg?: string;
  radius?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

// Checklist component props
export interface ChecklistProps {
  items: string[];
  fontSize?: number;
  color?: string;
  bg?: string;
  spacing?: number;
}

// Checkbox-list component props
export interface CheckboxListProps {
  items: CheckboxListItem[];
  fontSize?: number;
  color?: string;
  bg?: string;
  spacing?: number;
}

// Divider component props
export interface DividerProps {
  color?: string;
  thickness?: number;
  bg?: string;
}

// Image component props
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
  showAlt?: boolean;
}

// Video component props
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
  showAlt?: boolean;
}

// Grid (multi-image) component props
export interface GridProps {
  images: string[];
  columns: number;
  gap?: number;
  borderWidth?: number;
  borderColor?: string;
  radius?: number;
  shadow?: boolean;
  objectFit?: "cover" | "contain";
}

// File component props
export interface FileProps {
  url: string;
  filename: string;
  showName: boolean;
}

// Union van alle possible component props
export type ComponentProps =
  | TitleProps
  | SubheadingProps
  | ParagraphProps
  | QuoteProps
  | ImageProps
  | VideoProps
  | ButtonProps
  | ChecklistProps
  | DividerProps
  | CheckboxListProps
  | GridProps
  | FileProps;

// Eén component-item in app
export interface ComponentItem {
  id: string;
  type: ComponentType;
  props: ComponentProps;
}

// Section met title in plaats van naam
export interface Section {
  id: string;
  title: string;
  components: ComponentItem[];
}

// Vijf fases van een tour
export type Fase = "voor" | "aankomst" | "terwijl" | "vertrek" | "na";

// Mapping van fase naar lijst van sections
export type FaseSections = Record<Fase, Section[]>;
