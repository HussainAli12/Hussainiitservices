-- Step 15: Portfolio project pages — slug, case study fields, gallery, SEO

ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS challenge TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS solution TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS results TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS tech_stack TEXT[] DEFAULT '{}';
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]';
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS cover_image_alt TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS meta_keywords TEXT[];

-- Backfill slugs from titles (lowercase, non-alphanumeric → hyphen)
UPDATE portfolio
SET slug = trim(both '-' from regexp_replace(lower(trim(title)), '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Resolve duplicate slugs by appending a short id suffix
UPDATE portfolio AS p
SET slug = p.slug || '-' || left(replace(p.id::text, '-', ''), 6)
FROM (
  SELECT slug
  FROM portfolio
  WHERE slug IS NOT NULL AND slug <> ''
  GROUP BY slug
  HAVING count(*) > 1
) AS dup
WHERE p.slug = dup.slug
  AND EXISTS (
    SELECT 1
    FROM portfolio AS p2
    WHERE p2.slug = dup.slug
    GROUP BY p2.slug
    HAVING count(*) > 1
  )
  AND p.id <> (
    SELECT id FROM portfolio AS first_row
    WHERE first_row.slug = dup.slug
    ORDER BY first_row.sort_order ASC, first_row.created_at ASC
    LIMIT 1
  );

-- Fallback for any row still missing a slug
UPDATE portfolio
SET slug = 'project-' || left(replace(id::text, '-', ''), 8)
WHERE slug IS NULL OR slug = '';

ALTER TABLE portfolio ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS portfolio_slug_idx ON portfolio(slug);
