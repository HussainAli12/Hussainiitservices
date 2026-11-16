-- Step 16: Track when a portfolio project was last edited (used for sitemap lastmod)
-- Run in Supabase → SQL Editor → New query. Safe to run more than once.

ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

UPDATE portfolio SET updated_at = created_at WHERE updated_at IS NULL;
