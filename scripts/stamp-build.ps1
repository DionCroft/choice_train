[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$Version,
  [string]$ReleaseLabel,
  [string]$Channel = 'experimental',
  [string]$ReleaseDate = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd'),
  [string]$Commit,
  [string]$App = 'ChoiceTrain for ShowMe',
  [string]$LiveUrl = 'https://dioncroft.github.io/choice_train/',
  [string]$RepoUrl = 'https://github.com/DionCroft/choice_train',
  [string]$BaseBranch,
  [string]$PublishedEntry,
  [string]$SourceFile,
  [string]$SourceScript,
  [string[]]$Files = @(),
  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if(-not $Files.Count){
  $Files = @("choice_train_V$Version.js")
}

$arguments = @(
  (Join-Path $PSScriptRoot 'stamp-build.js'),
  '--version', $Version,
  '--channel', $Channel,
  '--date', $ReleaseDate,
  '--app', $App,
  '--live-url', $LiveUrl,
  '--repo-url', $RepoUrl
)

foreach($file in $Files){ $arguments += @('--file', $file) }
if($ReleaseLabel){ $arguments += @('--release-label', $ReleaseLabel) }
if($Commit){ $arguments += @('--commit', $Commit) }
if($BaseBranch){ $arguments += @('--branch', $BaseBranch) }
if($PublishedEntry){ $arguments += @('--published-entry', $PublishedEntry) }
if($SourceFile){ $arguments += @('--source-file', $SourceFile) }
if($SourceScript){ $arguments += @('--source-script', $SourceScript) }
if($DryRun){ $arguments += '--dry-run' }

& node @arguments
if($LASTEXITCODE -ne 0){
  throw "Build stamping failed with exit code $LASTEXITCODE"
}
