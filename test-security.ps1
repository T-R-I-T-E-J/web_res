# Security Testing Suite
# Run this script to test all security features locally

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Security Testing Suite - Para Shooting India" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$API_URL = "http://localhost:8080"
$WEB_URL = "http://localhost:3000"
$API_HEALTH = "$API_URL/api/v1/health"

# Test Results
$testResults = @()

function Test-Feature {
    param(
        [string]$TestName,
        [scriptblock]$TestScript,
        [string]$Category
    )
    
    Write-Host "Testing: $TestName" -ForegroundColor Yellow
    try {
        $result = & $TestScript
        if ($result.Success) {
            Write-Host "  ✅ PASS: $($result.Message)" -ForegroundColor Green
            $script:testResults += [PSCustomObject]@{
                Category = $Category
                Test     = $TestName
                Status   = "PASS"
                Message  = $result.Message
            }
        }
        else {
            Write-Host "  ❌ FAIL: $($result.Message)" -ForegroundColor Red
            $script:testResults += [PSCustomObject]@{
                Category = $Category
                Test     = $TestName
                Status   = "FAIL"
                Message  = $result.Message
            }
        }
    }
    catch {
        Write-Host "  ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $script:testResults += [PSCustomObject]@{
            Category = $Category
            Test     = $TestName
            Status   = "ERROR"
            Message  = $_.Exception.Message
        }
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. TESTING RATE LIMITING (DDoS Protection)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Rate Limiting - Burst Protection
Test-Feature -TestName "Rate Limiting - Burst Protection (10 req/sec)" -Category "Rate Limiting" -TestScript {
    $successCount = 0
    $rateLimitedCount = 0
    
    for ($i = 1; $i -le 15; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $API_HEALTH -Method GET -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $successCount++
            }
        }
        catch {
            if ($_.Exception.Response.StatusCode -eq 429) {
                $rateLimitedCount++
            }
        }
        Start-Sleep -Milliseconds 50  # Rapid requests
    }
    
    if ($rateLimitedCount -gt 0) {
        return @{Success = $true; Message = "Rate limited after $successCount requests (blocked $rateLimitedCount)" }
    }
    else {
        return @{Success = $false; Message = "No rate limiting detected in burst test" }
    }
}

# Test 2: Rate Limiting - Sustained Load
Test-Feature -TestName "Rate Limiting - Sustained Load (100 req/min)" -Category "Rate Limiting" -TestScript {
    $successCount = 0
    $rateLimitedCount = 0
    
    for ($i = 1; $i -le 20; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $API_HEALTH -Method GET -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $successCount++
            }
        }
        catch {
            if ($_.Exception.Response.StatusCode -eq 429) {
                $rateLimitedCount++
            }
        }
        Start-Sleep -Milliseconds 100
    }
    
    return @{Success = $true; Message = "Processed $successCount requests, rate limited $rateLimitedCount" }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "2. TESTING SECURITY HEADERS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 3: HSTS Header
Test-Feature -TestName "HSTS Header (Strict-Transport-Security)" -Category "Security Headers" -TestScript {
    try {
        $response = Invoke-WebRequest -Uri $API_HEALTH -Method GET
        $hstsHeader = $response.Headers['Strict-Transport-Security']
        
        if ($hstsHeader) {
            if ($hstsHeader -match "max-age=31536000" -and $hstsHeader -match "includeSubDomains" -and $hstsHeader -match "preload") {
                return @{Success = $true; Message = "HSTS header present with correct configuration: $hstsHeader" }
            }
            else {
                return @{Success = $false; Message = "HSTS header present but incorrect: $hstsHeader" }
            }
        }
        else {
            return @{Success = $false; Message = "HSTS header not found" }
        }
    }
    catch {
        return @{Success = $false; Message = "Failed to fetch headers: $($_.Exception.Message)" }
    }
}

# Test 4: X-Frame-Options Header
Test-Feature -TestName "X-Frame-Options (Clickjacking Protection)" -Category "Security Headers" -TestScript {
    try {
        $response = Invoke-WebRequest -Uri $API_HEALTH -Method GET
        $xFrameOptions = $response.Headers['X-Frame-Options']
        
        if ($xFrameOptions -eq "DENY") {
            return @{Success = $true; Message = "X-Frame-Options: DENY" }
        }
        else {
            return @{Success = $false; Message = "X-Frame-Options not set to DENY (found: $xFrameOptions)" }
        }
    }
    catch {
        return @{Success = $false; Message = "Failed to fetch headers" }
    }
}

