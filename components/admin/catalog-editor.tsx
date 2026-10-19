"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, applicationLabel } from "@/lib/brief";
import { catalogSchema, type Catalog, type CatalogEntry, type Category } from "@/lib/catalog";

export function CatalogEditor() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [drafts, setDrafts] = useState<Partial<Record<Category, string>>>({});
  const [category, setCategory] = useState<Category>("Bebidas");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function reload() {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/catalog", { cache: "no-store" });
      const data = await response.json() as { catalog: Catalog; error?: string };
      if (!response.ok) throw new Error(data.error);
      setCatalog(data.catalog);
      // Preserve drafts on conflict/reload so work can be compared and resubmitted.
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  useEffect(() => { void reload(); }, []);
  const text = drafts[category] ?? catalog?.[category].names.join("\n") ?? "";
  const dirty = !!catalog && text !== catalog[category].names.join("\n");
  async function save() {
    if (!catalog) return;
    const parsed = catalogSchema.safeParse({ category, revision: catalog[category].revision, names: text.split(/\r?\n/).map(s => s.trim()).filter(Boolean) });
    if (!parsed.success) { setError("Ingrese entre 1 y 30 sabores distintos, uno por línea, de hasta 60 caracteres."); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/catalog", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const data = await response.json() as { entry: CatalogEntry; error?: string };
      if (!response.ok) throw new Error(data.error);
      setCatalog(current => current && ({ ...current, [category]: data.entry }));
      setDrafts(current => ({ ...current, [category]: undefined }));
      setMessage(`Catálogo guardado: ${applicationLabel(category)}.`);
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <section className="catalog-editor" aria-labelledby="catalog-title">
    <div className="flex flex-wrap justify-between gap-3"><div><h2 id="catalog-title" className="text-xl font-semibold">Catálogo de sabores</h2><p className="mt-2 text-sm">Perfiles de referencia sujetos a evaluación técnica.</p></div><Button variant="outline" disabled={busy} onClick={reload}><RefreshCw /> Recargar catálogo</Button></div>
    <div className="brief-fields"><label>Aplicación del catálogo<select value={category} disabled={busy} onChange={e => { setCategory(e.target.value as Category); setError(""); setMessage(""); }}>{categories.map(c => <option key={c} value={c}>{applicationLabel(c)}</option>)}</select></label>
    <label>Sabores (uno por línea)<textarea rows={12} value={text} maxLength={1900} disabled={!catalog || busy} onChange={e => { setDrafts(current => ({ ...current, [category]: e.target.value })); setMessage(""); }} /></label></div>
    {error && <p role="alert" className="brief-error">{error}</p>}{message && <p role="status" className="my-4">{message}</p>}
    <div className="flex flex-wrap gap-3"><Button disabled={!dirty || busy} onClick={save}><Save /> {busy ? "Procesando..." : "Guardar catálogo"}</Button><Button variant="outline" disabled={!dirty || busy} onClick={() => { setDrafts(current => ({ ...current, [category]: undefined })); setError(""); }}>Descartar cambios</Button></div>
  </section>;
}
