@echo off
chcp 65001 >nul
title Alzikrayat - Launcher
cd /d "%~dp0"

echo ==============================================
echo   Alzikrayat - starting the project
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed. Download it from https://nodejs.org then run this file again.
  pause
  exit /b 1
)

sc query MongoDB 2>nul | find "RUNNING" >nul
if errorlevel 1 (
  echo [WARNING] The MongoDB service does not look like it is running.
  echo           If you installed MongoDB as a service, start it from services.msc.
  echo           If you use MongoDB Atlas, edit server\.env and ignore this warning.
  echo.
)

if not exist "server\.env" (
  copy "server\.env.example" "server\.env" >nul
  echo Created server\.env
)

rem Fill in a random JWT_SECRET if it is missing or still the placeholder
node "server\scripts\generateSecret.js"

echo Checking server packages ^(fast if already installed^)...
pushd server
call npm install --no-audit --no-fund --loglevel=error
popd

echo Checking client packages ^(fast if already installed^)...
pushd client
call npm install --no-audit --no-fund --loglevel=error
popd

start "Alzikrayat - Server" /d "%~dp0server" cmd /k npm run dev
start "Alzikrayat - Client" /d "%~dp0client" cmd /k npm run dev

echo.
echo Opening the browser in a few seconds...
timeout /t 8 >nul
start http://localhost:3000

echo.
echo Two windows were opened (Server and Client). Keep them open while you use the site.
echo To stop everything, close those two windows.
timeout /t 5 >nul
