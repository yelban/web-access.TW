# 命名決策：為何 plugin/skill name 保留 `web-access` 而非 `web-access-tw`

**日期**：2026-05-24
**決策**：plugin name、skill name、安裝路徑 → 與上游一致用 `web-access`
**例外**：marketplace 頂層 name → `web-access-tw`（識別來源）

---

## 背景

第一輪 fork 在地化時，為「避免衝突」把所有 name/path 統一改為 `web-access-tw`：

- `plugin.json` `name`
- `marketplace.json` 頂層 `name` + `plugins[].name`
- `SKILL.md` frontmatter `name`
- 安裝路徑 `~/.claude/skills/web-access-tw`

實際使用後反思，發現這個決策過度設計，本文件記錄為何回退。

---

## 反思：「衝突」是真實風險嗎？

| 情境 | 是否真的會衝突 |
|------|-------------|
| 同一台機器同時裝上游 + 本 fork | ❌ 罕見場景，且翻譯版本本就是替代原版 |
| 同一 marketplace 內兩個同名 plugin | ❌ 不存在（不同 marketplace） |
| 不同 marketplace 註冊同名 plugin | ⚠️ marketplace name 已區隔，plugin name 不需再改 |
| 使用者註冊兩個叫 `web-access` 的 marketplace | ✅ **真實風險**，這才是唯一需要區隔的點 |

**結論**：只有「marketplace 來源混淆」是真實風險，其他都是想像出來的衝突。

---

## 改名帶來的反效果

### 1. 破壞 fork / 翻譯版慣例

| 專案類別 | 翻譯版本如何命名 |
|---------|--------------|
| Linux 多語言 doc | 保留原 name（`man-pages-zh_TW`、`man-pages` 為同一識別） |
| Docker 多語言 image | 保留原 image name |
| 開源軟體 i18n fork | 保留原 binary name（usability 第一） |

翻譯版本的設計目標是**無痛替代原版**，使用者切換時不該被迫改命令、改路徑、改設定。

### 2. site-patterns 經驗無法跨版本共享

`web-access` 設計有「站點經驗累積」機制，把網站操作經驗（URL pattern、平台特徵、已知陷阱）寫入：

```
${CLAUDE_SKILL_DIR}/references/site-patterns/<domain>.md
```

如果路徑分歧：

- 上游：`~/.claude/skills/web-access/references/site-patterns/`
- 改名版：`~/.claude/skills/web-access-tw/references/site-patterns/`

切版本時所有站點經驗（小紅書 xsec_token、Twitter URL pattern 等）全部斷掉，違背 skill 的核心價值。

### 3. 未來想切回上游成本變高

如果哪天上游加入正式繁體支援、或本 fork 停止維護，使用者切回上游需要：

- 改回路徑 `~/.claude/skills/web-access`
- 重新設定 `config.env`
- 重新累積站點經驗
- 改變所有教學/筆記中的命名

保留原 name 則只需 `claude plugin uninstall` + `claude plugin install` 即無痛切換。

### 4. fork 標示已經有更好的位置

README 開頭已有顯眼的 fork notice：

```markdown
> **這是繁體中文（台灣）在地化同步版本**
> 上游：[eze-is/web-access](https://github.com/eze-is/web-access) | 維護者：[@yelban](https://github.com/yelban)
> 所有內容已使用 OpenCC s2twp 轉換為繁體中文（台灣正體）。
```

plugin name 不需要再重複表達「我是繁體版」這件事。

### 5. 使用者體驗：mental map 成本

上游文章/教學寫 `web-access`，使用者得自行對應到 `web-access-tw`：

```
# 上游教學寫
claude plugin install web-access@web-access

# 使用者看到改名版要翻譯成
claude plugin install web-access-tw@web-access-tw  # 又難記又難打
```

---

## 決策方案：分層處理

