const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');

async function runTest() {
  console.log('🔍 Starting Full Authentication Integration Test...\n');

  // 1. Read Secrets safely
  console.log('📂 Checking Environment Configuration...');
  const secrets = {};
  
  try {
    const apiEnv = fs.readFileSync(path.join(__dirname, 'apps/api/.env'), 'utf8');
    const apiMatch = apiEnv.match(/JWT_SECRET=(.*)/);
    secrets.api = apiMatch ? apiMatch[1].trim() : null;
    console.log(`   - apps/api/.env: ${secrets.api ? 'FOUND' : 'MISSING'}`);
  } catch (e) {
    console.log(`   - apps/api/.env: ERROR (${e.message})`);
  }

  try {
    // Try .env.local first, then .env
    let webEnvPath = path.join(__dirname, 'apps/web/.env.local');
    if (!fs.existsSync(webEnvPath)) {
      webEnvPath = path.join(__dirname, 'apps/web/.env');
    }
    
    const webEnv = fs.readFileSync(webEnvPath, 'utf8');
    const webMatch = webEnv.match(/JWT_SECRET=(.*)/);
    secrets.web = webMatch ? webMatch[1].trim() : null;
    console.log(`   - apps/web/.env(.local): ${secrets.web ? 'FOUND' : 'MISSING'}`);
  } catch (e) {
    console.log(`   - apps/web env: ERROR (${e.message})`);
  }

  // 2. Compare Secrets
  console.log('\n🔐 Verifying Secret Consistency...');
  if (!secrets.api || !secrets.web) {
    console.error('   ❌ CRITICAL: Could not find JWT_SECRET in one or both environment files.');
  } else if (secrets.api !== secrets.web) {
    console.error('   ❌ CRITICAL: SECRETS MISMATCH!');
    console.error('      The Backend is signing tokens with one secret, but the Frontend is verifying with another.');
    console.error('      This guarantees login failures.');
  } else {
    console.log('   ✅ SECRETS MATCH: Configuration looks correct.');
  }

  // 3. Perform Live Login & Verification
  console.log('\n🌐 Testing Live Authentication Flow...');
  const EMAIL = `test_verifier_${Date.now()}@example.com`;
  const PASSWORD = 'Password123!';
  
  try {
    // Register
    await fetchRequest('POST', '/auth/register', {
      email: EMAIL,
      password: PASSWORD,
      first_name: 'Auth',
      last_name: 'Test'
    });

    // Login
    const loginRes = await fetchRequest('POST', '/auth/login', {
      email: EMAIL,
      password: PASSWORD
    });

    if (!loginRes.cookie) {
      throw new Error('Login failed to return a cookie');
    }

    console.log('   ✅ Login successful, cookie received.');

    // Extract Token
    const token = loginRes.cookie.split(';')[0].split('=')[1];
    
    // 4. Client-Side Verification Simulation
    console.log('\n🕵️  Simulating Frontend Middleware Verification...');
    if (secrets.web) {
      const isValid = verifyJwtSignature(token, secrets.web);
      if (isValid) {
        console.log('   ✅ VALID MATCH: The frontend middleware WILL accept this token.');
      } else {
        console.log('   ❌ INVALID SIGNATURE: The frontend middleware WILL REJECT this token.');
        if (secrets.api === secrets.web) {
            console.log('      (Secrets match but verification failed. This is unusual. Check special characters or encoding.)');
        }
      }
    } else {
      console.log('   ⚠️  Skipping verification test (no web secret found).');
    }

    // 5. Check Token Contents (Role)
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    console.log('\n👤 User Role Analysis:');
    console.log(`   - User ID: ${payload.sub}`);
    console.log(`   - Roles: [${payload.roles.join(', ')}]`);
    
    if (!payload.roles.includes('admin')) {
      console.log('   ⚠️  WARNING: User is NOT an ADMIN.');
      console.log('      Redirect Loop Cause: Middleware redirects non-admin users away from /admin.');
    } else {
      console.log('   ✅ User has ADMIN role.');
    }

  } catch (error) {
    console.error('   ❌ Test Failed:', error.message);
  }
}

// Helper: Minimal Fetch Wrapper
function fetchRequest(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1' + endpoint,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ 
            body: data ? JSON.parse(data) : {}, 
            cookie: res.headers['set-cookie'] ? res.headers['set-cookie'][0] : null 
          });
        } else {
            // resolve anyway to handle errors gracefully in flow
           resolve({ body: data, error: true, statusCode: res.statusCode });
        }
      });
    });
    
    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Helper: Verify JWT HS256 Signature manually
function verifyJwtSignature(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  const hmac = crypto.createHmac('sha256', secret);
  // JWT signature is Header.Payload
  hmac.update(`${parts[0]}.${parts[1]}`);
  const calculated = hmac.digest('base64url');
  
  return calculated === parts[2];
}

runTest();
