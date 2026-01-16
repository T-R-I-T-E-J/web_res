/**
 * Generate Bcrypt Hash for Admin Password
 * 
 * This script generates a bcrypt hash for the password "Admin@123"
 * to be used in the production database.
 * 
 * Run: node generate-admin-hash.js
 */

const bcrypt = require('bcrypt');

const password = 'Admin@123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  
  console.log('\n===========================================');
  console.log('Bcrypt Hash Generated Successfully!');
  console.log('===========================================\n');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\n===========================================');
  console.log('SQL Command to Create Admin User:');
  console.log('===========================================\n');
  console.log(`INSERT INTO public.users (
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
    '${hash}',
    'System',
    'Administrator',
    '+91-1234567890',
    NOW(),
    true
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    is_active = true,
    email_verified_at = NOW();

-- Insert admin role
INSERT INTO public.roles (name, display_name, description, permissions, is_system, level)
VALUES ('admin', 'Administrator', 'Full system access', '{"all": true}'::jsonb, true, 100)
ON CONFLICT (name) DO NOTHING;

-- Assign role
INSERT INTO public.user_roles (user_id, role_id, assigned_at)
SELECT u.id, r.id, NOW()
FROM public.users u
CROSS JOIN public.roles r
WHERE u.email = 'admin@psci.in' AND r.name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;
`);
  console.log('\n===========================================\n');
});
