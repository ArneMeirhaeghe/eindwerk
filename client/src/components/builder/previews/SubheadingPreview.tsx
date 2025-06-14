// import React from "react";
// import type { SubheadingProps } from "../../../types/types";

// const defaultProps: Required<SubheadingProps> = {
//   text: "Subtitel voorbeeld",
//   fontSize: 20,
//   color: "#000000",
//   align: "left",
//   italic: false,
//   bold: false,
//   underline: false,
// };

// const SubheadingPreview: React.FC<{ p: Partial<SubheadingProps> }> = ({ p }) => {
//   const props = { ...defaultProps, ...p };

//   const style: React.CSSProperties = {
//     fontSize: props.fontSize,
//     color: props.color,
//     textAlign: props.align,
//     fontWeight: props.bold ? "bold" : "normal",
//     fontStyle: props.italic ? "italic" : "normal",
//     textDecoration: props.underline ? "underline" : "none",
//     marginBottom: "0.75rem",
//   };

//   return <h2 style={style}>{props.text}</h2>;
// };

// export default SubheadingPreview;
