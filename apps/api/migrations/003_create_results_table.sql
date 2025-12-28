-- Migration: Create results table for PDF uploads
-- Date: 2025-12-28
-- Description: Adds results table to store metadata for uploaded competition result PDFs
-- Create results table
CREATE TABLE IF NOT EXISTS results (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- PDF Metadata
    title VARCHAR(200) NOT NULL,
    date VARCHAR(50) NOT NULL,
    description TEXT,
    -- File Information
    file_name VARCHAR(255) NOT NULL,
    stored_file_name VARCHAR(255) UNIQUE NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    url TEXT NOT NULL,
    -- Ownership & Status
    uploaded_by BIGINT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    is_deleted BOOLEAN DEFAULT false,
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Foreign Key
    CONSTRAINT fk_results_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT
);
-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_results_date ON results(date DESC);
CREATE INDEX IF NOT EXISTS idx_results_published ON results(is_published, is_deleted);
CREATE INDEX IF NOT EXISTS idx_results_created_at ON results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_results_uploaded_by ON results(uploaded_by);
-- Add comments for documentation
COMMENT ON TABLE results IS 'Stores metadata for uploaded competition result PDFs';
COMMENT ON COLUMN results.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN results.title IS 'Title of the competition result';
COMMENT ON COLUMN results.date IS 'Year or date of the competition (e.g., "2025")';
COMMENT ON COLUMN results.description IS 'Optional description or category';
COMMENT ON COLUMN results.file_name IS 'Original filename as uploaded';
COMMENT ON COLUMN results.stored_file_name IS 'Unique filename stored on disk (UUID-based)';
COMMENT ON COLUMN results.file_size IS 'File size in bytes';
COMMENT ON COLUMN results.mime_type IS 'MIME type (should be application/pdf)';
COMMENT ON COLUMN results.url IS 'Public URL to access the PDF';
COMMENT ON COLUMN results.uploaded_by IS 'User ID of admin who uploaded';
COMMENT ON COLUMN results.is_published IS 'Whether result is visible to public';
COMMENT ON COLUMN results.is_deleted IS 'Soft delete flag';
COMMENT ON COLUMN results.created_at IS 'Upload timestamp';
COMMENT ON COLUMN results.updated_at IS 'Last update timestamp';
-- Verify table creation
DO $$ BEGIN IF EXISTS (
    SELECT
    FROM information_schema.tables
    WHERE table_name = 'results'
) THEN RAISE NOTICE 'Table "results" created successfully';
ELSE RAISE EXCEPTION 'Failed to create table "results"';
END IF;
END $$;