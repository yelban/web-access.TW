<div align="right">
  <details>
    <summary>🌐 Language</summary>
    <div>
      <div align="center">
        <a href="https://openaitx.github.io/view.html?user=eze-is&project=web-access&lang=en">English</a>
        | <a href="https://openaitx.github.io/view.html?user=eze-is&project=web-access&lang=zh-CN">簡體中文</a>
        | <a href="https://openaitx.github.io/view.html?user=eze-is&project=web-access&lang=zh-TW">繁體中文</a>
        | <a href="https://openaitx.github.io/view.html?user=eze-is&project=web-access&lang=ja">日本語</a>
        | <a href="https://openaitx.github.io/view.html?user=eze-is&project=web-access&lang=ko">한국어</a>
        | <a href="https://openaitx.github.io/view.html?user=eze-is&project=web-access&lang=fr">Français</a>
        | <a href="https://openaitx.github.io/view.html?user=eze-is&project=web-access&lang=de">Deutsch</a>
        | <a href="https://openaitx.github.io/view.html?user=eze-is&project=web-access&lang=es">Español</a>
        | <a href="https://openaitx.github.io/view.html?user=eze-is&project=web-access&lang=pt">Português</a>
        | <a href="https://openaitx.github.io/view.html?user=eze-is&project=web-access&lang=ru">Русский</a>
      </div>
    </div>
  </details>
</div>

<img width="879" height="376" alt="image" src="https://github.com/user-attachments/assets/a87fd816-a0b5-4264-b01c-9466eae90723" />