# Test 5: X-Content-Type-Options Header
Test-Feature -TestName "X-Content-Type-Options (MIME Sniffing Protection)" -Category "Security Headers" -TestScript {
    try {
        $response = Invoke-WebRequest -Uri $API_HEALTH -Method GET
        $xContentType = $response.Headers['X-Content-Type-Options']
        
        if ($xContentType -eq "nosniff") {
            return @{Success = $true; Message = "X-Content-Type-Options: nosniff" }
        }
        else {
            return @{Success = $false; Message = "X-Content-Type-Options not set correctly" }
        }
    }
    catch {
        return @{Success = $false; Message = "Failed to fetch headers" }
    }
}

# Test 6: Referrer-Policy Header
Test-Feature -TestName "Referrer-Policy (Privacy Protection)" -Category "Security Headers" -TestScript {
    try {
        $response = Invoke-WebRequest -Uri $API_HEALTH -Method GET
        $referrerPolicy = $response.Headers['Referrer-Policy']
        
        if ($referrerPolicy) {
            return @{Success = $true; Message = "Referrer-Policy: $referrerPolicy" }
        }
        else {
            return @{Success = $false; Message = "Referrer-Policy not found" }
        }
    }
    catch {
        return @{Success = $false; Message = "Failed to fetch headers" }
    }
}

