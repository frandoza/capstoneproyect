import { statuses } from "@/lib/brief";
import { authenticated, body, database, json, sameOrigin } from "@/lib/local-server";
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return json({ error: "Origen no permitido." }, 403);
  try {
    if (!await authenticated(request)) return json({ error: "Acceso no autorizado." }, 401);
    const input = await body(request);
    if (!statuses.includes(input.status)) return json({ error: "Estado no válido." }, 400);
    const { id } = await context.params;
    const result = await database().prepare("UPDATE requests SET status=?,updated_at=? WHERE id=?").bind(input.status, new Date().toISOString(), id).run();
    return result.meta.changes ? json({ ok: true }) : json({ error: "Solicitud no encontrada." }, 404);
  } catch { return json({ error: "No se pudo actualizar el estado." }, 503); }
}
