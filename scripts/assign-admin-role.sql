-- Assign admin role to admin@psci.in
-- 1. Create admin role if it doesn't exist
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
-- 2. Assign admin role to the user
INSERT INTO public.user_roles (user_id, role_id, assigned_at)
SELECT u.id,
    r.id,
    NOW()
FROM public.users u
    CROSS JOIN public.roles r
WHERE u.email = 'admin@psci.in'
    AND r.name = 'admin' ON CONFLICT (user_id, role_id) DO NOTHING;
-- 3. Verify the assignment
SELECT u.id,
    u.email,
    u.first_name,
    u.last_name,
    r.name as role_name,
    r.display_name
FROM public.users u
    LEFT JOIN public.user_roles ur ON u.id = ur.user_id
    LEFT JOIN public.roles r ON ur.role_id = r.id
WHERE u.email = 'admin@psci.in';