#!/usr/bin/env bash
# iskill-huggingface-ext — 移库（macOS / Linux）
# 将 HuggingFace hub 缓存迁移到用户指定目录，并软链回原处。
set -euo pipefail

show_help() {
  cat <<'EOF'
iskill-huggingface-ext · 移库

将 HuggingFace hub 缓存迁移到用户指定目录，并软链回原处。

用法:
  migrate.sh [选项] [目标目录]

选项:
  -h, --help     显示帮助
  -n, --dry-run  仅打印将要执行的操作，不实际移动/删除

说明:
  - 不传目标目录时，尝试弹出系统目录选择框（macOS 为文件夹选择对话框）。
  - 目标目录即新的 hub 数据目录（其下直接存放模型仓库）。
EOF
}

DRY_RUN=0
TARGET=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help) show_help; exit 0 ;;
    -n|--dry-run) DRY_RUN=1; shift ;;
    -*) echo "未知选项: $1" >&2; show_help; exit 1 ;;
    *) TARGET="$1"; shift ;;
  esac
done

# 解析源 hub 目录（与 HuggingFace 解析顺序一致）
if [[ -n "${HF_HUB_CACHE:-}" ]]; then
  HUB="$HF_HUB_CACHE"
elif [[ -n "${HF_HOME:-}" ]]; then
  HUB="$HF_HOME/hub"
else
  HUB="$HOME/.cache/huggingface/hub"
fi

echo "🔍 源 hub 目录: $HUB"

# 1. 已是软链接 -> 已迁移过
if [[ -L "$HUB" ]]; then
  echo "ℹ️  该路径已是软链接，指向: $(readlink "$HUB")"
  echo "   看起来已经迁移过了，无需重复操作。如需重新迁移请先删除该软链接。"
  exit 0
fi

# 2. 不存在 -> 无需迁移
if [[ ! -d "$HUB" ]]; then
  echo "ℹ️  未找到 $HUB（HuggingFace 缓存尚未生成，或已自定义路径）。无需迁移。"
  exit 0
fi

# 3. 获取目标目录（未提供则尝试弹框）
if [[ -z "$TARGET" ]]; then
  echo "📂 未提供目标目录，尝试弹出目录选择框…"
  if [[ "$(uname)" == "Darwin" ]]; then
    PICKED="$(osascript -e 'POSIX path of (choose folder with prompt "选择 HuggingFace hub 的新存放目录")' 2>/dev/null)" || PICKED=""
    if [[ -n "$PICKED" ]]; then
      TARGET="$PICKED"
    fi
  fi
  if [[ -z "$TARGET" ]]; then
    echo "⚠️  无法弹出选择框（非交互环境 / 已取消）。"
    read -r -p "请输入目标目录的绝对路径: " TARGET || TARGET=""
  fi
fi

if [[ -z "$TARGET" ]]; then
  echo "❌ 未指定目标目录，已取消。" >&2
  exit 1
fi

# 规范化目标路径
TARGET="$(cd "$(dirname "$TARGET")" 2>/dev/null && pwd)/$(basename "$TARGET")"
if [[ ! -d "$(dirname "$TARGET")" ]]; then
  echo "❌ 目标目录的父目录不存在: $(dirname "$TARGET")" >&2
  exit 1
fi

# 防御：不能把 hub 迁到自己或自己内部
REAL_HUB="$(cd "$HUB" && pwd)"
if [[ "$TARGET" == "$REAL_HUB" || "$TARGET" == "$REAL_HUB"/* ]]; then
  echo "❌ 目标目录不能是 hub 自身或其子目录。" >&2
  exit 1
fi

# 4. 目标已存在 & 非空 -> 提示覆盖
NEED_OVERWRITE=0
if [[ -e "$TARGET" ]]; then
  if [[ -d "$TARGET" && -z "$(ls -A "$TARGET" 2>/dev/null)" ]]; then
    echo "ℹ️  目标目录已存在但为空，将直接使用。"
  else
    echo "⚠️  目标目录已存在且非空: $TARGET"
    read -r -p "是否覆盖（将删除目标目录现有内容）？[y/N] " ANS
    case "$ANS" in
      y|Y|yes|YES) NEED_OVERWRITE=1 ;;
      *) echo "❌ 已取消。" >&2; exit 1 ;;
    esac
  fi
fi

echo "🚚 计划: 迁移 $REAL_HUB -> $TARGET"

if [[ $DRY_RUN -eq 1 ]]; then
  echo "（dry-run）不执行实际移动。"
  exit 0
fi

# 5. 执行迁移
mkdir -p "$TARGET"
if [[ $NEED_OVERWRITE -eq 1 ]]; then
  echo "🗑  删除现有目标目录内容…"
  rm -rf "$TARGET"
  mkdir -p "$TARGET"
fi

shopt -s dotglob nullglob
items=("$REAL_HUB"/*)
shopt -u dotglob nullglob
if [[ ${#items[@]} -gt 0 ]]; then
  mv "${items[@]}" "$TARGET"/
fi

# 删除原 hub 目录（应为空）
rmdir "$REAL_HUB" 2>/dev/null || rm -rf "$REAL_HUB"

# 6. 建立软链接
ln -s "$TARGET" "$HUB"

echo "✅ 完成！"
echo "   $HUB -> $TARGET"
echo "   验证: ls -ld \"$HUB\""
