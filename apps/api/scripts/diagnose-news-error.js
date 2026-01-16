const { Client } = require('pg');

async function checkNewsData() {
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

    // Check if there are any news articles
    const countResult = await client.query('SELECT COUNT(*) FROM news_articles');
    console.log(`📊 Total news articles: ${countResult.rows[0].count}`);

    // Try to fetch news articles like the API does
    console.log('\n🔍 Testing query similar to API...');
    try {
      const newsResult = await client.query(`
        SELECT 
          id, title, slug, excerpt, content, 
          featured_image_url, preview_image_url, image_urls,
          category, tags, author_id, status,
          is_featured, is_pinned, view_count,
          published_at, created_at, updated_at, public_id
        FROM news_articles
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        LIMIT 10
      `);
      
      console.log(`✅ Query successful! Found ${newsResult.rows.length} articles`);
      
      if (newsResult.rows.length > 0) {
        console.log('\n📰 Sample article:');
        const sample = newsResult.rows[0];
        console.log(`  - ID: ${sample.id}`);
        console.log(`  - Title: ${sample.title}`);
        console.log(`  - Status: ${sample.status}`);
        console.log(`  - Author ID: ${sample.author_id}`);
        console.log(`  - Public ID: ${sample.public_id}`);
      }
    } catch (queryError) {
      console.error('❌ Query failed:', queryError.message);
      console.error('   This might be what\'s causing the 500 error!');
    }

    // Check if author_id references exist in users table
    console.log('\n👤 Checking users table...');
    try {
      const usersCount = await client.query('SELECT COUNT(*) FROM users');
      console.log(`   Total users: ${usersCount.rows[0].count}`);
      
      // Check for orphaned author_ids
      const orphaned = await client.query(`
        SELECT DISTINCT n.author_id
        FROM news_articles n
        LEFT JOIN users u ON n.author_id = u.id
        WHERE u.id IS NULL
      `);
      
      if (orphaned.rows.length > 0) {
        console.log(`   ⚠️  Found ${orphaned.rows.length} news articles with invalid author_id:`);
        orphaned.rows.forEach(row => console.log(`      - author_id: ${row.author_id}`));
      } else {
        console.log(`   ✅ All author_id references are valid`);
      }
    } catch (err) {
      console.error(`   ❌ Error checking users: ${err.message}`);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

checkNewsData();
