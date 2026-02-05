-- Migration: Cleanup invalid downloads data
-- Date: 2026-02-06
-- Description: Marks or removes downloads with invalid file paths

-- Step 1: Find and report invalid downloads
-- These are downloads with hrefs that don't start with http or /uploads
-- (Run this first to see what will be affected)

-- REPORT ONLY - Review before running cleanup
SELECT 
    id, 
    title, 
    href, 
    category,
    CASE 
        WHEN href LIKE 'http%' THEN '✅ Valid External URL'
        WHEN href LIKE '/uploads/%' THEN '✅ Valid Internal Path'
        WHEN href LIKE '/api/%' THEN '✅ Valid API Path'
        ELSE '❌ Invalid Path'
    END as status
FROM downloads 
WHERE is_active = true
    AND href NOT LIKE 'http%'
    AND href NOT LIKE '/uploads/%'
    AND href NOT LIKE '/api/%'
ORDER BY created_at DESC;

-- Step 2: Mark invalid downloads as inactive (SAFE - can be reversed)
-- Uncomment the line below to execute:
-- UPDATE downloads 
-- SET is_active = false 
-- WHERE is_active = true
--     AND href NOT LIKE 'http%'
--     AND href NOT LIKE '/uploads/%'
--     AND href NOT LIKE '/api/%';

-- Step 3: (OPTIONAL) Completely delete invalid downloads
-- WARNING: This is irreversible! Only run if you're sure the data is garbage
-- Uncomment the lines below to execute:
-- DELETE FROM downloads 
-- WHERE is_active = false
--     AND href NOT LIKE 'http%'
--     AND href NOT LIKE '/uploads/%'
--     AND href NOT LIKE '/api/%';

-- Step 4: Verify downloads are properly categorized
SELECT 
    c.page,
    c.name as category_name,
    COUNT(d.id) as document_count
FROM categories c
LEFT JOIN downloads d ON d.category_id = c.id AND d.is_active = true
GROUP BY c.page, c.name, c."order"
ORDER BY c.page, c."order";

-- Expected output should show:
-- | page           | category_name           | document_count |
-- |----------------|-------------------------|----------------|
-- | classification | Medical Classification  | X              |
-- | classification | IPC License             | X              |
-- | classification | National Classification | X              |
-- | classification | General Classification  | X              |
-- | policies       | Rules                   | X              |
-- | policies       | Selection               | X              |
-- | policies       | Calendar                | X              |
-- | policies       | Match                   | X              |
