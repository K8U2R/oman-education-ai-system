# Script to kill process using port 4173
# Usage: .\scripts\kill-port.ps1

$port = 4173

Write-Host "🔍 Checking for process using port $port..." -ForegroundColor Yellow

try {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    
    if ($connection) {
        $processId = $connection.OwningProcess
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        
        if ($process) {
            Write-Host "⚠️  Found process using port $port:" -ForegroundColor Yellow
            Write-Host "   Process ID: $processId" -ForegroundColor Cyan
            Write-Host "   Process Name: $($process.ProcessName)" -ForegroundColor Cyan
            
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Process stopped successfully" -ForegroundColor Green
            
            # Wait a moment for the port to be released
            Start-Sleep -Seconds 1
        } else {
            Write-Host "ℹ️  Port $port is available" -ForegroundColor Green
        }
    } else {
        Write-Host "ℹ️  Port $port is available" -ForegroundColor Green
    }
} catch {
    Write-Host "ℹ️  Port $port is available" -ForegroundColor Green
}

