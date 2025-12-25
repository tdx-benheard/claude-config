# Update PATH to point to renamed claude-config directory

$oldPath = "C:\source\mcp\claude-mcp-cli\bin"
$newPath = "C:\source\mcp\claude-config\bin"

# Get current user PATH
$currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')

# Replace old path with new path
$updatedPath = $currentPath -replace [regex]::Escape($oldPath), $newPath

# Set the updated PATH
[Environment]::SetEnvironmentVariable('Path', $updatedPath, 'User')

Write-Host "PATH updated successfully" -ForegroundColor Green
Write-Host "  Old: $oldPath" -ForegroundColor Gray
Write-Host "  New: $newPath" -ForegroundColor Gray
Write-Host ""
Write-Host "You may need to restart your terminal for changes to take effect." -ForegroundColor Yellow
