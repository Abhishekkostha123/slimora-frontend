$files = Get-ChildItem -Path "app","components" -Recurse -Include "*.tsx","*.ts","*.css" | Where-Object { $_.FullName -notmatch "node_modules|\.next" }
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    # Replace accent utility classes with sage
    $content = $content -replace '\baccent-hover\b', 'sage-hover'
    $content = $content -replace '\baccent\b', 'sage'
    # Replace secondary utility classes with sand
    $content = $content -replace '\bsecondary-hover\b', 'sand-hover'
    $content = $content -replace '\bsecondary\b', 'sand'
    [System.IO.File]::WriteAllText($file.FullName, $content)
    Write-Host "Updated: $($file.Name)"
}
Write-Host "All done!"
