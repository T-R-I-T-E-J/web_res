-- Create news_articles table
-- This table was missing from the initial schema
CREATE TABLE IF NOT EXISTS news_articles (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    category VARCHAR(50) NOT NULL CHECK (
        category IN (
            'NEWS',
            'ANNOUNCEMENT',
            'RESULT',
            'ACHIEVEMENT',
            'EVENT',
            'PRESS_RELEASE'
        )
    ),
    tags JSONB DEFAULT '[]',
    author_id BIGINT REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (
        status IN (
            'draft',
            'pending_review',
            'published',
            'archived'
        )
    ),
    is_featured BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
-- Create indexes
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_published ON news_articles(published_at)
WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_news_articles_slug ON news_articles(slug);
-- Add comments
COMMENT ON TABLE news_articles IS 'News articles, announcements, and press releases for the public website.';