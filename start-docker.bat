@echo off
title VulnScanner Docker Launcher
color 0A

echo.
echo ========================================
echo    VULN SCANNER - Docker Mode
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo.
    echo Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

echo [1/5] Stopping existing containers...
docker-compose down 2>nul

echo [2/5] Building Docker images...
docker-compose build --no-cache

echo [3/5] Starting services...
docker-compose up -d

echo [4/5] Waiting for services to start...
timeout /t 25 /nobreak >nul

echo [5/5] Verifying services...
echo.

docker-compose ps

echo.
echo ========================================
echo    System Status
echo ========================================

REM Check if services are running
docker exec vuln-scanner-mysql mysqladmin ping -h localhost -u root -prootpassword >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MySQL: RUNNING
) else (
    echo [!!] MySQL: FAILED
)

curl -s http://localhost:8080/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Rust API: RUNNING
) else (
    echo [!!] Rust API: FAILED
)

curl -s http://localhost:8081/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Go Port Scanner: RUNNING
) else (
    echo [!!] Go Port Scanner: FAILED
)

curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend: RUNNING
) else (
    echo [!!] Frontend: FAILED
)

echo.
echo ========================================
echo    Opening Browser...
echo ========================================
echo.

timeout /t 3 /nobreak >nul
start http://localhost:3000/scan

echo VulnScanner is now running!
echo.
echo Application URL: http://localhost:3000/scan
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.
pause