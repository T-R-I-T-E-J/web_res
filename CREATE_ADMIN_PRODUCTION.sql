-- ============================================
-- Create Admin User for Render Production DB
-- ============================================
-- Email: admin@psci.in
-- Password: Admin@123
-- 
-- INSTRUCTIONS:
-- 1. Go to Render Dashboard → Your Service → Shell
-- 2. Connect to PostgreSQL:
--    psql $DATABASE_URL
-- 3. Copy and paste this entire script
-- 4. Press Enter to execute
-- ============================================
-- Step 1: Create the admin user
INSERT INTO public.users (
        email,
        password_hash,
        first_name,
        last_name,
        phone,
        email_verified_at,
        is_active
    )
VALUES (
        'admin@psci.in',
        '$2b$10$Skc1uP6gyToY8aG1elJOq.QFnTGPg5RtJYDgYn5HV6GGp/.',
        'System',
        'Administrator',
        '+91-1234567890',
        NOW(),
        true
    ) ON CONFLICT (email) DO
UPDATE
SET password_hash = EXCLUDED.password_hash,
    is_active = true,
    email_verified_at = NOW();
-- Step 2: Create admin role
INSERT INTO public.roles (
        name,
        display_name,
        description,
        permissions,
        is_system,
        level
    )
VALUES (
        'admin',
        'Administrator',
        'Full system access with all permissions',
        '{"all": true}'::jsonb,
        true,
        100
    ) ON CONFLICT (name) DO NOTHING;
-- Step 3: Assign admin role to user
INSERT INTO public.user_roles (user_id, role_id, assigned_at)
SELECT u.id,
    r.id,
    NOW()
FROM public.users u
    CROSS JOIN public.roles r
WHERE u.email = 'admin@psci.in'
    AND r.name = 'admin' ON CONFLICT (user_id, role_id) DO NOTHING;
-- Step 4: Verify the admin user was created successfully
SELECT u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.is_active,
    u.email_verified_at IS NOT NULL as email_verified,
    r.name as role_name,
    r.display_name as role_display_name
FROM public.users u
    LEFT JOIN public.user_roles ur ON u.id = ur.user_id
    LEFT JOIN public.roles r ON ur.role_id = r.id
WHERE u.email = 'admin@psci.in';
-- ============================================
-- Expected Output:
-- ============================================
-- id | email           | first_name | last_name      | is_active | email_verified | role_name | role_display_name
-- ---|-----------------|------------|----------------|-----------|----------------|-----------|------------------
--  1 | admin@psci.in   | System     | Administrator  | t         | t              | admin     | Administrator
-- ============================================