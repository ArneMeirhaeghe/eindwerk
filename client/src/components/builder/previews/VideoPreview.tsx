import React from "react";
import type { VideoProps } from "../../../types/types";

const defaultProps: Required<VideoProps> = {
  url: "",
  alt: "",
  controls: true,
  autoplay: false,
  loop: false,
  width: 300,
  height: 200,
  radius: 0,
  shadow: false,
  objectFit: "cover",
  showAlt: false,
};

const VideoPreview: React.FC<{ p: Partial<VideoProps> }> = ({ p }) => {
  const props = { ...defaultProps, ...p };

  if (!props.url)
    return (
      <div className="italic text-gray-400 mb-2 text-center">
        Geen video geselecteerd
      </div>
    );

  return (
    <div className="mb-4 text-center">
      <video
        src={props.url}
        controls={props.controls}
        autoPlay={props.autoplay}
        loop={props.loop}
        muted
        className="mx-auto"
        style={{
          width: props.width,
          height: props.height,
          objectFit: props.objectFit,
          borderRadius: props.radius,
          boxShadow: props.shadow ? "0 4px 6px rgba(0,0,0,0.1)" : undefined,
        }}
      />
      {props.showAlt && props.alt && (
        <div className="text-sm text-gray-600 italic mt-2">{props.alt}</div>
      )}
    </div>
  );
};

export default VideoPreview;
