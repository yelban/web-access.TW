# CDP Proxy API 參考

## 基礎資訊

- 地址：`http://localhost:3456`
- 啟動：`node ~/.claude/skills/web-access-tw/scripts/cdp-proxy.mjs &`
- 啟動後持續執行，不建議主動停止（重啟需 Chrome 重新授權）
- 強制停止：`pkill -f cdp-proxy.mjs`

## API 端點

### GET /health
健康檢查，返回連線狀態。
```bash
curl -s http://localhost:3456/health
```

### GET /targets
列出所有已開啟的頁面 tab。返回陣列，每項含 `targetId`、`title`、`url`。
```bash
curl -s http://localhost:3456/targets
```

### POST /new
建立新後臺 tab，自動等待頁面載入完成。**URL 透過 POST body 原樣傳入**，無需 URL-encode、不會因 query 中含 `&` 被切分。返回 `{ targetId }`。
```bash
curl -s -X POST --data-raw 'https://example.com' http://localhost:3456/new
# 含 query 的目標 URL（如帶 token 的小紅書筆記）也直接原樣傳：
curl -s -X POST --data-raw 'https://www.xiaohongshu.com/explore/xxx?xsec_source=app_share&xsec_token=ABC&type=normal' http://localhost:3456/new
```
> v2.5.3 起改為 POST。舊的 `GET /new?url=...` 返回 400 + 遷移指引，詳見 `migration-2.5.3.md`。

### GET /close?target=ID
關閉指定 tab。
```bash
curl -s "http://localhost:3456/close?target=TARGET_ID"
```

### POST /navigate?target=ID
在已有 tab 中導航到新 URL，自動等待載入。**target 走 query（不帶特殊字元的不透明 ID），URL 走 POST body**。
```bash
curl -s -X POST --data-raw 'https://example.com' "http://localhost:3456/navigate?target=ID"
```
> v2.5.3 起改為 POST。舊的 `GET /navigate?target=...&url=...` 返回 400 + 遷移指引，詳見 `migration-2.5.3.md`。

### GET /back?target=ID
後退一頁。
```bash
curl -s "http://localhost:3456/back?target=ID"
```

### GET /info?target=ID
獲取頁面基礎資訊（title、url、readyState）。
```bash
curl -s "http://localhost:3456/info?target=ID"
```

### POST /eval?target=ID
執行 JavaScript 表示式，POST body 為 JS 程式碼。
```bash
curl -s -X POST "http://localhost:3456/eval?target=ID" -d 'document.title'
```

### POST /click?target=ID
JS 層面點選（`el.click()`），POST body 為 CSS 選擇器。自動 scrollIntoView 後點選。簡單快速，覆蓋大多數場景。
```bash
curl -s -X POST "http://localhost:3456/click?target=ID" -d 'button.submit'
```

### POST /clickAt?target=ID
CDP 瀏覽器級真實滑鼠點選（`Input.dispatchMouseEvent`），POST body 為 CSS 選擇器。先獲取元素座標，再模擬滑鼠按下/釋放。算真實使用者手勢，能觸發檔案對話方塊、繞過部分反自動化檢測。
```bash
curl -s -X POST "http://localhost:3456/clickAt?target=ID" -d 'button.upload'
```

### POST /setFiles?target=ID
給 file input 設定本地檔案路徑（`DOM.setFileInputFiles`），完全繞過檔案對話方塊。POST body 為 JSON。
```bash
curl -s -X POST "http://localhost:3456/setFiles?target=ID" -d '{"selector":"input[type=file]","files":["/path/to/file1.png","/path/to/file2.png"]}'
```

### GET /scroll?target=ID&y=3000&direction=down
滾動頁面。`direction` 可選 `down`（預設）、`up`、`top`、`bottom`。滾動後自動等待 800ms 供懶載入觸發。
```bash
curl -s "http://localhost:3456/scroll?target=ID&y=3000"
curl -s "http://localhost:3456/scroll?target=ID&direction=bottom"
```

### GET /screenshot?target=ID&file=/tmp/shot.png
截圖。指定 `file` 引數儲存到本地檔案；不指定則返回圖片二進位制。可選 `format=jpeg`。
```bash
curl -s "http://localhost:3456/screenshot?target=ID&file=/tmp/shot.png"
```

## /eval 使用提示

- POST body 為任意 JS 表示式，返回 `{ value }` 或 `{ error }`
- 支援 `awaitPromise`：可以寫 async 表示式
- 返回值必須是可序列化的（字串、數字、物件），DOM 節點不能直接返回，需要提取屬性
- 提取大量資料時用 `JSON.stringify()` 包裹，確保返回字串
- 根據頁面實際 DOM 結構編寫選擇器，不要套用固定模板

## 錯誤處理

| 錯誤 | 原因 | 解決 |
|------|------|------|
| `Chrome 未開啟遠端除錯埠` | Chrome 未開啟遠端除錯 | 提示使用者開啟 `chrome://inspect/#remote-debugging` 並勾選 Allow |
| `attach 失敗` | targetId 無效或 tab 已關閉 | 用 `/targets` 獲取最新列表 |
| `CDP 命令超時` | 頁面長時間未響應 | 重試或檢查 tab 狀態 |
| `埠已被佔用` | 另一個 proxy 已在執行 | 已有例項可直接複用 |
