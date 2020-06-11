param(
  [string] $Path
)

if ($Path -eq "") {
  Write-Error "Usage: ./load-from-filesystem.ps1 -Path path-to-folder > destination-file"
  exit 1
}
$absolutePath = Resolve-Path -Path "$($Path)"
$files = get-ChildItem -Recurse -Path "$($absolutePath)" | where {! $_.PSIsContainer}
Write-Output "1.0.0"
Write-Output "windows"
Write-Output "$($absolutePath)"

foreach ($file in $files) {
  $lastModifiedDate = (Get-Date -Date $file.LastWriteTime.ToUniversalTime() -UFormat %s)
  $fileHash = (Get-FileHash -Algorithm MD5 -LiteralPath $file.FullName).Hash
  Write-Output "`"$($file.FullName)`",$($file.length),$($lastModifiedDate),$($fileHash)"
}
