/**
 * Script to reset the admin user password
 * Usage: node reset-admin-password.js
 */

const bcrypt = require('bcrypt');
const { Client } = require('pg');

const SALT_ROUNDS = 10;

// Database connection from environment or defaults
const connectionString = process.env.DATABASE_URL || 
  'postgresql://admin:admin123@localhost:5432/psci_platform';

async function resetAdminPassword() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const email = 'admin@psci.in';
    const newPassword = 'Admin@123';  // New password

    // Check if user exists
    const userResult = await client.query(
      'SELECT id, email, first_name, last_name FROM public.users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log('❌ User not found with email:', email);
      return;
    }

    const user = userResult.rows[0];
    console.log('📧 Found user:', user.email);
    console.log('👤 Name:', user.first_name, user.last_name);

    // Hash new password
    console.log('🔐 Hashing new password...');
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    console.log('💾 Updating password...');
    await client.query(`
      UPDATE public.users 
      SET password_hash = $1, updated_at = NOW()
      WHERE id = $2
    `, [passwordHash, user.id]);

    console.log('\n✅ Password reset successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('🔑 New Password:', newPassword);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  You can now login with these credentials!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the script
resetAdminPassword()
  .then(() => {
    console.log('\n✨ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
