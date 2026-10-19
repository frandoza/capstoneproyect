const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const path = require('node:path');
function load(file) {
  const filename = path.resolve(__dirname, '../lib', file + '.ts');
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', compiled)(id => id === './brief' ? load('brief') : require(id), mod, mod.exports);
  return mod.exports;
}
const { briefSchema } = load('brief');
const { briefEntries, requestText, requestsCsv } = load('request-export');
const brief = { application: 'Helados', flavor: 'Vainilla', stage: 'Idea inicial', company: '=SUM(1,2)', name: 'Demo', email: 'demo@example.test', product: 'Base "vegetal", prueba', ph: '', process: 'Primera línea\nSegunda línea', restrictions: '', consent: true };
assert(briefSchema.safeParse(brief).success);
assert(!briefSchema.safeParse({ ...brief, ph: '15' }).success);
assert(!briefSchema.safeParse({ ...brief, consent: false }).success);
assert.equal(briefEntries(brief).length, 10);
assert(requestText('demo-id', brief).includes('Helados y postres congelados'));
assert(requestText('demo-id', brief).includes('Referencia: demo-id'));
assert(requestText('demo-id', brief).includes('No indicado'));
const record = { id: 'demo-id', payload: JSON.stringify(brief), status: 'Nueva', created_at: '2026-10-18', updated_at: '2026-10-18' };
const csv = requestsCsv([record]);
assert(csv.startsWith('\ufeff'));
assert(csv.includes('"\'=SUM(1,2)"'));
assert(csv.includes('"Base ""vegetal"", prueba"'));
assert(csv.includes('"Primera línea\nSegunda línea"'));
for (const value of ['+CMD', '-CMD', '@SUM(1)', '\t=CMD', '  =CMD']) {
  assert(requestsCsv([{ ...record, payload: JSON.stringify({ ...brief, company: value }) }]).includes(`"'${value}"`));
}
assert.equal(requestsCsv([]).split('\r\n').length, 1);
console.log('PASS: validation, labels, receipt, CSV quoting, multiline values, formula escaping, empty export.');
