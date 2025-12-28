# Complete Security Audit - Check All Threats
# Checks for: Brute force, Unknown IPs, DoS, SQL injection, Errors, Normal activity

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Complete Security Audit" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Checking all security threats..." -ForegroundColor Yellow
Write-Host ""

# Initialize counters
$threats = @{
    BruteForce  = 0
    UnknownIP   = 0
    DoS         = 0
    LongQueries = 0
    Errors      = 0
    Normal      = 0
}

# Get all logs
$allLogs = docker logs psci_postgres 2>&1

# ============================================
# CHECK 1: Failed Login Attempts (Brute Force)
# ============================================
Write-Host "[1/6] Checking for BRUTE FORCE attacks..." -ForegroundColor Yellow

$failedLogins = $allLogs | Select-String "FATAL.*authentication failed"
$threats.BruteForce = $failedLogins.Count

if ($threats.BruteForce -eq 0) {
    Write-Host "  OK: No failed login attempts detected" -ForegroundColor Green
    Write-Host "  Status: SECURE - No brute force attacks" -ForegroundColor Green
}
elseif ($threats.BruteForce -le 5) {
    Write-Host "  WARNING: $($threats.BruteForce) failed login attempts detected" -ForegroundColor Yellow
    Write-Host "  Status: MONITORING - Could be legitimate mistakes" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Recent attempts:" -ForegroundColor Gray
    $failedLogins | Select-Object -First 3 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Yellow
    }
}
else {
    Write-Host "  ALERT: $($threats.BruteForce) failed login attempts detected!" -ForegroundColor Red
    Write-Host "  Status: UNDER ATTACK - Brute force detected" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Recent attempts:" -ForegroundColor Gray
    $failedLogins | Select-Object -First 5 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Red
    }
}
Write-Host ""

# ============================================
# CHECK 2: Unknown IP Connections
# ============================================
Write-Host "[2/6] Checking for UNKNOWN IP connections..." -ForegroundColor Yellow

$unknownIPs = $allLogs | Select-String "no pg_hba.conf entry for host"
$threats.UnknownIP = $unknownIPs.Count

if ($threats.UnknownIP -eq 0) {
    Write-Host "  OK: No unknown IP connection attempts" -ForegroundColor Green
    Write-Host "  Status: SECURE - All connections from authorized IPs" -ForegroundColor Green
}
elseif ($threats.UnknownIP -le 3) {
    Write-Host "  WARNING: $($threats.UnknownIP) unknown IP attempts detected" -ForegroundColor Yellow
    Write-Host "  Status: MONITORING - Possible reconnaissance" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Blocked IPs:" -ForegroundColor Gray
    $unknownIPs | Select-Object -First 3 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Yellow
    }
}
else {
    Write-Host "  ALERT: $($threats.UnknownIP) unknown IP attempts detected!" -ForegroundColor Red
    Write-Host "  Status: UNDER ATTACK - Multiple unauthorized IPs" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Blocked IPs:" -ForegroundColor Gray
    $unknownIPs | Select-Object -First 5 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Red
    }
}
Write-Host ""

# ============================================
# CHECK 3: Too Many Connections (DoS)
# ============================================
Write-Host "[3/6] Checking for DOS attacks (connection flooding)..." -ForegroundColor Yellow

$tooManyConnections = $allLogs | Select-String "too many clients|remaining connection slots"
$threats.DoS = $tooManyConnections.Count

# Also check current connection count
try {
    $currentConnections = docker exec psci_postgres psql -U admin -t -c "SELECT count(*) FROM pg_stat_activity;" 2>$null
    $currentConnections = $currentConnections.Trim()
}
catch {
    $currentConnections = "N/A"
}

if ($threats.DoS -eq 0) {
    Write-Host "  OK: No connection flooding detected" -ForegroundColor Green
    Write-Host "  Current connections: $currentConnections" -ForegroundColor Green
    Write-Host "  Status: SECURE - Normal connection levels" -ForegroundColor Green
}
else {
    Write-Host "  ALERT: $($threats.DoS) connection overflow events detected!" -ForegroundColor Red
    Write-Host "  Current connections: $currentConnections" -ForegroundColor Red
    Write-Host "  Status: POSSIBLE DOS ATTACK" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Events:" -ForegroundColor Gray
    $tooManyConnections | Select-Object -First 3 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Red
    }
}
Write-Host ""

# ============================================
# CHECK 4: Long-Running Queries (SQL Injection)
# ============================================
Write-Host "[4/6] Checking for LONG-RUNNING queries (SQL injection)..." -ForegroundColor Yellow

# Check for queries that took more than 10 seconds (10000ms)
$longQueries = $allLogs | Select-String "duration: [0-9]{5,}" 
$threats.LongQueries = $longQueries.Count

# Also check for SQL injection patterns
$sqlInjection = $allLogs | Select-String "DROP|DELETE.*FROM|UNION.*SELECT|OR.*1.*=.*1|--"
$injectionAttempts = $sqlInjection.Count

