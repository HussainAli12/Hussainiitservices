-- Per-post SEO fields for blogs (run after 12-create-blogs.sql)
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_keywords TEXT[] DEFAULT '{}';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS cover_image_alt TEXT;
