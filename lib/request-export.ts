import { applicationLabel, type Brief, type RequestRecord } from "./brief";

export function briefEntries(brief: Brief): [string, string][] {
  return [
    ["Empresa", brief.company], ["Contacto", brief.name], ["Correo", brief.email],
    ["Aplicación", applicationLabel(brief.application)], ["Perfil", brief.flavor],
    ["Etapa", brief.stage], ["Producto y matriz", brief.product],
    ["pH", brief.ph || "No indicado"], ["Proceso", brief.process || "No indicado"],
    ["Restricciones", brief.restrictions || "No indicadas"],
  ];
}

export function requestText(id: string, brief: Brief): string {
  return ["FOOD SOLUTIONS", `Referencia: ${id}`, "", ...briefEntries(brief).map(([key, value]) => `${key}: ${value}`), "", "Registro local. Sujeto a evaluación técnica; no confirma compatibilidad ni envío de una muestra."].join("\n");
}

function csvCell(value: string): string {
  // Prevent spreadsheet formulas from executing when user input is exported.
  const safe = /^[\s\u0000-\u001f]*[=+@-]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function requestsCsv(records: RequestRecord[]): string {
  const headers = ["Referencia", "Estado", "Creada", "Actualizada", "Empresa", "Contacto", "Correo", "Aplicación", "Perfil", "Etapa", "Producto y matriz", "pH", "Proceso", "Restricciones"];
  const rows = records.map(record => [record.id, record.status, record.created_at, record.updated_at, ...briefEntries(JSON.parse(record.payload) as Brief).map(([, value]) => value)]);
  return "\ufeff" + [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n");
}

export function downloadFile(filename: string, content: string, type = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = filename;
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
