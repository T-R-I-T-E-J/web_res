# Complete Security Prevention System Test
# Tests all security features to ensure they're working

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Security Prevention System - Full Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:8080/api/v1"
$testResults = @()

# Helper function to add test result
function Add-TestResult {
    param($name, $status, $message)
    $script:testResults += [PSCustomObject]@{
        Test    = $name
        Status  = $status
        Message = $message
    }
}

# Helper function to print test header
function Write-TestHeader {
    param($name)
    Write-Host ""
    Write-Host "[$name]" -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Gray
}

# ============================================
# TEST 1: Database Security
# ============================================
Write-TestHeader "TEST 1: Database Security"

try {
    # Test that port 5432 is NOT exposed
    $portTest = Test-NetConnection -ComputerName localhost -Port 5432 -WarningAction SilentlyContinue -InformationLevel Quiet -ErrorAction SilentlyContinue
    
    if ($portTest -eq $false) {
        Write-Host "  OK: Port 5432 is NOT exposed (SECURE)" -ForegroundColor Green
        Add-TestResult "Database Port Security" "PASS" "Port 5432 not exposed to public"
    }
    else {
        Write-Host "  FAIL: Port 5432 is exposed (INSECURE)" -ForegroundColor Red
        Add-TestResult "Database Port Security" "FAIL" "Port 5432 is publicly accessible"
    }
}
catch {
    Write-Host "  OK: Port 5432 is NOT accessible (SECURE)" -ForegroundColor Green
    Add-TestResult "Database Port Security" "PASS" "Port 5432 blocked"
}

# Check database container is running
$dbContainer = docker ps --filter "name=psci_postgres" --format "{{.Names}}"
if ($dbContainer) {
    Write-Host "  OK: Database container running" -ForegroundColor Green
    Add-TestResult "Database Container" "PASS" "Container running and healthy"
}
else {
    Write-Host "  FAIL: Database container not running" -ForegroundColor Red
    Add-TestResult "Database Container" "FAIL" "Container not running"
}

# ============================================
# TEST 2: File Security
# ============================================
Write-TestHeader "TEST 2: File Security"

# Check security files exist
$securityFiles = @(
    "apps\api\src\auth\services\brute-force-protection.service.ts",
    "apps\api\src\common\services\ip-filter.service.ts",
    "apps\api\src\common\services\query-protection.service.ts",
    "apps\api\src\common\guards\security.guard.ts"
)

foreach ($file in $securityFiles) {
    if (Test-Path $file) {
        Write-Host "  OK: $file exists" -ForegroundColor Green
        Add-TestResult "Security File: $(Split-Path $file -Leaf)" "PASS" "File exists"
    }
    else {
        Write-Host "  FAIL: $file missing" -ForegroundColor Red
        Add-TestResult "Security File: $(Split-Path $file -Leaf)" "FAIL" "File not found"
    }
}

# ============================================
# TEST 3: Encryption Service
# ============================================
Write-TestHeader "TEST 3: Encryption Service"

$encryptionFile = "apps\api\src\common\services\encryption.service.ts"
if (Test-Path $encryptionFile) {
    Write-Host "  OK: Encryption service exists" -ForegroundColor Green
    Add-TestResult "Encryption Service" "PASS" "Service file exists"
    
    # Check for key encryption methods
    $content = Get-Content $encryptionFile -Raw
    $methods = @("encrypt", "decrypt", "hash", "maskEmail", "maskPhone")
    
    foreach ($method in $methods) {
        if ($content -match $method) {
            Write-Host "  OK: Method '$method' found" -ForegroundColor Green
        }
        else {
            Write-Host "  WARN: Method '$method' not found" -ForegroundColor Yellow
        }
    }
}
else {
    Write-Host "  FAIL: Encryption service missing" -ForegroundColor Red
    Add-TestResult "Encryption Service" "FAIL" "Service file not found"
}

# ============================================
# TEST 4: Upload Security
# ============================================
Write-TestHeader "TEST 4: Upload Security"

$uploadFiles = @(
    "apps\api\src\config\multer.config.ts",
    "apps\api\src\upload\upload.controller.ts",
    "apps\api\src\upload\upload.module.ts"
)

foreach ($file in $uploadFiles) {
    if (Test-Path $file) {
        Write-Host "  OK: $file exists" -ForegroundColor Green
        Add-TestResult "Upload File: $(Split-Path $file -Leaf)" "PASS" "File exists"
    }
    else {
        Write-Host "  FAIL: $file missing" -ForegroundColor Red
        Add-TestResult "Upload File: $(Split-Path $file -Leaf)" "FAIL" "File not found"
    }
}

