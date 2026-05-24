#!/bin/bash
# 套用繁體中文 fork 的自訂修改
# 這些修改會在每次同步上游後自動套用
#
# === 命名策略（詳見 docs/naming-decision.md）===
# - plugin name / skill name / 安裝路徑：保留 `web-access`（與上游對齊，site-patterns 共享）
# - marketplace 頂層 name：改為 `web-access-tw`（識別來源）
# - 安裝指令：`claude plugin install web-access@web-access-tw`
#
# 唯一帶 `-tw` suffix 的識別是 marketplace name，純粹避免使用者註冊兩個
# 同名 marketplace 時搞混。plugin/skill 識別與安裝路徑全部對齊上游。

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "套用自訂修改..."

# 修改 SKILL.md：只更新 github URL，name 保留上游 `web-access`
SKILL_FILE="SKILL.md"
if [ -f "$SKILL_FILE" ]; then
    sed -i '' 's|github: https://github.com/eze-is/web-access|github: https://github.com/yelban/web-access.TW|' "$SKILL_FILE"
    echo "  已更新: $SKILL_FILE (github URL)"
fi

# 修改 README.md
README_FILE="README.md"
if [ -f "$README_FILE" ]; then
    # 替換 repo 路徑（GitHub URL / repo reference）
    sed -i '' 's|eze-is/web-access|yelban/web-access.TW|g' "$README_FILE"

    # 替換 plugin install 指令的 marketplace name
    # 上游：claude plugin install web-access@web-access
    # 本版：claude plugin install web-access@web-access-tw
    sed -i '' 's|plugin install web-access@web-access\b|plugin install web-access@web-access-tw|g' "$README_FILE"

    # 替換 Star History（保留指向上游，看上游趨勢）
    sed -i '' 's|repos=yelban/web-access.TW|repos=eze-is/web-access|g' "$README_FILE"
    sed -i '' 's|#yelban/web-access.TW|#eze-is/web-access|g' "$README_FILE"

    echo "  已更新: $README_FILE (repo URL + plugin install marketplace name)"

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

    # 確保 fork notice 內的上游連結指向 eze-is（避免被前面的 sed 全域替換誤換）
    # 重跑時上游 URL 已是 yelban/web-access.TW，需還原為 eze-is/web-access
    sed -i '' 's|上游：\[yelban/web-access.TW\](https://github.com/yelban/web-access.TW)|上游：[eze-is/web-access](https://github.com/eze-is/web-access)|' "$README_FILE"
fi

# references/cdp-api.md：不需要改路徑（路徑保留 skills/web-access）

# 修改 .claude-plugin/plugin.json：URL、author、description（加 TW 標記）、keywords（加 TW tag）
# name 保留上游 `web-access`（與 SKILL.md 對齊）
PLUGIN_JSON=".claude-plugin/plugin.json"
if [ -f "$PLUGIN_JSON" ]; then
    sed -i '' 's|https://github.com/eze-is/web-access|https://github.com/yelban/web-access.TW|g' "$PLUGIN_JSON"
    sed -i '' 's|"name": "一泽 Eze"|"name": "一泽 Eze (TW fork: yelban)"|' "$PLUGIN_JSON"
    # description 補上 TW 標記（只在首次套用時加）
    if ! grep -q "Traditional Chinese / Taiwan" "$PLUGIN_JSON"; then
        sed -i '' 's| - intelligent tool selection| (Traditional Chinese / Taiwan) - intelligent tool selection|' "$PLUGIN_JSON"
    fi
    # keywords 補上 TW tag（只在首次套用時加）
    if ! grep -q '"traditional-chinese"' "$PLUGIN_JSON"; then
        sed -i '' 's|"search"\]|"search", "traditional-chinese", "taiwan"]|' "$PLUGIN_JSON"
    fi
    echo "  已更新: $PLUGIN_JSON (URL + author + description + keywords)"
fi

# 修改 .claude-plugin/marketplace.json
# - 頂層 name 改 web-access-tw（識別來源）
# - plugins[].name 保留 web-access（與 plugin.json 一致）
# - owner、description、tags 加 TW 標記
MARKETPLACE_JSON=".claude-plugin/marketplace.json"
if [ -f "$MARKETPLACE_JSON" ]; then
    # 頂層 name → web-access-tw（只改第一個 match）
    # 兩階段：先 normalize 所有 -tw 回 web-access，再用 range addressing 只改第一個
    # （這樣不管 reapply 多少次都收斂到「頂層 -tw、plugins[] web-access」）
    sed -i '' 's|"name": "web-access-tw"|"name": "web-access"|g' "$MARKETPLACE_JSON"
    sed -i '' '1,/"name": "web-access"/s|"name": "web-access"|"name": "web-access-tw"|' "$MARKETPLACE_JSON"

    sed -i '' 's|"name": "一泽 Eze"|"name": "一泽 Eze (TW fork: yelban)"|' "$MARKETPLACE_JSON"
    if ! grep -q "Traditional Chinese / Taiwan" "$MARKETPLACE_JSON"; then
        sed -i '' 's|skill for Claude Code"|skill for Claude Code (Traditional Chinese / Taiwan)"|' "$MARKETPLACE_JSON"
        sed -i '' 's|site experience accumulation"|site experience accumulation (Traditional Chinese / Taiwan)"|' "$MARKETPLACE_JSON"
    fi
    if ! grep -q '"traditional-chinese"' "$MARKETPLACE_JSON"; then
        sed -i '' 's|"search"\]|"search", "traditional-chinese", "taiwan"]|' "$MARKETPLACE_JSON"
    fi
    echo "  已更新: $MARKETPLACE_JSON (頂層 name + owner + description + tags)"
fi

echo "自訂修改套用完成"
