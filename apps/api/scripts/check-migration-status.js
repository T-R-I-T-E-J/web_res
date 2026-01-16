const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '../migrations');

async function checkMigrationStatus() {
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
    console.log('🔌 Connecting to Neon database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Get all migration files from the migrations directory
    if (!fs.existsSync(MIGRATIONS_DIR)) {
      console.error(`❌ Error: Migrations directory not found at ${MIGRATIONS_DIR}`);
      process.exit(1);
    }

    const migrationFiles = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    console.log(`📂 Found ${migrationFiles.length} migration files in migrations directory\n`);

    // Get applied migrations from database
    const { rows: appliedMigrations } = await client.query(`
      SELECT filename, applied_at 
      FROM schema_migrations 
      ORDER BY applied_at;
    `);

    console.log(`📊 Migration Status Report`);
    console.log('═'.repeat(100));
    console.log(`${'Migration File'.padEnd(50)} ${'Status'.padEnd(15)} ${'Applied At'.padEnd(30)}`);
    console.log('─'.repeat(100));

    const appliedSet = new Set(appliedMigrations.map(m => m.filename));
    let appliedCount = 0;
    let pendingCount = 0;

    migrationFiles.forEach(file => {
      const applied = appliedSet.has(file);
      const migration = appliedMigrations.find(m => m.filename === file);
      
      if (applied) {
        appliedCount++;
        const appliedAt = migration ? new Date(migration.applied_at).toLocaleString() : 'Unknown';
        console.log(`${file.padEnd(50)} ${'✅ Applied'.padEnd(15)} ${appliedAt}`);
      } else {
        pendingCount++;
        console.log(`${file.padEnd(50)} ${'⏳ Pending'.padEnd(15)} ${'-'.padEnd(30)}`);
      }
    });

    console.log('═'.repeat(100));
    console.log(`\n📈 Summary:`);
    console.log(`   Total migration files: ${migrationFiles.length}`);
    console.log(`   ✅ Applied: ${appliedCount}`);
    console.log(`   ⏳ Pending: ${pendingCount}`);

    if (pendingCount > 0) {
      console.log(`\n⚠️  You have ${pendingCount} pending migration(s).`);
      console.log(`   Run: npm run migrate:sql`);
      console.log(`   Or: node scripts/run-migrations.js`);
    } else {
      console.log(`\n🎉 All migrations are up to date!`);
    }

    // Check for migrations in database that don't have files
    const orphanedMigrations = appliedMigrations.filter(
      m => !migrationFiles.includes(m.filename)
    );

    if (orphanedMigrations.length > 0) {
      console.log(`\n⚠️  Warning: Found ${orphanedMigrations.length} migration(s) in database without corresponding files:`);
      orphanedMigrations.forEach(m => {
        console.log(`   - ${m.filename} (applied at ${new Date(m.applied_at).toLocaleString()})`);
      });
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkMigrationStatus();
