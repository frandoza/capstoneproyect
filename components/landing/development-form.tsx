"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Download, Loader2 } from "lucide-react";
import type { Brief } from "@/lib/brief";
import { briefEntries, downloadFile, requestText } from "@/lib/request-export";
import { applicationLabel, briefSchema, categories, orientation, stages, stageGuidance } from "@/lib/brief";
import { Button } from "@/components/ui/button";
import { BriefPreview } from "@/components/landing/brief-preview";
import { applicationVisuals, getFlavorVisual } from "@/lib/brief-visuals";
import { type Catalog, type Category } from "@/lib/catalog";

export function DevelopmentForm({ application, onApplicationChange }: { application: string; onApplicationChange: (value: string) => void }) {
  const [step, setStep] = useState(0);
  const [flavor, setFlavor] = useState("");
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState("");
  const [review, setReview] = useState<Brief | null>(null);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [catalogError, setCatalogError] = useState(false);
  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const response = await fetch("/api/catalog", { cache: "no-store" });
        if (!response.ok) throw new Error("catalog");
        const data = await response.json() as { catalog: Catalog };
        if (active) { setCatalog(data.catalog); setCatalogError(false); }
      } catch { if (active) { setCatalog(null); setCatalogError(true); } }
    }
    void refresh();
    window.addEventListener("focus", refresh);
    return () => { active = false; window.removeEventListener("focus", refresh); };
  }, []);
  const flavorVisuals = catalog ? (application ? catalog[application as Category]?.names ?? [] : [...new Set(Object.values(catalog).flatMap(entry => entry.names))]).map(getFlavorVisual) : [];
  const requestId = useRef("");
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  function go(next: number) {
    setStep(next); setError("");
    requestAnimationFrame(() => heading.current?.focus());
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (step === 0) {
      if (!application || !flavor.trim() || !stage) { setError("Seleccione una aplicación, un perfil de sabor y la etapa de su proyecto."); return; }
      go(1); return;
    }
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = briefSchema.safeParse(step === 2 ? review : { ...fields, application, flavor, stage, consent: fields.consent === "on" });
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    if (step === 1) { if (JSON.stringify(review) !== JSON.stringify(parsed.data)) requestId.current = ""; setReview(parsed.data); go(2); return; }
    setBusy(true); setError("");
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...parsed.data, requestId: requestId.current }) });
      const result = await response.json() as { id: string; error?: string };
      if (!response.ok) throw new Error(result.error || "No se pudo registrar la solicitud.");
      setReceipt(result.id);
    } catch (e) { setError(e instanceof Error ? e.message : "No hay conexión. Intente nuevamente."); }
    finally { setBusy(false); }
  }
  if (receipt) return <div className="brief-success" role="status"><CheckCircle2 size={36} /><h3>Solicitud registrada</h3><p>Referencia: <strong className="break-all">{receipt}</strong></p><p>Quedó guardada en este equipo para revisión en el panel local. No se ha enviado un correo ni solicitado una muestra automáticamente.</p><div className="flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={() => review && downloadFile(`solicitud-${receipt}.txt`, requestText(receipt, review))}><Download /> Descargar solicitud</Button><Button type="button" onClick={() => { setReceipt(""); setReview(null); setStep(0); setFlavor(""); setStage(""); onApplicationChange(""); requestId.current = ""; }}>Nueva solicitud <ArrowRight /></Button></div></div>;
  return <form ref={form} onSubmit={submit} className="brief-form">
    <div className="brief-editor">
    <div className="brief-progress" aria-label={`Paso ${step + 1} de 3`}>{["Personalización", "Solicitud técnica", "Revisión"].map((label, index) => <span key={label} aria-current={step === index ? "step" : undefined} className={step === index ? "active" : ""}>0{index + 1} · {label}</span>)}</div>
    <h3 ref={heading} tabIndex={-1} className="text-2xl font-semibold">{step === 0 ? "Su próximo desarrollo" : step === 1 ? "Cuéntenos sobre su producto" : "Revise su solicitud"}</h3>
    <fieldset hidden={step !== 0} disabled={busy} className="brief-selection">
      <fieldset className="application-choices"><legend>Aplicación</legend><div className="application-choices-grid">{categories.map((category, index) => <label key={category} className="application-choice">
        <input id={index === 0 ? "brief-application" : undefined} type="radio" name="application" value={category} checked={application === category} onChange={() => onApplicationChange(category)} required={step === 0} />
        <span className="application-choice-body"><img src={applicationVisuals[category].image} alt="" width={1254} height={1254} /><span>{applicationLabel(category)}</span><Check className="application-choice-check" size={15} aria-hidden="true" /></span>
      </label>)}</div></fieldset>
      {catalogError && <p role="status" className="my-4 text-sm">El catálogo no está disponible. Puede escribir el perfil de sabor buscado.</p>}
      <fieldset className="flavor-choices"><legend>Perfil de sabor</legend><div className="flavor-choices-grid">{flavorVisuals.map(item => <button type="button" key={item.name} aria-pressed={flavor === item.name} onClick={() => setFlavor(item.name)} className="flavor-choice" title={`Seleccionar ${item.name}`}><span className="flavor-swatch" style={{ background: item.wash, color: item.accent }}><item.icon size={22} aria-hidden="true" /></span><span>{item.name}</span></button>)}</div></fieldset>
      <div className="brief-fields"><label>Perfil de sabor buscado<input value={flavor} onChange={e => setFlavor(e.target.value)} maxLength={160} required={step === 0} placeholder="Ej.: cítrico con notas de limón" /></label>
      <label>Etapa del proyecto<select aria-label="Etapa del proyecto" value={stage} onChange={e => setStage(e.target.value)} required={step === 0}><option value="">Seleccione una etapa</option>{stages.map(s => <option key={s}>{s}</option>)}</select></label></div>
    </fieldset>
    <div hidden={step !== 1}>
      <div className="brief-orientation"><p className="font-semibold">{applicationLabel(application)} · {flavor}</p><p>{stage}</p><p className="mt-3">{orientation[application as keyof typeof orientation]}</p><p className="mt-3">{stageGuidance[stage as keyof typeof stageGuidance]}</p><p className="mt-3 text-sm">Orientación preliminar, pendiente de validación por Food Solutions. No determina una fórmula, dosificación ni compatibilidad garantizada.</p></div>
      <fieldset disabled={busy} className="brief-fields sm:grid-cols-2">
        <label>Empresa<input name="company" autoComplete="organization" required={step === 1} maxLength={160} /></label>
        <label>Nombre de contacto<input name="name" autoComplete="name" required={step === 1} maxLength={120} /></label>
        <label>Correo electrónico<input name="email" type="email" autoComplete="email" required={step === 1} maxLength={254} /></label>
        <label>Producto y matriz<input name="product" required={step === 1} maxLength={300} placeholder="Ej.: bebida sin gas, base acuosa" /></label>
        <label>pH, si lo conoce<input name="ph" inputMode="decimal" maxLength={5} placeholder="Opcional, de 0 a 14" /></label>
        <label>Proceso industrial<textarea name="process" maxLength={1000} rows={3} placeholder="Opcional: temperaturas, incorporación..." /></label>
        <label className="sm:col-span-2">Restricciones del desarrollo<textarea name="restrictions" rows={3} maxLength={1000} placeholder="Opcional: ingredientes, dulzor, conservación..." /></label>
      </fieldset>
      <label className="brief-consent"><input name="consent" type="checkbox" required={step === 1} disabled={busy} /><span>Autorizo el registro local de estos datos para evaluar esta solicitud. Para esta versión de prueba, utilizaré datos de demostración y no información confidencial.</span></label>
    </div>
    {step === 2 && review && <section className="brief-review" aria-label="Resumen de solicitud"><dl>{briefEntries(review).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="my-5 text-sm">Consentimiento otorgado para el registro local. La evaluación del equipo técnico es necesaria antes de definir una muestra o formulación.</p></section>}
    {error && <p role="alert" className="brief-error">{error}</p>}
    <div className="flex flex-wrap gap-3">{step > 0 && <Button type="button" variant="outline" disabled={busy} onClick={() => go(step - 1)}><ArrowLeft /> Atrás</Button>}<Button type="submit" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <ArrowRight />}{busy ? "Registrando..." : step === 0 ? "Ver orientación" : step === 1 ? "Revisar solicitud" : "Confirmar y registrar"}</Button></div>
    </div>
    <BriefPreview application={application} flavor={flavor} stage={stage} />
  </form>;
}