| 元素 | 第一輪改的 | 本次決策 | 理由 |
|------|---------|---------|------|
| `plugin.json` `name` | `web-access-tw` | **`web-access`** | 識別功能本身，跟上游對齊 |
| `marketplace.json` 頂層 `name` | `web-access-tw` | **`web-access-tw`** | 識別來源（不同 GitHub repo），唯一保留的 `-tw` |
| `marketplace.json` `plugins[].name` | `web-access-tw` | **`web-access`** | 同 plugin.json |
| `SKILL.md` frontmatter `name` | `web-access-tw` | **`web-access`** | Claude Code skill 識別 |
| 安裝路徑 | `~/.claude/skills/web-access-tw` | **`~/.claude/skills/web-access`** | site-patterns 跨版本共享 |
| `description` / `author` / `keywords` 內 TW 標記 | 加 `(Traditional Chinese / Taiwan)` 等 | **保留** | 不影響識別，純資訊性標註 |

### 安裝指令對照

```bash
# 改名版（過度設計）
claude plugin marketplace add https://github.com/yelban/web-access.TW
claude plugin install web-access-tw@web-access-tw --scope user

# 回退版（本次決策）
claude plugin marketplace add https://github.com/yelban/web-access.TW
claude plugin install web-access@web-access-tw --scope user
#                    ^^^^^^^^^^   ^^^^^^^^^^^^^^
#                    與上游同名     不同來源
```

格式說明：`<plugin-name>@<marketplace-name>`

- plugin name (`web-access`)：標識「裝什麼功能」
- marketplace name (`web-access-tw`)：標識「從哪裡裝」

---

## 唯一保留 `-tw` 的副作用

如果使用者同時在同一台機器：

1. 註冊上游 marketplace（`web-access`）
2. 註冊本 fork marketplace（`web-access-tw`）
3. 嘗試 `claude plugin install web-access@???`

此時 Claude Code 會要求指定 marketplace 名稱（即 `@web-access` 或 `@web-access-tw`）。這正是**正確行為**：使用者必須明確選擇來源，避免「不知道裝到哪個」。

如果使用者同時 install 兩個來源的 `web-access`：

- 兩個 plugin 都會被當成同名 plugin 載入
- Claude Code 可能 error 或擇一覆蓋
- 這是**翻譯替代版的正確行為**：使用者不該同時用兩個版本

---

## 維護腳本同步更新

`apply-customizations.sh` 對應調整：

- 移除：`sed 's|skills/web-access$|skills/web-access-tw|g'`（不再改路徑）
- 移除：`sed 's|skills/web-access"|skills/web-access-tw"|g'`
- 移除：`sed 's|skills/web-access/|skills/web-access-tw/|g'`（cdp-api.md）
- 移除：`sed 's|^name: web-access$|name: web-access-tw|'`（SKILL.md）
- 移除：`sed 's|"name": "web-access"|"name": "web-access-tw"|'`（plugin.json）
- 保留：marketplace 頂層 name 改 `web-access-tw`（只改第一個 match）
- 保留：URL 改 fork、author 加 TW 標記、keywords 加 TW tag、fork notice 插入

---

## 後續若需要再次評估

本決策建立在以下假設上，若其中之一改變，可重新評估：

1. **使用者不會同時裝上游與本 fork** — 若實際使用情境改變，可能需要區隔
2. **Claude Code plugin 系統不會強制 plugin name 全域唯一** — 若未來改為強制唯一，可能需要改名
3. **上游維持英文 / 簡中為主** — 若上游加入官方繁中支援，本 fork 可考慮停止
4. **site-patterns 路徑保持為 skill-relative** — 若上游改為跨 skill 共享路徑，命名影響降低

---

## 參考

- 主要分析：[../docs (osx)/claude-code-permission-channels-privacy.md](https://github.com/yelban/notes)（私人筆記）
- 相關 commit：本次回退 commit
- 命名慣例參考：Linux 多語言 doc、Debian 翻譯團隊、Docker i18n image
