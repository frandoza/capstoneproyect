"use client";

import { useEffect, useRef } from "react";

export function CanModelViewer() {
  const viewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const viewer = viewerRef.current;

    if (!viewer) {
      return;
    }

    void import("@google/model-viewer").then(() => {
      viewer.setAttribute("src", "/assets/aluminium_can_500ml.glb");
      viewer.setAttribute("alt", "Modelo 3D de lata de aluminio de 500 ml");
      viewer.setAttribute("exposure", "1.12");
      viewer.setAttribute("scale", "0.006 0.006 0.006");
      viewer.setAttribute("camera-target", "0.22m 0.4m 0.17m");
      viewer.setAttribute("camera-orbit", "18deg 74deg 5.6m");
      viewer.setAttribute("min-camera-orbit", "auto 55deg 3.6m");
      viewer.setAttribute("max-camera-orbit", "auto 90deg 8m");
    });
  }, []);

  return (
    <model-viewer
      ref={viewerRef}
      camera-controls
      auto-rotate
      rotation-per-second="22deg"
      shadow-intensity="0.55"
      environment-image="neutral"
      field-of-view="24deg"
      interaction-prompt="none"
      ar={false}
      className="absolute inset-0 h-full w-full"
    />
  );
}
