# Food Solutions Landing

Proyecto local de landing page para Food Solutions.

## Como abrirlo

1. Instalar Node.js 22 o superior.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Abrir una terminal dentro de la carpeta.
4. Ejecutar:

```bash
npm install
npm run dev
```

5. Abrir en el navegador:

```text
http://localhost:5173/
```

## Alcance funcional local

### Catalogo editable

El panel `/admin` incluye el editor de sabores por aplicacion. Admite de 1 a
30 nombres distintos por categoria, con hasta 60 caracteres. Guardar actualiza
la tabla `flavor_catalog`; el formulario consulta este catalogo al abrirse y
al volver a enfocar la ventana. Las solicitudes anteriores conservan sus datos.
Las categorias siguen siendo las cuatro acordadas; no se editan reglas de
compatibilidad alimentaria ni textos institucionales desde este editor.

En una instalacion existente, aplicar una sola vez (es idempotente):

```powershell
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_flavor_catalog.sql
```

En un equipo nuevo, ejecutar tambien esta migracion despues de la migracion
inicial indicada mas abajo. Si falta, el editor muestra un error y el formulario
permite escribir un perfil personalizado sin mostrar un catalogo desactualizado.

Prueba de API: `node tests/catalog-api.mjs`. Usa cambios DEMO temporales,
restaura los nombres originales y no guarda credenciales en la evidencia.

### Funciones generales

- Landing B2B, fichas por aplicacion y escena 3D.
- Personalizacion: aplicacion, perfil de sabor y etapa del proyecto.
- Seleccion visual por aplicacion, perfiles rapidos y vista ilustrativa animada
  con GSAP. Se conserva el campo libre para perfiles personalizados.
- Las animaciones se pueden pausar, se detienen fuera de pantalla y respetan
  la preferencia de movimiento reducido. Las imagenes no predicen el producto.
- Orientacion preliminar por aplicacion; debe validarla Food Solutions.
- Solicitud tecnica con validacion en cliente y servidor.
- Base de datos D1/SQLite local persistente en `.wrangler/state`.
- Panel `/admin`: consulta, busqueda, filtro y cambio de estado.
- Sesion local de 8 horas, cookie HttpOnly, cierre de sesion y limites de intentos.

El 70% es una referencia al alcance acordado, no una medicion matematica ni
una certificacion de preparacion para produccion. No se envia correo, no hay
formulacion automatica y no se publican datos en la nube.

## Acceso al panel

Abra `http://localhost:5173/admin`. La contrasena se encuentra en
`LOCAL_ADMIN_PASSWORD` dentro de `.dev.vars`, en la raiz del proyecto.
Ese archivo es privado, esta excluido de Git y no debe compartirse.
No existe una contrasena universal incorporada al codigo.

Use datos ficticios en esta etapa. La base de datos no esta cifrada en disco;
la proteccion del equipo y sus copias de seguridad sigue siendo necesaria.
El acceso del servidor se restringe a localhost. No publique esta autenticacion
local: antes de produccion se debe integrar identidad y permisos adecuados.

## Preparacion en otro equipo (solo la primera vez)

```powershell
npm install --legacy-peer-deps
node scripts/setup-local.mjs
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_cheerful_old_lace.sql
npm run dev -- --host 127.0.0.1
```

En este equipo las tablas ya estan creadas: no repita la migracion inicial.
No elimine `.wrangler/state` si desea conservar solicitudes. Los cambios de
estructura posteriores deben realizarse mediante nuevas migraciones.

## Comprobaciones

```powershell
npx tsc --noEmit
npm run build
```

La prueba `tests/local-flow.mjs` usa Playwright y Edge en modo sin ventana.
Puede indicar la ubicacion instalada de Playwright mediante `PLAYWRIGHT_PATH`.
Registra datos ficticios con el prefijo DEMO QA. Comprueba contacto, validacion,
sesion, estado persistente tras recargar, acceso anonimo y anchos de 390/768 px.

`tests/brief-visual.mjs` comprueba las cuatro aplicaciones y sabores, perfiles
libres, pausa/reanudacion, movimiento reducido y anchos 1440/768/390/320 px.

## Pendiente antes de produccion

Validacion de reglas y textos con la empresa; privacidad y retencion de datos;
identidad y permisos de usuarios; notificaciones; recuperacion de acceso;
HTTPS y dominio; backups; monitoreo; pruebas de carga y revision de seguridad.
El panel inicial muestra como maximo las 500 solicitudes mas recientes.

