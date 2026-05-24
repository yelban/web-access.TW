#!/bin/bash
# 將專案中所有簡體中文轉換為繁體中文（台灣正體 + 詞彙轉換）
# 使用自訂 opencc config（s2twp + false positive 修正詞典）
#
# === 核心約束 ===
# - 只修改字串內容，不改變字串的位置或結構
# - 保持字串模板佔位符完整（{name}, %s, ${var}, {{var}}）
# - 保持轉義字元不變（\n, \t, \\）
# - 引號類型保持一致（單引號/雙引號/反引號）
# - 縮排與格式保持不變
#
# === 處理順序 ===
# 1. 先處理 .md 文件（風險最低）
# 2. 再處理 .mjs 程式碼檔案
#
# === False Positive 處理 ===
# 透過自訂詞典 (scripts/opencc-custom-phrases.txt) 在 conversion chain
# 最後一步修正，無需 sed 後處理。
# 詞典格式：「錯誤轉換<TAB>正確結果」每行一條。

set -e

if ! command -v opencc &> /dev/null; then
    echo "錯誤: 請先安裝 opencc"
    echo "  brew install opencc"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# 準備自訂 opencc config（將詞典路徑注入模板）
OPENCC_CONFIG=$(mktemp)
sed "s|CUSTOM_PHRASES_PATH|$SCRIPT_DIR/opencc-custom-phrases.txt|" \
    "$SCRIPT_DIR/s2twp-custom.json" > "$OPENCC_CONFIG"

echo "開始轉換簡體中文為繁體中文..."
echo "專案路徑: $PROJECT_ROOT"
echo "使用自訂 opencc config（含 false positive 修正）"
echo ""

# OpenCC 多階段 chain 對部分上下文需多輪才能收斂
# （TWPhrases 階段依賴前一階段輸出，一輪可能轉不完）
MAX_PASSES=5

convert_files() {
    local ext=$1
    local total_changed=0
    local pass=0
    local changed_this_pass

    while [ $pass -lt $MAX_PASSES ]; do
        pass=$((pass + 1))
        changed_this_pass=0

        while IFS= read -r -d '' file; do
            tmp=$(mktemp)
            if opencc -i "$file" -o "$tmp" -c "$OPENCC_CONFIG" 2>/dev/null; then
                if ! cmp -s "$file" "$tmp"; then
                    # 用 cat 寫回保留原檔權限（mv 會繼承 mktemp 的 600）
                    cat "$tmp" > "$file"
                    rm -f "$tmp"
                    if [ $pass -eq 1 ]; then
                        echo "  轉換: $file"
                    else
                        echo "  轉換 (pass $pass): $file"
                    fi
                    changed_this_pass=$((changed_this_pass + 1))
                else
                    rm -f "$tmp"
                fi
            else
                rm -f "$tmp"
                echo "  失敗: $file"
            fi
        done < <(find . -name "*.$ext" \
            -not -path "./.git/*" \
            -not -path "./node_modules/*" \
            -not -path "*/node_modules/*" \
            -not -path "./scripts/sync-upstream.sh" \
            -not -path "./scripts/convert-to-traditional.sh" \
            -not -path "./scripts/apply-customizations.sh" \
            -not -path "./docs/*" \
            -print0)

        total_changed=$((total_changed + changed_this_pass))
        if [ $changed_this_pass -eq 0 ]; then
            break
        fi
    done

    echo "  $ext 檔案轉換完成: $total_changed 個檔案次數（$pass 輪收斂）"
}

echo "轉換 Markdown 檔案..."
convert_files "md"
echo ""

echo "轉換 JavaScript 模組檔案..."
convert_files "mjs"
echo ""

echo "轉換 Template 檔案..."
convert_files "template"
echo ""

rm -f "$OPENCC_CONFIG"

echo "轉換完成！"
echo ""
echo "請檢查變更："
echo "  git diff --stat"
