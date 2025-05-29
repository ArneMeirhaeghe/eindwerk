// /src/types/types.ts

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

export interface CheckboxListItem {
  label: string;
  good: boolean;
}

// Title, Subheading, Paragraph & Quote share text & style props
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

export interface TitleProps extends TextStyleProps {
  text: string;
}

export interface SubheadingProps extends TextStyleProps {
  text: string;
}

export interface ParagraphProps extends TextStyleProps {
  text: string;
}

export interface QuoteProps extends TextStyleProps {
  text: string;
  author?: string;
}

// Button
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

// Checklist
export interface ChecklistProps {
  items: string[];
  fontSize?: number;
  color?: string;
  bg?: string;
  spacing?: number;
}

// Checkbox-list
export interface CheckboxListProps {
  items: CheckboxListItem[];
  fontSize?: number;
  color?: string;
  bg?: string;
  spacing?: number;
}

// Divider
export interface DividerProps {
  color?: string;
  thickness?: number;
  bg?: string;
}

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
  showAlt?: boolean;
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
  showAlt?: boolean;
}

// Grid (multi-image) props
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

// File props
export interface FileProps {
  url: string;
  filename: string;
  showName: boolean;
}

// Union of all props
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

export interface ComponentItem {
  id: string;
  type: ComponentType;
  props: ComponentProps;
}

export interface Section {
  id: string;
  title: string;
  components: ComponentItem[];
}

export type Fase = "voor" | "aankomst" | "terwijl" | "vertrek" | "na";

export type FaseSections = Record<Fase, Section[]>;
