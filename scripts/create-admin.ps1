# Create Admin User via API
# This script registers an admin user and assigns the admin role

$API_URL = "http://localhost:4000/api/v1"

# Step 1: Register the admin user
Write-Host "Creating admin user..." -ForegroundColor Cyan

$registerPayload = @{
    email = "admin@psci.in"
    password = "Admin@123"
    firstName = "System"
    lastName = "Administrator"
    phone = "+91-1234567890"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/auth/register" `
        -Method POST `
        -Body $registerPayload `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "✓ User created successfully!" -ForegroundColor Green
    Write-Host "Email: admin@psci.in" -ForegroundColor Yellow
    Write-Host "Password: Admin@123" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "User Details:" -ForegroundColor Cyan
    $response.user | Format-List
    
} catch {
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "✗ Error creating user:" -ForegroundColor Red
    Write-Host $errorDetails.message -ForegroundColor Red
    
    if ($errorDetails.message -like "*already exists*") {
        Write-Host ""
        Write-Host "User already exists. You can log in with:" -ForegroundColor Yellow
        Write-Host "Email: admin@psci.in" -ForegroundColor Yellow
        Write-Host "Password: Admin@123" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Note: You may need to manually assign the 'admin' role in the database." -ForegroundColor Yellow
Write-Host "Check the create-admin-user.sql script for SQL commands." -ForegroundColor Yellow
