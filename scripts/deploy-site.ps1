param(
    [string]$Message = "Update website"
)

$ErrorActionPreference = "Stop"

Write-Host "== HK Court Availability deploy ==" -ForegroundColor Cyan

Set-Location (Split-Path -Parent $PSScriptRoot)

Write-Host ""
Write-Host "1. Checking Cloudflare Worker proxy..." -ForegroundColor Cyan

$WorkerUrl = "https://hk-court-proxy.vmflux-hk.workers.dev/health"

try {
    $health = Invoke-RestMethod $WorkerUrl -TimeoutSec 15
    if ($health.ok -ne $true) {
        throw "Worker health check returned unexpected result."
    }

    Write-Host "Worker OK: $($health.name)" -ForegroundColor Green
} catch {
    Write-Host "Worker health check failed." -ForegroundColor Red
    Write-Host $_
    exit 1
}

Write-Host ""
Write-Host "2. Building Vite app..." -ForegroundColor Cyan
npm run build

Write-Host ""
Write-Host "3. Verifying built index.html..." -ForegroundColor Cyan

$distIndex = ".\dist\index.html"

if (!(Test-Path $distIndex)) {
    throw "dist/index.html not found. Build failed or output folder missing."
}

$indexContent = Get-Content $distIndex -Raw

if ($indexContent -match "/src/main.jsx") {
    throw "Built index.html still references /src/main.jsx. Do not deploy this."
}

if ($indexContent -notmatch "/hk-court-availability/assets/") {
    throw "Built index.html does not contain expected GitHub Pages asset path."
}

Write-Host "Build output looks correct." -ForegroundColor Green

Write-Host ""
Write-Host "4. Copying dist to docs..." -ForegroundColor Cyan

Remove-Item ".\docs" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force ".\docs" | Out-Null

robocopy ".\dist" ".\docs" /MIR | Out-Host

# Robocopy exit codes 0-7 are usually success/info
if ($LASTEXITCODE -gt 7) {
    throw "Robocopy failed with exit code $LASTEXITCODE"
}

Write-Host ""
Write-Host "5. Committing and pushing..." -ForegroundColor Cyan

git add .

$status = git status --porcelain

if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
} else {
    git commit -m $Message
}

git push

Write-Host ""
Write-Host "Deploy pushed." -ForegroundColor Green
Write-Host "Open: https://msgrida.github.io/hk-court-availability/" -ForegroundColor Cyan
Write-Host "Wait 1-2 minutes, then Ctrl + F5." -ForegroundColor Cyan
