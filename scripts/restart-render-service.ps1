# Render Service Restart Script
# This script restarts your Render service using the Render API

$RENDER_API_KEY = "rnd_OE432G9TGcRdp0JRcMxdPEWSrVST"
$SERVICE_ID = "YOUR_SERVICE_ID_HERE"  # You need to get this from Render dashboard

# Restart the service
$headers = @{
    "Authorization" = "Bearer $RENDER_API_KEY"
    "Content-Type"  = "application/json"
}

Write-Host "🔄 Restarting Render service..."

try {
    $response = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$SERVICE_ID/restart" -Method Post -Headers $headers
    Write-Host "✅ Service restart initiated successfully!"
    Write-Host "⏳ Wait 2-3 minutes for the service to restart..."
}
catch {
    Write-Host "❌ Error: $_"
    Write-Host ""
    Write-Host "💡 To get your SERVICE_ID:"
    Write-Host "   1. Go to https://dashboard.render.com"
    Write-Host "   2. Click on your backend service"
    Write-Host "   3. Look at the URL - it will be like: https://dashboard.render.com/web/srv-XXXXX"
    Write-Host "   4. The SERVICE_ID is the 'srv-XXXXX' part"
}
