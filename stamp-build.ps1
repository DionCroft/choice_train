[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$Version,

  [string]$ReleaseLabel,

  [string]$Channel = 'stable',

  [string]$ReleaseDate = (Get-Date).ToString('yyyy-MM-dd'),

  [string]$Commit,

  [string]$App = 'ChoiceTrain',

  [string]$LiveUrl = 'https://dioncroft.github.io/choice_train/',

  [string]$RepoUrl = 'https://github.com/DionCroft/choice_train',

  [string]$BaseBranch = 'main',

  [string]$PublishedEntry = 'index.html',

  [string]$SourceFile,

  [string]$SourceScript,

  [string[]]$Files = @('index.html')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Escape-JsValue {
  param([string]$Value)
  if($null -eq $Value){
    return ''
  }
  return (($Value -replace '\\', '\\\\') -replace "'", "\\'")
}

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '.'))
if(-not $ReleaseLabel){
  $ReleaseLabel = "V$Version"
}

if(-not $Commit){
  try {
    $Commit = (git -C $repoRoot rev-parse --short HEAD).Trim()
  } catch {
    $Commit = 'pending'
  }
}

$escapedApp = Escape-JsValue $App
$escapedVersion = Escape-JsValue $Version
$escapedReleaseLabel = Escape-JsValue $ReleaseLabel
$escapedChannel = Escape-JsValue $Channel
$escapedCommit = Escape-JsValue $Commit
$escapedReleaseDate = Escape-JsValue $ReleaseDate
$escapedLiveUrl = Escape-JsValue $LiveUrl
$escapedRepoUrl = Escape-JsValue $RepoUrl
$escapedBaseBranch = Escape-JsValue $BaseBranch
$escapedPublishedEntry = Escape-JsValue $PublishedEntry

foreach($file in $Files){
  $targetPath = if([System.IO.Path]::IsPathRooted($file)){
    $file
  } else {
    Join-Path $repoRoot $file
  }

  if(-not (Test-Path -LiteralPath $targetPath)){
    throw "Target file not found: $targetPath"
  }

  $displaySourceFile = if($SourceFile){
    $SourceFile
  } else {
    [System.IO.Path]::GetFileName($targetPath)
  }
  $displaySourceScript = if($SourceScript){
    $SourceScript
  } elseif([System.IO.Path]::GetExtension($targetPath).ToLowerInvariant() -eq '.js'){
    [System.IO.Path]::GetFileName($targetPath)
  } else {
    ''
  }

  $escapedSourceFile = Escape-JsValue $displaySourceFile
  $escapedSourceScript = Escape-JsValue $displaySourceScript
  $content = Get-Content -LiteralPath $targetPath -Raw

  $buildBlock = @"
  const APP_BUILD = Object.freeze({
    app: '$escapedApp',
    version: '$escapedVersion',
    release_label: '$escapedReleaseLabel',
    channel: '$escapedChannel',
    source_file: '$escapedSourceFile',
    source_script: '$escapedSourceScript',
    based_on_branch: '$escapedBaseBranch',
    based_on_commit: '$escapedCommit',
    build_date: '$escapedReleaseDate',
    published_entry: '$escapedPublishedEntry',
    live_url: '$escapedLiveUrl',
    repo_url: '$escapedRepoUrl'
  });
"@

  $updated = [System.Text.RegularExpressions.Regex]::Replace(
    $content,
    '(?ms)^\s*const APP_BUILD = (?:Object\.freeze\()?\{.*?^\s*\}\)?;',
    $buildBlock,
    1
  )

  if($updated -eq $content){
    throw "APP_BUILD block not found in $targetPath"
  }

  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($targetPath, $updated, $utf8NoBom)
  Write-Host "Stamped $([System.IO.Path]::GetFileName($targetPath)) -> $ReleaseLabel [$Channel] @ $Commit"
}
