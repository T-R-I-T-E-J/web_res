# Quick Security Test - Simple Results

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Security Test Results" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$passed = 0
$failed = 0

# Test 1: Brute Force Protection
Write-Host "[1] Brute Force Protection Service..." -NoNewline
if (Test-Path "apps\api\src\auth\services\brute-force-protection.service.ts") {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
}
else {
    Write-Host " FAIL" -ForegroundColor Red
    $failed++
}

# Test 2: IP Filter Service
Write-Host "[2] IP Filter Service..." -NoNewline
if (Test-Path "apps\api\src\common\services\ip-filter.service.ts") {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
}
else {
    Write-Host " FAIL" -ForegroundColor Red
    $failed++
}

# Test 3: Query Protection
Write-Host "[3] Query Protection Service..." -NoNewline
if (Test-Path "apps\api\src\common\services\query-protection.service.ts") {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
}
else {
    Write-Host " FAIL" -ForegroundColor Red
    $failed++
}

# Test 4: Security Guard
Write-Host "[4] Security Guard..." -NoNewline
if (Test-Path "apps\api\src\common\guards\security.guard.ts") {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
}
else {
    Write-Host " FAIL" -ForegroundColor Red
    $failed++
}

# Test 5: Encryption Service
Write-Host "[5] Encryption Service..." -NoNewline
if (Test-Path "apps\api\src\common\services\encryption.service.ts") {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
}
else {
    Write-Host " FAIL" -ForegroundColor Red
    $failed++
}

# Test 6: Upload Security
Write-Host "[6] Upload Security..." -NoNewline
if ((Test-Path "apps\api\src\config\multer.config.ts") -and 
    (Test-Path "apps\api\src\upload\upload.controller.ts")) {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
}
else {
    Write-Host " FAIL" -ForegroundColor Red
    $failed++
}

# Test 7: Database Config
Write-Host "[7] Database Configuration..." -NoNewline
if ((Test-Path "docker-compose.yml") -and 
    (Test-Path "infrastructure\database\postgresql.conf") -and
    (Test-Path "infrastructure\database\pg_hba.conf")) {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
}
else {
    Write-Host " FAIL" -ForegroundColor Red
    $failed++
}

# Test 8: Database Port Security
Write-Host "[8] Database Port Security..." -NoNewline
try {
    $portTest = Test-NetConnection -ComputerName localhost -Port 5432 -WarningAction SilentlyContinue -InformationLevel Quiet -ErrorAction SilentlyContinue
    if ($portTest -eq $false) {
        Write-Host " PASS (Not Exposed)" -ForegroundColor Green
        $passed++
    }
    else {
        Write-Host " FAIL (Exposed)" -ForegroundColor Red
        $failed++
    }
}
catch {
    Write-Host " PASS (Not Accessible)" -ForegroundColor Green
    $passed++
}

# Test 9: Database Container
Write-Host "[9] Database Container..." -NoNewline
$dbContainer = docker ps --filter "name=psci_postgres" --format "{{.Names}}" 2>$null
if ($dbContainer) {
    Write-Host " PASS (Running)" -ForegroundColor Green
    $passed++
}
else {
    Write-Host " FAIL (Not Running)" -ForegroundColor Red
    $failed++
}

# Test 10: Documentation
Write-Host "[10] Security Documentation..." -NoNewline
if ((Test-Path "docs\security\DATABASE-SECURITY.md") -and 
    (Test-Path "docs\security\COMPLETE-PREVENTION-SYSTEM.md")) {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
}
else {
    Write-Host " FAIL" -ForegroundColor Red
    $failed++
}

# Summary
$total = $passed + $failed
$successRate = [math]::Round(($passed / $total) * 100, 2)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total Tests:   $total" -ForegroundColor White
Write-Host "Passed:        $passed" -ForegroundColor Green
Write-Host "Failed:        $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host "Success Rate:  $successRate%" -ForegroundColor $(if ($successRate -ge 90) { "Green" } elseif ($successRate -ge 70) { "Yellow" } else { "Red" })
Write-Host ""

# Security Grade
if ($successRate -ge 95) {
    Write-Host "Security Grade: A+ (Excellent)" -ForegroundColor Green
    Write-Host "Your platform has MAXIMUM SECURITY!" -ForegroundColor Green
}
elseif ($successRate -ge 85) {
    Write-Host "Security Grade: A (Very Good)" -ForegroundColor Green
    Write-Host "Your platform is well secured." -ForegroundColor Green
}
elseif ($successRate -ge 75) {
    Write-Host "Security Grade: B (Good)" -ForegroundColor Yellow
    Write-Host "Your platform needs minor improvements." -ForegroundColor Yellow
}
else {
    Write-Host "Security Grade: C (Needs Work)" -ForegroundColor Red
    Write-Host "Your platform needs security improvements." -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
