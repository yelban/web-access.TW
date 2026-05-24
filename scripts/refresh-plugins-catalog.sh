#!/bin/bash
# 重新抓取 Claude Code 官方 marketplace plugins，重新生成 docs/claude-code-official-plugins-catalog.md
# 並列出新增 / 移除的 plugins
#
# 用法：
#   ./scripts/refresh-plugins-catalog.sh
#
# 需要：
#   - claude CLI 已登入並可執行 `claude plugin list --available --json`
#   - python3（純 stdlib，無外部相依）

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CATALOG="$PROJECT_ROOT/docs/claude-code-official-plugins-catalog.md"
TMP_JSON="$(mktemp -t plugins-XXXXXX.json)"

cleanup() { rm -f "$TMP_JSON"; }
trap cleanup EXIT

if ! command -v claude &> /dev/null; then
    echo "錯誤: 未找到 claude CLI" >&2
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "錯誤: 未找到 python3" >&2
    exit 1
fi

echo "[1/2] 抓取 marketplace plugins..."
claude plugin list --available --json > "$TMP_JSON" 2>/dev/null

# 簡單檢查 JSON 大小
SIZE=$(wc -c < "$TMP_JSON")
if [ "$SIZE" -lt 1000 ]; then
    echo "錯誤: JSON 內容過短 ($SIZE bytes)，請確認 claude CLI 狀態" >&2
    head -c 500 "$TMP_JSON" >&2
    exit 1
fi
echo "  下載完成: $SIZE bytes"

echo ""
echo "[2/2] 解析、分類、生成 catalog..."
python3 "$SCRIPT_DIR/refresh-plugins-catalog.py" \
    --input "$TMP_JSON" \
    --output "$CATALOG" \
    --diff

echo ""
echo "完成。下一步建議："
echo "  git diff docs/claude-code-official-plugins-catalog.md   # 看實際內容變化"
echo "  git add docs/claude-code-official-plugins-catalog.md && git commit -m 'docs: refresh plugins catalog'"
