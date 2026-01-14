# Lint Cleanup Script
# Run this to see detailed linting errors and fix auto-fixable issues

Write-Host "=== Linting Technical Debt Cleanup ===" -ForegroundColor Cyan
Write-Host ""

# Change to API directory
Set-Location -Path "apps/api"

Write-Host "Step 1: Running ESLint with auto-fix..." -ForegroundColor Yellow
npx eslint "src/**/*.ts" "test/**/*.ts" --fix

Write-Host ""
Write-Host "Step 2: Generating error report..." -ForegroundColor Yellow
npx eslint "src/**/*.ts" "test/**/*.ts" --quiet > ../../lint_errors.txt 2>&1

Write-Host ""
Write-Host "Step 3: Counting remaining errors..." -ForegroundColor Yellow
$errorCount = (Get-Content ../../lint_errors.txt | Select-String -Pattern "^\s+\d+:\d+\s+error" | Measure-Object).Count
$warningCount = (Get-Content ../../lint_errors.txt | Select-String -Pattern "^\s+\d+:\d+\s+warning" | Measure-Object).Count

Write-Host ""
Write-Host "=== Results ===" -ForegroundColor Cyan
Write-Host "Errors: $errorCount" -ForegroundColor $(if ($errorCount -eq 0) { "Green" } else { "Red" })
Write-Host "Warnings: $warningCount" -ForegroundColor $(if ($warningCount -eq 0) { "Green" } else { "Yellow" })

Write-Host ""
Write-Host "Full report saved to: lint_errors.txt" -ForegroundColor Gray

# Return to root
Set-Location -Path "../.."
