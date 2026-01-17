Write-Host "Checking Docker status..."

# Function to check if Docker is responsive
function Test-Docker {
    $ErrorActionPreference = "SilentlyContinue"
    docker ps -n 1 2>&1 | Out-Null
    return $?
}

# Check and Start Docker if needed
if (-not (Test-Docker)) {
    Write-Host "Docker is not running or not responsive." -ForegroundColor Yellow
    $dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    
    if (Test-Path $dockerPath) {
        Write-Host "Attempting to start Docker Desktop..."
        Start-Process $dockerPath
        
        Write-Host "Waiting for Docker to initialize (max 60s)..."
        $retry = 0
        while (-not (Test-Docker) -and $retry -lt 30) {
            Write-Host "." -NoNewline
            Start-Sleep -Seconds 2
            $retry++
        }
        Write-Host ""
        
        if (-not (Test-Docker)) {
            Write-Host "FATAL: Could not start Docker automatically. Please open Docker Desktop manually and wait for the engine to start." -ForegroundColor Red
            exit 1
        }
        else {
            Write-Host "Docker started successfully!" -ForegroundColor Green
        }
    }
    else {
        Write-Host "FATAL: Docker Desktop not found at $dockerPath. Please start Docker manually." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Stopping all Node.js processes..."
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

Write-Host "Starting Database (Docker)..."
docker-compose up -d

Write-Host "Waiting for database to be ready..."
Start-Sleep -Seconds 5

Write-Host "Configuring Environment..."
# Set Frontend to use API on port 4000
$envContent = "NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`r`nJWT_SECRET=683abb93b3e8a5002e6a8213151095228bddb8c4105d65e7bc4ccdcf258a3fec"
$envContent | Out-File -FilePath "apps\web\.env.local" -Encoding utf8

Write-Host "Starting Backend (API) on Port 4000..."
# Start API with PORT=4000
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd apps/api; `$env:PORT='4000'; npm run start:dev" -WorkingDirectory $PSScriptRoot -WindowStyle Normal

Write-Host "Starting Frontend (Web)..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd apps/web; npm run dev" -WorkingDirectory $PSScriptRoot -WindowStyle Normal

Write-Host "Services started!" -ForegroundColor Green
Write-Host "API: http://localhost:4000/api/v1/health"
Write-Host "Web: http://localhost:3000"
