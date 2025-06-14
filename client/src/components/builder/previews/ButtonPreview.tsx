// import React from "react";
// import type { ButtonProps } from "../../../types/types";

// // Standaardwaarden
// const defaultProps: ButtonProps = {
//   label: "Klik hier",
//   bgColor: "#3b82f6",
//   textColor: "#ffffff",
//   radius: 8,
//   fontSize: 16,
//   bold: false,
//   italic: false,
//   underline: false,
//   align: "center",
// };

// const ButtonPreview: React.FC<{ p: ButtonProps }> = ({ p }) => {
//   const props = { ...defaultProps, ...p };

//   const alignmentClass =
//     props.align === "left"
//       ? "justify-start"
//       : props.align === "right"
//       ? "justify-end"
//       : "justify-center";

//   return (
//     <div className={`flex ${alignmentClass}`}>
//       <button
//         disabled
//         className="px-4 py-2 rounded shadow-sm cursor-default"
//         style={{
//           backgroundColor: props.bgColor,
//           color: props.textColor,
//           borderRadius: `${props.radius}px`,
//           fontSize: `${props.fontSize}px`,
//           fontWeight: props.bold ? "bold" : "normal",
//           fontStyle: props.italic ? "italic" : "normal",
//           textDecoration: props.underline ? "underline" : "none",
//         }}
//       >
//         {props.label}
//       </button>
//     </div>
//   );
// };

// export default ButtonPreview;
