const crypto = require('crypto');

async function run() {
  const EMAIL = `test_${Date.now()}@example.com`;
  const PASSWORD = 'Password123!';
  const API_URL = 'http://localhost:4000/api/v1';

  console.log('--- Starting Cookie Analysis ---');
  console.log(`Target API: ${API_URL}`);

  try {
    // 1. Register
    console.log(`\n1. Registering user: ${EMAIL}`);
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: EMAIL,
        password: PASSWORD,
        first_name: 'Test',
        last_name: 'User'
      })
    });

    if (!regRes.ok) {
      console.error('Registration failed:', await regRes.text());
      return;
    }
    
    // Check headers for cookie
    const regCookie = regRes.headers.get('set-cookie');
    console.log('Registration Set-Cookie:', regCookie ? regCookie : 'NONE');

    // 2. Login
    console.log(`\n2. Logging in...`);
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: EMAIL,
        password: PASSWORD
      })
    });

    if (!loginRes.ok) {
      console.error('Login failed:', await loginRes.text());
      return;
    }

    const loginCookie = loginRes.headers.get('set-cookie');
    console.log('Login Set-Cookie:', loginCookie ? loginCookie : 'NONE');

    if (loginCookie) {
      // Analyze cookie
      const parts = loginCookie.split(';');
      const cookieMap = {};
      parts.forEach(p => {
        const [key, val] = p.trim().split('=');
        cookieMap[key.toLowerCase()] = val || true;
      });

      console.log('\n--- Cookie attributes analysis ---');
      console.log('Name:', parts[0].split('=')[0]);
      console.log('HttpOnly:', !!cookieMap.httponly);
      console.log('Secure:', !!cookieMap.secure);
      console.log('SameSite:', Object.keys(cookieMap).find(k => k.toLowerCase() === 'samesite') ? cookieMap[ Object.keys(cookieMap).find(k => k.toLowerCase() === 'samesite')] : 'Not Set');
      console.log('Path:', cookieMap.path);
      
      // Extract Token
      const token = parts[0].split('=')[1];
      console.log('\n--- JWT Payload Analysis ---');
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Payload:', JSON.stringify(payload, null, 2));
        
        const expDate = new Date(payload.exp * 1000);
        console.log('Expires:', expDate.toISOString());
        console.log('Is Expired?', expDate < new Date());
        
      } catch (e) {
        console.error('Failed to parse JWT payload', e);
      }
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

run();
