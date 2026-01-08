/**
 * Script to create an admin user in the database
 * Usage: node create-admin-user.js
 */

const bcrypt = require('bcrypt');
const { Client } = require('pg');

const SALT_ROUNDS = 10;

// Database connection from environment or defaults
const connectionString = process.env.DATABASE_URL || 
  'postgresql://admin:admin123@localhost:5432/psci_platform';

async function createAdminUser() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Admin user details
    const email = 'admin@psci.in';
    const password = 'Admin@123'; // Change this to a secure password
    const firstName = 'Admin';
    const lastName = 'User';

    // Check if user already exists
    const checkResult = await client.query(
      'SELECT id FROM public.users WHERE email = $1',
      [email]
    );

    if (checkResult.rows.length > 0) {
      console.log('⚠️  Admin user already exists with email:', email);
      console.log('User ID:', checkResult.rows[0].id);
      
      // Check roles
      const rolesResult = await client.query(`
        SELECT r.name 
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = $1
      `, [checkResult.rows[0].id]);
      
      console.log('Current roles:', rolesResult.rows.map(r => r.name).join(', '));
      return;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    console.log('👤 Creating admin user...');
    const userResult = await client.query(`
      INSERT INTO public.users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        is_active, 
        email_verified_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, email, first_name, last_name
    `, [email, passwordHash, firstName, lastName, true]);

    const userId = userResult.rows[0].id;
    console.log('✅ User created:', userResult.rows[0]);

    // Get or create admin role
    let adminRoleResult = await client.query(
      'SELECT id FROM public.roles WHERE name = $1',
      ['admin']
    );

    let adminRoleId;
    if (adminRoleResult.rows.length === 0) {
      console.log('📝 Creating admin role...');
      const createRoleResult = await client.query(`
        INSERT INTO public.roles (name, display_name, description, is_system, level)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, ['admin', 'Administrator', 'Full system access', true, 100]);
      adminRoleId = createRoleResult.rows[0].id;
    } else {
      adminRoleId = adminRoleResult.rows[0].id;
    }

    // Assign admin role
    console.log('🔑 Assigning admin role...');
    await client.query(`
      INSERT INTO public.user_roles (user_id, role_id)
      VALUES ($1, $2)
    `, [userId, adminRoleId]);

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the script
createAdminUser()
  .then(() => {
    console.log('\n✨ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
