-- Imoveis em Movimento: esquema inicial para Cloudflare D1
-- Aplicar manualmente no banco da sua conta, nao inclui anuncios ficticios.
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'Venda' CHECK(purpose IN ('Venda','Locação','Temporada')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
  price_cents INTEGER CHECK(price_cents IS NULL OR price_cents >= 0),
  city TEXT NOT NULL,
  uf TEXT NOT NULL,
  neighborhood TEXT NOT NULL DEFAULT '',
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  rooms INTEGER NOT NULL DEFAULT 0,
  baths INTEGER NOT NULL DEFAULT 0,
  parking INTEGER NOT NULL DEFAULT 0,
  area REAL NOT NULL DEFAULT 0,
  photos_json TEXT NOT NULL DEFAULT '[]',
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_properties_public ON properties(status, uf, city, updated_at);
CREATE INDEX IF NOT EXISTS idx_properties_admin_updated ON properties(updated_at DESC);
