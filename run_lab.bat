@echo off
setlocal enabledelayedexpansion
title OpenClaw + Nous Hermes Lab Launcher
color 0A

:: Strict Local Isolation Configuration
set "PROJECT_ROOT=%~dp0"
set "OPENCLAW_HOME=%PROJECT_ROOT%.openclaw"
set "OPENCLAW_CONFIG_PATH=%PROJECT_ROOT%config\openclaw.json5"
set "OPENCLAW_STATE_DIR=%PROJECT_ROOT%.openclaw\state"

:: Ensure local isolation directories exist
if not exist "%OPENCLAW_HOME%" mkdir "%OPENCLAW_HOME%"
if not exist "%OPENCLAW_STATE_DIR%" mkdir "%OPENCLAW_STATE_DIR%"
if not exist "%PROJECT_ROOT%workspace" mkdir "%PROJECT_ROOT%workspace"

:MENU
cls
echo ==============================================================================
echo                 OPENCLAW + NOUS HERMES LAB LAUNCHER (WINDOWS)
echo ==============================================================================
echo  Root Directory: %PROJECT_ROOT%
echo  Isolation Path: %OPENCLAW_HOME%
echo  Config Path:    %OPENCLAW_CONFIG_PATH%
echo ==============================================================================
echo.
echo   [1] Start Interactive Chat with Nous Hermes (CLI Mode)
echo   [2] Start OpenClaw Gateway Service (Telegram/Channels)
echo   [3] Check Gateway Service Status
echo   [4] Run Benchmark Test with Nous Hermes
echo   [5] Run Benchmark Test with GLM-5.3 (753B MoE)
echo   [6] Run OpenClaw Diagnostics & Health Check (Doctor)
echo   [7] Edit Configuration File (config\openclaw.json5)
echo   [8] Edit API Keys and Credentials (.env)
echo   [9] Open Local Workspace Directory
echo   [10] Exit
echo.
echo ==============================================================================
set /p choice="Enter your choice (1-10): "

if "%choice%"=="1" goto CHAT
if "%choice%"=="2" goto GATEWAY
if "%choice%"=="3" goto STATUS
if "%choice%"=="4" goto TEST
if "%choice%"=="5" goto TEST_GLM5
if "%choice%"=="6" goto DOCTOR
if "%choice%"=="7" goto EDIT_CONFIG
if "%choice%"=="8" goto EDIT_ENV
if "%choice%"=="9" goto OPEN_WORKSPACE
if "%choice%"=="10" goto EXIT

echo Invalid option. Please select 1-10.
timeout /t 2 >nul
goto MENU

:CHAT
cls
echo ------------------------------------------------------------------------------
echo Starting Interactive Chat with Nous Hermes...
echo Press Ctrl+C to exit chat.
echo ------------------------------------------------------------------------------
npx openclaw chat
pause
goto MENU

:GATEWAY
cls
echo ------------------------------------------------------------------------------
echo Starting OpenClaw Gateway Service...
echo ------------------------------------------------------------------------------
npx openclaw gateway start
pause
goto MENU

:STATUS
cls
echo ------------------------------------------------------------------------------
echo OpenClaw Gateway Status:
echo ------------------------------------------------------------------------------
npx openclaw gateway status
echo.
pause
goto MENU

:TEST
cls
echo ------------------------------------------------------------------------------
echo Running Automated Verification & Live Benchmark Test...
echo ------------------------------------------------------------------------------
node test_hermes_openclaw.js
echo.
pause
goto MENU

:TEST_GLM5
cls
echo ------------------------------------------------------------------------------
echo Running Benchmark Test with GLM-5.3 (753B MoE)...
echo ------------------------------------------------------------------------------
node test_glm5_openclaw.js
echo.
pause
goto MENU

:DOCTOR
cls
echo ------------------------------------------------------------------------------
echo Running OpenClaw Diagnostics (Doctor)...
echo ------------------------------------------------------------------------------
npx openclaw doctor
echo.
pause
goto MENU

:EDIT_CONFIG
notepad "%OPENCLAW_CONFIG_PATH%"
goto MENU

:EDIT_ENV
notepad "%PROJECT_ROOT%.env"
goto MENU

:OPEN_WORKSPACE
explorer "%PROJECT_ROOT%workspace"
goto MENU

:EXIT
echo Exiting OpenClaw + Nous Hermes Lab. Goodbye!
exit /b 0
