# Food Solutions - entrega local

Codigo de la landing y sus funciones locales, al 19/10/2026.
No incluye contrasenas, solicitudes guardadas ni dependencias instaladas.

## Preparar en otro equipo

Instalar Node.js 22.13 o superior y abrir esta carpeta en Visual Studio Code.
Ejecutar en la terminal, en este orden:

```powershell
npm install --legacy-peer-deps
node scripts/setup-local.mjs
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_cheerful_old_lace.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_flavor_catalog.sql
npm run dev -- --host 127.0.0.1
```

Abrir http://localhost:5173/. Panel: http://localhost:5173/admin.
La nueva contrasena se genera en `.dev.vars`, variable `LOCAL_ADMIN_PASSWORD`.
No compartir ese archivo. Las migraciones son para la preparacion inicial.

En sesiones posteriores basta con `npm run dev -- --host 127.0.0.1`.
La instalacion requiere Internet; el uso es local. No es un HTML para abrir
con doble clic. No publicar esta autenticacion local en Internet.

La entrega incluye el editor de sabores y las pruebas del proyecto, pero no
afirma que la instalacion se haya verificado en el equipo receptor.
Los porcentajes historicos en otros documentos no acreditan un avance global.
