# PowerShell script để chạy MongoDB setup
param(
    [string]$ScriptPath = "setup_database.js"
)

# Đọc nội dung file script
$content = Get-Content $ScriptPath -Raw

# Chạy mongosh với script content
$content | mongosh

Write-Host "Database setup completed!"