const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'admin',
  password: 'admin123',
  database: 'psci_platform',
  connectionTimeoutMillis: 5000,
});

console.log('Attempting to connect to PostgreSQL...');
console.log('Config:', {
  host: client.host,
  port: client.port,
  user: client.user,
  database: client.database,
});

client.connect()
  .then(() => {
    console.log('✅ Successfully connected to PostgreSQL!');
    return client.query('SELECT NOW()');
  })
  .then((res) => {
    console.log('✅ Query result:', res.rows[0]);
    return client.end();
  })
  .then(() => {
    console.log('✅ Connection closed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection error:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  });
