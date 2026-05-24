# v2.5.3 遷移指南：`/new` 和 `/navigate` 改 POST body

## TL;DR

```diff
- curl -s "http://localhost:3456/new?url=https://example.com"
+ curl -s -X POST --data-raw 'https://example.com' http://localhost:3456/new

- curl -s "http://localhost:3456/navigate?target=ID&url=https://example.com"
+ curl -s -X POST --data-raw 'https://example.com' "http://localhost:3456/navigate?target=ID"
```

舊寫法收到 `400` + 包含本檔案路徑的錯誤資訊後，按下方對照表改寫呼叫。同時把發現的舊寫法在源站點經驗檔案中就地修正。

## 為什麼改

舊版 `/new?url=...` 把目標 URL 塞進 query 引數。當目標 URL 自帶 query（如小紅書筆記必須攜帶 `xsec_token`、B 站、微博的分享連結），proxy 用 `URL.searchParams` 解析時，目標 URL 裡未編碼的 `&` 會被當成 **proxy 自身的** query 分隔符，導致目標 URL 被錯誤切分、token 等關鍵引數丟失，頁面返回"內容不存在"或被反爬攔截。

例：

```
GET /new?url=https://xhs.com/explore/x?a=1&b=2
```

proxy 解析結果：
- `q.url = "https://xhs.com/explore/x?a=1"` ← 被截斷
- `q.b = "2"` ← 被當成 proxy 自己的引數吃掉

根因是用一種"帶語法的格式（query string）"承載另一種"也帶相同語法的資料（URL）"，存在結構性歧義。靠呼叫方守紀律做 URL-encode 治標不治本：Agent 偶爾忘記就翻車，且增加每次呼叫的 token 成本。

v2.5.3 把 URL 改為透過 **POST body** 傳入。HTTP body 是不透明位元組流（邊界由 `Content-Length` header 顯式宣告，與資料本身解耦），不存在任何分隔符歧義，URL 原樣傳輸，零編碼負擔。

## 轉換對照表

### `/new`

| 場景 | 舊（v2.5.2） | 新（v2.5.3） |
|---|---|---|
| 簡單 URL | `curl ".../new?url=https://example.com"` | `curl -X POST --data-raw 'https://example.com' .../new` |
| URL 含 query | `curl ".../new?url=https://xhs.com/explore/x?xsec_token=ABC"` ⚠️ token 丟失 | `curl -X POST --data-raw 'https://xhs.com/explore/x?xsec_token=ABC' .../new` ✓ |
| URL 含 `#` fragment | `curl ".../new?url=https://app/page#sec"` ⚠️ fragment 丟失 | `curl -X POST --data-raw 'https://app/page#sec' .../new` ✓ |

### `/navigate`

| 舊 | 新 |
|---|---|
| `curl ".../navigate?target=ID&url=URL"` | `curl -X POST --data-raw 'URL' ".../navigate?target=ID"` |

`target` 仍走 query（它是無特殊字元的不透明 ID，沒有歧義問題）。

## Agent 自檢 checklist

在遷移後的環境中工作時，遇到任何來源的 web-access 呼叫，按以下順序處理：

1. **判斷呼叫是否過時**：搜尋字串 `localhost:3456/new?url=` 或 `localhost:3456/navigate?` 後跟 `&url=`。這兩類模式屬於 v2.5.2 舊寫法。
2. **就地改寫**：按上表對照修改成 POST 形式。
3. **更新原始檔**：如果舊寫法來自 `references/site-patterns/*.md` 中某個站點經驗檔案，把原始檔也一併修正掉（不要只在當前呼叫上改）—— 這樣下次複用同一站點經驗時不會再踩坑。
4. **保留 URL 原樣**：POST body 是不透明位元組流，目標 URL 中的 `?`、`&`、`=`、`#`、`%` 等字元**無需任何轉義**，從 DOM/分享連結抓到什麼樣就傳什麼樣。

## FAQ

**Q: 我用 GET `?url=` 呼叫會發生什麼？**
A: 收到 HTTP 400 響應，body 中包含 `error`、`migration` 檔案路徑、`example` 示例。按提示改 POST 呼叫即可。

**Q: 為什麼不在 proxy 裡做相容（同時支援 GET 和 POST）？**
A: 相容路徑會留下永久的"啟發式擷取 query"程式碼 + SKILL.md 裡"也支援舊寫法"的腳註。兩條路徑長期共存 → Agent 學得不徹底、維護者兩套都要測、讀程式碼的人要分辨主路徑 vs 相容路徑。把架構債轉成了認知債。一次性 breaking change 配合遷移指南，更徹底也更便宜。

**Q: 我自己的指令碼/別名/筆記裡有大量舊寫法，有遷移指令碼嗎？**
A: 沒有也不打算提供。站點經驗和指令碼是人寫的檔案/程式碼，摻著說明、註釋、上下文判斷，正則替換容易誤傷。本指南的 Agent 自檢 checklist 就是給"Agent 看著內容自己判斷怎麼改"的，比指令碼可靠。

**Q: 還有哪些 endpoint 用 POST body？**
A: 一直都有：`/eval`、`/click`、`/clickAt`、`/setFiles` 全是 POST + body。這次 `/new` `/navigate` 加入後，**所有傳輸"任意字串載荷"的寫操作都統一走 POST body** —— 內部一致性提升。
