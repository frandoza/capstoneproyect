import { briefSchema } from "@/lib/brief";
import { authenticated, body, database, json, limited, sameOrigin } from "@/lib/local-server";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Origen no permitido." }, 403);
  try {
    if (await limited("requests-local", 40)) return json({ error: "Demasiadas solicitudes. Intente en diez minutos." }, 429);
    const input = await body(request);
    const parsed = briefSchema.safeParse(input);
    if (!parsed.success) return json({ error: "Revise los campos de la solicitud.", fields: parsed.error.flatten().fieldErrors }, 400);
    if (typeof input.requestId !== "string" || !/^[a-f0-9-]{36}$/.test(input.requestId)) return json({ error: "Identificador no válido." }, 400);
    const id = input.requestId;
    const now = new Date().toISOString();
    const payload = JSON.stringify(parsed.data);
    await database().prepare("INSERT OR IGNORE INTO requests (id,payload,status,created_at,updated_at) VALUES (?,?,'Nueva',?,?)").bind(id, payload, now, now).run();
    const existing = await database().prepare("SELECT payload FROM requests WHERE id=?").bind(id).first<{ payload: string }>();
    if (existing?.payload !== payload) return json({ error: "Esta solicitud ya fue registrada con otros datos. Inicie una nueva." }, 409);
    return json({ id }, 201);
  } catch { return json({ error: "No se pudo registrar. Sus datos siguen en el formulario; intente nuevamente." }, 503); }
}
export async function GET(request: Request) {
  try {
    if (!await authenticated(request)) return json({ error: "Acceso no autorizado." }, 401);
    const result = await database().prepare("SELECT * FROM requests ORDER BY created_at DESC LIMIT 500").all();
    return json({ requests: result.results });
  } catch { return json({ error: "No se pudieron consultar las solicitudes." }, 503); }
}
