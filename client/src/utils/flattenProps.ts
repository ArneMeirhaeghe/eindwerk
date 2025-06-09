// File: src/utils/flattenProps.ts
export function flattenProps(raw: any): Record<string, any> {
  return {
    ...raw,
    // strings → numbers
    fontSize:
      typeof raw.fontSize === "object" && raw.fontSize["$numberInt"]
        ? parseInt(raw.fontSize["$numberInt"], 10)
        : raw.fontSize,
    lineHeight:
      typeof raw.lineHeight === "object" && raw.lineHeight["$numberDouble"]
        ? parseFloat(raw.lineHeight["$numberDouble"])
        : raw.lineHeight,

    // booleans uit strings
    bold: raw.bold === "true" ? true : raw.bold === "false" ? false : raw.bold,
    italic: raw.italic === "true" ? true : raw.italic === "false" ? false : raw.italic,
    underline:
      raw.underline === "true" ? true : raw.underline === "false" ? false : raw.underline,
    shadow: raw.shadow === "true" ? true : raw.shadow === "false" ? false : raw.shadow,
    showAlt:
      raw.showAlt === "true" ? true : raw.showAlt === "false" ? false : raw.showAlt,
    controls:
      raw.controls === "true" ? true : raw.controls === "false" ? false : raw.controls,
    autoplay:
      raw.autoplay === "true" ? true : raw.autoplay === "false" ? false : raw.autoplay,
    loop: raw.loop === "true" ? true : raw.loop === "false" ? false : raw.loop,

    // cijfers uit objecten
    width:
      typeof raw.width === "object" && raw.width["$numberInt"]
        ? parseInt(raw.width["$numberInt"], 10)
        : raw.width,
    height:
      typeof raw.height === "object" && raw.height["$numberInt"]
        ? parseInt(raw.height["$numberInt"], 10)
        : raw.height,
    radius:
      typeof raw.radius === "object" && raw.radius["$numberInt"]
        ? parseInt(raw.radius["$numberInt"], 10)
        : raw.radius,
    columns:
      typeof raw.columns === "object" && raw.columns["$numberInt"]
        ? parseInt(raw.columns["$numberInt"], 10)
        : raw.columns,
    gap:
      typeof raw.gap === "object" && raw.gap["$numberInt"]
        ? parseInt(raw.gap["$numberInt"], 10)
        : raw.gap,
    borderWidth:
      typeof raw.borderWidth === "object" && raw.borderWidth["$numberInt"]
        ? parseInt(raw.borderWidth["$numberInt"], 10)
        : raw.borderWidth,

    // Arrays veilig afhandelen
    options: Array.isArray(raw.options) ? raw.options : [],
    items: Array.isArray(raw.items) ? raw.items : [],
    images: Array.isArray(raw.images) ? raw.images : [],
  };
}
