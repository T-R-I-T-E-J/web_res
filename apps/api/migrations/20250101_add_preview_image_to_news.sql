-- Add preview_image_url to news_articles table
ALTER TABLE news_articles
ADD COLUMN IF NOT EXISTS preview_image_url TEXT;
-- Comment on column
COMMENT ON COLUMN news_articles.preview_image_url IS 'URL for the preview/thumbnail image of the news article';