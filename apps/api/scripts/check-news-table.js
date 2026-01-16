const { Client } = require('pg');

async function checkNewsTable() {
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

    // Check columns in news_articles
    const columnCheck = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'news_articles'
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 All columns in news_articles table:');
    console.log('─'.repeat(80));
    columnCheck.rows.forEach((row, index) => {
      const nullable = row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const defaultVal = row.column_default ? ` DEFAULT ${row.column_default}` : '';
      console.log(`${index + 1}. ${row.column_name.padEnd(25)} ${row.data_type.padEnd(20)} ${nullable}${defaultVal}`);
    });
    console.log('─'.repeat(80));
    console.log(`Total columns: ${columnCheck.rows.length}`);

    // Check if image_urls column exists
    const imageUrlsColumn = columnCheck.rows.find(row => row.column_name === 'image_urls');
    if (imageUrlsColumn) {
      console.log('\n✅ SUCCESS: image_urls column exists!');
      console.log(`   Type: ${imageUrlsColumn.data_type}`);
      console.log(`   Default: ${imageUrlsColumn.column_default || 'none'}`);
    } else {
      console.log('\n❌ ERROR: image_urls column NOT found!');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

checkNewsTable();
