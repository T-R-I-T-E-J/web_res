# PowerShell script to run the database migration

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOYING POLICIES/CLASSIFICATION FIX" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Docker is running
Write-Host "[Step 1/4] Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Docker is not running. Starting Docker containers..." -ForegroundColor Red
    docker-compose up -d
    Start-Sleep -Seconds 5
} else {
    Write-Host "✓ Docker is running" -ForegroundColor Green
}

# Step 2: Run migration
Write-Host ""
Write-Host "[Step 2/4] Running database migration..." -ForegroundColor Yellow
Write-Host "You have 3 options:" -ForegroundColor White
Write-Host ""
Write-Host "Option 1: Use pgAdmin (Easiest)" -ForegroundColor Cyan
Write-Host "  1. Open: http://localhost:8081" -ForegroundColor White
Write-Host "  2. Login: admin@psci.in / admin123" -ForegroundColor White
Write-Host "  3. Connect to database: psci_platform" -ForegroundColor White
Write-Host "  4. Open Query Tool (Tools > Query Tool)" -ForegroundColor White
Write-Host "  5. Copy/paste SQL from: apps\api\migrations\20260206_create_classification_categories.sql" -ForegroundColor White
Write-Host "  6. Click Execute (F5)" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Use Docker exec" -ForegroundColor Cyan
Write-Host "  Run this command:" -ForegroundColor White
Write-Host '  docker exec -i demowebsite-postgres-1 psql -U postgres -d psci_platform < apps\api\migrations\20260206_create_classification_categories.sql' -ForegroundColor Gray
Write-Host ""
Write-Host "Option 3: Manual SQL" -ForegroundColor Cyan
Write-Host "  See DEPLOY_FIX_NOW.md for the SQL to copy/paste" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Press Enter to try Option 2 (Docker exec), or type 'skip' to do it manually"

if ($choice -ne 'skip') {
    Write-Host ""
    Write-Host "Running migration via Docker..." -ForegroundColor Yellow
    Get-Content apps\api\migrations\20260206_create_classification_categories.sql | docker exec -i demowebsite-postgres-1 psql -U postgres -d psci_platform
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Migration completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "✗ Migration failed. Please use Option 1 (pgAdmin) instead." -ForegroundColor Red
        Write-Host "See DEPLOY_FIX_NOW.md for instructions" -ForegroundColor Yellow
        exit 1
    }
}

# Step 3: Verify migration
Write-Host ""
Write-Host "[Step 3/4] Verifying migration..." -ForegroundColor Yellow
$verifySQL = "SELECT name, slug, page FROM categories ORDER BY page, \`"order\`";"
echo $verifySQL | docker exec -i demowebsite-postgres-1 psql -U postgres -d psci_platform -t

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Categories verified" -ForegroundColor Green
} else {
    Write-Host "⚠ Could not verify. Please check pgAdmin" -ForegroundColor Yellow
}

# Step 4: Instructions
Write-Host ""
Write-Host "[Step 4/4] Next steps..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Now restart your servers:" -ForegroundColor Cyan
Write-Host "  1. Stop backend (Ctrl+C)" -ForegroundColor White
Write-Host "  2. cd apps\api" -ForegroundColor White
Write-Host "  3. npm run start:dev" -ForegroundColor White
Write-Host ""
Write-Host "  4. Stop frontend (Ctrl+C)" -ForegroundColor White
Write-Host "  5. cd apps\web" -ForegroundColor White  
Write-Host "  6. npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then test:" -ForegroundColor Cyan
Write-Host "  - http://localhost:4000/api/v1/categories?page=policies" -ForegroundColor White
Write-Host "  - http://localhost:4000/api/v1/categories?page=classification" -ForegroundColor White
Write-Host "  - http://localhost:3000/policies" -ForegroundColor White
Write-Host "  - http://localhost:3000/classification" -ForegroundColor White
Write-Host ""
Write-Host "✓ Pages should now show DIFFERENT content!" -ForegroundColor Green
Write-Host ""
Write-Host "Full guide: DEPLOY_FIX_NOW.md" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
