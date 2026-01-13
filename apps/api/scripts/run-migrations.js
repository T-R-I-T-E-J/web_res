const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuration
const MIGRATIONS_DIR = path.join(__dirname, '../migrations');

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is missing.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Neon/Render connectivity
    },
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();

    // 1. Ensure the schema_migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Get list of already applied migrations
    const { rows } = await client.query('SELECT filename FROM schema_migrations');
    const appliedMigrations = new Set(rows.map((row) => row.filename));

    // 3. Read migration files from directory
    if (!fs.existsSync(MIGRATIONS_DIR)) {
      console.error(`❌ Error: Migrations directory not found at ${MIGRATIONS_DIR}`);
      process.exit(1);
    }

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort(); // Sorts by filename (e.g., 001_initial.sql comes before 002_data.sql)

    console.log(`📂 Found ${files.length} migration files.`);

    // 4. Apply new migrations
    let migrationCount = 0;
    for (const file of files) {
      if (!appliedMigrations.has(file)) {
        console.log(`🚀 Running migration: ${file}`);
        const filePath = path.join(MIGRATIONS_DIR, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        try {
          await client.query('BEGIN'); // Start transaction
          await client.query(sql); // Run actual migration SQL
          await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]); // Record success
          await client.query('COMMIT'); // Commit transaction
          console.log(`✅ Applied: ${file}`);
          migrationCount++;
        } catch (err) {
          await client.query('ROLLBACK'); // Rollback on error
          console.error(`❌ Error applying ${file}:`, err.message);
          throw err; // Stop the migration process
        }
      }
    }

    if (migrationCount === 0) {
      console.log('✨ No new migrations to run. Schema is up to date.');
    } else {
      console.log(`🎉 Successfully applied ${migrationCount} migrations.`);
    }
  } catch (err) {
    console.error('💥 Migration script failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
