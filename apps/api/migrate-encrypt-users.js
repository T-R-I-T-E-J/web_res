/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
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

    const users = await getUnencryptedUsers(client);
    if (users.length === 0) {
      console.log('✅ No users need encryption. Migration complete!\n');
      return;
    }

    const { successCount, errorCount } = await processUsers(client, users);

    logSummary(users.length, successCount, errorCount);
    await verifyEncryption(client);
    logNextSteps();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
    console.log('Disconnected from database\n');
  }
}

async function getUnencryptedUsers(client) {
  const result = await client.query(`
    SELECT id, email, phone 
    FROM users 
    WHERE encrypted_email IS NULL 
       OR encrypted_phone IS NULL
    ORDER BY id
  `);
  const users = result.rows;
  console.log(`Found ${users.length} users to encrypt\n`);
  return users;
}

async function processUsers(client, users) {
  let successCount = 0;
  let errorCount = 0;

  for (const user of users) {
    try {
      const wasUpdated = await encryptAndSaveUser(client, user);
      if (wasUpdated) successCount++;
    } catch (error) {
      console.error(`❌ Error encrypting user ID ${user.id}:`, error.message);
      errorCount++;
    }
  }

  return { successCount, errorCount };
}

async function encryptAndSaveUser(client, user) {
  const { updates, values } = prepareUpdateData(user);

  if (updates.length > 0) {
    values.push(user.id);
    await client.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length}`,
      values,
    );

    console.log(`✅ Encrypted user ID ${user.id}`);
    return true;
  }
  return false;
}

function prepareUpdateData(user) {
  const updates = [];
  const values = [];
  let paramIndex = 1;

  if (shouldEncrypt(user.email, user.encrypted_email)) {
    updates.push(`encrypted_email = $${paramIndex++}`);
    values.push(encryptData(user.email));
  }

  if (shouldEncrypt(user.phone, user.encrypted_phone)) {
    updates.push(`encrypted_phone = $${paramIndex++}`);
    values.push(encryptData(user.phone));
  }

  return { updates, values };
}

function shouldEncrypt(original, encrypted) {
  return original && !encrypted;
}

function encryptData(text) {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

function decryptData(ciphertext) {
  return CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY).toString(
    CryptoJS.enc.Utf8,
  );
}

function logSummary(total, success, error) {
  console.log('\n========================================');
  console.log('Migration Summary');
  console.log('========================================');
  console.log(`Total users processed: ${total}`);
  console.log(`✅ Successfully encrypted: ${success}`);
  console.log(`❌ Errors: ${error}`);
  console.log('========================================\n');
}

async function verifyEncryption(client) {
  console.log('Verifying encryption...\n');
  const verifyResult = await client.query(`
    SELECT id, email, encrypted_email, phone, encrypted_phone
    FROM users
    WHERE encrypted_email IS NOT NULL
    LIMIT 5
  `);

  for (const user of verifyResult.rows) {
    verifyUserEncryption(user);
  }
}

function verifyUserEncryption(user) {
  if (user.encrypted_email) {
    const isMatch = decryptData(user.encrypted_email) === user.email;
    console.log(`User ${user.id} - Email: ${isMatch ? '✅' : '❌'}`);
  }

  if (user.encrypted_phone) {
    const isMatch = decryptData(user.encrypted_phone) === user.phone;
    console.log(`User ${user.id} - Phone: ${isMatch ? '✅' : '❌'}`);
  }
}

function logNextSteps() {
  console.log('\n✅ Migration completed successfully!\n');
  console.log('⚠️  NEXT STEPS:');
  console.log('1. Verify all data is encrypted correctly');
  console.log('2. Update application code to use encrypted fields');
  console.log('3. Test thoroughly in staging environment');
  console.log('4. After verification, drop old columns:');
  console.log('   ALTER TABLE users DROP COLUMN email;');
  console.log('   ALTER TABLE users DROP COLUMN phone;\n');
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
