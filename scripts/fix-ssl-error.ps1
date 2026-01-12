# Fix SSL Protocol Error by clearing browser HSTS cache
# This script helps resolve ERR_SSL_PROTOCOL_ERROR for localhost

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  SSL Protocol Error Fix for Localhost" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "ISSUE DETECTED:" -ForegroundColor Yellow
Write-Host "Your browser is forcing HTTPS on localhost due to HSTS cache." -ForegroundColor White
Write-Host ""

Write-Host "SOLUTION:" -ForegroundColor Green
Write-Host "You need to clear the HSTS cache for 'localhost' in your browser." -ForegroundColor White
Write-Host ""

Write-Host "STEPS TO FIX:" -ForegroundColor Cyan
Write-Host ""

Write-Host "For Chrome/Edge:" -ForegroundColor Yellow
Write-Host "  1. Open a new tab and navigate to:" -ForegroundColor White
Write-Host "     chrome://net-internals/#hsts" -ForegroundColor Gray
Write-Host "     (For Edge use: edge://net-internals/#hsts)" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Scroll down to 'Delete domain security policies'" -ForegroundColor White
Write-Host ""
Write-Host "  3. Enter: localhost" -ForegroundColor White
Write-Host ""
Write-Host "  4. Click 'Delete'" -ForegroundColor White
Write-Host ""
Write-Host "  5. Close that tab" -ForegroundColor White
Write-Host ""

Write-Host "For Firefox:" -ForegroundColor Yellow
Write-Host "  1. Close Firefox completely" -ForegroundColor White
Write-Host "  2. Press Win+R and paste:" -ForegroundColor White
Write-Host "     %APPDATA%\Mozilla\Firefox\Profiles\" -ForegroundColor Gray
Write-Host "  3. Find and delete: SiteSecurityServiceState.txt" -ForegroundColor White
Write-Host "  4. Restart Firefox" -ForegroundColor White
Write-Host ""

Write-Host "ALTERNATIVE (Quick Test):" -ForegroundColor Cyan
Write-Host "  Open an Incognito/Private window (Ctrl+Shift+N)" -ForegroundColor White
Write-Host "  Navigate to: http://localhost:3000/login" -ForegroundColor White
Write-Host "  (Make sure to type 'http://' explicitly!)" -ForegroundColor Gray
Write-Host ""

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "After clearing HSTS, navigate to:" -ForegroundColor Green
Write-Host "  http://localhost:3000/login" -ForegroundColor Yellow
Write-Host ""
Write-Host "Login Credentials:" -ForegroundColor Green
Write-Host "  Email: admin@psci.in" -ForegroundColor Yellow
Write-Host "  Password: Admin@123" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Attempt to open Chrome HSTS settings (may not work in all environments)
$chromeHstsUrl = "chrome://net-internals/#hsts"
Write-Host "Attempting to open Chrome HSTS settings..." -ForegroundColor Cyan

try {
    Start-Process "chrome.exe" -ArgumentList $chromeHstsUrl -ErrorAction SilentlyContinue
    Write-Host "✓ Opened Chrome HSTS settings" -ForegroundColor Green
} catch {
    Write-Host "✗ Could not auto-open Chrome. Please open manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
