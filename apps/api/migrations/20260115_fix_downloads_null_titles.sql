-- Fix NULL values in downloads table before adding NOT NULL constraint
-- Date: 2026-01-15
-- Step 1: Update any NULL title values with a default value
UPDATE downloads
SET title = 'Untitled Document'
WHERE title IS NULL;
-- Step 2: Now it's safe to add NOT NULL constraint if needed
-- (This will be handled by TypeORM synchronization)
-- Add comment
COMMENT ON COLUMN downloads.title IS 'Title of the download document (required)';