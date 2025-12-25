@echo off
setlocal enabledelayedexpansion

REM cc - Configure MCP servers and start Claude
REM Usage:
REM   cc              - Interactive mode, then start Claude
REM   cc tickets      - Apply tickets profile and start Claude
REM   cc tickets web  - Apply tickets + web and start Claude

REM If no arguments, run interactive mode
if "%1"=="" (
    node C:/source/mcp/claude-config/bin/claude-mcp.js
    if %ERRORLEVEL% EQU 0 (
        claude
    )
    exit /b
)

REM Otherwise, pass all arguments to claude-config
node C:/source/mcp/claude-config/bin/claude-mcp.js %*
if %ERRORLEVEL% EQU 0 (
    claude
)
