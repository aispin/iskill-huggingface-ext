# iskill-huggingface-ext

把本地 HuggingFace 下载的模型 / 数据集缓存（`~/.cache/huggingface/hub`）整体迁移到任意指定目录（移动硬盘、大容量 SSD 等），再把原路径软链回去，让 HuggingFace 无感知地继续工作，从而释放系统盘空间。

## 适用系统
- macOS / Linux：运行 `scripts/migrate.sh`
- Windows：用 PowerShell 运行 `scripts/migrate.ps1`

## 用法
不传目标目录时会弹出系统文件夹选择框；也可直接指定目标目录。

```bash
# macOS / Linux
bash scripts/migrate.sh                      # 弹框选择目标目录
bash scripts/migrate.sh /Volumes/Big/hf-hub  # 直接指定
bash scripts/migrate.sh -n /Volumes/Big/hf-hub   # 只预览，不实际改动

# Windows (PowerShell)
pwsh scripts/migrate.ps1                     # 弹框选择
pwsh scripts/migrate.ps1 -Target D:\hf-hub   # 直接指定
```

## 迁移流程
1. 解析源 hub 目录（优先级：`$HF_HUB_CACHE` → `$HF_HOME/hub` → `~/.cache/huggingface/hub`）。
2. 源不存在 → 提示无需迁移；源已是软链接 → 提示已迁移过并退出（防重复）。
3. 目标目录未提供 → 弹系统选择框（macOS 文件夹对话框 / Windows FolderBrowserDialog），否则回退手输路径。
4. 目标已存在且非空 → 询问是否覆盖（y 删除旧内容继续 / n 取消）。
5. 移动 hub 全部内容到目标，删原 hub，建立软链接 `hub → 目标`。
6. Windows 下符号链接失败自动降级为 Junction，对读取无差异。

## 说明
- 迁移会移动真实数据，请确保目标盘已挂载且空间充足。
- 软链建立后 HuggingFace 仍按原路径读取，无需改任何代码 / 环境变量。
- 想换位置：先删软链（`rm ~/.cache/huggingface/hub`），再重跑一次即可。

> 依赖同步：本仓库含 iskill 共享真源的 vendored 副本（清单见 `package.json` 的 `iskillDeps`），**不要手改**。使用前请同时安装 iskill-dep-sync：对 agent 说「请帮我安装 Skill：aispin/iskill-dep-sync」；用法见 SKILL.md「依赖同步」节。
