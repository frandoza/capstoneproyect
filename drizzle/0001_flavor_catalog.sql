CREATE TABLE IF NOT EXISTS flavor_catalog (
  category TEXT PRIMARY KEY NOT NULL,
  names TEXT NOT NULL,
  revision TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
