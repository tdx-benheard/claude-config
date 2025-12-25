$binPath = "C:\source\mcp\claude-mcp-cli\bin"
$currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')

if ($currentPath -notlike "*$binPath*") {
    $newPath = $currentPath + ";$binPath"
    [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
    Write-Host "✓ Added to PATH: $binPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: Restart your terminal for changes to take effect" -ForegroundColor Yellow
} else {
    Write-Host "✓ Already in PATH: $binPath" -ForegroundColor Green
}
