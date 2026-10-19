import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const base = 'http://localhost:5173';
const runId = randomUUID();
const folder = path.resolve('outputs/acceptance', runId);
mkdirSync(folder, { recursive: true });
const results = [];
const sourceHash = createHash('sha256');
function fingerprint(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) fingerprint(file);
    else { sourceHash.update(file.replaceAll('\\', '/')); sourceHash.update(readFileSync(file)); }
  }
}
for (const directory of ['app', 'components', 'lib', 'db', 'tests']) fingerprint(directory);
sourceHash.update(readFileSync('package-lock.json'));
const fingerprintValue = sourceHash.digest('hex');
async function test(id, description, action) {
  try { await action(); results.push({ id, description, status: 'APROBADO' }); }
  catch (e) { results.push({ id, description, status: 'FALLIDO', detail: e.message }); }
  console.log(`${results.at(-1).status}: ${id} ${description}`);
}
let cookie = '';
async function api(route, method = 'GET', payload, authenticated = false, origin = base) {
  return fetch(base + route, { method, headers: { 'Content-Type': 'application/json', Origin: origin, ...(authenticated && cookie ? { Cookie: cookie } : {}) }, ...(payload === undefined ? {} : { body: JSON.stringify(payload) }), signal: AbortSignal.timeout(20000) });
}
const brief = { application: 'Bebidas', flavor: 'Limon DEMO QA', stage: 'Pruebas piloto', company: `DEMO QA ACEPTACION ${runId}`, name: 'Contacto de prueba', email: 'demo@example.test', product: 'Bebida de demostracion', ph: '3.5', process: '', restrictions: '', consent: true, requestId: randomUUID() };
await test('U01', 'Validacion y exportacion con datos multilinea y proteccion de formulas', () => {
  const output = execFileSync(process.execPath, ['tests/request-export.cjs'], { encoding: 'utf8' });
  writeFileSync(path.join(folder, 'exportacion.log'), output);
});
await test('A01', 'Lectura anonima rechazada', async () => assert.equal((await api('/api/requests')).status, 401));
await test('A02', 'Escritura de origen externo rechazada', async () => assert.equal((await api('/api/requests','POST',brief,false,'https://other.example')).status,403));
await test('A03', 'Campos obligatorios ausentes rechazados', async () => assert.equal((await api('/api/requests','POST',{})).status,400));
for (const [id, description, change] of [
  ['A04','Correo invalido rechazado',{email:'incorrecto'}],
  ['A05','pH fuera de rango rechazado',{ph:'15'}],
  ['A06','Ausencia de consentimiento rechazada',{consent:false}],
  ['A07','Categoria desconocida rechazada',{application:'Inexistente'}],
]) await test(id,description,async () => assert.equal((await api('/api/requests','POST',{...brief,...change})).status,400));
await test('A08','Modificacion anonima rechazada',async () => assert.equal((await api('/api/requests/'+brief.requestId,'PATCH',{status:'En revisión'})).status,401));
await test('A09','Contrasena incorrecta rechazada',async () => assert.equal((await api('/api/admin/session','POST',{password:randomUUID()})).status,401));
await test('A10','Autenticacion y atributos de cookie',async () => {
  const password = readFileSync('.dev.vars','utf8').match(/^LOCAL_ADMIN_PASSWORD=(.+)$/m)?.[1].trim();
  assert(password, 'Credencial configurada');
  const response = await api('/api/admin/session','POST',{password});
  assert.equal(response.status,200);
  const header = response.headers.get('set-cookie');
  assert(header?.includes('HttpOnly')); assert(header.includes('SameSite=Strict'));
  cookie = header.split(';')[0];
});
try {
  await test('A11','Registro valido devuelve referencia',async () => {
    const response = await api('/api/requests','POST',brief);
    assert.equal(response.status,201); assert.equal((await response.json()).id,brief.requestId);
  });
  await test('A12','Reintento identico no duplica registros',async () => {
    assert.equal((await api('/api/requests','POST',brief)).status,201);
    const response = await api('/api/requests','GET',undefined,true); assert.equal(response.status,200);
    assert.equal((await response.json()).requests.filter(r => r.id === brief.requestId).length,1);
  });
  await test('A13','Referencia reutilizada con otros datos rechazada',async () => assert.equal((await api('/api/requests','POST',{...brief,flavor:'Otro perfil'})).status,409));
  await test('A14','Datos conservados al consultar nuevamente',async () => {
    const response = await api('/api/requests','GET',undefined,true); assert.equal(response.status,200);
    const row = (await response.json()).requests.find(r => r.id === brief.requestId);
    assert(row); const { requestId, ...expected } = brief; assert.deepEqual(JSON.parse(row.payload),expected);
  });
  await test('A15','Estado invalido rechazado',async () => assert.equal((await api('/api/requests/'+brief.requestId,'PATCH',{status:'INVALIDO'},true)).status,400));
  await test('A16','Cambio de estado persiste en nueva consulta',async () => {
    assert.equal((await api('/api/requests/'+brief.requestId,'PATCH',{status:'En revisión'},true)).status,200);
    const response = await api('/api/requests','GET',undefined,true);
    assert.equal((await response.json()).requests.find(r => r.id === brief.requestId).status,'En revisión');
  });
  await test('A17','Solicitud inexistente devuelve 404',async () => assert.equal((await api('/api/requests/'+randomUUID(),'PATCH',{status:'Contactada'},true)).status,404));
} finally {
  await test('A18','Cierre revoca la sesion',async () => {
    assert.equal((await api('/api/admin/session','DELETE',undefined,true)).status,200);
    assert.equal((await api('/api/requests','GET',undefined,true)).status,401);
  });
  cookie = '';
  const report = { runId, executedAt: new Date().toISOString(), sourceSHA256: fingerprintValue, node: process.version, scope: 'Pruebas unitarias y API local; sin navegador ni aceptacion empresarial', demoReference: brief.requestId, results };
  writeFileSync(path.join(folder,'resultados.json'),JSON.stringify(report,null,2));
  writeFileSync(path.join(folder,'RESULTADOS.md'),`# Evidencia de pruebas tecnicas\n\nEjecucion UTC: ${report.executedAt}\n\nHuella SHA256 del codigo: ${fingerprintValue}\n\nAlcance: ${report.scope}.\n\n| Caso | Comprobacion | Resultado |\n|---|---|---|\n${results.map(r=>`| ${r.id} | ${r.description} | ${r.status} |`).join('\n')}\n\n${results.filter(r=>r.status==='APROBADO').length}/${results.length} casos aprobados. Esta proporcion NO es porcentaje de avance del producto.\n\nSe conserva un registro identificado DEMO QA ACEPTACION, referencia ${brief.requestId}. No se usan datos de clientes. Las credenciales y cookies no se incluyen en la evidencia.\n`);
  console.log('Evidencia: '+folder);
}
if (results.some(r => r.status !== 'APROBADO')) process.exitCode = 1;
