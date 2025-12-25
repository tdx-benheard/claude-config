@echo off
setlocal

REM Get the directory where this batch file is located
set SCRIPT_DIR=%~dp0

REM Real Claude is in the same directory (after rename)
set REAL_CLAUDE=%SCRIPT_DIR%claude-real.exe

REM Check if first arg is "mcp" - just configure, don't start Claude
if "%1"=="mcp" (
    claude-mcp
    exit /b
)

REM Check if first arg is a profile name - configure then start Claude
set PROFILES=tickets project time web tdx full
for %%p in (%PROFILES%) do (
    if "%1"=="%%p" (
        claude-mcp %%p
        "%REAL_CLAUDE%"
        exit /b
    )
)

REM Default: pass through to real Claude
"%REAL_CLAUDE%" %*
