"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight, Beaker, Check, ChevronDown, Menu, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductScene } from "@/components/landing/product-scene";
import { ApplicationsSection } from "@/components/landing/applications-section";
import { DevelopmentForm } from "@/components/landing/development-form";

const steps = [
  ["01", "Brief técnico", "Producto, matriz, proceso, sabor objetivo y etapa del desarrollo."],
  ["02", "Evaluación", "Analizamos compatibilidad, restricciones y comportamiento esperado."],
  ["03", "Perfil a medida", "Seleccionamos o ajustamos el perfil sensorial para la aplicación."],
  ["04", "Muestra y validación", "Entregamos una muestra para pruebas, evaluación y ajuste final."],
];

export function LandingExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState("");
  const selectApplication = (category: string) => {
    setSelectedApplication(category);
    requestAnimationFrame(() => {
      window.location.hash = "contacto";
      document.getElementById("contacto")?.scrollIntoView({ block: "start" });
      document.getElementById("brief-application")?.focus({ preventScroll: true });
    });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("[data-hero-reveal]", { y: 34, opacity: 0, duration: 0.9, stagger: 0.11, ease: "power3.out" });

      gsap.to("[data-marquee-track]", { xPercent: -50, duration: 24, ease: "none", repeat: -1 });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, { y: 42, opacity: 0, duration: 0.85, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 84%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((line) => {
        gsap.from(line, { scaleX: 0, transformOrigin: "left center", duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: line, start: "top 90%", once: true } });
      });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <main ref={rootRef} className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#173c2d]/92 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Food Solutions, inicio">
            <img src="/assets/food-solutions-logo.png" alt="Food Solutions" className="h-11 w-auto rounded bg-white object-contain px-2 py-1" />
          </a>
          <nav className="hidden items-center gap-8 text-sm text-white/78 lg:flex" aria-label="Navegación principal">
            <a className="nav-link" href="#aplicaciones">Aplicaciones</a><a className="nav-link" href="#proceso">Proceso</a><a className="nav-link" href="#empresa">Empresa</a><a className="nav-link" href="#contacto">Contacto</a>
          </nav>
          <div className="hidden lg:block"><Button asChild className="h-11 bg-[#d7ef62] px-5 text-[#173c2d] hover:bg-[#e2f77b]"><a href="#contacto">Solicitar una muestra <ArrowRight /></a></Button></div>
          <button type="button" className="grid size-10 place-items-center lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <nav className="border-t border-white/10 px-5 py-5 lg:hidden" aria-label="Navegación móvil"><div className="flex flex-col gap-4 text-base">{["aplicaciones", "proceso", "empresa", "contacto"].map((item) => <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)} className="capitalize">{item}</a>)}</div></nav>}
      </header>

      <section id="inicio" className="hero-grid relative min-h-[94svh] bg-[#173c2d] pt-18 text-white">
        <div className="mx-auto grid min-h-[calc(94svh-4.5rem)] max-w-[1440px] items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:px-12 lg:py-12">
          <div data-hero-copy className="relative z-10 max-w-3xl py-8 lg:py-12">
            <p data-hero-reveal className="mb-7 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#d7ef62]"><span className="h-px w-10 bg-current" /> Desarrollo de sabores para la industria</p>
            <h1 data-hero-reveal className="max-w-3xl text-5xl font-semibold leading-[1.02] sm:text-6xl xl:text-7xl">El <span className="text-[#d7ef62]">sabor natural</span> que su producto necesita.</h1>
            <p data-hero-reveal className="mt-7 max-w-xl text-lg leading-8 text-white/72 sm:text-xl">Creamos perfiles naturales según su matriz, proceso y objetivo sensorial. De la idea técnica a una muestra lista para validar.</p>
            <div data-hero-reveal className="mt-9 flex flex-wrap gap-3"><Button asChild size="lg" className="h-12 bg-[#d7ef62] px-6 text-[#173c2d] hover:bg-[#e2f77b]"><a href="#contacto">Iniciar un desarrollo <ArrowRight /></a></Button><Button asChild size="lg" variant="outline" className="h-12 border-white/25 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"><a href="#aplicaciones">Ver aplicaciones <ArrowDown /></a></Button></div>
            <div data-hero-reveal className="mt-12 grid max-w-xl grid-cols-3 border-t border-white/15 pt-6 text-sm text-white/58"><span>Enfoque B2B</span><span>Perfil a medida</span><span>Soporte técnico</span></div>
          </div>
          <div data-hero-reveal data-product-stage className="relative h-[44vh] min-h-[360px] lg:h-[calc(94svh-8rem)] lg:min-h-[560px]">
            <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12" /><div className="absolute left-1/2 top-1/2 h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d7ef62]/30" />
            <ProductScene />
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-[#173c2d]/15 bg-[#d7ef62] py-4" aria-label="Aplicaciones alimentarias">
        <div data-marquee-track className="flex w-max items-center will-change-transform">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {["Bebidas", "Lácteos", "Helados", "Licores", "Panificación", "Confitería", "Postres"].map((item) => (
                <div key={`${copy}-${item}`} className="flex items-center">
                  <span className="px-8 text-sm font-bold uppercase tracking-[0.16em] text-[#173c2d] sm:px-12">{item}</span>
                  <span className="size-1.5 rounded-full bg-[#173c2d]" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <ApplicationsSection onSelect={selectApplication} />

      <section id="proceso" className="bg-white py-22 sm:py-28"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div data-reveal className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="section-kicker">Proceso técnico</p><h2 className="section-title mt-6">Del requerimiento a una muestra lista para validar.</h2></div><p className="max-w-2xl text-lg leading-8 text-[#173c2d]/66 lg:justify-self-end">Cada desarrollo empieza entendiendo el producto. Organizamos la información crítica para reducir iteraciones y avanzar con criterios sensoriales claros.</p></div>
        <div className="mt-16 border-t border-[#173c2d]/20">{steps.map(([number, title, text]) => <article data-reveal key={number} className="process-row"><span className="text-sm text-[#173c2d]/45">{number}</span><h3 className="text-xl font-semibold sm:text-2xl">{title}</h3><p className="max-w-xl leading-7 text-[#173c2d]/64">{text}</p><ChevronDown className="hidden size-5 text-[#173c2d]/40 lg:block" /></article>)}</div>
      </div></section>

      <section id="empresa" className="relative bg-[#d7ef62] py-22 sm:py-28"><div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-12">
        <div data-reveal><p className="section-kicker">Food Solutions</p><h2 className="section-title mt-6 max-w-3xl">Capacidad técnica antes, durante y después de la muestra.</h2></div>
        <div data-reveal className="grid gap-7 sm:grid-cols-2 lg:grid-cols-1">{[[ShieldCheck, "Confidencialidad", "Cada desarrollo se trata como información técnica reservada."], [Beaker, "Criterio de aplicación", "El perfil se decide considerando matriz, proceso y desempeño."], [Check, "Acompañamiento", "Un interlocutor técnico acompaña la selección y los ajustes."]].map(([Icon, title, text]) => { const FeatureIcon = Icon as typeof ShieldCheck; return <div key={title as string} className="flex gap-5 border-t border-[#173c2d]/25 pt-6"><FeatureIcon className="mt-1 size-6 shrink-0" /><div><h3 className="text-lg font-semibold">{title as string}</h3><p className="mt-2 leading-7 text-[#173c2d]/68">{text as string}</p></div></div>; })}</div>
      </div></section>

      <section id="contacto" className="scroll-mt-18 bg-[#173c2d] py-22 text-white sm:py-28"><div data-reveal className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7ef62]">Siguiente desarrollo</p>
        <div className="mt-7 grid gap-10">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-end"><h2 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">Cuéntenos qué producto está desarrollando.</h2><div><p className="text-lg leading-8 text-white/75">Comparta la aplicación, la matriz y el perfil que busca para preparar su solicitud técnica.</p><p className="mt-4 text-sm text-white/65">Versión local de evaluación. Las solicitudes no se envían fuera de este equipo.</p></div></div>
          <DevelopmentForm application={selectedApplication} onApplicationChange={setSelectedApplication} />
        </div>
        <footer className="mt-20 flex flex-col gap-5 border-t border-white/15 pt-7 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between"><span>Food Solutions · Sabores, ingredientes y edulcorantes</span><a href="/admin" className="underline underline-offset-4">Acceso al equipo</a></footer>
      </div></section>
    </main>
  );
}
