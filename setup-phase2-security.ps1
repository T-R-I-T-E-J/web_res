# Phase-2 Security Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Phase-2 Security Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Generate Encryption Key
Write-Host "[1/4] Generating Encryption Key..." -ForegroundColor Yellow
$encryptionKey = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % { [char]$_ })
Write-Host "  ✅ Generated 64-character encryption key" -ForegroundColor Green
Write-Host ""

# Step 2: Check if .env exists
Write-Host "[2/4] Checking .env file..." -ForegroundColor Yellow
$envPath = "apps\api\.env"

if (Test-Path $envPath) {
    Write-Host "  ✅ .env file exists" -ForegroundColor Green
    
    # Check if ENCRYPTION_KEY already exists
    $envContent = Get-Content $envPath -Raw
    if ($envContent -match "ENCRYPTION_KEY=") {
        Write-Host "  ⚠️  ENCRYPTION_KEY already exists in .env" -ForegroundColor Yellow
        $replace = Read-Host "  Do you want to replace it? (y/N)"
        if ($replace -eq "y" -or $replace -eq "Y") {
            $envContent = $envContent -replace "ENCRYPTION_KEY=.*", "ENCRYPTION_KEY=$encryptionKey"
            Set-Content -Path $envPath -Value $envContent
            Write-Host "  ✅ Updated ENCRYPTION_KEY in .env" -ForegroundColor Green
        }
        else {
            Write-Host "  ⏭️  Skipped updating ENCRYPTION_KEY" -ForegroundColor Gray
        }
    }
    else {
        # Add ENCRYPTION_KEY
        Add-Content -Path $envPath -Value "`nENCRYPTION_KEY=$encryptionKey"
        Write-Host "  ✅ Added ENCRYPTION_KEY to .env" -ForegroundColor Green
    }
}
else {
    Write-Host "  ⚠️  .env file not found" -ForegroundColor Yellow
    Write-Host "  Creating .env from .env.example..." -ForegroundColor Yellow
    
    if (Test-Path "apps\api\.env.example") {
        Copy-Item "apps\api\.env.example" -Destination $envPath
        $envContent = Get-Content $envPath -Raw
        $envContent = $envContent -replace "ENCRYPTION_KEY=.*", "ENCRYPTION_KEY=$encryptionKey"
        Set-Content -Path $envPath -Value $envContent
        Write-Host "  ✅ Created .env with encryption key" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ .env.example not found" -ForegroundColor Red
        Write-Host "  Please create .env manually and add:" -ForegroundColor Yellow
        Write-Host "  ENCRYPTION_KEY=$encryptionKey" -ForegroundColor Gray
    }
}
Write-Host ""

# Step 3: Create uploads directory
Write-Host "[3/4] Creating uploads directory..." -ForegroundColor Yellow
$uploadsPath = "apps\api\uploads"

if (-not (Test-Path $uploadsPath)) {
    New-Item -ItemType Directory -Path $uploadsPath | Out-Null
    New-Item -ItemType Directory -Path "$uploadsPath\profiles" | Out-Null
    New-Item -ItemType Directory -Path "$uploadsPath\documents" | Out-Null
    Write-Host "  ✅ Created uploads directory structure" -ForegroundColor Green
}
else {
    Write-Host "  ✅ Uploads directory already exists" -ForegroundColor Green
}
Write-Host ""

# Step 4: Display summary
Write-Host "[4/4] Setup Summary" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ENCRYPTION KEY (Save this securely!)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host $encryptionKey -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT:" -ForegroundColor Yellow
Write-Host "1. This key is saved in apps/api/.env" -ForegroundColor White
Write-Host "2. NEVER commit this key to Git" -ForegroundColor White
Write-Host "3. Use different keys for dev/staging/production" -ForegroundColor White
Write-Host "4. Backup this key securely" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Restart API server:" -ForegroundColor White
Write-Host "   cd apps/api && npm run start:dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test encryption service:" -ForegroundColor White
Write-Host "   See: docs/security/PHASE-2-IMPLEMENTATION-COMPLETE.md" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test file upload:" -ForegroundColor White
Write-Host "   POST http://localhost:8080/upload/file" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Update entities to use encryption" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Phase-2 Security Setup Complete!" -ForegroundColor Green
Write-Host ""
