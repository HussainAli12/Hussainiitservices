-- Step 13: Create site_stats table (editable homepage numbers)
-- Run in Supabase → SQL Editor → New query

CREATE TABLE IF NOT EXISTS site_stats (
  id TEXT PRIMARY KEY DEFAULT 'main',
  projects_delivered INTEGER NOT NULL DEFAULT 15,
  global_clients INTEGER NOT NULL DEFAULT 15,
  years_experience INTEGER NOT NULL DEFAULT 2,
  client_satisfaction INTEGER NOT NULL DEFAULT 98,
  projects_completed INTEGER NOT NULL DEFAULT 15,
  countries_served INTEGER NOT NULL DEFAULT 2,
  happy_clients INTEGER NOT NULL DEFAULT 15,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO site_stats (id)
VALUES ('main')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site stats" ON site_stats;
CREATE POLICY "Public read site stats"
  ON site_stats FOR SELECT
  USING (true);
