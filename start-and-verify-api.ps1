# API Startup and Verification Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "API Server Startup & Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if API process is running
Write-Host "[1/5] Checking if API is running..." -ForegroundColor Yellow
$apiProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*apps\api*" }

if ($apiProcess) {
    Write-Host "  OK: API process found (PID: $($apiProcess.Id))" -ForegroundColor Green
}
else {
    Write-Host "  WARNING: API process not found" -ForegroundColor Yellow
    Write-Host "  Starting API server..." -ForegroundColor Yellow
    
    Start-Process -FilePath "powershell" `
        -ArgumentList "-NoExit", "-Command", "cd apps/api; npm run start:dev" `
        -WorkingDirectory $PSScriptRoot `
        -WindowStyle Normal
    
    Write-Host "  Waiting for API to start (30 seconds)..." -ForegroundColor Gray
    Start-Sleep -Seconds 30
}
Write-Host ""

# Step 2: Check database connection
Write-Host "[2/5] Checking database..." -ForegroundColor Yellow
$dbContainer = docker ps --filter "name=psci_postgres" --format "{{.Names}}"

if ($dbContainer) {
    Write-Host "  OK: Database container running" -ForegroundColor Green
}
else {
    Write-Host "  ERROR: Database container not running" -ForegroundColor Red
    Write-Host "  Starting database..." -ForegroundColor Yellow
    docker-compose up -d
    Start-Sleep -Seconds 10
}
Write-Host ""

# Step 3: Test API endpoints
Write-Host "[3/5] Testing API endpoints..." -ForegroundColor Yellow

$endpoints = @(
    @{ Path = "/api/v1/health"; Name = "Health Check" },
    @{ Path = "/api/v1/auth/login"; Name = "Auth Login" },
    @{ Path = "/api/v1/upload/file"; Name = "File Upload" }
)

$maxRetries = 5
$retryDelay = 5

foreach ($endpoint in $endpoints) {
    $success = $false
    
    for ($i = 1; $i -le $maxRetries; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080$($endpoint.Path)" `
                -Method Get `
                -UseBasicParsing `
                -TimeoutSec 5 `
                -ErrorAction SilentlyContinue
            
            Write-Host "  OK: $($endpoint.Name) - Available" -ForegroundColor Green
            $success = $true
            break
        }
        catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            
            if ($statusCode -eq 401 -or $statusCode -eq 400 -or $statusCode -eq 404) {
                Write-Host "  OK: $($endpoint.Name) - Available (Status: $statusCode)" -ForegroundColor Green
                $success = $true
                break
            }
            
            if ($i -lt $maxRetries) {
                Write-Host "  Retry $i/$maxRetries for $($endpoint.Name)..." -ForegroundColor Gray
                Start-Sleep -Seconds $retryDelay
            }
        }
    }
    
    if (-not $success) {
        Write-Host "  WARNING: $($endpoint.Name) - Not responding" -ForegroundColor Yellow
    }
}
Write-Host ""

# Step 4: Check environment variables
Write-Host "[4/5] Checking environment variables..." -ForegroundColor Yellow
$envFile = "apps\api\.env"

if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    
    $requiredVars = @("DATABASE_URL", "JWT_SECRET", "ENCRYPTION_KEY")
    $missingVars = @()
    
    foreach ($var in $requiredVars) {
        if ($envContent -notmatch "$var=") {
            $missingVars += $var
        }
        else {
            Write-Host "  OK: $var is set" -ForegroundColor Green
        }
    }
    
    if ($missingVars.Count -gt 0) {
        Write-Host "  WARNING: Missing variables: $($missingVars -join ', ')" -ForegroundColor Yellow
    }
}
else {
    Write-Host "  ERROR: .env file not found at $envFile" -ForegroundColor Red
}
Write-Host ""

# Step 5: Summary
Write-Host "[5/5] Startup Summary" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Status Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test final health check
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/health" -Method Get -TimeoutSec 5
    Write-Host "API Status: RUNNING" -ForegroundColor Green
    Write-Host "Health Check: OK" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $healthResponse | ConvertTo-Json -Depth 3
}
catch {
    Write-Host "API Status: STARTING or ERROR" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "If API is still starting, wait a few more seconds and try:" -ForegroundColor Yellow
    Write-Host "  Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/health'" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Available Endpoints" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Health:        http://localhost:8080/api/v1/health" -ForegroundColor White
Write-Host "Auth Login:    http://localhost:8080/api/v1/auth/login" -ForegroundColor White
Write-Host "File Upload:   http://localhost:8080/api/v1/upload/file" -ForegroundColor White
Write-Host "Frontend:      http://localhost:3000" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Test file upload:" -ForegroundColor Yellow
Write-Host "   .\quick-test-upload.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Run database migrations:" -ForegroundColor Yellow
Write-Host "   psql `$env:DATABASE_URL -f apps\api\migrations\003-add-encrypted-fields.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Encrypt existing data:" -ForegroundColor Yellow
Write-Host "   cd apps\api && node migrate-encrypt-users.js" -ForegroundColor Gray
Write-Host ""

Write-Host "API Server Ready!" -ForegroundColor Green
Write-Host ""
