import { adminPassword, authenticated, body, cookie, database, hash, json, limited, sameOrigin } from "@/lib/local-server";
export async function GET(request: Request) {
  try { return json({ authenticated: await authenticated(request) }); }
  catch { return json({ error: "Base de datos no disponible." }, 503); }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Acceso disponible solo en local." }, 403);
  try {
    const configured = adminPassword();
    if (!configured) return json({ error: "Configure la contraseña local antes de ingresar." }, 503);
    if (await limited("admin-login", 8)) return json({ error: "Demasiados intentos. Espere diez minutos." }, 429);
    const input = await body(request);
    if (typeof input.password !== "string" || await hash(input.password) !== await hash(configured)) return json({ error: "Contraseña incorrecta." }, 401);
    await database().prepare("DELETE FROM rate_limits WHERE key='admin-login'").run();
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(v => v.toString(16).padStart(2, "0")).join("");
    await database().prepare("DELETE FROM admin_sessions WHERE expires_at<=?").bind(Date.now()).run();
    await database().prepare("INSERT INTO admin_sessions (token_hash,expires_at) VALUES (?,?)").bind(await hash(token), Date.now() + 8 * 3600000).run();
    return json({ ok: true }, 200, { "Set-Cookie": cookie(token, 8 * 3600) });
  } catch { return json({ error: "No se pudo iniciar sesión." }, 503); }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Origen no permitido." }, 403);
  const token = request.headers.get("cookie")?.match(/(?:^|;\s*)fs_session=([a-f0-9]{64})(?:;|$)/)?.[1];
  try {
    if (token) await database().prepare("DELETE FROM admin_sessions WHERE token_hash=?").bind(await hash(token)).run();
    return json({ ok: true }, 200, { "Set-Cookie": cookie("", 0) });
  } catch { return json({ error: "No se pudo cerrar la sesión. Intente nuevamente." }, 503); }
}
