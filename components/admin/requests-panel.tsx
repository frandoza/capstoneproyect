"use client";
/* Full navigation avoids duplicate React contexts in the local Vinext Link shim. */
/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Download, LogOut, RefreshCw, Search, X } from "lucide-react";
import { applicationLabel, categories, type Brief, type RequestRecord, statuses } from "@/lib/brief";
import { briefEntries, downloadFile, requestsCsv, requestText } from "@/lib/request-export";
import { Button } from "@/components/ui/button";
import { CatalogEditor } from "@/components/admin/catalog-editor";

export function RequestsPanel() {
  const [auth, setAuth] = useState(false);
  const [ready, setReady] = useState(false);
  const [rows, setRows] = useState<RequestRecord[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [application, setApplication] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function api(url: string, init?: RequestInit) {
    const response = await fetch(url, init);
    const data = await response.json() as { error?: string; requests: RequestRecord[] };
    if (!response.ok) { if (response.status === 401) { setAuth(false); setRows([]); setSelected(null); } throw new Error(data.error || "Operación no disponible."); }
    return data;
  }
  async function load() {
    setBusy(true); setError("");
    try { const data = await api("/api/requests"); setRows(data.requests); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/session").then(async response => { const data = await response.json() as { error?: string; authenticated: boolean }; if (!response.ok) throw new Error(data.error); if (cancelled) return; setAuth(data.authenticated); if (data.authenticated) await load(); }).catch(e => { if (!cancelled) setError(e.message); }).finally(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
    // Session is checked once when entering the panel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const target = e.currentTarget; setBusy(true); setError("");
    try { await api("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: new FormData(target).get("password") }) }); target.reset(); setAuth(true); await load(); }
    catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true); setError("");
    try { await api("/api/admin/session", { method: "DELETE" }); setAuth(false); setRows([]); setSelected(null); }
    catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  }
  async function update(id: string, next: string) {
    setBusy(true); setError("");
    try { await api(`/api/requests/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) }); await load(); }
    catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  }
  const current = rows.find(r => r.id === selected);
  const detail: Brief | null = current ? JSON.parse(current.payload) : null;
  const filtered = rows.filter(r => (!status || r.status === status) && (!application || (JSON.parse(r.payload) as Brief).application === application) && `${r.id} ${r.payload}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return <main className="admin-page"><header className="admin-header"><a href="/" className="flex items-center gap-2"><ArrowLeft size={18} /> Food Solutions</a><span>Solicitudes · Local</span>{auth && <Button variant="outline" onClick={logout} disabled={busy}><LogOut /> Salir</Button>}</header>
    {!ready ? <p role="status">Comprobando acceso...</p> : !auth ? <section className="admin-login"><h1 className="text-3xl font-semibold">Acceso al equipo</h1><p className="my-4">Panel de solicitudes de desarrollo.</p><form onSubmit={login} className="brief-fields"><label>Contraseña local<input name="password" type="password" autoComplete="current-password" required maxLength={200} /></label><Button disabled={busy}>{busy ? "Ingresando..." : "Ingresar"}</Button></form></section> : <>
      <div className="flex flex-wrap items-center justify-between gap-4 py-8"><div><h1 className="text-3xl font-semibold">Solicitudes técnicas</h1><p className="mt-2 text-sm">{rows.length} registradas · {rows.filter(r => r.status === "Nueva").length} nuevas</p></div><Button variant="outline" onClick={load} disabled={busy}><RefreshCw size={18} /> Actualizar</Button></div>
      <dl className="admin-metrics">{statuses.map(s => <div key={s}><dt>{s}</dt><dd>{rows.filter(r => r.status === s).length}</dd></div>)}</dl>
      <div className="admin-filters"><label><Search size={18} /><input aria-label="Buscar solicitudes" placeholder="Empresa, contacto o referencia" value={query} onChange={e => setQuery(e.target.value)} /></label><select aria-label="Filtrar por estado" value={status} onChange={e => setStatus(e.target.value)}><option value="">Todos los estados</option>{statuses.map(s => <option key={s}>{s}</option>)}</select><select aria-label="Filtrar por aplicación" value={application} onChange={e => setApplication(e.target.value)}><option value="">Todas las aplicaciones</option>{categories.map(c => <option key={c} value={c}>{applicationLabel(c)}</option>)}</select></div>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6"><p role="status" className="text-sm">{filtered.length} de {rows.length} solicitudes cargadas (máximo 500)</p><div className="flex flex-wrap gap-3">{(query || status || application) && <Button variant="outline" onClick={() => { setQuery(""); setStatus(""); setApplication(""); }}><X /> Limpiar filtros</Button>}<Button variant="outline" disabled={!filtered.length || busy} onClick={() => downloadFile("solicitudes-food-solutions.csv", requestsCsv(filtered), "text/csv;charset=utf-8")}><Download /> Exportar CSV</Button></div></div>
      <div className="admin-workspace"><section aria-label="Listado de solicitudes">{filtered.length === 0 ? <p className="py-12">{rows.length ? "No hay coincidencias con estos filtros." : "Todavía no hay solicitudes registradas."}</p> : <ul>{filtered.map(r => { const b: Brief = JSON.parse(r.payload); return <li key={r.id}><button className={`request-row ${selected === r.id ? "selected" : ""}`} onClick={() => setSelected(r.id)} aria-pressed={selected === r.id}><span><strong>{b.company}</strong><small>{applicationLabel(b.application)} · {b.flavor}</small></span><span><small>{new Date(r.created_at).toLocaleDateString("es")}</small><strong className="request-status">{r.status}</strong></span></button></li>; })}</ul>}</section>
      {current && detail && <section className="request-detail" aria-label="Detalle de solicitud"><div className="flex items-start justify-between gap-3"><h2 className="text-xl font-semibold">{detail.company}</h2><button onClick={() => setSelected(null)} aria-label="Cerrar detalle" title="Cerrar detalle"><X /></button></div><p className="my-3 break-all text-xs">{current.id}</p><Button variant="outline" onClick={() => downloadFile(`solicitud-${current.id}.txt`, requestText(current.id, detail))}><Download /> Descargar ficha</Button><label className="brief-fields">Estado<select aria-label="Estado" disabled={busy} value={current.status} onChange={e => update(current.id, e.target.value)}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label><dl>{briefEntries(detail).map(([key,value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></section>}</div>
      <CatalogEditor />
    </>}{error && <p role="alert" className="brief-error my-5">{error}</p>}</main>;
}
