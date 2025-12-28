# Security Log Monitoring Script
# Monitors database logs for suspicious activity and hacker attempts

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Security Log Monitor" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if database container is running
$container = docker ps --filter "name=psci_postgres" --format "{{.Names}}"
if (-not $container) {
    Write-Host "ERROR: Database container not running" -ForegroundColor Red
    Write-Host "Start it with: docker-compose up -d postgres" -ForegroundColor Yellow
    exit 1
}

Write-Host "Monitoring database: $container" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Gray
Write-Host ""

# Function to analyze log entry
function Analyze-LogEntry {
    param($line)
    
    # Failed authentication attempts (HACKER ALERT!)
    if ($line -match "FATAL.*authentication failed") {
        Write-Host "[SECURITY ALERT] Failed login attempt detected!" -ForegroundColor Red
        Write-Host "  $line" -ForegroundColor Red
        return $true
    }
    
    # Connection from unknown IP (SUSPICIOUS)
    if ($line -match "connection received.*host=(?!172\.25\.|127\.0\.0\.1)") {
        Write-Host "[WARNING] Connection from unknown IP!" -ForegroundColor Yellow
        Write-Host "  $line" -ForegroundColor Yellow
        return $true
    }
    
    # Too many connections (DoS ATTACK?)
    if ($line -match "too many connections") {
        Write-Host "[SECURITY ALERT] Possible DoS attack - too many connections!" -ForegroundColor Red
        Write-Host "  $line" -ForegroundColor Red
        return $true
    }
    
    # Long-running queries (SUSPICIOUS)
    if ($line -match "duration: [0-9]{4,}") {
        Write-Host "[WARNING] Long-running query detected (potential attack)" -ForegroundColor Yellow
        Write-Host "  $line" -ForegroundColor Yellow
        return $true
    }
    
    # Database errors (POTENTIAL ATTACK)
    if ($line -match "ERROR|PANIC") {
        Write-Host "[WARNING] Database error detected" -ForegroundColor Yellow
        Write-Host "  $line" -ForegroundColor Yellow
        return $true
    }
    
    # Successful connections (NORMAL)
    if ($line -match "connection authorized") {
        Write-Host "[INFO] Authorized connection" -ForegroundColor Green
        Write-Host "  $line" -ForegroundColor Gray
        return $true
    }
    
    return $false
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Live Security Monitoring" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Monitor logs in real-time
Write-Host "Monitoring for security events..." -ForegroundColor Yellow
Write-Host ""

try {
    # Get recent logs first
    Write-Host "[Checking recent logs...]" -ForegroundColor Cyan
    Write-Host ""
    
    $recentLogs = docker logs --tail 50 psci_postgres 2>&1
    $alertCount = 0
    $warningCount = 0
    $infoCount = 0
    
    foreach ($line in $recentLogs) {
        if ($line -match "FATAL.*authentication failed") {
            $alertCount++
            Write-Host "[ALERT] Failed authentication: $line" -ForegroundColor Red
        }
        elseif ($line -match "connection authorized") {
            $infoCount++
        }
        elseif ($line -match "ERROR") {
            $warningCount++
            Write-Host "[WARNING] Error: $line" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "Recent Activity Summary:" -ForegroundColor Cyan
    Write-Host "  Security Alerts: $alertCount" -ForegroundColor $(if ($alertCount -gt 0) { "Red" } else { "Green" })
    Write-Host "  Warnings: $warningCount" -ForegroundColor $(if ($warningCount -gt 0) { "Yellow" } else { "Green" })
    Write-Host "  Normal Connections: $infoCount" -ForegroundColor Green
    Write-Host ""
    
    if ($alertCount -eq 0 -and $warningCount -eq 0) {
        Write-Host "No security threats detected!" -ForegroundColor Green
    }
    else {
        Write-Host "Review alerts above for potential security issues" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Continuous Monitoring (Press Ctrl+C to stop)" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Follow logs in real-time
    docker logs -f --tail 0 psci_postgres 2>&1 | ForEach-Object {
        Analyze-LogEntry $_
    }
    
}
catch {
    Write-Host ""
    Write-Host "Monitoring stopped." -ForegroundColor Yellow
}
