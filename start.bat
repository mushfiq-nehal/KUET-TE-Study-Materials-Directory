@echo off
REM KUET Textile Engineering 2k24 - Quick Start Script

echo.
echo ========================================
echo KUET Textile Engineering 2k24
echo Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB is running
echo Checking for MongoDB connection...
(
    echo db.version()
    echo exit
) | mongosh localhost:27017 >nul 2>&1

if errorlevel 1 (
    echo.
    echo WARNING: MongoDB might not be running!
    echo Make sure MongoDB is running before starting the application.
    echo.
    pause
)

echo.
echo Checking dependencies...

cd server
if not exist "node_modules" (
    echo Installing server dependencies...
    call npm install
)

cd ..\client
if not exist "node_modules" (
    echo Installing client dependencies...
    call npm install
)

echo.
echo ========================================
echo To start the application, open TWO terminals:
echo.
echo Terminal 1 (Backend):
echo   cd server
echo   npm start
echo.
echo Terminal 2 (Frontend):
echo   cd client
echo   npm start
echo.
echo Then open: http://localhost:3000
echo ========================================
echo.
pause
