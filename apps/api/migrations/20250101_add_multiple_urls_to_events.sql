-- Migration: Add support for multiple image URLs in events
-- Date: 2025-01-01
-- Description: Add image_urls jsonb array to support multiple images for events
-- Step 1: Add new column for image URLs array
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS image_urls jsonb DEFAULT '[]';
-- Step 2: Add comment to the new column
COMMENT ON COLUMN public.events.image_urls IS 'Array of image URLs for the event. First image is considered the featured image.';
-- Step 3: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_events_image_urls ON public.events USING GIN (image_urls);
-- Rollback script (if needed):
-- ALTER TABLE public.events DROP COLUMN IF EXISTS image_urls;
-- DROP INDEX IF EXISTS idx_events_image_urls;