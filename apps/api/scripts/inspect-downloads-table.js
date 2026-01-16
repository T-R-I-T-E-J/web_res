const { Client } = require('pg');

async function inspectDownloads() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is missing.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { acceptUnauthorized: true, rejectUnauthorized: false }, // Lenient SSL
  });

  try {
    await client.connect();
    console.log('🔌 Connected to database');

    // 1. Get Columns
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable, character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'downloads'
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Columns in "downloads" table:');
    if (columns.rows.length === 0) {
        console.log('⚠️ Table "downloads" might not exist or has no columns.');
    } else {
        columns.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}, MaxLength: ${col.character_maximum_length}, Nullable: ${col.is_nullable})`);
        });
    }

    // 2. Count Rows
    const count = await client.query('SELECT COUNT(*) FROM downloads');
    console.log(`\n📊 Total rows in downloads: ${count.rows[0].count}`);

    // 3. Peek at data (using * to avoid "column does not exist" errors)
    if (parseInt(count.rows[0].count) > 0) {
        const data = await client.query('SELECT * FROM downloads LIMIT 5');
        console.log('\n📝 First 5 rows:');
        console.log(JSON.stringify(data.rows, null, 2));
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

inspectDownloads();
