$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (Get-NetTCPConnection -LocalPort 4321 -State Listen -ErrorAction SilentlyContinue) {
    Write-Host 'Website already running at http://127.0.0.1:4321'
    exit
}
if (-not (Test-Path 'node_modules/astro/bin/astro.mjs')) {
    & npm.cmd ci
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
}
& node.exe scripts/setup-local.mjs
if ($LASTEXITCODE -ne 0) { throw 'Local database setup failed.' }
New-Item -ItemType Directory -Force '.local' | Out-Null
$process = Start-Process -FilePath (Get-Command node.exe).Source -ArgumentList 'node_modules/astro/bin/astro.mjs','dev','--host','127.0.0.1','--port','4321' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput '.local/server.log' -RedirectStandardError '.local/server-error.log'
$process.Id | Set-Content '.local/server.pid'
Write-Host 'Starting website at http://127.0.0.1:4321'
