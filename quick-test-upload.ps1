# Quick Test Script for File Upload
# This script helps you login and test file upload

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "File Upload Quick Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:8080/api/v1"

# Step 1: Login
Write-Host "[1/3] Logging in..." -ForegroundColor Yellow
Write-Host "  Using default admin credentials" -ForegroundColor Gray

$loginBody = @{
    email    = "admin@example.com"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody

    $token = $loginResponse.access_token
    Write-Host "  OK: Login successful!" -ForegroundColor Green
    Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
}
catch {
    Write-Host "  ERROR: Login failed" -ForegroundColor Red
    Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Please check:" -ForegroundColor Yellow
    Write-Host "  1. API is running (cd apps/api && npm run start:dev)" -ForegroundColor White
    Write-Host "  2. Database is running" -ForegroundColor White
    Write-Host "  3. Admin user exists in database" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Step 2: Create test file
Write-Host "[2/3] Creating test file..." -ForegroundColor Yellow
$testFile = "test-upload.txt"
"This is a test file for upload" | Out-File $testFile -Encoding UTF8
Write-Host "  OK: Created $testFile" -ForegroundColor Green
Write-Host ""

# Step 3: Upload file
Write-Host "[3/3] Uploading file..." -ForegroundColor Yellow

try {
    # Read file
    $filePath = Resolve-Path $testFile
    $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
    $fileEnc = [System.Text.Encoding]::GetEncoding('iso-8859-1').GetString($fileBytes)
    
    # Create multipart form data
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$testFile`"",
        "Content-Type: text/plain$LF",
        $fileEnc,
        "--$boundary--$LF"
    ) -join $LF

    # Upload
    $uploadResponse = Invoke-RestMethod -Uri "$API_URL/upload/file" `
        -Method Post `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -ContentType "multipart/form-data; boundary=$boundary" `
        -Body $bodyLines

    Write-Host "  OK: File uploaded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Response:" -ForegroundColor Cyan
    Write-Host "  Message: $($uploadResponse.message)" -ForegroundColor Gray
    Write-Host "  Filename: $($uploadResponse.file.filename)" -ForegroundColor Gray
    Write-Host "  Original: $($uploadResponse.file.originalName)" -ForegroundColor Gray
    Write-Host "  Size: $($uploadResponse.file.size) bytes" -ForegroundColor Gray
    Write-Host "  Type: $($uploadResponse.file.mimetype)" -ForegroundColor Gray
    Write-Host ""
    
    # Check if file exists
    $uploadedFile = "apps\api\uploads\$($uploadResponse.file.filename)"
    if (Test-Path $uploadedFile) {
        Write-Host "  OK: File saved to: $uploadedFile" -ForegroundColor Green
    }
    else {
        Write-Host "  WARNING: File not found at: $uploadedFile" -ForegroundColor Yellow
    }
    
}
catch {
    Write-Host "  ERROR: Upload failed" -ForegroundColor Red
    Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "  Details: $($errorDetails.message)" -ForegroundColor Red
    }
}

# Cleanup
if (Test-Path $testFile) {
    Remove-Item $testFile -Force
    Write-Host ""
    Write-Host "  Cleaned up test file" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Your JWT Token (save this for manual tests):" -ForegroundColor Yellow
Write-Host $token -ForegroundColor White
Write-Host ""

Write-Host "To upload another file manually:" -ForegroundColor Yellow
Write-Host "Invoke-RestMethod -Uri '$API_URL/upload/file' \" -ForegroundColor Gray
Write-Host "  -Method Post \" -ForegroundColor Gray
Write-Host "  -Headers @{ 'Authorization' = 'Bearer $token' } \" -ForegroundColor Gray
Write-Host "  -Form @{ file = Get-Item 'yourfile.pdf' }" -ForegroundColor Gray
Write-Host ""
