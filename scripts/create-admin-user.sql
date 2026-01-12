-- Create Admin User
-- Password: Admin@123 (bcrypt hash)
-- Email: admin@psci.in
-- First, insert the user
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
        '$2b$10$rQJ5qKZxKxKxKxKxKxKxKOe5qKZxKxKxKxKxKxKxKxKxKxKxKxKxK',
        -- This is a placeholder, will be replaced
        'System',
        'Administrator',
        '+91-1234567890',
        NOW(),
        true
    ) ON CONFLICT (email) DO NOTHING
RETURNING id;
-- Get the user ID (you'll need to run this separately or use a transaction)
-- For now, let's assume the user ID is 1
-- Insert admin role if it doesn't exist
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
-- Assign admin role to the user
INSERT INTO public.user_roles (user_id, role_id, assigned_at)
SELECT u.id,
    r.id,
    NOW()
FROM public.users u
    CROSS JOIN public.roles r
WHERE u.email = 'admin@psci.in'
    AND r.name = 'admin' ON CONFLICT (user_id, role_id) DO NOTHING;
-- Verify the user was created
SELECT u.id,
    u.email,
    u.first_name,
    u.last_name,
    r.name as role_name
FROM public.users u
    LEFT JOIN public.user_roles ur ON u.id = ur.user_id
    LEFT JOIN public.roles r ON ur.role_id = r.id
WHERE u.email = 'admin@psci.in';