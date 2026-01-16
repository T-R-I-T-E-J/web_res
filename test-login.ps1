# Test Login Flow
Write-Host "Testing Login Flow..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Test Login API
Write-Host "Step 1: Testing Login API..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-WebRequest -Uri "https://web-res-api.vercel.app/api/v1/auth/login" `
        -Method POST `
        -Body '{"email":"admin@psci.in","password":"Admin@123"}' `
        -ContentType "application/json" `
        -SessionVariable session `
        -UseBasicParsing
    
    Write-Host "✅ Login API Status: $($loginResponse.StatusCode)" -ForegroundColor Green
    
    # Check for Set-Cookie header
    $setCookie = $loginResponse.Headers['Set-Cookie']
    if ($setCookie) {
        Write-Host "✅ Cookie Set: $setCookie" -ForegroundColor Green
        
        # Parse cookie details
        if ($setCookie -match "auth_token=([^;]+)") {
            Write-Host "✅ Token extracted successfully" -ForegroundColor Green
        }
        if ($setCookie -match "SameSite=lax") {
            Write-Host "✅ SameSite=lax (correct for same-domain)" -ForegroundColor Green
        }
        if ($setCookie -match "HttpOnly") {
            Write-Host "✅ HttpOnly flag set" -ForegroundColor Green
        }
        if ($setCookie -match "Secure") {
            Write-Host "✅ Secure flag set" -ForegroundColor Green
        }
    }
    else {
        Write-Host "❌ No Set-Cookie header found" -ForegroundColor Red
    }
    
    Write-Host ""
    
    # Step 2: Test accessing protected route with cookie
    Write-Host "Step 2: Testing Protected Route Access..." -ForegroundColor Yellow
    
    $adminResponse = Invoke-WebRequest -Uri "https://web-res-api.vercel.app/admin" `
        -WebSession $session `
        -UseBasicParsing `
        -MaximumRedirection 0 `
        -ErrorAction SilentlyContinue
    
    if ($adminResponse.StatusCode -eq 200) {
        Write-Host "✅ Admin page accessible (Status: 200)" -ForegroundColor Green
        Write-Host "✅ Cookie is working correctly!" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Admin page returned: $($adminResponse.StatusCode)" -ForegroundColor Yellow
    }
    
}
catch {
    if ($_.Exception.Response.StatusCode -eq 307 -or $_.Exception.Response.StatusCode -eq 302) {
        $location = $_.Exception.Response.Headers['Location']
        if ($location -like "*/login*") {
            Write-Host "❌ Redirected to login - Cookie not working" -ForegroundColor Red
        }
        else {
            Write-Host "⚠️  Redirected to: $location" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Test Complete!" -ForegroundColor Cyan
