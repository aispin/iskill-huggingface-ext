---
name: iskill-huggingface-ext
description: 将 HuggingFace hub 缓存目录迁移到用户指定位置并建立软链接（跨 macOS / Windows 一致体验），用于释放系统盘空间。触发词：移库、huggingface 迁移、hf 缓存迁移、迁移 hf 模型缓存、把 hf 缓存迁走、move hf cache、hf hub 搬家。
---

# iskill-huggingface-ext

把本地 HuggingFace 下载的模型 / 数据集缓存（默认 `~/.cache/huggingface/hub`）整体搬到用户指定目录（如移动硬盘、大容量 SSD），再把原路径软链回去，让 HuggingFace 无感知地继续工作。

## 何时用
- 系统盘空间不足，想把 HF 缓存挪到别的盘。
- 用户说「移库」「把 huggingface 缓存迁走」「hf 模型太占 C 盘 / 系统盘」。

## 命令：移库
- macOS / Linux：运行 `scripts/migrate.sh`
- Windows：用 PowerShell 运行 `scripts/migrate.ps1`

两个脚本行为完全一致：
1. 解析源 hub 目录（优先级与 HuggingFace 一致：`$HF_HUB_CACHE` → `$HF_HOME/hub` → `~/.cache/huggingface/hub`）。
2. 若源 hub 不存在 → 提示无需迁移，退出。
3. 若源 hub 已是软链接 → 提示已迁移过，显示指向，退出（避免重复操作）。
4. 目标目录：未传参时**尝试弹出系统目录选择框**（macOS 用文件夹选择对话框，Windows 用 FolderBrowserDialog）；弹不出则回退到手动输入路径。
5. 目标已存在且非空 → 提示是否覆盖；确认则删除后继续，否则取消。
6. 移动 hub 全部内容到目标，删除原 hub，建立软链接 `hub -> 目标`。

## 设计决策（默认行为，已在创建时确定）
- **目标目录即新的 hub 数据目录**：迁移后 `~/.cache/huggingface/hub` 是指向「目标目录」的软链接，目标目录下直接存放模型仓库（如 `models--org--name`、`snapshots`、`blobs` 等）。
- Windows 下优先建目录符号链接（`mklink /D` / `New-Item SymbolicLink`）；若当前 PowerShell 无权限（未开开发者模式 / 未提权），自动降级为 **Junction（目录连接点）**，对 HuggingFace 读取无差异。

## 注意事项
- 迁移会移动真实数据，请确保目标盘已挂载且空间充足。
- 软链建立后，HuggingFace 仍按原路径读取，无需改任何代码 / 环境变量。
- 跨盘软链（如外置硬盘）在硬盘卸载后访问会失败，属正常现象。
- 若日后想换位置：先删掉软链接（`rm ~/.cache/huggingface/hub`），再重新跑一次本命令即可。

## 调用示例（macOS / Linux）
```bash
# 弹框选择目标目录
bash ~/.workbuddy/skills/iskill-huggingface-ext/scripts/migrate.sh
# 直接指定目标目录
bash ~/.workbuddy/skills/iskill-huggingface-ext/scripts/migrate.sh /Volumes/Big/hf-hub
# 只预览将要执行的操作
bash ~/.workbuddy/skills/iskill-huggingface-ext/scripts/migrate.sh -n /Volumes/Big/hf-hub
```

## 调用示例（Windows，PowerShell）
```powershell
# 弹框选择目标目录
pwsh scripts/migrate.ps1
# 直接指定目标目录
pwsh scripts/migrate.ps1 -Target D:\hf-hub
# 只预览
pwsh scripts/migrate.ps1 -Target D:\hf-hub -DryRun
```

## 依赖同步

本仓库 `promo-page/assets/{app.js,style.css,icons.js}` 是 [iskill-promo-page](https://github.com/aispin/iskill-promo-page)
模板引擎的 vendored 副本（锁定版本见 `package.json` 的 `iskillDeps`），**不要手改**——
去真源仓库改并升 `@iskill-version`，再用 iskill-dep-sync 同步回来（本机无该工具时按下面自举）：

```bash
T="$HOME/.workbuddy/skills/iskill-dep-sync/scripts/skill-deps.mjs"
[ -f "$T" ] || { TMP="$(mktemp -d)"; curl -fsSL "https://raw.githubusercontent.com/aispin/iskill-dep-sync/HEAD/scripts/skill-deps.mjs" -o "$TMP/skill-deps.mjs"; T="$TMP/skill-deps.mjs"; }
node "$T" check "$(pwd)"     # 漂移检测；node "$T" sync "$(pwd)" 恢复/升级；node "$T" env "$(pwd)" 冷启动自检
```
