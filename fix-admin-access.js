const fs = require('fs');
const path = require('path');

// Try to load pg from the api's node_modules
let Client;
try {
  Client = require(path.resolve(__dirname, 'apps/api/node_modules/pg')).Client;
} catch (e) {
  console.error('❌ Could not load "pg" library. Ensure "npm install" was run in apps/api.');
  console.error(e.message);
  process.exit(1);
}

// Helper to parse .env file
function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes if present
      env[key] = value;
    }
  });
  return env;
}

async function fixAdminAccess() {
  console.log('🔧 Starting Admin Access Fixer...');

  // 1. Load DB Config
  const apiEnvPath = path.join(__dirname, 'apps/api/.env');
  const env = parseEnv(apiEnvPath);
  
  const dbConfig = {
    host: env.POSTGRES_HOST || 'localhost',
    port: parseInt(env.POSTGRES_PORT || '5432'),
    user: env.POSTGRES_USER || 'postgres',
    password: env.POSTGRES_PASSWORD || 'postgres',
    database: env.POSTGRES_DB || 'postgres',
  };

  // Handle DATABASE_URL if present (overrides individual fields)
  if (env.DATABASE_URL) {
    console.log('   Using DATABASE_URL from .env');
    // Basic parse or just pass connectionString
    // pg client connects with connectionString automatically if passed
  }

  const client = new Client(env.DATABASE_URL ? { connectionString: env.DATABASE_URL } : dbConfig);

  try {
    await client.connect();
    console.log('   ✅ Connected to Database.');

    // 2. Find Admin Role ID
    // Try standard table names (NestJS/TypeORM often uses plural or singular based on entity)
    // Based on file names: 'role' entity -> likely 'role' or 'roles' table.
    let roleTableName = 'role';
    let userTableName = 'user';
    let userRoleTableName = 'user_role';

    // Check if tables exist (simple heuristic: try to select)
    try {
        await client.query('SELECT * FROM "role" LIMIT 1');
    } catch {
        roleTableName = 'roles'; 
        userTableName = 'users'; // likely plural
        userRoleTableName = 'user_roles';
        console.log('   (Switching to plural table names)');
    }

    const adminRoleRes = await client.query(`SELECT id FROM "${roleTableName}" WHERE name = $1`, ['admin']);
    
    if (adminRoleRes.rows.length === 0) {
      console.error('   ❌ Critical: "admin" role not found in database! Please run migrations.');
      return;
    }

    const adminRoleId = adminRoleRes.rows[0].id;
    console.log(`   Found Admin Role ID: ${adminRoleId}`);

    // 3. Create or Update Admin User
    const TARGET_EMAIL = 'admin@demo.com';
    const RAW_PASSWORD = 'Password123!'; // Note: We need to hash this if we insert manually, but hashing requires bcrypt.
    // Instead of inserting, we will try to UPGRADE the latest user we created in the test, or just ASK the user to register first.
    
    // BETTER: Upgrade the user from the previous test: "test_verifier_..."
    // Find the most recent user
    const recentUserRes = await client.query(`SELECT id, email, first_name FROM "${userTableName}" ORDER BY created_at DESC LIMIT 1`);
    
    if (recentUserRes.rows.length === 0) {
      console.log('   ❌ No users found. Please register a user on the frontend first, then run this script.');
      return;
    }

    const user = recentUserRes.rows[0];
    console.log(`\n   👤 Most recent user found: ${user.email} (ID: ${user.id})`);

    // 4. Assign Role
    // Check if already has role
    const existingRole = await client.query(
      `SELECT * FROM "${userRoleTableName}" WHERE user_id = $1 AND role_id = $2`,
      [user.id, adminRoleId]
    );

    if (existingRole.rows.length > 0) {
      console.log('   ✅ This user is ALREADY an Admin.');
    } else {
      console.log('   🚀 upgrading user to ADMIN...');
      await client.query(
        `INSERT INTO "${userRoleTableName}" (user_id, role_id) VALUES ($1, $2)`,
        [user.id, adminRoleId]
      );
      console.log('   ✅ SUCCESS! User upgraded.');
    }

    console.log('\n   To test login loop resolution:');
    console.log(`   1. Go to http://localhost:3000/login`);
    console.log(`   2. Login with: ${user.email} / (The password you used)`);
    console.log(`   3. You should be redirected to /admin successfully.`);

  } catch (err) {
    console.error('   ❌ DB Error:', err.message);
  } finally {
    await client.end();
  }
}

fixAdminAccess();
