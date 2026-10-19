import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
const base = 'http://localhost:5173';
let cookie = '';
let changed = null;
const results = [];
const folder = `outputs/acceptance/catalog-${randomUUID()}`;
mkdirSync(folder,{recursive:true});
async function call(method, value, auth = true, origin = base) {
  return fetch(base+'/api/catalog',{method,headers:{Origin:origin,'Content-Type':'application/json',...(auth?{Cookie:cookie}:{})},...(value?{body:JSON.stringify(value)}:{}),signal:AbortSignal.timeout(20000)});
}
async function test(name, fn) { await fn(); results.push(name); console.log('PASS: '+name); }
const password = readFileSync('.dev.vars','utf8').match(/^LOCAL_ADMIN_PASSWORD=(.+)$/m)[1].trim();
let original;
try {
  const initial = await call('GET'); assert.equal(initial.status,200);
  original = (await initial.json()).catalog;
  await test('Lectura publica de cuatro categorias', async()=>assert.equal(Object.keys(original).length,4));
  await test('Edicion anonima bloqueada',async()=>assert.equal((await call('PUT',{category:'Bebidas',names:['Demo'],revision:original.Bebidas.revision},false)).status,401));
  const login = await fetch(base+'/api/admin/session',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({password})});
  assert.equal(login.status,200); cookie=login.headers.get('set-cookie').split(';')[0];
  await test('Origen externo bloqueado',async()=>assert.equal((await call('PUT',{},true,'https://other.example')).status,403));
  for(const names of [[],['Fresa',' fresa '],['x'.repeat(61)],Array.from({length:31},(_,i)=>'Perfil '+i)]) {
    await test('Catalogo invalido rechazado '+results.length,async()=>assert.equal((await call('PUT',{category:'Bebidas',names,revision:original.Bebidas.revision})).status,400));
  }
  for(const category of Object.keys(original)) {
    const before = original[category];
    const names = [...before.names.slice(0,29),'DEMO QA '+randomUUID().slice(0,8)];
    const saved = await call('PUT',{category,names,revision:before.revision}); assert.equal(saved.status,200);
    const entry = (await saved.json()).entry;
    changed={category,revision:entry.revision,names:before.names};
    await test('Persistencia publica '+category,async()=>{
      const current=(await (await call('GET',undefined,false)).json()).catalog;
      assert.deepEqual(current[category].names,names);
      assert.equal(current[category].revision,entry.revision);
    });
    await test('Conflicto de revision '+category,async()=>assert.equal((await call('PUT',{category,names:['Otro'],revision:before.revision})).status,409));
    const restored = await call('PUT',changed); assert.equal(restored.status,200);
    changed=null;
    await test('Restauracion de sabores '+category,async()=>assert.deepEqual((await (await call('GET')).json()).catalog[category].names,before.names));
  }
} finally {
  if(changed) { const response=await call('PUT',changed); if(!response.ok) console.error('ATENCION: restauracion pendiente; revisar catalogo.'); }
  if(cookie) await fetch(base+'/api/admin/session',{method:'DELETE',headers:{Origin:base,Cookie:cookie}});
  writeFileSync(folder+'/resultados.json',JSON.stringify({executedAt:new Date().toISOString(),passed:results,scope:'API catalogo; no prueba visual; sabores originales restaurados si todos los casos finalizaron'},null,2));
  console.log('Evidencia: '+folder);
}
