"""Create a source archive and consistent SQLite snapshots, without secrets."""
from pathlib import Path
from datetime import datetime
import hashlib
import json
import sqlite3
import tempfile
import zipfile
from contextlib import closing

root = Path(__file__).resolve().parent.parent
excluded = {'.git', 'node_modules', 'outputs', 'work', '.next', '.vinext',
            '.wrangler', '.sites-runtime', 'dist', '.agents', '.codex', '.aws'}
stamp = datetime.now().strftime('%Y%m%d-%H%M%S')
destination = root / 'outputs' / f'Food-Solutions-backup-{stamp}.zip'
destination.parent.mkdir(exist_ok=True)
manifest = []

def add(archive, source, name):
    content = source.read_bytes()
    archive.writestr(name, content)
    manifest.append({'path': name, 'bytes': len(content),
                     'sha256': hashlib.sha256(content).hexdigest()})

with tempfile.TemporaryDirectory(dir=destination.parent) as temp, zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED) as archive:
    for source in sorted(root.rglob('*')):
        relative = source.relative_to(root)
        if any(part in excluded for part in relative.parts):
            continue
        if not source.is_file() or source.is_symlink():
            continue
        if source.name.startswith(('.env', '.dev.vars')) or source.suffix in {'.log', '.tsbuildinfo', '.pem', '.key'}:
            continue
        add(archive, source, relative.as_posix())
    databases = list((root / '.wrangler/state/v3/d1').rglob('*.sqlite'))
    for index, source in enumerate(databases):
        snapshot = Path(temp) / f'{index}.sqlite'
        with closing(sqlite3.connect(source.as_uri() + '?mode=ro', uri=True)) as original, closing(sqlite3.connect(snapshot)) as copy:
            original.backup(copy)
            tables = {row[0] for row in copy.execute("SELECT name FROM sqlite_master WHERE type='table'")}
            for table in ('admin_sessions', 'rate_limits'):
                if table in tables:
                    copy.execute(f'DELETE FROM {table}')
            copy.commit()
            assert copy.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
        add(archive, snapshot, source.relative_to(root).as_posix())
    archive.writestr('RESTAURAR_BACKUP.txt', '''FOOD SOLUTIONS - RESPALDO LOCAL

Incluye codigo, recursos, dependencias declaradas, migraciones y copia consistente
de las bases SQLite locales. Las sesiones y limites temporales se reinician.
No incluye contrasenas (.dev.vars), node_modules, Git, logs ni compilaciones.

RESTAURAR EN UNA CARPETA NUEVA, nunca encima de una instancia en ejecucion:
1. Extraer todo el ZIP, incluyendo .openai y .wrangler.
2. Abrir Food-Solutions.code-workspace en Visual Studio Code.
3. Ejecutar npm install --legacy-peer-deps
4. Ejecutar node scripts/setup-local.mjs (genera una nueva contrasena).
5. Ejecutar npm run dev -- --host 127.0.0.1
6. Abrir http://localhost:5173 y /admin.

Las tablas ya estan en el respaldo: NO repetir la migracion inicial.
La nueva contrasena esta en .dev.vars. El archivo contiene solicitudes locales:
conservarlo privado; no distribuirlo como un paquete publico.
MANIFEST-BACKUP.json contiene el inventario y SHA-256 de cada archivo copiado.
''')
    archive.writestr('MANIFEST-BACKUP.json', json.dumps(manifest, indent=2))

with zipfile.ZipFile(destination) as archive:
    assert archive.testzip() is None
    for entry in manifest:
        assert hashlib.sha256(archive.read(entry['path'])).hexdigest() == entry['sha256']
print(json.dumps({'file': str(destination), 'files': len(manifest),
                  'databases': len(databases), 'bytes': destination.stat().st_size,
                  'verified': True}))