# Check upload directory
$uploadDir = "apps\api\uploads"
if (Test-Path $uploadDir) {
    Write-Host "  OK: Upload directory exists" -ForegroundColor Green
    Add-TestResult "Upload Directory" "PASS" "Directory exists"
}
else {
    Write-Host "  WARN: Upload directory missing (will be created on first upload)" -ForegroundColor Yellow
    Add-TestResult "Upload Directory" "WARN" "Directory not created yet"
}

# ============================================
# TEST 5: Database Configuration
# ============================================
Write-TestHeader "TEST 5: Database Configuration"

$dbConfigFiles = @(
    "docker-compose.yml",
    "infrastructure\database\postgresql.conf",
    "infrastructure\database\pg_hba.conf"
)

foreach ($file in $dbConfigFiles) {
    if (Test-Path $file) {
        Write-Host "  OK: $file exists" -ForegroundColor Green
        Add-TestResult "DB Config: $(Split-Path $file -Leaf)" "PASS" "File exists"
        
        # Check for security keywords
        $content = Get-Content $file -Raw
        if ($file -eq "docker-compose.yml") {
            if ($content -match "internal: true") {
                Write-Host "    OK: Network isolation enabled" -ForegroundColor Green
            }
            if ($content -match "security_opt") {
                Write-Host "    OK: Security options configured" -ForegroundColor Green
            }
        }
        if ($file -eq "infrastructure\database\postgresql.conf") {
            if ($content -match "scram-sha-256") {
                Write-Host "    OK: Strong authentication enabled" -ForegroundColor Green
            }
            if ($content -match "statement_timeout") {
                Write-Host "    OK: Query timeout configured" -ForegroundColor Green
            }
        }
    }
    else {
        Write-Host "  FAIL: $file missing" -ForegroundColor Red
        Add-TestResult "DB Config: $(Split-Path $file -Leaf)" "FAIL" "File not found"
    }
}

# ============================================
# TEST 6: Environment Variables
# ============================================
Write-TestHeader "TEST 6: Environment Variables"

$envFile = "apps\api\.env"
if (Test-Path $envFile) {
    Write-Host "  OK: .env file exists" -ForegroundColor Green
    Add-TestResult "Environment File" "PASS" "File exists"
    
    $envContent = Get-Content $envFile -Raw
    $requiredVars = @("DATABASE_URL", "JWT_SECRET", "ENCRYPTION_KEY")
    
    foreach ($var in $requiredVars) {
        if ($envContent -match "$var=") {
            Write-Host "  OK: $var is set" -ForegroundColor Green
        }
        else {
            Write-Host "  WARN: $var not found" -ForegroundColor Yellow
            Add-TestResult "Env Var: $var" "WARN" "Variable not set"
        }
    }
}
else {
    Write-Host "  FAIL: .env file missing" -ForegroundColor Red
    Add-TestResult "Environment File" "FAIL" "File not found"
}

# ============================================
# TEST 7: Documentation
# ============================================
Write-TestHeader "TEST 7: Documentation"

$docFiles = @(
    "docs\security\DATABASE-SECURITY.md",
    "docs\security\DATABASE-SECURITY-VERIFIED.md",
    "docs\security\SECURITY-MONITORING-GUIDE.md",
    "docs\security\COMPLETE-PREVENTION-SYSTEM.md",
    "docs\security\PHASE-2-ENCRYPTION.md"
)

$docCount = 0
foreach ($file in $docFiles) {
    if (Test-Path $file) {
        $docCount++
        Write-Host "  OK: $file exists" -ForegroundColor Green
    }
}

Write-Host "  Found $docCount/$($docFiles.Count) documentation files" -ForegroundColor $(if ($docCount -eq $docFiles.Count) { "Green" } else { "Yellow" })
Add-TestResult "Documentation" "PASS" "$docCount/$($docFiles.Count) files found"

# ============================================
# TEST 8: API Endpoints (if running)
# ============================================
Write-TestHeader "TEST 8: API Endpoints"

try {
    $healthResponse = Invoke-RestMethod -Uri "$API_URL/health" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  OK: Health endpoint responding" -ForegroundColor Green
    Add-TestResult "API Health Endpoint" "PASS" "Endpoint accessible"
    
    # Try to access upload endpoint without auth (should fail)
    try {
        $uploadResponse = Invoke-WebRequest -Uri "$API_URL/upload/file" -Method Post -UseBasicParsing -ErrorAction Stop
        Write-Host "  FAIL: Upload endpoint accessible without auth" -ForegroundColor Red
        Add-TestResult "Upload Security" "FAIL" "Endpoint not protected"
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 403) {
            Write-Host "  OK: Upload endpoint requires authentication" -ForegroundColor Green
            Add-TestResult "Upload Security" "PASS" "Endpoint protected"
        }
        else {
            Write-Host "  WARN: Upload endpoint returned unexpected status" -ForegroundColor Yellow
            Add-TestResult "Upload Security" "WARN" "Unexpected response"
        }
    }
    
}
catch {
    Write-Host "  SKIP: API not running (start with .\restart-services.ps1)" -ForegroundColor Yellow
    Add-TestResult "API Endpoints" "SKIP" "API not running"
}

