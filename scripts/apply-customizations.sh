#!/bin/bash
# 套用繁體中文 fork 的自訂修改
# 這些修改會在每次同步上游後自動套用

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "套用自訂修改..."

# 修改 SKILL.md：更新 github URL 指向 fork
SKILL_FILE="SKILL.md"
if [ -f "$SKILL_FILE" ]; then
    # 替換 github URL
    sed -i '' 's|github: https://github.com/eze-is/web-access|github: https://github.com/yelban/web-access.TW|' "$SKILL_FILE"

    # 替換 skill name 避免衝突
    sed -i '' 's|^name: web-access$|name: web-access-tw|' "$SKILL_FILE"

    echo "  已更新: $SKILL_FILE (github URL + name)"
fi

# 修改 README.md
README_FILE="README.md"
if [ -f "$README_FILE" ]; then
    # 替換 repo 路徑
    sed -i '' 's|eze-is/web-access|yelban/web-access.TW|g' "$README_FILE"

    # 替換安裝路徑
    sed -i '' 's|skills/web-access$|skills/web-access-tw|g' "$README_FILE"
    sed -i '' 's|skills/web-access"|skills/web-access-tw"|g' "$README_FILE"

    # 替換 Star History（保留原版）
    sed -i '' 's|repos=yelban/web-access.TW|repos=eze-is/web-access|g' "$README_FILE"
    sed -i '' 's|#yelban/web-access.TW|#eze-is/web-access|g' "$README_FILE"

    echo "  已更新: $README_FILE (repo 路徑替換)"

    # 在圖片標籤後加入繁體中文版說明
    # README 開頭是 HTML div（語言選擇器）+ img，沒有 # 標題，
    # 所以在 <img> 行後插入 fork 標記
    if ! grep -q "繁體中文（台灣）在地化同步版本" "$README_FILE"; then
        awk '/<img.*alt=.*image/ && !done {
            print
            print ""
            print "> **這是繁體中文（台灣）在地化同步版本**"
            print ">"
            print "> 上游：[eze-is/web-access](https://github.com/eze-is/web-access) | 維護者：[@yelban](https://github.com/yelban)"
            print ">"
            print "> 所有內容已使用 OpenCC s2twp 轉換為繁體中文（台灣正體）。"
            print ""
            done=1
            next
        }
        {print}' "$README_FILE" > "$README_FILE.tmp" && mv "$README_FILE.tmp" "$README_FILE"
        echo "  已更新: $README_FILE (加入繁體中文版說明)"
    fi
fi

# 修改 references/cdp-api.md：更新腳本路徑
CDP_API_FILE="references/cdp-api.md"
if [ -f "$CDP_API_FILE" ]; then
    sed -i '' 's|skills/web-access/|skills/web-access-tw/|g' "$CDP_API_FILE"
    echo "  已更新: $CDP_API_FILE (路徑替換)"
fi

echo "自訂修改套用完成"
