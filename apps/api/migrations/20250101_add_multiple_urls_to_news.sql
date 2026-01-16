-- Migration: Add support for multiple image URLs in news articles
-- Date: 2025-01-01
-- Description: Convert featured_image_url from single text field to jsonb array to support multiple images
-- Step 1: Add new column for image URLs array
ALTER TABLE news_articles
ADD COLUMN IF NOT EXISTS image_urls jsonb DEFAULT '[]';
-- Step 2: Migrate existing data from featured_image_url to image_urls
-- If featured_image_url exists and is not empty, add it as first element in array
UPDATE news_articles
SET image_urls = jsonb_build_array(featured_image_url)
WHERE featured_image_url IS NOT NULL
    AND featured_image_url != ''
    AND image_urls = '[]';
-- Step 3: Keep featured_image_url for backward compatibility (will be deprecated)
-- Add comment to indicate deprecation
COMMENT ON COLUMN news_articles.featured_image_url IS 'DEPRECATED: Use image_urls instead. Kept for backward compatibility.';
COMMENT ON COLUMN news_articles.image_urls IS 'Array of image URLs for the news article. First image is considered the featured image.';
-- Step 4: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_news_articles_image_urls ON news_articles USING GIN (image_urls);
-- Rollback script (if needed):
-- ALTER TABLE news_articles DROP COLUMN IF EXISTS image_urls;
-- DROP INDEX IF EXISTS idx_news_articles_image_urls;