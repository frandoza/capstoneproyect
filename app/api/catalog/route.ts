import { categories } from "@/lib/brief";
import { catalogSchema, initialCatalog, type Category } from "@/lib/catalog";
import { authenticated, body, database, json, sameOrigin } from "@/lib/local-server";

export async function GET() {
  try {
    const catalog = initialCatalog();
    const rows = await database().prepare("SELECT category,names,revision FROM flavor_catalog").all<{ category: Category; names: string; revision: string }>();
    for (const row of rows.results) {
      if (categories.includes(row.category)) catalog[row.category] = { names: JSON.parse(row.names), revision: row.revision };
    }
    return json({ catalog });
  } catch { return json({ error: "No se pudo cargar el catálogo." }, 503); }
}

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Origen no permitido." }, 403);
  try {
    if (!await authenticated(request)) return json({ error: "Acceso no autorizado." }, 401);
    const parsed = catalogSchema.safeParse(await body(request));
    if (!parsed.success) return json({ error: "Revise el catálogo: de 1 a 30 sabores únicos, hasta 60 caracteres por nombre." }, 400);
    const { category, names, revision } = parsed.data;
    const nextRevision = crypto.randomUUID();
    const now = new Date().toISOString();
    // Compare-and-swap prevents overwriting another administrator's changes.
    const result = revision === null
      ? await database().prepare("INSERT OR IGNORE INTO flavor_catalog (category,names,revision,updated_at) VALUES (?,?,?,?)").bind(category, JSON.stringify(names), nextRevision, now).run()
      : await database().prepare("UPDATE flavor_catalog SET names=?,revision=?,updated_at=? WHERE category=? AND revision=?").bind(JSON.stringify(names), nextRevision, now, category, revision).run();
    if (!result.meta.changes) return json({ error: "El catálogo cambió en otra sesión. Recargue el catálogo antes de guardar." }, 409);
    return json({ entry: { names, revision: nextRevision } });
  } catch { return json({ error: "No se pudo guardar el catálogo. Los cambios siguen en el editor." }, 503); }
}
