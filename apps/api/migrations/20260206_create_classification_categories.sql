-- Migration: Create proper classification categories and fix data separation
-- Date: 2026-02-06
-- Description: Separates Policies and Classification into distinct page types

-- Step 1: Create dedicated classification categories
INSERT INTO categories (name, slug, page, "order", is_active) VALUES
  ('Medical Classification', 'medical_classification', 'classification', 1, true),
  ('IPC License', 'ipc_license', 'classification', 2, true),
  ('National Classification', 'national_classification', 'classification', 3, true)
ON CONFLICT (slug) DO UPDATE SET
  page = EXCLUDED.page,
  name = EXCLUDED.name,
  "order" = EXCLUDED."order";

-- Step 2: Ensure 'classification' category is on classification page
UPDATE categories 
SET page = 'classification', "order" = 4
WHERE slug = 'classification';

-- Step 3: Ensure policies categories stay on policies page
UPDATE categories 
SET page = 'policies' 
WHERE slug IN ('rules', 'selection', 'calendar', 'match')
  AND page != 'policies';

-- Step 4: Add comment for clarity
COMMENT ON COLUMN categories.page IS 'Determines which frontend page shows this category: policies or classification';
