/**
 * Script to verify the admin user's password hash
 */

const bcrypt = require('bcrypt');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 
  'postgresql://admin:admin123@localhost:5432/psci_platform';

async function verifyPassword() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const email = 'admin@psci.in';
    const testPassword = 'Admin@123';

    // Get user
    const result = await client.query(
      'SELECT id, email, password_hash FROM public.users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }

    const user = result.rows[0];
    console.log('📧 User:', user.email);
    console.log('🔑 Password Hash:', user.password_hash.substring(0, 20) + '...');

    // Test password
    const isMatch = await bcrypt.compare(testPassword, user.password_hash);
    console.log('\n🔐 Password Test:');
    console.log('   Testing password:', testPassword);
    console.log('   Match:', isMatch ? '✅ YES' : '❌ NO');

    if (!isMatch) {
      console.log('\n⚠️  Password does NOT match!');
      console.log('   The password in the database is different from:', testPassword);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

verifyPassword();