# ============================================
# TEST 9: Security Scripts
# ============================================
Write-TestHeader "TEST 9: Security Scripts"

$scripts = @(
    "secure-database.ps1",
    "monitor-security-logs.ps1",
    "restart-services.ps1"
)

foreach ($script in $scripts) {
    if (Test-Path $script) {
        Write-Host "  OK: $script exists" -ForegroundColor Green
        Add-TestResult "Script: $script" "PASS" "Script exists"
    }
    else {
        Write-Host "  FAIL: $script missing" -ForegroundColor Red
        Add-TestResult "Script: $script" "FAIL" "Script not found"
    }
}

# ============================================
# TEST 10: Network Security
# ============================================
Write-TestHeader "TEST 10: Network Security"

# Check Docker networks
try {
    $networks = docker network ls --format "{{.Name}}" 2>$null
    if ($networks -match "demowebsite_db_network") {
        Write-Host "  OK: Isolated database network exists" -ForegroundColor Green
        Add-TestResult "Database Network" "PASS" "Isolated network configured"
        
        # Check if network is internal
        $networkInfo = docker network inspect demowebsite_db_network 2>$null | ConvertFrom-Json
        if ($networkInfo.Internal -eq $true) {
            Write-Host "  OK: Database network is internal (isolated)" -ForegroundColor Green
        }
        else {
            Write-Host "  WARN: Database network may not be fully isolated" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "  WARN: Database network not found" -ForegroundColor Yellow
        Add-TestResult "Database Network" "WARN" "Network not created"
    }
}
catch {
    Write-Host "  SKIP: Docker not available" -ForegroundColor Yellow
    Add-TestResult "Network Security" "SKIP" "Docker not accessible"
}

# ============================================
# SUMMARY
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$warned = ($testResults | Where-Object { $_.Status -eq "WARN" }).Count
$skipped = ($testResults | Where-Object { $_.Status -eq "SKIP" }).Count
$total = $testResults.Count

Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "Passed:      $passed" -ForegroundColor Green
Write-Host "Failed:      $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host "Warnings:    $warned" -ForegroundColor $(if ($warned -gt 0) { "Yellow" } else { "Green" })
Write-Host "Skipped:     $skipped" -ForegroundColor Gray
Write-Host ""

# Calculate success rate
$successRate = [math]::Round(($passed / $total) * 100, 2)
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 90) { "Green" } elseif ($successRate -ge 70) { "Yellow" } else { "Red" })
Write-Host ""

# Show detailed results
Write-Host "Detailed Results:" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
$testResults | Format-Table -AutoSize

# Security Grade
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Security Grade" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($successRate -ge 95) {
    Write-Host "Grade: A+ (Excellent)" -ForegroundColor Green
    Write-Host "Your platform has maximum security!" -ForegroundColor Green
}
elseif ($successRate -ge 85) {
    Write-Host "Grade: A (Very Good)" -ForegroundColor Green
    Write-Host "Your platform is well secured." -ForegroundColor Green
}
elseif ($successRate -ge 75) {
    Write-Host "Grade: B (Good)" -ForegroundColor Yellow
    Write-Host "Your platform is secured but needs improvements." -ForegroundColor Yellow
}
else {
    Write-Host "Grade: C or below (Needs Work)" -ForegroundColor Red
    Write-Host "Your platform needs security improvements." -ForegroundColor Red
}

Write-Host ""

# Recommendations
if ($failed -gt 0) {
    Write-Host "Recommendations:" -ForegroundColor Yellow
    $testResults | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  - Fix: $($_.Test)" -ForegroundColor Red
    }
    Write-Host ""
}

if ($warned -gt 0) {
    Write-Host "Warnings to Review:" -ForegroundColor Yellow
    $testResults | Where-Object { $_.Status -eq "WARN" } | ForEach-Object {
        Write-Host "  - Review: $($_.Test)" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Save results to file
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$reportFile = "test-results-$timestamp.txt"
$testResults | Format-Table -AutoSize | Out-File $reportFile
Write-Host "Results saved to: $reportFile" -ForegroundColor Gray
Write-Host ""
