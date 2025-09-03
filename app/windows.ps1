# Install NextDeploy CLI (Windows) → %USERPROFILE%\bin
$ErrorActionPreference = "Stop"

# Ensure bin directory exists
$binDir = "$env:USERPROFILE\bin"
if (!(Test-Path $binDir)) {
    New-Item -ItemType Directory -Path $binDir | Out-Null
}

# Fetch latest release tag from GitHub
$version = (Invoke-RestMethod -Uri "https://api.github.com/repos/aynaash/NextDeploy/releases/latest").tag_name
$arch = if ([System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture -eq "X64") { "amd64" } else { "arm64" }

# Download binary
$downloadUrl = "https://github.com/aynaash/NextDeploy/releases/download/$version/nextdeploy-windows-$arch.exe"
$targetPath = "$binDir\nextdeploy.exe"
Invoke-WebRequest -Uri $downloadUrl -OutFile $targetPath

# Add binDir to PATH if not already present
$oldPath = [Environment]::GetEnvironmentVariable("Path", "User")
if (-not ($oldPath -split ";" | Where-Object { $_ -eq $binDir })) {
    [Environment]::SetEnvironmentVariable("Path", "$oldPath;$binDir", "User")
}

Write-Output "✅ NextDeploy installed at $targetPath"
Write-Output "👉 Open a new terminal and run: nextdeploy --version"
