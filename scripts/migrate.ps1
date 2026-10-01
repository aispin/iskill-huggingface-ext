# iskill-huggingface-ext — 移库（Windows / PowerShell）
# 将 HuggingFace hub 缓存迁移到用户指定目录，并软链回原处。
[CmdletBinding()]
param(
  [string]$Target = "",
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Show-Help {
  Write-Host @"
iskill-huggingface-ext · 移库 (Windows)

将 HuggingFace hub 缓存迁移到指定目录，并软链回原处。

用法:
  .\migrate.ps1 [-Target <目标目录>] [-DryRun]

不传 -Target 时弹出系统文件夹选择框（FolderBrowserDialog）。
"@
}

if ($args -contains "-h" -or $args -contains "--help") { Show-Help; exit 0 }

# 解析源 hub 目录（与 HuggingFace 解析顺序一致）
if ($env:HF_HUB_CACHE) { $HUB = $env:HF_HUB_CACHE }
elseif ($env:HF_HOME) { $HUB = Join-Path $env:HF_HOME "hub" }
else { $HUB = Join-Path $env:USERPROFILE ".cache\huggingface\hub" }

Write-Host "🔍 源 hub 目录: $HUB"

# 1. 已是链接 -> 已迁移过
if (Test-Path $HUB) {
  $item = Get-Item $HUB
  if ($item.LinkType) {
    Write-Host "ℹ️  该路径已是 $($item.LinkType) 链接，指向: $($item.Target)"
    Write-Host "   看起来已经迁移过了，无需重复操作。"
    exit 0
  }
} else {
  Write-Host "ℹ️  未找到 $HUB（HuggingFace 缓存尚未生成，或已自定义路径）。无需迁移。"
  exit 0
}

# 2. 获取目标目录（未提供则弹框）
if (-not $Target) {
  Write-Host "📂 尝试弹出目录选择框…"
  Add-Type -AssemblyName System.Windows.Forms | Out-Null
  $fb = New-Object System.Windows.Forms.FolderBrowserDialog
  $fb.Description = "选择 HuggingFace hub 的新存放目录"
  $fb.ShowNewFolderButton = $true
  if ($fb.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
    $Target = $fb.SelectedPath
  }
  if (-not $Target) {
    $Target = Read-Host "请输入目标目录的绝对路径"
  }
}

if (-not $Target) { Write-Host "❌ 未指定目标目录，已取消。"; exit 1 }

# 防御：不能迁到自己内部
$realHub = (Resolve-Path $HUB).Path
if ($Target -eq $realHub -or $Target.StartsWith("$realHub\") -or $Target.StartsWith("$realHub/")) {
  Write-Host "❌ 目标目录不能是 hub 自身或其子目录。" -ForegroundColor Red
  exit 1
}

# 3. 目标已存在 & 非空 -> 提示覆盖
$needOverwrite = $false
if (Test-Path $Target) {
  $children = Get-ChildItem $Target -Force
  if ($children.Count -eq 0) {
    Write-Host "ℹ️  目标目录已存在但为空，将直接使用。"
  } else {
    $ans = Read-Host "⚠️  目标目录已存在且非空: $Target 是否覆盖（删除现有内容）？[y/N]"
    if ($ans -match '^[yY]') { $needOverwrite = $true }
    else { Write-Host "❌ 已取消。"; exit 1 }
  }
}

Write-Host "🚚 计划: 迁移 $realHub -> $Target"
if ($DryRun) { Write-Host "(DryRun) 不执行实际移动。"; exit 0 }

# 4. 执行迁移
if ($needOverwrite) {
  Write-Host "🗑  删除现有目标目录内容…"
  Remove-Item $Target -Recurse -Force
}
New-Item -ItemType Directory -Path $Target -Force | Out-Null

Get-ChildItem $realHub -Force | ForEach-Object {
  Move-Item $_.FullName -Destination $Target -Force
}
Remove-Item $realHub -Recurse -Force

# 5. 建立软链接；无权限时降级 Junction
try {
  New-Item -ItemType SymbolicLink -Path $HUB -Value $Target -Force | Out-Null
  Write-Host "✅ 完成（符号链接）！ $HUB -> $Target"
} catch {
  New-Item -ItemType Junction -Path $HUB -Value $Target -Force | Out-Null
  Write-Host "✅ 完成（已降级为 Junction 目录连接点，对 HuggingFace 读取无差异）！ $HUB -> $Target"
}
