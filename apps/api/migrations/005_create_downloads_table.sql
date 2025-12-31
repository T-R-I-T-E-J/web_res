-- Migration: Create downloads table
-- Date: 2025-12-30
-- Description: Adds downloads table to store rules, policies, and match documents
-- Create downloads table
CREATE TABLE IF NOT EXISTS downloads (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Content
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_type VARCHAR(50) NOT NULL,
    size VARCHAR(50),
    href VARCHAR(255) NOT NULL,
    -- Categorization
    category VARCHAR(50) NOT NULL DEFAULT 'rules',
    -- Status
    is_active BOOLEAN DEFAULT true,
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Create indexes
CREATE INDEX IF NOT EXISTS idx_downloads_category ON downloads(category);
CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON downloads(created_at DESC);
-- Comments
COMMENT ON TABLE downloads IS 'Stores downloadable documents and external links';
COMMENT ON COLUMN downloads.category IS 'Category: rules, selection, calendar, match';