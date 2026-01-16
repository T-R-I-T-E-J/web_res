const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function checkDatabase() {
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

    // Check if news_articles table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'news_articles';
    `);

    if (tableCheck.rows.length === 0) {
      console.log('❌ Table "news_articles" does NOT exist');
    } else {
      console.log('✅ Table "news_articles" exists');
      
      // Check columns
      const columnCheck = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'news_articles'
        ORDER BY ordinal_position;
      `);
      
      console.log('\n📋 Columns in news_articles:');
      columnCheck.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type})`);
      });
    }

    // Check applied migrations
    const migrationCheck = await client.query(`
      SELECT filename, applied_at 
      FROM schema_migrations 
      ORDER BY applied_at;
    `);

    console.log('\n📝 Applied migrations:');
    migrationCheck.rows.forEach(row => {
      console.log(`  - ${row.filename} (${row.applied_at})`);
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Full error:', err);
  } finally {
    await client.end();
  }
}

checkDatabase();
