import { existsSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
const path = new URL("../.dev.vars", import.meta.url);
if (!existsSync(path)) {
  writeFileSync(path, `LOCAL_ADMIN_PASSWORD=${randomBytes(18).toString("base64url")}\n`, { flag: "wx", mode: 0o600 });
  console.log("Acceso local configurado. Consulte LOCAL_ADMIN_PASSWORD en .dev.vars; no comparta ese archivo.");
} else console.log("Se conserva la configuracion local existente.");
