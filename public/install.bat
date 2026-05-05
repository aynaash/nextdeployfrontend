@echo off
echo ===========================================
echo  Installing NextDeploy CLI for Windows...
echo ===========================================

set "REPO=aynaash/NextDeploy"
set "BIN_NAME=nextdeploy.exe"
set "INSTALL_DIR=%USERPROFILE%\.nextdeploy\bin"

:: Create install directory if it doesn't exist
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

:: Use PowerShell to fetch the latest release tag
for /f "delims=" %%I in ('powershell -Command "$response = Invoke-RestMethod -Uri 'https://api.github.com/repos/aynaash/NextDeploy/releases/latest'; $response.tag_name"') do set "LATEST_TAG=%%I"

if "%LATEST_TAG%"=="" (
    echo Could not fetch latest release. Please verify your internet connection or GitHub API limits.
    exit /b 1
)

echo Latest Version: %LATEST_TAG%

:: Strip leading 'v' from tag for archive naming (e.g. v0.6.2 -> 0.6.2)
set "CLEAN_VERSION=%LATEST_TAG:~1%"

:: GoReleaser archive name: nextdeploy_VERSION_windows_amd64.zip
set "ARCHIVE_NAME=nextdeploy_%CLEAN_VERSION%_windows_amd64.zip"
set "ARCHIVE_URL=https://github.com/%REPO%/releases/download/%LATEST_TAG%/%ARCHIVE_NAME%"
set "TMP_ZIP=%TEMP%\%ARCHIVE_NAME%"

echo Downloading %ARCHIVE_NAME%...
powershell -Command "Invoke-WebRequest -Uri '%ARCHIVE_URL%' -OutFile '%TMP_ZIP%'"

if not exist "%TMP_ZIP%" (
    echo Error: Download failed. Could not download %ARCHIVE_NAME%.
    exit /b 1
)

echo Extracting...
powershell -Command "Expand-Archive -Path '%TMP_ZIP%' -DestinationPath '%INSTALL_DIR%' -Force"
del "%TMP_ZIP%"

if exist "%INSTALL_DIR%\%BIN_NAME%" (
    echo ===========================================
    echo [SUCCESS] NextDeploy CLI installed successfully!
    echo Installed to: %INSTALL_DIR%\%BIN_NAME%
    
    :: Add to PATH using PowerShell so it persists
    powershell -Command "$p = [Environment]::GetEnvironmentVariable('PATH', 'User'); if ($p -notmatch [regex]::Escape('%INSTALL_DIR%')) { [Environment]::SetEnvironmentVariable('PATH', $p + ';%INSTALL_DIR%', 'User'); Write-Host 'Added to PATH.' }"
    
    echo Please restart your terminal to use 'nextdeploy'.
    echo ===========================================
) else (
    echo [ERROR] Installation failed. Could not find extracted executable.
    exit /b 1
)
