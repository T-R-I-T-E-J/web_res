-- Seed sample results data for the results page
-- This script adds sample shooting competition results
-- First, delete any existing sample results to avoid duplicates
DELETE FROM results
WHERE title LIKE '%National Para Shooting Championship%'
    OR title LIKE '%Asian Para Shooting Championship%'
    OR title LIKE '%World Para Shooting Championship%'
    OR title LIKE '%Selection Trials%'
    OR title LIKE '%Grand Prix%';
-- Insert sample results
INSERT INTO results (
        title,
        event_name,
        event_date,
        category,
        year,
        file_url,
        file_name,
        file_size,
        created_at,
        updated_at
    )
VALUES -- 2026 Results
    (
        'National Para Shooting Championship 2026 - 10m Air Rifle Results',
        'National Para Shooting Championship 2026',
        '2026-01-15',
        '10m Air Rifle',
        2026,
        'https://example.com/results/national-2026-10m-air-rifle.pdf',
        'national-2026-10m-air-rifle.pdf',
        245678,
        NOW(),
        NOW()
    ),
    (
        'National Para Shooting Championship 2026 - 10m Air Pistol Results',
        'National Para Shooting Championship 2026',
        '2026-01-15',
        '10m Air Pistol',
        2026,
        'https://example.com/results/national-2026-10m-air-pistol.pdf',
        'national-2026-10m-air-pistol.pdf',
        198456,
        NOW(),
        NOW()
    ),
    (
        'National Para Shooting Championship 2026 - 50m Rifle 3 Positions Results',
        'National Para Shooting Championship 2026',
        '2026-01-16',
        '50m Rifle 3 Positions',
        2026,
        'https://example.com/results/national-2026-50m-rifle-3p.pdf',
        'national-2026-50m-rifle-3p.pdf',
        312890,
        NOW(),
        NOW()
    ),
    -- 2025 Results
    (
        'Asian Para Shooting Championship 2025 - Final Results',
        'Asian Para Shooting Championship 2025',
        '2025-11-20',
        'All Categories',
        2025,
        'https://example.com/results/asian-2025-final.pdf',
        'asian-2025-final.pdf',
        567234,
        NOW(),
        NOW()
    ),
    (
        'World Para Shooting Championship 2025 - India Team Results',
        'World Para Shooting Championship 2025',
        '2025-09-10',
        'All Categories',
        2025,
        'https://example.com/results/world-2025-india-team.pdf',
        'world-2025-india-team.pdf',
        423567,
        NOW(),
        NOW()
    ),
    (
        'Selection Trials 2025 - 10m Air Rifle',
        'Selection Trials 2025',
        '2025-06-15',
        '10m Air Rifle',
        2025,
        'https://example.com/results/selection-2025-10m-rifle.pdf',
        'selection-2025-10m-rifle.pdf',
        156789,
        NOW(),
        NOW()
    ),
    (
        'Selection Trials 2025 - 10m Air Pistol',
        'Selection Trials 2025',
        '2025-06-16',
        '10m Air Pistol',
        2025,
        'https://example.com/results/selection-2025-10m-pistol.pdf',
        'selection-2025-10m-pistol.pdf',
        145678,
        NOW(),
        NOW()
    ),
    -- 2024 Results
    (
        'National Para Shooting Championship 2024 - Final Results',
        'National Para Shooting Championship 2024',
        '2024-12-10',
        'All Categories',
        2024,
        'https://example.com/results/national-2024-final.pdf',
        'national-2024-final.pdf',
        389456,
        NOW(),
        NOW()
    ),
    (
        'WSPS Grand Prix France 2024 - India Results',
        'WSPS Grand Prix France 2024',
        '2024-08-25',
        'All Categories',
        2024,
        'https://example.com/results/wsps-france-2024.pdf',
        'wsps-france-2024.pdf',
        278901,
        NOW(),
        NOW()
    ),
    (
        'Asian Para Games 2024 - Shooting Results',
        'Asian Para Games 2024',
        '2024-10-15',
        'All Categories',
        2024,
        'https://example.com/results/asian-para-games-2024.pdf',
        'asian-para-games-2024.pdf',
        456123,
        NOW(),
        NOW()
    );
-- Verify the inserted results
SELECT id,
    title,
    event_name,
    event_date,
    category,
    year,
    created_at
FROM results
ORDER BY event_date DESC;