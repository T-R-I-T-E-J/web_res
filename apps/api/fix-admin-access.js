const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  content.split(/\r?\n/).forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const cleanLine = line.replace(/^export\s+/, '');
    const match = cleanLine.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  });
  return env;
}

async function fixAdminAccess() {
  console.log('🔧 Starting Admin Access Fixer (v3)...');

  let env = parseEnv(path.join(__dirname, '.env'));
  const envLocal = parseEnv(path.join(__dirname, '.env.local'));
  env = { ...env, ...envLocal };

  console.log('   Keys detected:', Object.keys(env).join(', '));
  
  // Heuristic for DB credentials
  const config = {
      host: env.POSTGRES_HOST || env.DB_HOST || 'localhost',
      port: parseInt(env.POSTGRES_PORT || env.DB_PORT || '5432'),
      user: env.POSTGRES_USER || env.DB_USER || env.DB_USERNAME || 'postgres',
      password: env.POSTGRES_PASSWORD || env.DB_PASSWORD || 'postgres',
      database: env.POSTGRES_DB || env.DB_DATABASE || env.DB_NAME || 'postgres',
  };

  console.log(`   Connecting to: ${config.host}:${config.port} as ${config.user} (DB: ${config.database})`);

  let client;
  if (env.DATABASE_URL) {
      console.log('   Using DATABASE_URL');
      client = new Client({ connectionString: env.DATABASE_URL });
  } else {
      client = new Client(config);
  }

  try {
    await client.connect();
    console.log('   ✅ Connected successfully.');

    // 2. Scan Tables
    let rolesTable = 'role';
    let userTableName = 'user';
    let userRoleTableName = 'user_role';

    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    const tables = tablesRes.rows.map(r => r.table_name);
    
    if (tables.includes('roles')) rolesTable = 'roles';
    if (tables.includes('users')) userTableName = 'users';
    if (tables.includes('user_roles')) userRoleTableName = 'user_roles';

    // 3. Find Admin Role
    const adminRoleRes = await client.query(`SELECT id FROM "${rolesTable}" WHERE name = $1`, ['admin']);
    if (adminRoleRes.rows.length === 0) {
      console.error('   ❌ Critical: "admin" role not found!');
      return;
    }
    const adminRoleId = adminRoleRes.rows[0].id;

    // 4. Find Recent User
    const recentUserRes = await client.query(`SELECT id, email FROM "${userTableName}" ORDER BY created_at DESC LIMIT 1`);
    if (recentUserRes.rows.length === 0) {
      console.log('   ❌ No users found.');
      return;
    }
    const user = recentUserRes.rows[0];
    console.log(`   👤 Processing User: ${user.email} (ID: ${user.id})`);

    // 5. Assign Role
    const existingRole = await client.query(
      `SELECT * FROM "${userRoleTableName}" WHERE user_id = $1 AND role_id = $2`,
      [user.id, adminRoleId]
    );

    if (existingRole.rows.length > 0) {
      console.log('   ✅ User ALREADY has Admin role.');
    } else {
      await client.query(
        `INSERT INTO "${userRoleTableName}" (user_id, role_id) VALUES ($1, $2)`,
        [user.id, adminRoleId]
      );
      console.log('   ✅ SUCCESS: User UPGRADED to Admin.');
    }

  } catch (err) {
    console.error('   ❌ DB Error:', err.message);
  } finally {
    if (client) await client.end();
  }
}

fixAdminAccess();
