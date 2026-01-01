-- Add documents column to news_articles table
ALTER TABLE news_articles
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;
-- Comment on column
COMMENT ON COLUMN news_articles.documents IS 'List of attached documents (pdfs, docs) for the news article';