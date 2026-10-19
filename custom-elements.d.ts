import "react";
declare module "react" {
 namespace JSX {
  interface IntrinsicElements {
    "model-viewer": {
      alt?: string;
      "auto-rotate"?: boolean;
      "camera-controls"?: boolean;
      "camera-orbit"?: string;
      "camera-target"?: string;
      className?: string;
      "environment-image"?: string;
      exposure?: string;
      "field-of-view"?: string;
      "interaction-prompt"?: string;
      "max-camera-orbit"?: string;
      "min-camera-orbit"?: string;
      "rotation-per-second"?: string;
      "shadow-intensity"?: string;
      src?: string;
      scale?: string;
      ar?: boolean;
      ref?: import("react").Ref<HTMLElement>;
    };
  }
}
}