if ($threats.LongQueries -eq 0 -and $injectionAttempts -eq 0) {
    Write-Host "  OK: No long-running queries detected" -ForegroundColor Green
    Write-Host "  OK: No SQL injection patterns detected" -ForegroundColor Green
    Write-Host "  Status: SECURE - All queries normal" -ForegroundColor Green
}
else {
    if ($threats.LongQueries -gt 0) {
        Write-Host "  WARNING: $($threats.LongQueries) long-running queries detected" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  Slow queries:" -ForegroundColor Gray
        $longQueries | Select-Object -First 3 | ForEach-Object {
            Write-Host "    $_" -ForegroundColor Yellow
        }
    }
    if ($injectionAttempts -gt 0) {
        Write-Host "  ALERT: $injectionAttempts SQL injection patterns detected!" -ForegroundColor Red
        Write-Host "  Status: POSSIBLE SQL INJECTION ATTACK" -ForegroundColor Red
        Write-Host ""
        Write-Host "  Suspicious queries:" -ForegroundColor Gray
        $sqlInjection | Select-Object -First 3 | ForEach-Object {
            Write-Host "    $_" -ForegroundColor Red
        }
    }
}
Write-Host ""

# ============================================
# CHECK 5: Database Errors
# ============================================
Write-Host "[5/6] Checking for DATABASE ERRORS..." -ForegroundColor Yellow

$errors = $allLogs | Select-String "ERROR|PANIC"
$threats.Errors = $errors.Count

if ($threats.Errors -eq 0) {
    Write-Host "  OK: No database errors detected" -ForegroundColor Green
    Write-Host "  Status: HEALTHY - Database running smoothly" -ForegroundColor Green
}
elseif ($threats.Errors -le 5) {
    Write-Host "  WARNING: $($threats.Errors) errors detected" -ForegroundColor Yellow
    Write-Host "  Status: REVIEW NEEDED - Minor issues" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Recent errors:" -ForegroundColor Gray
    $errors | Select-Object -First 3 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Yellow
    }
}
else {
    Write-Host "  ALERT: $($threats.Errors) errors detected!" -ForegroundColor Red
    Write-Host "  Status: CRITICAL - Multiple errors" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Recent errors:" -ForegroundColor Gray
    $errors | Select-Object -First 5 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Red
    }
}
Write-Host ""

# ============================================
# CHECK 6: Normal Activity
# ============================================
Write-Host "[6/6] Checking NORMAL activity..." -ForegroundColor Yellow

$normalConnections = $allLogs | Select-String "connection authorized"
$threats.Normal = $normalConnections.Count

if ($threats.Normal -gt 0) {
    Write-Host "  OK: $($threats.Normal) normal connections detected" -ForegroundColor Green
    Write-Host "  Status: ACTIVE - Application running normally" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Recent connections:" -ForegroundColor Gray
    $normalConnections | Select-Object -Last 3 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor Green
    }
}
else {
    Write-Host "  WARNING: No normal connections detected" -ForegroundColor Yellow
    Write-Host "  Status: IDLE - No recent activity" -ForegroundColor Yellow
}
Write-Host ""

# ============================================
# SUMMARY
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Security Audit Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Calculate threat level
$totalThreats = $threats.BruteForce + $threats.UnknownIP + $threats.DoS + $threats.LongQueries + $threats.Errors
$threatLevel = if ($totalThreats -eq 0) { "SECURE" } 
elseif ($totalThreats -le 5) { "LOW RISK" }
elseif ($totalThreats -le 15) { "MEDIUM RISK" }
else { "HIGH RISK" }

$threatColor = if ($totalThreats -eq 0) { "Green" }
elseif ($totalThreats -le 5) { "Yellow" }
else { "Red" }

# Display summary table
Write-Host "Threat Type                    Count    Status" -ForegroundColor White
Write-Host "--------------------------------------------" -ForegroundColor Gray
Write-Host "Brute Force Attacks            $($threats.BruteForce.ToString().PadLeft(5))    $(if ($threats.BruteForce -eq 0) { 'OK' } elseif ($threats.BruteForce -le 5) { 'WARN' } else { 'ALERT' })" -ForegroundColor $(if ($threats.BruteForce -eq 0) { "Green" } elseif ($threats.BruteForce -le 5) { "Yellow" } else { "Red" })
Write-Host "Unknown IP Connections         $($threats.UnknownIP.ToString().PadLeft(5))    $(if ($threats.UnknownIP -eq 0) { 'OK' } elseif ($threats.UnknownIP -le 3) { 'WARN' } else { 'ALERT' })" -ForegroundColor $(if ($threats.UnknownIP -eq 0) { "Green" } elseif ($threats.UnknownIP -le 3) { "Yellow" } else { "Red" })
Write-Host "DoS Attacks (Flooding)         $($threats.DoS.ToString().PadLeft(5))    $(if ($threats.DoS -eq 0) { 'OK' } else { 'ALERT' })" -ForegroundColor $(if ($threats.DoS -eq 0) { "Green" } else { "Red" })
Write-Host "Long Queries (SQL Injection)   $($threats.LongQueries.ToString().PadLeft(5))    $(if ($threats.LongQueries -eq 0) { 'OK' } else { 'WARN' })" -ForegroundColor $(if ($threats.LongQueries -eq 0) { "Green" } else { "Yellow" })
Write-Host "Database Errors                $($threats.Errors.ToString().PadLeft(5))    $(if ($threats.Errors -eq 0) { 'OK' } elseif ($threats.Errors -le 5) { 'WARN' } else { 'ALERT' })" -ForegroundColor $(if ($threats.Errors -eq 0) { "Green" } elseif ($threats.Errors -le 5) { "Yellow" } else { "Red" })
Write-Host "Normal Activity                $($threats.Normal.ToString().PadLeft(5))    $(if ($threats.Normal -gt 0) { 'OK' } else { 'IDLE' })" -ForegroundColor $(if ($threats.Normal -gt 0) { "Green" } else { "Yellow" })
Write-Host ""

