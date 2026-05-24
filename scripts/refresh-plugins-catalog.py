#!/usr/bin/env python3
"""
Refresh docs/claude-code-official-plugins-catalog.md from
`claude plugin list --available --json` output.

- Categorizes 23 functional groups by name+description keywords.
- Hand-written entries for popular plugins are overridden via CUSTOM dict.
- Generic entries use category-level templates.
- Optionally prints a diff (new/removed plugins) vs the existing catalog.

Usage:
    refresh-plugins-catalog.py --input plugins.json --output catalog.md [--diff]
"""

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path


def load_json_tolerant(path: Path) -> dict:
    """Parse JSON tolerantly — sometimes `claude plugin list` output has trailing junk."""
    raw = path.read_text()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Find last `]` and try closing with `}`
        for i in range(len(raw) - 1, 0, -1):
            if raw[i] == ']':
                try:
                    return json.loads(raw[: i + 1] + '}')
                except json.JSONDecodeError:
                    continue
        raise


def categorize(name: str, desc: str) -> str:
    n = name.lower()
    d = (desc or '').lower()
    if 'lsp' in n or 'language server' in d:
        return 'LSP'
    if 'output-style' in n or 'output style' in d:
        return 'OutputStyle'
    if any(k in n for k in ['simplifier', 'refactor', 'modernization', 'cleanup', 'conversion']):
        return 'Refactor'
    if any(k in n for k in ['code-review', 'pr-review', 'reviewer', 'coderabbit']):
        return 'CodeReview'
    if any(k in n for k in ['context7', 'serena', 'greptile', 'sourcegraph', 'codesearch', 'ast-grep', 'semgrep', 'sonarqube']):
        return 'CodeIntel'
    if any(k in n for k in ['security', 'crunch', 'aikido', 'endor', 'snyk', 'sast', 'vulnerability', 'nightvision', 'vanta', 'crowdstrike', 'jfrog', 'zscaler', 'sonatype', 'auth0']):
        return 'Security'
    if any(k in n for k in ['test', 'pytest', 'jest', 'mocha', 'cypress', 'vitest', 'fakechat']):
        return 'Testing'
    if any(k in n for k in ['playwright', 'puppeteer', 'browser', 'chrome', 'devtools', 'crawl', 'scrape', 'firecrawl', 'brightdata', 'nimble']):
        return 'BrowserScraping'
    if any(k in n for k in ['frontend-design', 'playground', 'figma', 'shadcn', 'tailwind', 'storybook', 'sanity', 'webflow', 'miro', 'cloudinary']):
        return 'DesignFrontend'
    if any(k in n for k in ['supabase', 'firebase', 'postgres', 'mysql', 'mongodb', 'redis', 'database', 'turso', 'planetscale', 'neon', 'cockroach', 'dynamodb', 'prisma', 'pinecone', 'qdrant', 'chroma', 'weaviate', 'alloydb', 'snowflake', 'clickhouse', 'dataverse', 'zilliz', 'atlan', 'box']):
        return 'Database'
    if any(k in n for k in ['vercel', 'netlify', 'render', 'fly', 'cloudflare', 'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'k8s', 'deploy', 'terraform', 'railway', 'expo', 'fastly']):
        return 'CloudDeploy'
    if any(k in n for k in ['stripe', 'paddle', 'lemon', 'paypal', 'square', 'payment', 'revenuecat', 'sumup', 'mercadopago']):
        return 'Payment'
    if any(k in n for k in ['slack', 'discord', 'telegram', 'whatsapp', 'twilio', 'imessage', 'zoom', 'intercom']):
        return 'Messaging'
    if any(k in n for k in ['linear', 'jira', 'atlassian', 'asana', 'monday', 'trello', 'clickup', 'notion']):
        return 'PM'
    if any(k in n for k in ['sentry', 'datadog', 'newrelic', 'logfire', 'honeycomb', 'grafana', 'prometheus', 'pagerduty', 'amplitude', 'posthog', 'dash0', 'fullstory']):
        return 'Monitoring'
    if any(k in n for k in ['gmail', 'email', 'mailgun', 'sendgrid', 'resend']):
        return 'Email'
    if any(k in n for k in ['airtable', 'sheets', 'baserow', 'remember', 'session-report', 'desktop-commander', 'postman', 'mintlify', 'microsoft-docs', 'circleback']):
        return 'Productivity'
    if any(k in n for k in ['openai', 'anthropic', 'llm', 'gemini', 'ollama', 'inference', 'huggingface', 'pydantic-ai', 'atomic-agents', 'qodo', 'datarobot', 'math-olympiad', 'fiftyone', 'agent-sdk', 'agentforce', 'mcp-server-dev', 'liquid-skills', 'youdotcom', 'cwc-makers', 'data-agent', 'rc', 'outputai']):
        return 'AIServices'
    if any(k in n for k in ['ralph', 'loop', 'autogen', 'superpowers']):
        return 'AgentLoop'
    if any(k in n for k in ['github', 'gitlab', 'bitbucket', 'commit', 'pr-', 'pull-request']):
        return 'GitDevOps'
    if any(k in n for k in ['skill-creator', 'plugin-dev', 'claude-md', 'claude-code-setup', 'hookify', 'init', 'feature-dev', 'commit-commands', 'agent-sdk-dev']):
        return 'DevWorkflow'
    if any(k in n for k in ['adobe', 'creativity', 'video', 'image', 'audio', 'spotify']):
        return 'Media'
    if any(k in n for k in ['data-engineering', 'astronomer', 'bigdata', 'data', 'spotify-ads']):
        return 'DataEng'
    if any(k in n for k in ['sap', 'salesforce', 'shopify', 'wordpress', 'wix', 'base44', 'ui5', 'qt-development', 'laravel-boost', 'quarkus', 'netsuite', 'servicenow', 'oracle', 'cds-mcp', 'legalzoom', 'apollo', 'bigdata-com', 'mintlify', 'pigment', 'amazon-location', 'windsor-ai', 'zapier', 'postiz']):
        return 'Enterprise'
    # Fallback overrides
    if name == 'ai-plugins':
        return 'Security'
    if name == 'exa':
        return 'BrowserScraping'
    return 'Other'


CAT_ORDER = [
    ('DevWorkflow', '開發 Workflow / Skill / Plugin 開發'),
    ('AgentLoop', 'Agent Loop / 進階能力增強'),
    ('CodeReview', 'Code Review / PR 審查'),
    ('CodeIntel', 'Code Intelligence / 文件搜尋'),
    ('Refactor', '重構 / 程式碼現代化'),
    ('LSP', 'LSP 語言伺服器'),
    ('OutputStyle', '輸出風格'),
    ('GitDevOps', 'Git / Repository'),
    ('BrowserScraping', '瀏覽器自動化 / 爬蟲'),
    ('DesignFrontend', '設計 / 前端'),
    ('CloudDeploy', '雲端 / 部署 / IaC'),
    ('Database', '資料庫 / 儲存'),
    ('Payment', '支付 / 訂閱'),
    ('Messaging', '訊息 / 通訊'),
    ('PM', '專案管理 / Issue 追蹤'),
    ('Monitoring', '監控 / Observability'),
    ('Email', '電子郵件'),
    ('Productivity', '生產力 / 工作流程'),
    ('AIServices', 'AI / Agent / ML 平台'),
    ('Security', '安全性 / 漏洞掃描'),
    ('Testing', '測試'),
    ('DataEng', '資料工程'),
    ('Media', '創意 / 媒體'),
    ('Enterprise', '企業 / 特定行業'),
    ('Other', '未分類'),
]

SCOPE_DEFAULT = {
    'DevWorkflow': 'user',
    'AgentLoop': 'user',
    'CodeReview': 'user',
    'CodeIntel': 'user',
    'Refactor': 'user',
    'LSP': 'user (主力語言) / project (次要)',
    'OutputStyle': 'user',
    'GitDevOps': 'user (GitHub) / project (其他)',
    'BrowserScraping': 'project',
    'DesignFrontend': 'project',
    'CloudDeploy': 'project',
    'Database': 'project',
    'Payment': 'project',
    'Messaging': 'project',
    'PM': 'project',
    'Monitoring': 'project',
    'Email': 'project',
    'Productivity': 'user (通用) / project (專案性)',
    'AIServices': 'project',
    'Security': 'user (通用) / project (特定 vendor)',
    'Testing': 'project',
    'DataEng': 'project',
    'Media': 'project',
    'Enterprise': 'project (有用該服務的專案才裝)',
    'Other': '視需求',
}

CATEGORY_TEMPLATE = {
    'DevWorkflow': '增強 Claude Code workflow，通用性高',
    'AgentLoop': 'Agent 進階能力，多步任務時派上用場',
    'CodeReview': 'PR / 程式碼審查自動化',
    'CodeIntel': 'Codebase / 文件理解強化',
    'Refactor': '程式碼整理 / 現代化',
    'LSP': '提供 IDE 級別的語言智能',
    'OutputStyle': '改變回應風格，個人偏好',
    'GitDevOps': 'Git / Repo 工作流程',
    'BrowserScraping': '瀏覽器/爬蟲；多數情境 web-access 已能涵蓋',
    'DesignFrontend': '設計 / 前端開發整合',
    'CloudDeploy': '雲端 / 部署平台整合，用該平台的專案才需要',
    'Database': '資料庫 MCP 整合，用該 DB 的專案才需要',
    'Payment': '金流整合，做 SaaS 才需要',
    'Messaging': '即時訊息整合，想接通知時',
    'PM': '專案管理 / Issue tracker 整合',
    'Monitoring': 'APM / 監控整合，有線上產品才用',
    'Email': '電子郵件 / 通訊整合',
    'Productivity': '日常工作流程強化',
    'AIServices': 'AI / Agent 框架，特定 ML workflow',
    'Security': '安全掃描 / 風險偵測',
    'Testing': '測試 workflow',
    'DataEng': '資料工程 / ETL pipeline',
    'Media': '創意 / 媒體處理',
    'Enterprise': '特定企業 / 行業專用，用該系統才需要',
    'Other': '視需求使用',
}

CUSTOM = {
    'frontend-design': ('生成高品質前端 UI，包含設計感、品味、互動細節', '寫 blog/demo 時的 prototype 神器；指令 `/frontend-design <需求>`'),
    'superpowers': ('教 Claude brainstorming、subagent 驅動開發、systematic debugging。覆蓋整個 workflow', '裝完後在會議式 prompt 直接用 `/superpowers` 子指令'),
    'context7': ('即時拉取最新版函式庫文件，避免訓練資料過時造成的 API 幻覺', '吹吹已在用；用 `mcp__context7__resolve-library-id` + `query-docs` 兩步'),
    'code-review': ('多 agent PR 自動審查 + 信心評分過濾誤報', '在有 diff 的分支跑 `/code-review`'),
    'code-simplifier': ('清理重複/過度複雜的程式碼，保留功能不變', '寫完後跑 `/code-simplifier <file>` 收尾'),
    'skill-creator': ('創建/改進/評估 skill。吹吹是 skill 維護者必裝', '用 `/skill-creator` 引導建立 SKILL.md 與測試'),
    'github': ('官方 GitHub MCP：開 issue、PR、search repo、review code', '`@github` 在對話中提及；常見：搜尋 repo、看 issue 列表'),
    'playwright': ('Microsoft 出的 browser automation MCP，能截圖、互動、抓網頁', '比 web-access 的 CDP 更標準化；適合非 login 的測試'),
    'claude-md-management': ('CLAUDE.md 品質審計、會議學習擷取、保持專案記憶最新', '吹吹寫 MEMORY.md 的延伸；用 `/claude-md:audit` 等指令'),
    'feature-dev': ('完整功能開發 workflow，含 codebase 探索 / 架構設計 / 品質', '新功能從零開始時用'),
    'typescript-lsp': ('TS/JS 智能提示、補全、refactor', '主力語言裝 user scope'),
    'ralph-loop': ('自我迭代 AI loop（Ralph Wiggum 技巧），單一檔案反覆精煉', '寫長文/長程式碼時用'),
    'security-guidance': ('編輯時警告 command injection、XSS、SQL injection 等 OWASP 風險', '通用品質防線，user scope'),
    'commit-commands': ('git commit / push / PR 整套指令', '吹吹常 commit，省事；`/commit`、`/pr`'),
    'claude-code-setup': ('分析 codebase 並推薦最適合的 hooks / skills / MCP / subagent', '新專案初始化用 `/claude-code-setup`'),
    'figma': ('讀 Figma 設計檔、提取 component / design token', '設計轉程式碼時用'),
    'vercel': ('管理部署、看 build log、設 domain', 'Next.js / 前端專案'),
    'supabase': ('Supabase MCP：DB 操作、auth、storage、realtime', '用 Supabase 後端的專案'),
    'pr-review-toolkit': ('PR 審查專用 agent 集，涵蓋 comments / tests / error handling 等', '處理大型 PR 時'),
    'pyright-lsp': ('Python type check（Pyright）', 'Python 主力裝 user scope；吹吹用 uv 必裝'),
    'telegram': ('Telegram 訊息 bridge，含 access control', '想用 TG 接通知時'),
    'serena': ('語意 codebase 分析 MCP，提供智能理解、refactor 建議', '大型 codebase navigation'),
    'atlassian': ('Jira + Confluence：search/create issues、文件、sprint', '用 Atlassian 工作的團隊'),
    'slack': ('搜訊息、頻道、thread', '想跟 Slack 整合時'),
    'chrome-devtools-mcp': ('控制即時 Chrome：performance trace、network、screenshot', '前端性能調校；跟 web-access 互補'),
    'agent-sdk-dev': ('Claude Agent SDK 開發工具集', '寫自訂 agent 時'),
    'plugin-dev': ('Plugin 開發工具集，7 個 skill 覆蓋 hooks/MCP/commands/agents', '寫自己的 plugin 時必裝'),
    'explanatory-output-style': ('回應時加入實作選擇的教育性說明', '想看 Claude 思考過程時'),
    'playground': ('產出互動 HTML playground，含 visual controls、live preview', '解釋概念 / 教學時用'),
    'hookify': ('從對話模式或指令自動生成 hook', '想擴充 Claude 行為時'),
    'greptile': ('AI codebase 搜尋與理解，自然語言查詢', '大型 repo 找東西'),
    'linear': ('Linear issue tracking 整合', '用 Linear 的團隊'),
    'learning-output-style': ('互動學習模式，要求你在決策點做小貢獻', '邊學邊用時'),
    'gitlab': ('GitLab DevOps 整合：repo、MR、CI/CD、issues、wiki', '用 GitLab 的團隊'),
    'sentry': ('錯誤監控整合，看 stack trace、search issues', '線上產品 debug'),
    'firecrawl': ('Web scraping，把網站轉 LLM-friendly markdown', '一次性大量爬資料；你已有 web-access 通常不用'),
    'stripe': ('Stripe 開發 plugin', '做金流的 SaaS'),
}


def render_plugin(name: str, count: int, desc: str, cat: str) -> str:
    short = (desc or '(無描述)').strip().replace('\n', ' ')
    why, how = CUSTOM.get(name, ('', ''))
    if not why:
        why = CATEGORY_TEMPLATE.get(cat, '視需求使用')
    if not how:
        how = f'`claude plugin install {name}@claude-plugins-official --scope <user|project>`'
    return f"""### `{name}` · ⬇ {count:,}

> {short}

- **為什麼會用**：{why}
- **怎麼用**：{how}

"""


HEADER = """# Claude Code 官方 Plugins 完整目錄（{total} 個）

**Marketplace**：`claude-plugins-official` (`anthropics/claude-plugins-official`)
**數據抓取日期**：{date}
**總數**：{total} 個官方 plugin
**安裝量資料**：來自 Claude Code marketplace 公開 metadata

---

## 目錄

- [Part 1：強烈推薦清單（吹吹版）](#part-1-強烈推薦清單)
- [Part 2：完整 {total} 個分類目錄](#part-2-完整-{total}-個分類目錄)

### Part 2 類別索引

"""

PART1 = """
---

## Part 1：強烈推薦清單

針對個人開發者（多專案、Claude Max、寫 blog / 維護 skill）的初始安裝建議。

### A. user scope 必裝（開發核心強化）

| 優先級 | Plugin | 安裝量 | 用途 |
|--------|--------|--------|------|
| ★★★ | `skill-creator` | 268k | 創建/改進 skill — 你是 skill 維護者，必裝 |
| ★★★ | `context7` | 337k | 即時文件查詢 — 你已在用 |
| ★★★ | `superpowers` | 713k | brainstorming、subagent、systematic debugging |
| ★★★ | `code-review` | 333k | 多 agent PR 自動審查 |
| ★★★ | `claude-md-management` | 213k | CLAUDE.md / MEMORY.md 維護 |
| ★★★ | `commit-commands` | 141k | git commit / push / PR workflow |
| ★★★ | `security-guidance` | 162k | 編輯時警告 OWASP 風險 |
| ★★ | `claude-code-setup` | 134k | 新專案初始化推薦 hooks/skills/MCP |
| ★★ | `plugin-dev` | 55k | Plugin 開發工具集 |
| ★★ | `hookify` | 49k | 從對話模式生成 hook |
| ★★ | `frontend-design` | 790k | 高品質前端 UI 生成 |
| ★★ | `code-simplifier` | 273k | 程式碼清理 |

### B. user scope（主力語言 LSP）

| Plugin | 用途 |
|--------|------|
| `typescript-lsp` | TS/JS — 常用 |
| `pyright-lsp` | Python type check — uv 專案 |

其他語言 LSP（gopls / rust-analyzer / csharp / kotlin / swift / lua / ruby / php / liquid / clangd / jdtls）按專案需要 project scope。

### C. project scope（按專案選用 MCP 整合）

| 類別 | 代表 |
|------|------|
| Repo / DevOps | `github`、`gitlab` |
| 瀏覽器 | `playwright`、`chrome-devtools-mcp`（web-access 已 cover 大部分） |
| 設計 | `figma`、`playground` |
| 部署 | `vercel`、`cloudflare`、`netlify-skills` |
| 後端服務 | `supabase`、`firebase`、`stripe`、`airtable` |
| 通訊 | `slack`、`telegram`、`discord` |
| PM | `linear`、`atlassian` (Jira/Confluence) |
| 監控 | `sentry`、`posthog`、`datadog` |

### D. 輸出風格（user scope，個人偏好）

| Plugin | 風格 |
|--------|------|
| `explanatory-output-style` | 加入實作選擇的教育性說明 |
| `learning-output-style` | 互動學習模式 |

### 批次安裝（推薦初始套餐）

```bash
# user scope 必裝
for p in skill-creator context7 superpowers code-review claude-md-management \\
         commit-commands security-guidance claude-code-setup plugin-dev \\
         hookify pyright-lsp typescript-lsp; do
  claude plugin install $p@claude-plugins-official --scope user
done
```
"""

APPENDIX = """
---

## 附錄

### A. 常用指令備忘

```bash
# 列已安裝
claude plugin list                              # 簡潔
claude plugin list --json                       # 完整含路徑、scope、enabled

# 列 marketplace
claude plugin marketplace list                  # 已註冊
claude plugin list --available --json           # marketplace 可裝清單（JSON）

# 看 plugin 詳情（含 token 成本估算）
claude plugin details <plugin-name>

# 安裝 / 移除
claude plugin install <name>@<marketplace> --scope <user|project|local>
claude plugin uninstall <name>
claude plugin enable <name>
claude plugin disable <name>
claude plugin update <name>                     # 更新後需重啟

# marketplace 管理
claude plugin marketplace add <repo-url>
claude plugin marketplace remove <name>
claude plugin marketplace update [name]         # 不帶 name 更新全部

# 清理未使用的相依
claude plugin prune
```

### B. Scope 含義

| Scope | 儲存位置 | 生效範圍 |
|-------|---------|---------|
| `user` | `~/.claude/settings.json` | 所有 session |
| `project` | `<project>/.claude/settings.json` | 該專案目錄內 |
| `local` | `<project>/.claude/settings.local.json` | 該專案目錄內，但不入版本控制 |

### C. 個人不推薦（你可能不會用到，但列出供參考）

以下類別 plugin 對你（個人開發者、macOS、Claude Max）**多半用不上**，除非具體業務需要：

- **企業 ERP / CRM**：`sap-mdk-server`、`sap-fiori-mcp-server`、`sap-cds-mcp`、`netsuite-suitecloud`、`servicenow-sdk`、`apollo`、`salesforce` 系列
- **電商平台**：`shopify`、`shopify-ai-toolkit`、`wix`、`wordpress.com`、`base44`
- **特定產業**：`legalzoom`（法律）、`amazon-location-service`（GIS）、`pigment`（FP&A）、`spotify-ads-api`
- **企業安全**：`crowdstrike-falcon-foundry`、`zscaler`、`vanta-mcp-plugin`、`jfrog`、`nightvision`
- **AWS 重度服務**：`aws-amplify`、`aws-data-analytics`、`aws-core`、`aws-agents`（用 Vercel/Cloudflare 替代）
- **資料倉儲**：`snowflake-cortex-code`、`databricks` 系列、`oracle-ai-data-platform-...`
- **特定 framework**：`ui5`、`ui5-typescript-conversion`、`qt-development-skills`、`quarkus-agent`

### D. 安裝量分布觀察

{install_distribution}

**Top 5**：{top5}

### E. 自動更新此目錄

```bash
./scripts/refresh-plugins-catalog.sh
```

該腳本會：
1. 跑 `claude plugin list --available --json` 抓最新 marketplace 資料
2. 解析、按 23 類分類、套用 template + 手寫覆寫
3. 重新生成本目錄並覆寫
4. 在 stdout 顯示新增 / 移除的 plugin 名單

建議每 1-2 個月跑一次，因為 marketplace 持續新增 plugin。

---

## 變更紀錄

- {date}：重新整理（{total} 個 plugin）
"""


def render_install_distribution(plugins: list[tuple[str, int, str]]) -> tuple[str, str]:
    buckets = {'100k+': 0, '10k–100k': 0, '1k–10k': 0, '< 1k': 0}
    for _, cnt, _ in plugins:
        if cnt >= 100_000:
            buckets['100k+'] += 1
        elif cnt >= 10_000:
            buckets['10k–100k'] += 1
        elif cnt >= 1_000:
            buckets['1k–10k'] += 1
        else:
            buckets['< 1k'] += 1

    table = '| 量級 | 數量 |\n|------|------|\n'
    for k, v in buckets.items():
        table += f'| {k} | {v} |\n'

    top = sorted(plugins, key=lambda p: -p[1])[:5]
    top_str = ' → '.join(f'`{n}` ({c // 1000}k)' for n, c, _ in top)
    return table, top_str


def render_catalog(plugins: list[dict], date: str) -> str:
    # Categorize
    groups = defaultdict(list)
    for p in plugins:
        cat = categorize(p['name'], p.get('description', ''))
        groups[cat].append(p)
    for k in groups:
        groups[k].sort(key=lambda p: -p.get('installCount', 0))

    total = len(plugins)
    out = HEADER.format(total=total, date=date)

    # Category TOC
    for cat_key, cat_name in CAT_ORDER:
        items = groups.get(cat_key, [])
        if items:
            anchor = cat_name.replace(' ', '-').replace('/', '-').replace('(', '').replace(')', '').lower()
            out += f'- [{cat_name} ({len(items)})](#{anchor})\n'

    out += PART1
    out += '\n---\n\n## Part 2：完整 ' + str(total) + ' 個分類目錄\n\n'

    for cat_key, cat_name in CAT_ORDER:
        items = groups.get(cat_key, [])
        if not items:
            continue
        out += f'### {cat_name} ({len(items)})\n\n'
        out += f'**Scope 預設**：{SCOPE_DEFAULT.get(cat_key, "視需求")}\n\n'
        for p in items:
            out += render_plugin(p['name'], p.get('installCount', 0), p.get('description', ''), cat_key)

    # Appendix
    flat = [(p['name'], p.get('installCount', 0), p.get('description', '')) for p in plugins]
    dist_table, top5 = render_install_distribution(flat)
    out += APPENDIX.format(install_distribution=dist_table, top5=top5, date=date, total=total)
    return out


def extract_existing_names(catalog_path: Path) -> set[str]:
    if not catalog_path.exists():
        return set()
    md = catalog_path.read_text()
    return set(re.findall(r'^### `([^`]+)` · ⬇', md, re.M))


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument('--input', required=True, type=Path, help='JSON from `claude plugin list --available --json`')
    p.add_argument('--output', required=True, type=Path, help='Catalog markdown output path')
    p.add_argument('--date', default=None, help='Override date string (default: today)')
    p.add_argument('--diff', action='store_true', help='Print added/removed plugins vs existing catalog')
    args = p.parse_args()

    data = load_json_tolerant(args.input)
    official = [p for p in data.get('available', []) if p.get('marketplaceName') == 'claude-plugins-official']
    if not official:
        print('ERROR: no official plugins found in input', file=sys.stderr)
        return 1

    new_names = {p['name'] for p in official}

    # Diff against existing
    if args.diff:
        old_names = extract_existing_names(args.output)
        added = sorted(new_names - old_names)
        removed = sorted(old_names - new_names)
        print(f'== Catalog diff ==')
        print(f'  existing: {len(old_names)} plugins')
        print(f'  new:      {len(new_names)} plugins')
        if added:
            print(f'  + ADDED ({len(added)}):')
            for n in added:
                print(f'      + {n}')
        if removed:
            print(f'  - REMOVED ({len(removed)}):')
            for n in removed:
                print(f'      - {n}')
        if not added and not removed:
            print('  (no plugin set changes)')
        print()

    # Render
    from datetime import date as _date
    date_str = args.date or _date.today().isoformat()
    md = render_catalog(official, date_str)
    args.output.write_text(md)
    print(f'wrote {args.output} ({len(md):,} bytes, {len(official)} plugins)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