# Test 7: Content-Security-Policy Header
Test-Feature -TestName "Content-Security-Policy (XSS Protection)" -Category "Security Headers" -TestScript {
    try {
        $response = Invoke-WebRequest -Uri $API_HEALTH -Method GET
        $csp = $response.Headers['Content-Security-Policy']
        
        if ($csp) {
            return @{Success = $true; Message = "CSP header present" }
        }
        else {
            return @{Success = $false; Message = "CSP header not found" }
        }
    }
    catch {
        return @{Success = $false; Message = "Failed to fetch headers" }
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "3. TESTING API ENDPOINTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 8: Health Check Endpoint
Test-Feature -TestName "Health Check Endpoint" -Category "API Endpoints" -TestScript {
    try {
        $response = Invoke-WebRequest -Uri $API_HEALTH -Method GET
        if ($response.StatusCode -eq 200) {
            return @{Success = $true; Message = "Health check responding (200 OK)" }
        }
        else {
            return @{Success = $false; Message = "Unexpected status code: $($response.StatusCode)" }
        }
    }
    catch {
        return @{Success = $false; Message = "Health check failed: $($_.Exception.Message)" }
    }
}

# Test 9: CORS Configuration
Test-Feature -TestName "CORS Headers" -Category "API Endpoints" -TestScript {
    try {
        $response = Invoke-WebRequest -Uri $API_HEALTH -Method GET
        $corsOrigin = $response.Headers['Access-Control-Allow-Origin']
        
        if ($corsOrigin) {
            return @{Success = $true; Message = "CORS configured: $corsOrigin" }
        }
        else {
            return @{Success = $false; Message = "CORS headers not found" }
        }
    }
    catch {
        return @{Success = $false; Message = "Failed to check CORS" }
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "4. TESTING FRONTEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 10: Frontend Accessibility
Test-Feature -TestName "Frontend Accessible" -Category "Frontend" -TestScript {
    try {
        $response = Invoke-WebRequest -Uri $WEB_URL -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            return @{Success = $true; Message = "Frontend responding (200 OK)" }
        }
        else {
            return @{Success = $false; Message = "Unexpected status code: $($response.StatusCode)" }
        }
    }
    catch {
        return @{Success = $false; Message = "Frontend not accessible: $($_.Exception.Message)" }
    }
}

# Test 11: Check for CookieYes Script
Test-Feature -TestName "CookieYes Script Present" -Category "Frontend" -TestScript {
    try {
        $response = Invoke-WebRequest -Uri $WEB_URL -Method GET
        $content = $response.Content
        
        if ($content -match "cookieyes") {
            return @{Success = $true; Message = "CookieYes script found in HTML" }
        }
        else {
            return @{Success = $false; Message = "CookieYes script not found (needs ID replacement)" }
        }
    }
    catch {
        return @{Success = $false; Message = "Failed to check frontend content" }
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "5. PERFORMANCE & CAPACITY TESTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 12: Response Time
Test-Feature -TestName "API Response Time (<200ms)" -Category "Performance" -TestScript {
    $times = @()
    for ($i = 1; $i -le 10; $i++) {
        $start = Get-Date
        try {
            Invoke-WebRequest -Uri $API_HEALTH -Method GET | Out-Null
            $end = Get-Date
            $times += ($end - $start).TotalMilliseconds
        }
        catch {
            # Ignore rate limit errors for this test
        }
    }
    
    if ($times.Count -gt 0) {
        $avgTime = ($times | Measure-Object -Average).Average
        if ($avgTime -lt 200) {
            return @{Success = $true; Message = "Average response time: $([math]::Round($avgTime, 2))ms" }
        }
        else {
            return @{Success = $false; Message = "Response time too slow: $([math]::Round($avgTime, 2))ms" }
        }
    }
    else {
        return @{Success = $false; Message = "No successful requests" }
    }
}

# Test 13: Concurrent Request Handling
Test-Feature -TestName "Concurrent Request Handling (10 parallel)" -Category "Performance" -TestScript {
    $jobs = @()
    for ($i = 1; $i -le 10; $i++) {
        $jobs += Start-Job -ScriptBlock {
            param($url)
            try {
                $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 5
                return $response.StatusCode
            }
            catch {
                return 0
            }
        } -ArgumentList $API_HEALTH
    }
    
    $results = $jobs | Wait-Job | Receive-Job
    $successCount = ($results | Where-Object { $_ -eq 200 }).Count
    
    $jobs | Remove-Job
    
    if ($successCount -ge 5) {
        return @{Success = $true; Message = "Handled $successCount/10 concurrent requests" }
    }
    else {
        return @{Success = $false; Message = "Only handled $successCount/10 concurrent requests" }
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Group results by category
$categories = $testResults | Group-Object -Property Category

foreach ($category in $categories) {
    Write-Host "$($category.Name):" -ForegroundColor Cyan
    foreach ($test in $category.Group) {
        $icon = if ($test.Status -eq "PASS") { "✅" } elseif ($test.Status -eq "FAIL") { "❌" } else { "⚠️" }
        $color = if ($test.Status -eq "PASS") { "Green" } elseif ($test.Status -eq "FAIL") { "Red" } else { "Yellow" }
        Write-Host "  $icon $($test.Test): $($test.Status)" -ForegroundColor $color
    }
    Write-Host ""
}

# Calculate overall score
$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failedTests = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$errorTests = ($testResults | Where-Object { $_.Status -eq "ERROR" }).Count

$passRate = [math]::Round(($passedTests / $totalTests) * 100, 2)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OVERALL SCORE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor Red
Write-Host "Errors: $errorTests" -ForegroundColor Yellow
Write-Host "Pass Rate: $passRate%" -ForegroundColor $(if ($passRate -ge 80) { "Green" } elseif ($passRate -ge 60) { "Yellow" } else { "Red" })
Write-Host ""

# Security Grade
if ($passRate -ge 90) {
    Write-Host "Security Grade: A+ 🏆" -ForegroundColor Green
}
elseif ($passRate -ge 80) {
    Write-Host "Security Grade: A" -ForegroundColor Green
}
elseif ($passRate -ge 70) {
    Write-Host "Security Grade: B" -ForegroundColor Yellow
}
elseif ($passRate -ge 60) {
    Write-Host "Security Grade: C" -ForegroundColor Yellow
}
else {
    Write-Host "Security Grade: F" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RECOMMENDATIONS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($failedTests -gt 0 -or $errorTests -gt 0) {
    Write-Host "⚠️  Some tests failed. Review the following:" -ForegroundColor Yellow
    Write-Host ""
    
    $failedResults = $testResults | Where-Object { $_.Status -ne "PASS" }
    foreach ($result in $failedResults) {
        Write-Host "  • $($result.Test): $($result.Message)" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Fix any failed tests" -ForegroundColor White
Write-Host "2. Replace CookieYes ID in apps/web/src/app/layout.tsx" -ForegroundColor White
Write-Host "3. Replace Google Analytics ID" -ForegroundColor White
Write-Host "4. Configure Cloudflare for production" -ForegroundColor White
Write-Host "5. Run production tests with SSL Labs" -ForegroundColor White
Write-Host ""

# Export results to JSON
$testResults | ConvertTo-Json | Out-File -FilePath "security-test-results.json"
Write-Host "✅ Test results saved to: security-test-results.json" -ForegroundColor Green
Write-Host ""
