const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
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
    console.log('✅ Connected successfully!');

    // Read the init SQL file
    const initSqlPath = path.join(__dirname, '../../../infrastructure/database/01-init.sql');
    
    if (!fs.existsSync(initSqlPath)) {
      console.error(`❌ Error: Init SQL file not found at ${initSqlPath}`);
      process.exit(1);
    }

    console.log('📖 Reading initialization SQL...');
    const sql = fs.readFileSync(initSqlPath, 'utf8');

    console.log('🚀 Running database initialization...');
    console.log('   This may take a minute...');
    
    await client.query(sql);

    console.log('✅ Database initialized successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run migrations: npm run migrate:sql');
    console.log('   2. Or run specific migration with the run-single-migration.js script');

  } catch (err) {
    console.error('❌ Error initializing database:');
    console.error('Error message:', err.message);
    console.error('Error position:', err.position);
    console.error('Error detail:', err.detail || 'N/A');
    console.error('Error hint:', err.hint || 'N/A');
    
    // Write full error to file for debugging
    fs.writeFileSync(
      path.join(__dirname, 'init-error.log'),
      JSON.stringify(err, null, 2)
    );
    console.error('\n📄 Full error written to scripts/init-error.log');
    
    process.exit(1);
  } finally {
    await client.end();
  }
}

initializeDatabase();
