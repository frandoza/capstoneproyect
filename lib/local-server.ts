import { env } from "cloudflare:workers";

export function database() {
  if (!env.DB) throw new Error("Local database not configured");
  return env.DB;
}
export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });
}
// This access mechanism is intentionally restricted to the local prototype.
export function localOnly(request: Request) {
  return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(request.url).hostname);
}
export function sameOrigin(request: Request) {
  return localOnly(request) && request.headers.get("origin") === new URL(request.url).origin;
}
export async function body(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new Error("Invalid content type");
  const text = await request.text();
  if (text.length > 16000) throw new Error("Payload too large");
  return JSON.parse(text);
}
export async function hash(value: string) {
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)))).map(v => v.toString(16).padStart(2, "0")).join("");
}
export async function limited(key: string, max: number) {
  const now = Date.now();
  const row = await database().prepare("INSERT INTO rate_limits (key,count,reset_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN reset_at < ? THEN 1 ELSE count+1 END, reset_at=CASE WHEN reset_at < ? THEN ? ELSE reset_at END RETURNING count").bind(key, now + 600000, now, now, now + 600000).first<{ count: number }>();
  return !row || row.count > max;
}
export async function authenticated(request: Request) {
  if (!localOnly(request)) return false;
  const token = request.headers.get("cookie")?.match(/(?:^|;\s*)fs_session=([a-f0-9]{64})(?:;|$)/)?.[1];
  if (!token) return false;
  const session = await database().prepare("SELECT expires_at FROM admin_sessions WHERE token_hash=? AND expires_at>?").bind(await hash(token), Date.now()).first();
  return !!session;
}
export function cookie(token: string, age: number) {
  return `fs_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}`;
}
export function adminPassword() { return env.LOCAL_ADMIN_PASSWORD; }
