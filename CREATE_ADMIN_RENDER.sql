-- Create Admin User for Production (Render)
-- Email: admin@psci.in
-- Password: Admin@123
-- 
-- This script creates the admin user with the correct password hash
-- Run this on your Render database via the Render dashboard SQL console
-- Step 1: Insert the admin user
-- Password hash for "Admin@123" generated with bcrypt (10 rounds)
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
        '$2b$10$YourActualBcryptHashHere',
        -- REPLACE THIS with actual hash
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
-- Step 2: Insert admin role if it doesn't exist
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
-- Step 3: Assign admin role to the user
INSERT INTO public.user_roles (user_id, role_id, assigned_at)
SELECT u.id,
    r.id,
    NOW()
FROM public.users u
    CROSS JOIN public.roles r
WHERE u.email = 'admin@psci.in'
    AND r.name = 'admin' ON CONFLICT (user_id, role_id) DO NOTHING;
-- Step 4: Verify the user was created
SELECT u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.is_active,
    u.email_verified_at,
    r.name as role_name,
    r.display_name as role_display_name
FROM public.users u
    LEFT JOIN public.user_roles ur ON u.id = ur.user_id
    LEFT JOIN public.roles r ON ur.role_id = r.id
WHERE u.email = 'admin@psci.in';