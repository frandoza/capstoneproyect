"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { applicationLabel } from "@/lib/brief";
import { Pause, Play } from "lucide-react";
import { applicationVisuals, getFlavorVisual } from "@/lib/brief-visuals";

export function BriefPreview({ application, flavor, stage }: { application: string; flavor: string; stage: string }) {
  const root = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [failedImage, setFailedImage] = useState("");
  const product = applicationVisuals[application as keyof typeof applicationVisuals];
  const visual = getFlavorVisual(flavor);
  const FlavorIcon = visual.icon;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (paused) return;
      const image = element.querySelector("[data-preview-product]");
      if (!image) return;
      const entrance = gsap.fromTo(image, { opacity: 0, y: 14, rotation: -3 }, { opacity: 1, y: 0, rotation: 0, duration: .5, ease: "power2.out" });
      const floating = gsap.to(image, { y: -7, rotation: .8, duration: 2.8, delay: .5, yoyo: true, repeat: -1, ease: "sine.inOut" });
      let visible = true;
      const sync = () => {
        const stop = !visible || document.hidden;
        floating.paused(stop);
        entrance.paused(stop);
      };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
      observer.observe(element);
      document.addEventListener("visibilitychange", sync);
      return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
    }, element);
    return () => media.revert();
  }, [application, paused]);

  return <figure ref={root} className="brief-preview" style={{ "--preview-accent": visual.accent, "--preview-wash": visual.wash } as CSSProperties} aria-label="Referencia visual de la solicitud">
    <div className="brief-preview-top"><span>FOOD SOLUTIONS / DESARROLLO</span>{product && !reducedMotion && <button type="button" className="preview-motion-toggle" aria-label={paused ? "Reanudar animación" : "Pausar animación"} title={paused ? "Reanudar animación" : "Pausar animación"} onClick={() => setPaused(v => !v)}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>}</div>
    <div className="brief-preview-stage">
      {product ? <div className="brief-product-wrap" key={application}>{failedImage === product.image ? <p className="preview-image-fallback">{application}</p> : <img data-preview-product className="brief-product-image" src={product.image} alt={product.alt} width={1254} height={1254} onError={() => setFailedImage(product.image)} />}</div>
        : <div className="brief-preview-overview" aria-hidden="true">{Object.entries(applicationVisuals).map(([name, item]) => <img key={name} src={item.image} alt="" width={1254} height={1254} />)}</div>}
    </div>
    <figcaption className="brief-preview-caption">
      <p className="preview-application">{applicationLabel(application) || "De la idea al producto"}</p>
      <div className="preview-flavor"><FlavorIcon size={25} aria-hidden="true" /><span>{visual.name}</span></div>
      <p className="preview-stage-label">{stage || "Etapa por definir"}</p>
      <p className="preview-disclaimer">Referencia ilustrativa de aplicación. No representa la fórmula ni la apariencia final del producto.</p>
    </figcaption>
  </figure>;
}