# Overall status
Write-Host "Total Threats Detected: $totalThreats" -ForegroundColor $threatColor
Write-Host "Threat Level: $threatLevel" -ForegroundColor $threatColor
Write-Host ""

# Security grade
if ($totalThreats -eq 0) {
    Write-Host "Security Status: EXCELLENT" -ForegroundColor Green
    Write-Host "Your database is SECURE with NO threats detected!" -ForegroundColor Green
}
elseif ($totalThreats -le 5) {
    Write-Host "Security Status: GOOD" -ForegroundColor Yellow
    Write-Host "Minor issues detected. Review warnings above." -ForegroundColor Yellow
}
elseif ($totalThreats -le 15) {
    Write-Host "Security Status: CONCERNING" -ForegroundColor Yellow
    Write-Host "Multiple threats detected. Take action immediately." -ForegroundColor Yellow
}
else {
    Write-Host "Security Status: CRITICAL" -ForegroundColor Red
    Write-Host "UNDER ATTACK! Review all alerts and take immediate action!" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Recommendations" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Provide recommendations based on findings
if ($threats.BruteForce -gt 0) {
    Write-Host "Brute Force:" -ForegroundColor Yellow
    Write-Host "  - IPs will be auto-blocked after 5 attempts" -ForegroundColor White
    Write-Host "  - Consider changing database password" -ForegroundColor White
    Write-Host "  - Review blocked IPs in logs" -ForegroundColor White
    Write-Host ""
}

if ($threats.UnknownIP -gt 0) {
    Write-Host "Unknown IPs:" -ForegroundColor Yellow
    Write-Host "  - All connections are being blocked by pg_hba.conf" -ForegroundColor White
    Write-Host "  - Review IP addresses in logs" -ForegroundColor White
    Write-Host "  - Add legitimate IPs to whitelist if needed" -ForegroundColor White
    Write-Host ""
}

if ($threats.DoS -gt 0) {
    Write-Host "DoS Attack:" -ForegroundColor Red
    Write-Host "  - Kill idle connections: docker exec psci_postgres psql -c 'SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = ''idle'';'" -ForegroundColor White
    Write-Host "  - Restart database if needed: docker-compose restart postgres" -ForegroundColor White
    Write-Host "  - Block attacking IPs in firewall" -ForegroundColor White
    Write-Host ""
}

if ($threats.LongQueries -gt 0) {
    Write-Host "Long Queries:" -ForegroundColor Yellow
    Write-Host "  - Review queries for optimization" -ForegroundColor White
    Write-Host "  - Check for SQL injection patterns" -ForegroundColor White
    Write-Host "  - Queries will be auto-killed after 30 seconds" -ForegroundColor White
    Write-Host ""
}

if ($threats.Errors -gt 0) {
    Write-Host "Database Errors:" -ForegroundColor Yellow
    Write-Host "  - Review error details in logs" -ForegroundColor White
    Write-Host "  - Check application code for issues" -ForegroundColor White
    Write-Host "  - Monitor for recurring patterns" -ForegroundColor White
    Write-Host ""
}

if ($totalThreats -eq 0) {
    Write-Host "No action needed - Your database is SECURE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Continue monitoring with:" -ForegroundColor White
    Write-Host "  .\monitor-security-logs.ps1" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Audit Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Save report
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$reportFile = "security-audit-$timestamp.txt"

$report = @"
Security Audit Report
Generated: $(Get-Date)

THREAT SUMMARY:
- Brute Force Attacks: $($threats.BruteForce)
- Unknown IP Connections: $($threats.UnknownIP)
- DoS Attacks: $($threats.DoS)
- Long Queries: $($threats.LongQueries)
- Database Errors: $($threats.Errors)
- Normal Activity: $($threats.Normal)

Total Threats: $totalThreats
Threat Level: $threatLevel
Current Connections: $currentConnections

STATUS: $(if ($totalThreats -eq 0) { 'SECURE' } elseif ($totalThreats -le 5) { 'GOOD' } elseif ($totalThreats -le 15) { 'CONCERNING' } else { 'CRITICAL' })
"@

$report | Out-File $reportFile
Write-Host "Report saved to: $reportFile" -ForegroundColor Gray
Write-Host ""
