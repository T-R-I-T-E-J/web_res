// Data Migration Script: Encrypt Existing User Data
// Run with: node migrate-encrypt-users.js

require('dotenv').config();
const { Client } = require('pg');
const CryptoJS = require('crypto-js');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!ENCRYPTION_KEY) {
  console.error('❌ ERROR: ENCRYPTION_KEY not found in environment variables');
  process.exit(1);
}

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL not found in environment variables');
  process.exit(1);
}

console.log('========================================');
console.log('🔐 User Data Encryption Migration');
console.log('========================================\n');

async function migrateUsers() {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Get all users with unencrypted data
    const result = await client.query(`
      SELECT id, email, phone 
      FROM users 
      WHERE encrypted_email IS NULL 
         OR encrypted_phone IS NULL
      ORDER BY id
    `);

    const users = result.rows;
    console.log(`Found ${users.length} users to encrypt\n`);

    if (users.length === 0) {
      console.log('✅ No users need encryption. Migration complete!\n');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    // Encrypt each user's data
    for (const user of users) {
      try {
        const updates = [];
        const values = [];
        let paramIndex = 1;

        // Encrypt email if exists and not already encrypted
        if (user.email && !user.encrypted_email) {
          const encryptedEmail = CryptoJS.AES.encrypt(
            user.email,
            ENCRYPTION_KEY
          ).toString();
          updates.push(`encrypted_email = $${paramIndex++}`);
          values.push(encryptedEmail);
        }

        // Encrypt phone if exists and not already encrypted
        if (user.phone && !user.encrypted_phone) {
          const encryptedPhone = CryptoJS.AES.encrypt(
            user.phone,
            ENCRYPTION_KEY
          ).toString();
          updates.push(`encrypted_phone = $${paramIndex++}`);
          values.push(encryptedPhone);
        }

        if (updates.length > 0) {
          values.push(user.id);
          await client.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
            values
          );

          console.log(`✅ Encrypted user ID ${user.id}`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Error encrypting user ID ${user.id}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n========================================');
    console.log('Migration Summary');
    console.log('========================================');
    console.log(`Total users processed: ${users.length}`);
    console.log(`✅ Successfully encrypted: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('========================================\n');

    // Verify encryption
    console.log('Verifying encryption...\n');
    const verifyResult = await client.query(`
      SELECT id, email, encrypted_email, phone, encrypted_phone
      FROM users
      WHERE encrypted_email IS NOT NULL
      LIMIT 5
    `);

    for (const user of verifyResult.rows) {
      let emailMatch = false;
      let phoneMatch = false;

      if (user.encrypted_email) {
        const decryptedEmail = CryptoJS.AES.decrypt(
          user.encrypted_email,
          ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8);
        emailMatch = decryptedEmail === user.email;
        console.log(`User ${user.id} - Email: ${emailMatch ? '✅' : '❌'}`);
      }

      if (user.encrypted_phone) {
        const decryptedPhone = CryptoJS.AES.decrypt(
          user.encrypted_phone,
          ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8);
        phoneMatch = decryptedPhone === user.phone;
        console.log(`User ${user.id} - Phone: ${phoneMatch ? '✅' : '❌'}`);
      }
    }

    console.log('\n✅ Migration completed successfully!\n');
    console.log('⚠️  NEXT STEPS:');
    console.log('1. Verify all data is encrypted correctly');
    console.log('2. Update application code to use encrypted fields');
    console.log('3. Test thoroughly in staging environment');
    console.log('4. After verification, drop old columns:');
    console.log('   ALTER TABLE users DROP COLUMN email;');
    console.log('   ALTER TABLE users DROP COLUMN phone;\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
    console.log('Disconnected from database\n');
  }
}

// Run migration
migrateUsers()
  .then(() => {
    console.log('🎉 Migration script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  });