> **這是繁體中文（台灣）在地化同步版本**
>
> 上游：[eze-is/web-access](https://github.com/eze-is/web-access) | 維護者：[@yelban](https://github.com/yelban)
>
> 所有內容已使用 OpenCC s2twp 轉換為繁體中文（台灣正體）。


<p align="center">
  <b>給 AI Agent 裝上完整聯網能力的 Skill。</b><br/>
  <a href="https://web-access.eze.is">🌐 官網</a> · <a href="https://mp.weixin.qq.com/s/rps5YVB6TchT9npAaIWKCw">📖 設計詳解</a> · <a href="#安裝">⚡ 快速安裝</a>
</p>

AI Agent 原本的聯網能力（WebSearch、WebFetch）缺少排程策略和瀏覽器自動化能力。這個 Agent Skill 補上的是：**聯網策略 + CDP 瀏覽器操作 + 站點經驗積累**。相容所有支援 SKILL.md 的 Agent（Claude Code、Cursor、Gemini CLI、Codex CLI 等）。

> 推薦必讀：[Web Access：一個 Skill，拉滿 Agent 聯網和瀏覽器能力](https://mp.weixin.qq.com/s/rps5YVB6TchT9npAaIWKCw) ，完整介紹了 Web-Access Skill 的開發細節與 Agent Skill 設計哲學，幫助你也能寫出類似通用、高上限的 Skill

---

## v2.5.2 能力

| 能力 | 說明 |
|------|------|
| 聯網工具自動選擇 | WebSearch / WebFetch / curl / Jina / CDP，按場景自主判斷，可任意組合 |
| CDP Proxy 瀏覽器操作 | 直連使用者日常瀏覽器（Chrome / Edge / Chromium 系），天然攜帶登入態，支援動態頁面、互動操作、影片截幀 |
| 三種點選方式 | `/click`（JS click）、`/clickAt`（CDP 真實滑鼠事件）、`/setFiles`（檔案上傳） |
| 本地瀏覽器書籤/歷史檢索 | `find-url.mjs` 跨 Chrome / Edge 查詢公網搜不到的目標（內部系統）或使用者訪問過的頁面，支援關鍵詞/時間窗/訪問頻度排序 |
| 並行分治 | 多目標時分發子 Agent 並行執行，共享一個 Proxy，tab 級隔離 |
| 站點經驗積累 | 按域名儲存操作經驗（URL 模式、平台特徵、已知陷阱），跨 session 複用 |
| 媒體提取 | 從 DOM 直取圖片/影片 URL，或對影片任意時間點截幀分析 |

**v2.5.2 更新：**
- **Microsoft Edge 支援** — CDP Proxy 不再繫結 Chrome，新增 Edge 適配（及 Chromium、Chrome Canary 等 Chromium 系，透過同一套自動發現機制接入）。在 `edge://inspect/#remote-debugging` 勾選 "Allow remote debugging for this browser instance" 即可
- **瀏覽器偏好持久化** — 新增 `config.env`（gitignored，首次執行從模板建立），透過 `WEB_ACCESS_BROWSER` 固定預設瀏覽器；多瀏覽器同時開啟 toggle 時 Agent 會詢問偏好。也支援單次覆蓋 `--browser <chrome|edge>`
- **不擅自降級** — 偏好/指定的瀏覽器沒啟動或沒開 toggle 時硬錯並給出明確處理步驟，不會悄悄連到別的瀏覽器；proxy 首次成功連線後 pin 住瀏覽器 id，避免執行中漂移
- **find-url 也支援 Edge** — 本地書籤/歷史檢索預設遍歷 Chrome 與 Edge，可用 `--browser <chrome|edge>` 限定單一瀏覽器

<details><summary>v2.5.0 更新</summary>

- **本地 Chrome 資源檢索** — 新增 `scripts/find-url.mjs`，從本地 Chrome 書籤/歷史按關鍵詞/時間窗/訪問頻度定位 URL。典型場景：使用者提到組織內部系統（"我們的 XX 平台"等公網搜不到的目標）、回查之前訪問過但不記得地址的頁面、檢視最近高頻訪問網站等（場景感謝 @MVPGFC 在 #60 提出）
</details>

<details><summary>v2.4.3 更新</summary>

- **修復 CLAUDE_SKILL_DIR 路徑問題** — bash 程式碼塊改用 `${CLAUDE_SKILL_DIR}` 字串替換語法，修復 Windows Git Bash 路徑轉換錯誤和變數未設定問題（#47 #46）
- **站點經驗列表合併到前置檢查** — 啟動檢查通過後自動輸出已有站點經驗列表，移除不可靠的 `!` 內聯注入
</details>

<details><summary>v2.4.1 更新</summary>

- **跨平台支援** — 指令碼從 bash 遷移到 Node.js，Windows / Linux / macOS 均可使用
- **DOM 邊界穿透** — 新增技術事實：eval 遞迴遍歷可穿透 Shadow DOM、iframe 等選擇器不可跨越的邊界
</details>

<details><summary>v2.4 更新</summary>

- **站點內 URL 可靠性** — 新增事實說明：站點生成的連結自帶完整上下文，手動構造的 URL 可能缺失隱式必要引數
- **平台錯誤提示不可信** — 新增技術事實：平台返回的"內容不存在"等提示可能是訪問方式問題而非內容本身問題
- **小紅書站點經驗增強** — xsec_token 機制、創作者平台狀態校驗、暫存草稿流程
</details>

<details><summary>v2.3 更新</summary>

- **瀏覽哲學重構** — 更清晰的「像人一樣思考」框架，強調目標驅動而非步驟驅動
- **Jina 積極推薦** — 明確鼓勵在合適場景主動使用 Jina 節省 token
- **子 Agent prompt 指引最佳化** — 明確載入寫法，增加避免動詞暗示執行方式的說明
</details>

## 安裝

**方式一：npx skills 一鍵安裝（推薦）**

```bash
npx skills add yelban/web-access.TW
```

> [skills CLI](https://github.com/vercel-labs/skills) 是開源的 Agent Skill 包管理器，自動檢測你的 Agent 環境並安裝到正確位置。

**方式二：讓 Agent 自動安裝**

```
幫我安裝這個 skill：https://github.com/yelban/web-access.TW
```

**方式三：Plugin 安裝（Claude Code）**

```bash
claude plugin marketplace add https://github.com/yelban/web-access.TW
claude plugin install web-access@web-access --scope user
```

**方式四：手動**

```bash
git clone https://github.com/yelban/web-access.TW ~/.claude/skills/web-access-tw
```

## 前置配置（CDP 模式）

CDP 模式需要 **Node.js 22+** 和瀏覽器（Chrome / Edge）開啟遠端除錯：

1. 在你想用的瀏覽器位址列開啟對應 inspect 頁面：
   - Chrome：`chrome://inspect/#remote-debugging`
   - Edge：`edge://inspect/#remote-debugging`
2. 勾選 **Allow remote debugging for this browser instance**（可能需要重啟瀏覽器）

### 瀏覽器偏好（config.env）

skill 長期偏好儲存在 `${CLAUDE_SKILL_DIR}/config.env`（首次執行自動從 `config.env.template` 建立，gitignored）：

```bash
# 留空 = 每次啟動都詢問偏好；設值 = 固定使用該瀏覽器
WEB_ACCESS_BROWSER=edge
```

合法值：`chrome` / `edge`

**臨時用別的瀏覽器**（不修改 config.env）：

```bash
node "${CLAUDE_SKILL_DIR}/scripts/check-deps.mjs" --browser chrome
```

**切換瀏覽器**（proxy 已連線舊的）：

```bash
pkill -f cdp-proxy.mjs && node "${CLAUDE_SKILL_DIR}/scripts/check-deps.mjs"
```

環境檢查（Agent 執行時會自動完成前置檢查，無需手動執行）：

```bash
node "${CLAUDE_SKILL_DIR}/scripts/check-deps.mjs"
# $CLAUDE_SKILL_DIR 是 skill 載入時自動設定的環境變數
# 手動執行請替換為實際路徑，如 ~/.claude/skills/web-access-tw
```

## CDP Proxy API

Proxy 透過 WebSocket 直連瀏覽器（相容 `chrome://inspect` / `edge://inspect` 方式，無需命令列引數啟動），提供 HTTP API：

```bash
# 啟動（Agent 會自動管理 Proxy 生命週期，無需手動啟動）
node "${CLAUDE_SKILL_DIR}/scripts/cdp-proxy.mjs" &

# 頁面操作
curl -s -X POST --data-raw 'https://example.com' http://localhost:3456/new  # 新建 tab（v2.5.3 起 URL 走 POST body）
curl -s -X POST "http://localhost:3456/eval?target=ID" -d 'document.title'  # 執行 JS
curl -s -X POST "http://localhost:3456/click?target=ID" -d 'button.submit'  # JS 點選
curl -s -X POST "http://localhost:3456/clickAt?target=ID" -d '.upload-btn'  # 真實滑鼠點選
curl -s -X POST "http://localhost:3456/setFiles?target=ID" \
  -d '{"selector":"input[type=file]","files":["/path/to/file.png"]}'        # 檔案上傳
curl -s "http://localhost:3456/screenshot?target=ID&file=/tmp/shot.png"     # 截圖
curl -s "http://localhost:3456/scroll?target=ID&direction=bottom"           # 滾動
curl -s "http://localhost:3456/close?target=ID"                             # 關閉 tab
curl -s "http://localhost:3456/health"                                      # 檢視狀態（含 managedTabs 數量）
```

Proxy 會自動追蹤透過 `/new` 建立的 tab，閒置 15 分鐘後自動關閉，防止 Agent 異常退出時留下孤兒 tab。可透過環境變數 `CDP_TAB_IDLE_TIMEOUT`（單位毫秒）調整超時時間。

## ⚠️ 使用前提醒

透過瀏覽器自動化操作社交平台（如小紅書）存在賬號被平台限流或封禁的風險。**強烈建議使用小號進行操作。**

## 使用

安裝後直接讓 Agent 執行聯網任務，skill 自動接管：

- "幫我搜索 xxx 最新進展"
- "讀一下這個頁面：[URL]"
- "去小紅書搜尋 xxx 的賬號"
- "幫我在創作者平台發一篇圖文"
- "同時調研這 5 個產品的官網，給我對比摘要"

## 設計哲學

> Skill = 哲學 + 技術事實，不是操作手冊。講清 tradeoff 讓 AI 自己選，不替它推理。

詳見 [SKILL.md](./SKILL.md) 中的瀏覽哲學部分。

## License

MIT · 作者：[一澤 Eze](https://github.com/eze-is) · [官網](https://web-access.eze.is)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=eze-is/web-access&type=Date)](https://star-history.com/#eze-is/web-access&Date)

## Clawhub Download History

[![Download History](https://skill-history.com/chart/yelban/web-access.TW.svg)](https://skill-history.com/yelban/web-access.TW)

<img width="1280" height="306" alt="image" src="https://github.com/user-attachments/assets/2afa25c2-3730-413e-b40f-94e52567249d" />
