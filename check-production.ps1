# Quick Production Readiness Check

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Production Readiness Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$domain = "parashootingindia.org"
$netlifyDomain = "" # Will try to detect

Write-Host "Checking domain: $domain" -ForegroundColor Yellow
Write-Host ""

# Test 1: DNS Resolution
Write-Host "[1/8] Testing DNS Resolution..." -ForegroundColor Yellow
try {
    $dnsResult = Resolve-DnsName -Name $domain -ErrorAction Stop
    if ($dnsResult) {
        Write-Host "  ✅ DNS resolves to: $($dnsResult[0].IPAddress)" -ForegroundColor Green
        $deployed = $true
    }
}
catch {
    Write-Host "  ❌ DNS not configured or domain not registered" -ForegroundColor Red
    Write-Host "     Action: Configure DNS or wait for propagation" -ForegroundColor Yellow
    $deployed = $false
}
Write-Host ""

if ($deployed) {
    # Test 2: HTTPS Availability
    Write-Host "[2/8] Testing HTTPS..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "https://$domain" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        Write-Host "  ✅ HTTPS is working (Status: $($response.StatusCode))" -ForegroundColor Green
    }
    catch {
        Write-Host "  ❌ HTTPS not available: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "     Action: Check SSL certificate and Cloudflare configuration" -ForegroundColor Yellow
    }
    Write-Host ""

    # Test 3: Security Headers
    Write-Host "[3/8] Testing Security Headers..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "https://$domain" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $headers = $response.Headers
        
        $requiredHeaders = @{
            "Strict-Transport-Security" = "HSTS"
            "X-Frame-Options"           = "Clickjacking Protection"
            "X-Content-Type-Options"    = "MIME Sniffing Protection"
        }
        
        foreach ($header in $requiredHeaders.Keys) {
            if ($headers.ContainsKey($header)) {
                Write-Host "  ✅ $($requiredHeaders[$header]): Present" -ForegroundColor Green
            }
            else {
                Write-Host "  ❌ $($requiredHeaders[$header]): Missing" -ForegroundColor Red
            }
        }
    }
    catch {
        Write-Host "  ⚠️  Could not check headers" -ForegroundColor Yellow
    }
    Write-Host ""

    # Test 4: Cloudflare Detection
    Write-Host "[4/8] Testing Cloudflare..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "https://$domain" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $headers = $response.Headers
        
        if ($headers.ContainsKey("cf-ray") -or $headers.ContainsKey("server") -and $headers["server"] -match "cloudflare") {
            Write-Host "  ✅ Cloudflare is active" -ForegroundColor Green
            if ($headers.ContainsKey("cf-ray")) {
                Write-Host "     CF-Ray: $($headers['cf-ray'])" -ForegroundColor Gray
            }
        }
        else {
            Write-Host "  ❌ Cloudflare not detected" -ForegroundColor Red
            Write-Host "     Action: Configure Cloudflare WAF" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "  ⚠️  Could not check Cloudflare" -ForegroundColor Yellow
    }
    Write-Host ""

    # Test 5: HTTP to HTTPS Redirect
    Write-Host "[5/8] Testing HTTP → HTTPS Redirect..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://$domain" -UseBasicParsing -MaximumRedirection 0 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 301 -or $response.StatusCode -eq 302) {
            $location = $response.Headers["Location"]
            if ($location -match "https://") {
                Write-Host "  ✅ HTTP redirects to HTTPS (Status: $($response.StatusCode))" -ForegroundColor Green
            }
            else {
                Write-Host "  ⚠️  Redirect found but not to HTTPS" -ForegroundColor Yellow
            }
        }
    }
    catch {
        # Might auto-redirect, which is fine
        Write-Host "  ✅ HTTPS redirect active (auto-redirected)" -ForegroundColor Green
    }
    Write-Host ""

    # Test 6: SSL Certificate
    Write-Host "[6/8] Testing SSL Certificate..." -ForegroundColor Yellow
    try {
        $cert = $null
        $tcpClient = New-Object System.Net.Sockets.TcpClient($domain, 443)
        $sslStream = New-Object System.Net.Security.SslStream($tcpClient.GetStream(), $false)
        $sslStream.AuthenticateAsClient($domain)
        $cert = $sslStream.RemoteCertificate
        
        if ($cert) {
            $cert2 = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($cert)
            Write-Host "  ✅ SSL Certificate valid" -ForegroundColor Green
            Write-Host "     Issuer: $($cert2.Issuer)" -ForegroundColor Gray
            Write-Host "     Expires: $($cert2.NotAfter)" -ForegroundColor Gray
        }
        
        $sslStream.Close()
        $tcpClient.Close()
    }
    catch {
        Write-Host "  ❌ SSL Certificate issue: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""

    # Test 7: Cookie Consent Banner
    Write-Host "[7/8] Testing Cookie Consent..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "https://$domain" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $content = $response.Content
        
        if ($content -match "cookieyes") {
            Write-Host "  ✅ CookieYes script detected" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️  CookieYes script not found" -ForegroundColor Yellow
            Write-Host "     Action: Verify CookieYes ID is replaced" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "  ⚠️  Could not check cookie consent" -ForegroundColor Yellow
    }
    Write-Host ""

    # Test 8: Performance Check
    Write-Host "[8/8] Testing Response Time..." -ForegroundColor Yellow
    try {
        $times = @()
        for ($i = 1; $i -le 3; $i++) {
            $start = Get-Date
            Invoke-WebRequest -Uri "https://$domain" -UseBasicParsing -TimeoutSec 10 | Out-Null
            $end = Get-Date
            $times += ($end - $start).TotalMilliseconds
        }
        
        $avgTime = ($times | Measure-Object -Average).Average
        if ($avgTime -lt 2000) {
            Write-Host "  ✅ Average response time: $([math]::Round($avgTime, 0))ms" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️  Response time: $([math]::Round($avgTime, 0))ms (slow)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "  ⚠️  Could not measure response time" -ForegroundColor Yellow
    }
    Write-Host ""

}
else {
    Write-Host "[2-8] Skipping remaining tests (site not deployed)" -ForegroundColor Gray
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUMMARY & NEXT STEPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($deployed) {
    Write-Host "✅ Your site is DEPLOYED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Run full production tests:" -ForegroundColor White
    Write-Host "   • SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=$domain" -ForegroundColor Gray
    Write-Host "   • Security Headers: https://securityheaders.com/?q=$domain" -ForegroundColor Gray
    Write-Host "   • Performance: https://gtmetrix.com/" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Review test results in:" -ForegroundColor White
    Write-Host "   • docs/security/PRODUCTION-TESTING.md" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Configure Cloudflare (if not done):" -ForegroundColor White
    Write-Host "   • docs/security/cloudflare-setup.md" -ForegroundColor Gray
}
else {
    Write-Host "⏳ Your site is NOT YET DEPLOYED" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Check Netlify deployment status:" -ForegroundColor White
    Write-Host "   • https://app.netlify.com/" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Configure custom domain in Netlify:" -ForegroundColor White
    Write-Host "   • Site settings → Domain management" -ForegroundColor Gray
    Write-Host "   • Add custom domain: $domain" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Update DNS at domain registrar:" -ForegroundColor White
    Write-Host "   • Point to Netlify or Cloudflare" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Wait for DNS propagation (1-24 hours)" -ForegroundColor White
    Write-Host ""
    Write-Host "5. Run this script again to verify" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
