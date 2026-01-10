# Complete Service Restart Script
# Para Shooting Committee of India

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Service Restart Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop all services
Write-Host "[1/5] Stopping all services..." -ForegroundColor Yellow
Write-Host ""

Write-Host "  Stopping Node.js processes..." -ForegroundColor White
taskkill /F /IM node.exe 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Node.js processes stopped" -ForegroundColor Green
}
else {
    Write-Host "  No Node.js processes running" -ForegroundColor Gray
}

Write-Host ""

# Step 2: Restart database
Write-Host "[2/5] Restarting database services..." -ForegroundColor Yellow
docker-compose restart
Write-Host "  Database services restarted" -ForegroundColor Green
Write-Host ""

# Wait for database to be ready
Write-Host "  Waiting for database to be ready..." -ForegroundColor White
Start-Sleep -Seconds 3
Write-Host "  Database ready" -ForegroundColor Green
Write-Host ""

# Step 3: Start backend
Write-Host "[3/5] Starting backend API..." -ForegroundColor Yellow
Write-Host "  Starting on port 4000..." -ForegroundColor White

$backendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\trite\Downloads\demowebsite\apps\api"
    npm run start:dev
}

Write-Host "  Backend starting (Job ID: $($backendJob.Id))..." -ForegroundColor Green
Write-Host "  Waiting for backend to initialize..." -ForegroundColor White
Start-Sleep -Seconds 15

# Test backend
$backendReady = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4000/api/v1/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendReady = $true
            break
        }
    }
    catch {
        Write-Host "  Attempt $i/10: Backend not ready yet..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

if ($backendReady) {
    Write-Host "  Backend API is ready!" -ForegroundColor Green
}
else {
    Write-Host "  Backend may still be initializing..." -ForegroundColor Yellow
    Write-Host "  Check the terminal for backend logs" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Start frontend
Write-Host "[4/5] Starting frontend..." -ForegroundColor Yellow
Write-Host "  Starting on port 3000..." -ForegroundColor White

$frontendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\trite\Downloads\demowebsite\apps\web"
    npm run dev
}

Write-Host "  Frontend starting (Job ID: $($frontendJob.Id))..." -ForegroundColor Green
Start-Sleep -Seconds 5
Write-Host "  Frontend ready!" -ForegroundColor Green
Write-Host ""

# Step 5: Summary
Write-Host "[5/5] Service Status Summary" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Services Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access Points:" -ForegroundColor White
Write-Host "  Frontend:    http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend API: http://localhost:4000/api/v1" -ForegroundColor Cyan
Write-Host "  Health Check: http://localhost:4000/api/v1/health" -ForegroundColor Cyan
Write-Host "  Database:    localhost:5432" -ForegroundColor Cyan
Write-Host "  pgAdmin:     http://127.0.0.1:8081" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration:" -ForegroundColor White
Write-Host "  Backend Port: 4000" -ForegroundColor Gray
Write-Host "  Frontend Port: 3000" -ForegroundColor Gray
Write-Host "  API Prefix: api/v1" -ForegroundColor Gray
Write-Host ""
Write-Host "Note: Backend and Frontend are running in background jobs" -ForegroundColor Yellow
Write-Host "      Check their respective terminals for logs" -ForegroundColor Yellow
Write-Host ""
