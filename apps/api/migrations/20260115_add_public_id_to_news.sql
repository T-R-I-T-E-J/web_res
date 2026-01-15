-- Add missing public_id column to news_articles table
-- This column is required by the NewsArticle entity
-- Add public_id column with UUID type and default value
ALTER TABLE news_articles
ADD COLUMN IF NOT EXISTS public_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE;
-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_news_articles_public_id ON news_articles(public_id);
-- Add comment
COMMENT ON COLUMN news_articles.public_id IS 'Public UUID identifier for external API references';