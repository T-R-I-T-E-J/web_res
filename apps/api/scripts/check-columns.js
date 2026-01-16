const { Client } = require('pg');

async function checkColumns() {
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
    await client.connect();

    const { rows } = await client.query(`
      SELECT column_name
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'news_articles'
      ORDER BY ordinal_position;
    `);

    console.log('Columns in news_articles:');
    rows.forEach(row => console.log(`  - ${row.column_name}`));
    
    // Check for public_id specifically
    const hasPublicId = rows.some(row => row.column_name === 'public_id');
    console.log(`\npublic_id exists: ${hasPublicId ? '✅ YES' : '❌ NO'}`);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

checkColumns();
