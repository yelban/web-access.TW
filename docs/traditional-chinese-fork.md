# web-access.TW — 繁體中文 Fork 維護指南

## 概要

這是 [eze-is/web-access](https://github.com/eze-is/web-access) 的繁體中文（臺灣）在地化 fork。
所有中文內容使用 OpenCC s2twp 從簡體中文自動轉換為繁體中文（臺灣正體 + 臺灣詞彙）。

## 同步策略

**Reset + Re-apply**（非 merge/rebase）。

原因：OpenCC 轉換是冪等的（同一輸入永遠產生同一輸出），每個 .md/.mjs 檔案都會被修改，
使用 merge/rebase 會產生大量衝突。Reset + 重新轉換是無衝突且可重複的。

## 快速同步

```bash
./scripts/sync-upstream.sh
# 互動式：fetch → 確認 → reset → 轉換 → 自訂 → commit
git push --force-with-lease
```

## 指令碼說明

| 指令碼 | 用途 |
|------|------|
| `sync-upstream.sh` | 主編排指令碼：備份 TW 檔案 → reset → 還原 → 轉換 → 自訂 → commit |
| `convert-to-traditional.sh` | 使用 OpenCC s2twp 批次轉換 .md 和 .mjs 檔案 |
| `apply-customizations.sh` | 更新 SKILL.md name/URL、README.md repo 路徑和 fork 標記 |
| `s2twp-custom.json` | 自訂 OpenCC 設定（標準 s2twp + false positive 修正詞典） |
| `opencc-custom-phrases.txt` | False positive 修正詞典，格式：`錯誤轉換<TAB>正確結果` |

## 檔案分類

### 來自上游（reset 時自動恢復）
- `SKILL.md`
- `README.md`
- `references/cdp-api.md`
- `scripts/check-deps.mjs`
- `scripts/cdp-proxy.mjs`
- `scripts/match-site.mjs`
- `.gitignore`

### TW 專用（reset 時備份 + 還原）
- `scripts/sync-upstream.sh`
- `scripts/convert-to-traditional.sh`
- `scripts/apply-customizations.sh`
- `scripts/s2twp-custom.json`
- `scripts/opencc-custom-phrases.txt`
- `docs/` 目錄

## 依賴

- **OpenCC**: `brew install opencc`
- **Git**: 基本 git 操作
- **sed**: macOS 內建（使用 `-i ''` 語法）

## 新增 False Positive 修正

1. 執行 `git diff` 檢查轉換結果
2. 發現 OpenCC 錯誤轉換時，在 `scripts/opencc-custom-phrases.txt` 新增一行：
   ```
   錯誤轉換結果<TAB>正確結果
   ```
3. 重新執行 `./scripts/convert-to-traditional.sh` 驗證

## 注意事項

- Star History badge 在 `apply-customizations.sh` 中特別處理，保留指向原版倉庫
- `scripts/` 目錄混合上游和 TW 檔案，sync 時只備份 TW 專用的 5 個檔案
- `.gitignore` 中的 `references/site-patterns/*.md` 排除站點經驗檔案（runtime 產生）
