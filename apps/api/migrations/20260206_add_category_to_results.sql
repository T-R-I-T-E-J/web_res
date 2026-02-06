-- Migration: Add category support to Results
-- Date: 2026-02-06
-- Description: Enables Results to be categorized (National vs International, etc.)

-- Step 1: Add category_id column to results table
ALTER TABLE results 
ADD COLUMN IF NOT EXISTS category_id uuid;

-- Step 2: Add foreign key constraint
ALTER TABLE results
ADD CONSTRAINT fk_results_category 
FOREIGN KEY (category_id) 
REFERENCES categories(id) 
ON DELETE SET NULL;

-- Step 3: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_results_category_id ON results(category_id);

-- Step 4: Verify the change
COMMENT ON COLUMN results.category_id IS 'Links result to a category (e.g., National, International) from categories table where page=results';
