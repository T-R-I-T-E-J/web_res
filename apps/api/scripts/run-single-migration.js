const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Get migration filename from command line argument
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('❌ Usage: node run-single-migration.js <migration-filename.sql>');
  process.exit(1);
}

async function runSingleMigration() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is missing.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();

    // Ensure schema_migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if already applied
    const { rows } = await client.query(
      'SELECT filename FROM schema_migrations WHERE filename = $1',
      [migrationFile]
    );

    if (rows.length > 0) {
      console.log(`⚠️  Migration ${migrationFile} has already been applied.`);
      console.log('   Use --force flag to re-run (not implemented for safety)');
      process.exit(0);
    }

    // Read and run migration
    const filePath = path.join(__dirname, '../migrations', migrationFile);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Error: Migration file not found: ${filePath}`);
      process.exit(1);
    }

    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`🚀 Running migration: ${migrationFile}`);
    console.log('📝 SQL to execute:');
    console.log('─'.repeat(80));
    console.log(sql);
    console.log('─'.repeat(80));

    await client.query('BEGIN');
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [migrationFile]);
    await client.query('COMMIT');

    console.log(`✅ Successfully applied: ${migrationFile}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`❌ Error applying ${migrationFile}:`);
    console.error('Error message:', err.message);
    console.error('Error detail:', err.detail || 'N/A');
    console.error('Error hint:', err.hint || 'N/A');
    console.error('Full error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSingleMigration();
