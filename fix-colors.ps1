$targetFiles = @(
    "app\globals.css",
    "app\layout.tsx",
    "app\page.tsx",
    "app\blog\page.tsx",
    "app\blog\[slug]\page.tsx",
    "app\author\[slug]\page.tsx",
    "app\contact\page.tsx",
    "app\about\page.tsx",
    "app\privacy\page.tsx",
    "app\terms\page.tsx",
    "app\sitemap\page.tsx",
    "components\Header.tsx",
    "components\Footer.tsx",
    "components\PostCards.tsx",
    "components\SearchInput.tsx",
    "components\SubscriberForm.tsx",
    "components\CommentSection.tsx",
    "components\PostLikeDislike.tsx",
    "components\ShareButtons.tsx",
    "components\ProductReviews.tsx",
    "components\FAQAccordion.tsx",
    "components\TOC.tsx"
)

foreach ($relPath in $targetFiles) {
    $fullPath = Join-Path (Get-Location) $relPath
    if (-not (Test-Path $fullPath)) {
        Write-Host "SKIP (not found): $relPath"
        continue
    }

    $content = [System.IO.File]::ReadAllText($fullPath)
    $lines = $content -split "`n"
    $totalLines = $lines.Count

    # Find the second occurrence of the file's starting marker
    # TSX/TS files start with "use client" or "import" or "export"
    # CSS files start with "@import" or "/*" or "."
    $ext = [System.IO.Path]::GetExtension($fullPath)
    
    if ($ext -eq ".css") {
        $startMarker = "@import"
    } else {
        # For TSX/TS - start could be "use client" or "import " or "export "
        $startMarker = $null
        # Find all lines that look like a file start
        $candidates = @()
        for ($i = 0; $i -lt $lines.Count; $i++) {
            $line = $lines[$i].Trim()
            if ($line -eq '"use client";' -or $line -eq "'use client';" -or $line.StartsWith("import ") -or $line.StartsWith("export default") -or $line.StartsWith("export const") -or $line.StartsWith("export async")) {
                $candidates += $i
            }
        }
        
        if ($candidates.Count -gt 1) {
            # File is duplicated/concatenated - find the second "start"
            # The real content ends just before the second start (or use the first chunk)
            $secondStart = $candidates[1]
            
            # Check if between candidates[0] and candidates[1] we have reasonable content
            $firstChunk = $lines[0..($secondStart-1)]
            $cleanContent = $firstChunk -join "`n"
            
            # Apply replacements on the clean first chunk
            $cleanContent = $cleanContent -replace '\baccent-hover\b', 'sage-hover'
            $cleanContent = $cleanContent -replace '\baccent\b', 'sage'
            $cleanContent = $cleanContent -replace '\bsecondary-hover\b', 'sand-hover'
            $cleanContent = $cleanContent -replace '\bsecondary\b', 'sand'
            
            [System.IO.File]::WriteAllText($fullPath, $cleanContent)
            Write-Host "FIXED+REPLACED ($($firstChunk.Count) lines, was $totalLines): $relPath"
            continue
        }
    }
    
    # File looks clean - just do replacements
    $content = $content -replace '\baccent-hover\b', 'sage-hover'
    $content = $content -replace '\baccent\b', 'sage'
    $content = $content -replace '\bsecondary-hover\b', 'sand-hover'
    $content = $content -replace '\bsecondary\b', 'sand'
    
    [System.IO.File]::WriteAllText($fullPath, $content)
    Write-Host "REPLACED only ($totalLines lines): $relPath"
}

Write-Host "`nAll files processed!"
