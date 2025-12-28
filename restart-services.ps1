Write-Host "Stopping all Node.js processes..."
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

Write-Host "Starting Database (Docker)..."
docker-compose up -d

Write-Host "Starting Backend (API)..."
$apiProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd apps/api; npm run start:dev" -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Normal

Write-Host "Starting Frontend (Web)..."
$webProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd apps/web; npm run dev" -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Normal

Write-Host "Services started!"
Write-Host "API: http://localhost:8080/api/v1/health"
Write-Host "Web: http://localhost:3000"
