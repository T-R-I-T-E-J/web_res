const { Client } = require('pg');

async function checkAndFixDownloads() {
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
    console.log('🔌 Connected to database\n');

    // Check for NULL titles
    const nullCheck = await client.query(`
      SELECT COUNT(*) as count
      FROM downloads
      WHERE title IS NULL
    `);

    console.log(`📊 Downloads with NULL title: ${nullCheck.rows[0].count}`);

    if (parseInt(nullCheck.rows[0].count) > 0) {
      console.log('\n🔧 Fixing NULL titles...');
      
      const updateResult = await client.query(`
        UPDATE downloads
        SET title = 'Untitled Document'
        WHERE title IS NULL
        RETURNING id
      `);
      
      console.log(`✅ Updated ${updateResult.rowCount} rows`);
    } else {
      console.log('✅ No NULL titles found');
    }

    // Show all downloads
    const allDownloads = await client.query(`
      SELECT id, title, category, file_name
      FROM downloads
      ORDER BY id
    `);

    console.log(`\n📋 All downloads (${allDownloads.rows.length} total):`);
    allDownloads.rows.forEach(row => {
      console.log(`  - ID: ${row.id}, Title: "${row.title}", Category: ${row.category}, File: ${row.file_name}`);
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

checkAndFixDownloads();
