Write-Host "Stopping all Node.js processes..."
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

Write-Host "Starting Database (Docker)..."
docker-compose up -d

Write-Host "Configuring Environment..."
# Set Frontend to use API on port 4000
# We assume JWT_SECRET is needed as per previous logs, copying a standard one or keeping it simple. 
# If .env.local exists, we should probably respect it, but to ensure 4000 we overwrite.
$envContent = "NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`r`nJWT_SECRET=683abb93b3e8a5002e6a8213151095228bddb8c4105d65e7bc4ccdcf258a3fec"
$envContent | Out-File -FilePath "apps\web\.env.local" -Encoding utf8

Write-Host "Starting Backend (API) on Port 4000..."
# Start API with PORT=4000
$apiProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd apps/api; `$env:PORT='4000'; npm run start:dev" -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Normal

Write-Host "Starting Frontend (Web)..."
$webProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd apps/web; npm run dev" -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Normal

Write-Host "Services started!"
Write-Host "API: http://localhost:4000/api/v1/health"
Write-Host "Web: http://localhost:3000"
