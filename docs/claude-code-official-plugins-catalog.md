# Claude Code 官方 Plugins 完整目錄（172 個）

**Marketplace**：`claude-plugins-official` (`anthropics/claude-plugins-official`)
**數據抓取日期**：2026-05-24
**總數**：172 個官方 plugin
**安裝量資料**：來自 Claude Code marketplace 公開 metadata

---

## 目錄

- [Part 1：強烈推薦清單（吹吹版）](#part-1-強烈推薦清單)
- [Part 2：完整 172 個分類目錄](#part-2-完整-172-個分類目錄)

### Part 2 類別索引

- [開發 Workflow / Skill / Plugin 開發 (6)](#開發-workflow---skill---plugin-開發)
- [Agent Loop / 進階能力增強 (2)](#agent-loop---進階能力增強)
- [Code Review / PR 審查 (3)](#code-review---pr-審查)
- [Code Intelligence / 文件搜尋 (5)](#code-intelligence---文件搜尋)
- [重構 / 程式碼現代化 (3)](#重構---程式碼現代化)
- [LSP 語言伺服器 (14)](#lsp-語言伺服器)
- [輸出風格 (2)](#輸出風格)
- [Git / Repository (3)](#git---repository)
- [瀏覽器自動化 / 爬蟲 (6)](#瀏覽器自動化---爬蟲)
- [設計 / 前端 (6)](#設計---前端)
- [雲端 / 部署 / IaC (16)](#雲端---部署---iac)
- [資料庫 / 儲存 (18)](#資料庫---儲存)
- [支付 / 訂閱 (4)](#支付---訂閱)
- [訊息 / 通訊 (8)](#訊息---通訊)
- [專案管理 / Issue 追蹤 (4)](#專案管理---issue-追蹤)
- [監控 / Observability (8)](#監控---observability)
- [生產力 / 工作流程 (8)](#生產力---工作流程)
- [AI / Agent / ML 平台 (17)](#ai---agent---ml-平台)
- [安全性 / 漏洞掃描 (11)](#安全性---漏洞掃描)
- [測試 (1)](#測試)
- [資料工程 (4)](#資料工程)
- [創意 / 媒體 (2)](#創意---媒體)
- [企業 / 特定行業 (21)](#企業---特定行業)


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
for p in skill-creator context7 superpowers code-review claude-md-management \
         commit-commands security-guidance claude-code-setup plugin-dev \
         hookify pyright-lsp typescript-lsp; do
  claude plugin install $p@claude-plugins-official --scope user
done
```


---

## Part 2：完整 172 個分類目錄

### 開發 Workflow / Skill / Plugin 開發 (6)

**Scope 預設**：user

### `skill-creator` · ⬇ 268,237

> Create new skills, improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, update or optimize an existing skill, run evals to test a skill, or benchmark skill performance with variance analysis.

- **為什麼會用**：創建/改進/評估 skill。吹吹是 skill 維護者必裝
- **怎麼用**：用 `/skill-creator` 引導建立 SKILL.md 與測試

### `claude-md-management` · ⬇ 213,170

> Tools to maintain and improve CLAUDE.md files - audit quality, capture session learnings, and keep project memory current.

- **為什麼會用**：CLAUDE.md 品質審計、會議學習擷取、保持專案記憶最新
- **怎麼用**：吹吹寫 MEMORY.md 的延伸；用 `/claude-md:audit` 等指令

### `feature-dev` · ⬇ 211,361

> Comprehensive feature development workflow with specialized agents for codebase exploration, architecture design, and quality review

- **為什麼會用**：完整功能開發 workflow，含 codebase 探索 / 架構設計 / 品質
- **怎麼用**：新功能從零開始時用

### `claude-code-setup` · ⬇ 134,609

> Analyze codebases and recommend tailored Claude Code automations such as hooks, skills, MCP servers, and subagents.

- **為什麼會用**：分析 codebase 並推薦最適合的 hooks / skills / MCP / subagent
- **怎麼用**：新專案初始化用 `/claude-code-setup`

### `plugin-dev` · ⬇ 55,797

> Comprehensive toolkit for developing Claude Code plugins. Includes 7 expert skills covering hooks, MCP integration, commands, agents, and best practices. AI-assisted plugin creation and validation.

- **為什麼會用**：Plugin 開發工具集，7 個 skill 覆蓋 hooks/MCP/commands/agents
- **怎麼用**：寫自己的 plugin 時必裝

### `hookify` · ⬇ 49,405

> Easily create custom hooks to prevent unwanted behaviors by analyzing conversation patterns or from explicit instructions. Define rules via simple markdown files.

- **為什麼會用**：從對話模式或指令自動生成 hook
- **怎麼用**：想擴充 Claude 行為時

### Agent Loop / 進階能力增強 (2)

**Scope 預設**：user

### `superpowers` · ⬇ 713,185

> Superpowers teaches Claude brainstorming, subagent driven development with built in code review, systematic debugging, and red/green TDD. Additionally, it teaches Claude how to author and test new skills.

- **為什麼會用**：教 Claude brainstorming、subagent 驅動開發、systematic debugging。覆蓋整個 workflow
- **怎麼用**：裝完後在會議式 prompt 直接用 `/superpowers` 子指令

### `ralph-loop` · ⬇ 171,129

> Interactive self-referential AI loops for iterative development, implementing the Ralph Wiggum technique. Claude works on the same task repeatedly, seeing its previous work, until completion.

- **為什麼會用**：自我迭代 AI loop（Ralph Wiggum 技巧），單一檔案反覆精煉
- **怎麼用**：寫長文/長程式碼時用

### Code Review / PR 審查 (3)

**Scope 預設**：user

### `code-review` · ⬇ 333,535

> Automated code review for pull requests using multiple specialized agents with confidence-based scoring to filter false positives

- **為什麼會用**：多 agent PR 自動審查 + 信心評分過濾誤報
- **怎麼用**：在有 diff 的分支跑 `/code-review`

### `pr-review-toolkit` · ⬇ 93,829

> Comprehensive PR review agents specializing in comments, tests, error handling, type design, code quality, and code simplification

- **為什麼會用**：PR 審查專用 agent 集，涵蓋 comments / tests / error handling 等
- **怎麼用**：處理大型 PR 時

### `coderabbit` · ⬇ 25,306

> Your code review partner. CodeRabbit provides external validation using a specialized AI architecture and 40+ integrated static analyzers—offering a different perspective that catches bugs, security vulnerabilities, logic errors, and edge cases. Context-aware analysis via AST parsing and codegraph relationships. Automatically incorporates CLAUDE.md and project coding guidelines into reviews. Useful after writing or modifying code, before commits, when implementing complex or security-sensitive logic, or when a second opinion would increase confidence in the changes. Returns specific findings with suggested fixes that can be applied immediately. Free to use.

- **為什麼會用**：PR / 程式碼審查自動化
- **怎麼用**：`claude plugin install coderabbit@claude-plugins-official --scope <user|project>`

### Code Intelligence / 文件搜尋 (5)

**Scope 預設**：user

### `context7` · ⬇ 337,289

> Upstash Context7 MCP server for up-to-date documentation lookup. Pull version-specific documentation and code examples directly from source repositories into your LLM context.

- **為什麼會用**：即時拉取最新版函式庫文件，避免訓練資料過時造成的 API 幻覺
- **怎麼用**：吹吹已在用；用 `mcp__context7__resolve-library-id` + `query-docs` 兩步

### `greptile` · ⬇ 48,997

> AI-powered codebase search and understanding. Query your repositories using natural language to find relevant code, understand dependencies, and get contextual answers about your codebase architecture.

- **為什麼會用**：AI codebase 搜尋與理解，自然語言查詢
- **怎麼用**：大型 repo 找東西

### `semgrep` · ⬇ 14,968

> Semgrep catches security vulnerabilities in real-time and guides Claude to write secure code from the start.

- **為什麼會用**：Codebase / 文件理解強化
- **怎麼用**：`claude plugin install semgrep@claude-plugins-official --scope <user|project>`

### `sourcegraph` · ⬇ 9,197

> Code search and understanding across codebases. Search, read, and trace references across repositories; analyze refactor impact; investigate incidents via commit and diff search; run targeted security sweeps.

- **為什麼會用**：Codebase / 文件理解強化
- **怎麼用**：`claude plugin install sourcegraph@claude-plugins-official --scope <user|project>`

### `sonarqube` · ⬇ 2,663

> Automatically enforce SonarQube code quality and security in the agent coding loop — 7,000+ rules, secrets scanning, agentic analysis, and quality gates across 40+ languages. PostToolUse hooks run analysis after every file edit. Pre-tool secrets scanning prevents 450+ patterns from reaching the LLM. Slash commands give on-demand access to quality gate status, coverage, duplication, and dependency risks. Includes SonarQube CLI, MCP Server, skills, hooks, and slash commands.

- **為什麼會用**：Codebase / 文件理解強化
- **怎麼用**：`claude plugin install sonarqube@claude-plugins-official --scope <user|project>`

### 重構 / 程式碼現代化 (3)

**Scope 預設**：user

### `code-simplifier` · ⬇ 273,543

> Agent that simplifies and refines code for clarity, consistency, and maintainability while preserving functionality. Focuses on recently modified code.

- **為什麼會用**：清理重複/過度複雜的程式碼，保留功能不變
- **怎麼用**：寫完後跑 `/code-simplifier <file>` 收尾

### `code-modernization` · ⬇ 1,530

> Modernize legacy codebases (COBOL, legacy Java/C++, monolith web apps) with a structured assess / map / extract-rules / reimagine / transform / harden workflow and specialist review agents

- **為什麼會用**：程式碼整理 / 現代化
- **怎麼用**：`claude plugin install code-modernization@claude-plugins-official --scope <user|project>`

### `ui5-typescript-conversion` · ⬇ 1,133

> SAPUI5 / OpenUI5 plugin for Claude. Convert JavaScript based UI5 projects to TypeScript.

- **為什麼會用**：程式碼整理 / 現代化
- **怎麼用**：`claude plugin install ui5-typescript-conversion@claude-plugins-official --scope <user|project>`

### LSP 語言伺服器 (14)

**Scope 預設**：user (主力語言) / project (次要)

### `typescript-lsp` · ⬇ 171,531

> TypeScript/JavaScript language server for enhanced code intelligence

- **為什麼會用**：TS/JS 智能提示、補全、refactor
- **怎麼用**：主力語言裝 user scope

### `pyright-lsp` · ⬇ 88,202

> Python language server (Pyright) for type checking and code intelligence

- **為什麼會用**：Python type check（Pyright）
- **怎麼用**：Python 主力裝 user scope；吹吹用 uv 必裝

### `serena` · ⬇ 79,844

> Semantic code analysis MCP server providing intelligent code understanding, refactoring suggestions, and codebase navigation through language server protocol integration.

- **為什麼會用**：語意 codebase 分析 MCP，提供智能理解、refactor 建議
- **怎麼用**：大型 codebase navigation

### `csharp-lsp` · ⬇ 34,840

> C# language server for code intelligence

- **為什麼會用**：提供 IDE 級別的語言智能
- **怎麼用**：`claude plugin install csharp-lsp@claude-plugins-official --scope <user|project>`

### `gopls-lsp` · ⬇ 34,007

> Go language server for code intelligence and refactoring

- **為什麼會用**：提供 IDE 級別的語言智能
- **怎麼用**：`claude plugin install gopls-lsp@claude-plugins-official --scope <user|project>`

### `rust-analyzer-lsp` · ⬇ 29,275

> Rust language server for code intelligence and analysis

- **為什麼會用**：提供 IDE 級別的語言智能
- **怎麼用**：`claude plugin install rust-analyzer-lsp@claude-plugins-official --scope <user|project>`

### `jdtls-lsp` · ⬇ 26,854

> Java language server (Eclipse JDT.LS) for code intelligence

- **為什麼會用**：提供 IDE 級別的語言智能
- **怎麼用**：`claude plugin install jdtls-lsp@claude-plugins-official --scope <user|project>`

### `php-lsp` · ⬇ 26,686

> PHP language server (Intelephense) for code intelligence

- **為什麼會用**：提供 IDE 級別的語言智能
- **怎麼用**：`claude plugin install php-lsp@claude-plugins-official --scope <user|project>`

### `clangd-lsp` · ⬇ 23,789

> C/C++ language server (clangd) for code intelligence

- **為什麼會用**：提供 IDE 級別的語言智能
- **怎麼用**：`claude plugin install clangd-lsp@claude-plugins-official --scope <user|project>`

### `kotlin-lsp` · ⬇ 19,274

> Kotlin language server for code intelligence

- **為什麼會用**：提供 IDE 級別的語言智能
- **怎麼用**：`claude plugin install kotlin-lsp@claude-plugins-official --scope <user|project>`

### `swift-lsp` · ⬇ 19,252

> Swift language server (SourceKit-LSP) for code intelligence

- **為什麼會用**：提供 IDE 級別的語言智能
- **怎麼用**：`claude plugin install swift-lsp@claude-plugins-official --scope <user|project>`

### `lua-lsp` · ⬇ 13,044

> Lua language server for code intelligence

- **為什麼會用**：提供 IDE 級別的語言智能
- **怎麼用**：`claude plugin install lua-lsp@claude-plugins-official --scope <user|project>`

### `ruby-lsp` · ⬇ 6,646

> Ruby language server for code intelligence and analysis

- **為什麼會用**：提供 IDE 級別的語言智能
- **怎麼用**：`claude plugin install ruby-lsp@claude-plugins-official --scope <user|project>`

### `liquid-lsp` · ⬇ 754

> LSP integration for Shopify Liquid templates via the Shopify CLI theme language server.

- **為什麼會用**：提供 IDE 級別的語言智能
- **怎麼用**：`claude plugin install liquid-lsp@claude-plugins-official --scope <user|project>`

### 輸出風格 (2)

**Scope 預設**：user

### `explanatory-output-style` · ⬇ 54,683

> Adds educational insights about implementation choices and codebase patterns (mimics the deprecated Explanatory output style)

- **為什麼會用**：回應時加入實作選擇的教育性說明
- **怎麼用**：想看 Claude 思考過程時

### `learning-output-style` · ⬇ 35,532

> Interactive learning mode that requests meaningful code contributions at decision points (mimics the unshipped Learning output style)

- **為什麼會用**：互動學習模式，要求你在決策點做小貢獻
- **怎麼用**：邊學邊用時

### Git / Repository (3)

**Scope 預設**：user (GitHub) / project (其他)

### `github` · ⬇ 253,259

> Official GitHub MCP server for repository management. Create issues, manage pull requests, review code, search repositories, and interact with GitHub's full API directly from Claude Code.

- **為什麼會用**：官方 GitHub MCP：開 issue、PR、search repo、review code
- **怎麼用**：`@github` 在對話中提及；常見：搜尋 repo、看 issue 列表

### `commit-commands` · ⬇ 141,037

> Commands for git commit workflows including commit, push, and PR creation

- **為什麼會用**：git commit / push / PR 整套指令
- **怎麼用**：吹吹常 commit，省事；`/commit`、`/pr`

### `gitlab` · ⬇ 32,393

> GitLab DevOps platform integration. Manage repositories, merge requests, CI/CD pipelines, issues, and wikis. Full access to GitLab's comprehensive DevOps lifecycle tools.

- **為什麼會用**：GitLab DevOps 整合：repo、MR、CI/CD、issues、wiki
- **怎麼用**：用 GitLab 的團隊

### 瀏覽器自動化 / 爬蟲 (6)

**Scope 預設**：project

### `playwright` · ⬇ 238,220

> Browser automation and end-to-end testing MCP server by Microsoft. Enables Claude to interact with web pages, take screenshots, fill forms, click elements, and perform automated browser testing workflows.

- **為什麼會用**：Microsoft 出的 browser automation MCP，能截圖、互動、抓網頁
- **怎麼用**：比 web-access 的 CDP 更標準化；適合非 login 的測試

### `chrome-devtools-mcp` · ⬇ 64,569

> Control and inspect a live Chrome browser from your coding agent. Record performance traces, analyze network requests, check console messages with source-mapped stack traces, and automate browser actions with Puppeteer.

- **為什麼會用**：控制即時 Chrome：performance trace、network、screenshot
- **怎麼用**：前端性能調校；跟 web-access 互補

### `firecrawl` · ⬇ 29,027

> Web scraping and crawling powered by Firecrawl. Turn any website into clean, LLM-ready markdown or structured data. Scrape single pages, crawl entire sites, search the web, and extract structured information. Includes an AI agent for autonomous multi-source data gathering - just describe what you need and it finds, navigates, and extracts automatically.

- **為什麼會用**：Web scraping，把網站轉 LLM-friendly markdown
- **怎麼用**：一次性大量爬資料；你已有 web-access 通常不用

### `nimble` · ⬇ 1,945

> Nimble web data toolkit — search, extract, map, crawl the web and work with structured data agents

- **為什麼會用**：瀏覽器/爬蟲；多數情境 web-access 已能涵蓋
- **怎麼用**：`claude plugin install nimble@claude-plugins-official --scope <user|project>`

### `exa` · ⬇ 1,616

> Exa AI web search, deep research, and content extraction. Provides MCP tools and research skills for comprehensive web search, people discovery, company research, academic papers, and more.

- **為什麼會用**：瀏覽器/爬蟲；多數情境 web-access 已能涵蓋
- **怎麼用**：`claude plugin install exa@claude-plugins-official --scope <user|project>`

### `brightdata-plugin` · ⬇ 1,210

> Web scraping, Google search, structured data extraction, and MCP server integration powered by Bright Data. Includes 7 skills: scrape any webpage as markdown (with bot detection/CAPTCHA bypass), search Google with structured JSON results, extract data from 40+ websites (Amazon, LinkedIn, Instagram, TikTok, YouTube, and more), orchestrate Bright Data's 60+ MCP tools, built-in best practices for Web Unlocker, SERP API, Web Scraper API, and Browser API, Python SDK best practices for the brightda...

- **為什麼會用**：瀏覽器/爬蟲；多數情境 web-access 已能涵蓋
- **怎麼用**：`claude plugin install brightdata-plugin@claude-plugins-official --scope <user|project>`

### 設計 / 前端 (6)

**Scope 預設**：project

### `frontend-design` · ⬇ 790,806

> Create distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished code that avoids generic AI aesthetics.

- **為什麼會用**：生成高品質前端 UI，包含設計感、品味、互動細節
- **怎麼用**：寫 blog/demo 時的 prototype 神器；指令 `/frontend-design <需求>`

### `figma` · ⬇ 131,854

> Figma design platform integration. Access design files, extract component information, read design tokens, and translate designs into code. Bridge the gap between design and development workflows.

- **為什麼會用**：讀 Figma 設計檔、提取 component / design token
- **怎麼用**：設計轉程式碼時用

### `playground` · ⬇ 49,784

> Creates interactive HTML playgrounds — self-contained single-file explorers with visual controls, live preview, and prompt output with copy button. Includes templates for design playgrounds, data explorers, concept maps, and document critique.

- **為什麼會用**：產出互動 HTML playground，含 visual controls、live preview
- **怎麼用**：解釋概念 / 教學時用

### `cloudinary` · ⬇ 1,627

> Use Cloudinary directly in Claude. Manage assets, apply transformations, optimize media, and more through natural conversation.

- **為什麼會用**：設計 / 前端開發整合
- **怎麼用**：`claude plugin install cloudinary@claude-plugins-official --scope <user|project>`

### `miro` · ⬇ 1,392

> Secure access to Miro boards. Enables AI to read board context, create diagrams, and generate code with enterprise-grade security.

- **為什麼會用**：設計 / 前端開發整合
- **怎麼用**：`claude plugin install miro@claude-plugins-official --scope <user|project>`

### `sanity` · ⬇ 1,072

> Sanity content platform integration with MCP server, agent skills, and slash commands. Query and author content, build and optimize GROQ queries, design schemas, and set up Visual Editing.

- **為什麼會用**：設計 / 前端開發整合
- **怎麼用**：`claude plugin install sanity@claude-plugins-official --scope <user|project>`

### 雲端 / 部署 / IaC (16)

**Scope 預設**：project

### `vercel` · ⬇ 130,848

> Vercel deployment platform integration. Manage deployments, check build status, access logs, configure domains, and control your frontend infrastructure directly from Claude Code.

- **為什麼會用**：管理部署、看 build log、設 domain
- **怎麼用**：Next.js / 前端專案

### `cloudflare` · ⬇ 7,550

> Skills for the Cloudflare developer platform: Workers, Durable Objects, Agents SDK, MCP servers, Wrangler CLI, and web performance.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install cloudflare@claude-plugins-official --scope <user|project>`

### `deploy-on-aws` · ⬇ 7,210

> Deploy applications to AWS with architecture recommendations, cost estimates, and IaC deployment.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install deploy-on-aws@claude-plugins-official --scope <user|project>`

### `expo` · ⬇ 6,542

> Official Expo skills for building, deploying, upgrading, and debugging React Native apps with Expo. Covers UI development with Expo Router, SwiftUI and Jetpack Compose components, Tailwind CSS setup, API routes, data fetching, CI/CD workflows, App Store and Play Store deployment, SDK upgrades, DOM components, and dev client distribution.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install expo@claude-plugins-official --scope <user|project>`

### `aws-serverless` · ⬇ 6,115

> Design, build, deploy, test, and debug serverless applications with AWS Serverless services.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install aws-serverless@claude-plugins-official --scope <user|project>`

### `terraform` · ⬇ 6,006

> The Terraform MCP Server provides seamless integration with Terraform ecosystem, enabling advanced automation and interaction capabilities for Infrastructure as Code (IaC) development.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install terraform@claude-plugins-official --scope <user|project>`

### `railway` · ⬇ 4,142

> Deploy and manage apps, databases, and infrastructure on Railway. Covers project setup, deploys, environment configuration, networking, troubleshooting, and monitoring.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install railway@claude-plugins-official --scope <user|project>`

### `netlify-skills` · ⬇ 2,876

> Netlify platform skills for Claude Code — functions, edge functions, blobs, database, image CDN, forms, config, CLI, frameworks, caching, AI gateway, and deployment.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install netlify-skills@claude-plugins-official --scope <user|project>`

### `azure` · ⬇ 2,401

> Transform Claude into an Azure expert. This plugin integrates the Azure MCP server and specialized Azure skills to move beyond generic advice. It enables Claude to perform real-world tasks: listing resources, validating deployments, diagnosing infrastructure issues, and optimizing costs across 50+ Azure services.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install azure@claude-plugins-official --scope <user|project>`

### `fastly-agent-toolkit` · ⬇ 2,097

> Fastly development tools and platform skills

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install fastly-agent-toolkit@claude-plugins-official --scope <user|project>`

### `aws-dev-toolkit` · ⬇ 1,034

> AWS development toolkit — 34 skills, 11 agents, and 3 MCP servers for building, migrating, and performing architecture reviews on AWS.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install aws-dev-toolkit@claude-plugins-official --scope <user|project>`

### `azure-cosmos-db-assistant` · ⬇ 879

> Expert assistant for Azure Cosmos DB — data modeling, query optimization, performance tuning, and best practices.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install azure-cosmos-db-assistant@claude-plugins-official --scope <user|project>`

### `aws-amplify` · ⬇ 858

> Build full-stack apps with AWS Amplify Gen 2 using guided workflows for authentication, data models, storage, GraphQL APIs, and Lambda functions.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install aws-amplify@claude-plugins-official --scope <user|project>`

### `aws-core` · ⬇ 790

> Build, deploy, and operate applications on AWS. Skills to author infrastructure-as-code, use core services, and complete common tasks.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install aws-core@claude-plugins-official --scope <user|project>`

### `aws-agents` · ⬇ 480

> Build, deploy, and operate AI agents on AWS. Skills for scaffolding agents with Amazon Bedrock AgentCore, connecting tools, memory, policies, evaluation, debugging, and production hardening.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install aws-agents@claude-plugins-official --scope <user|project>`

### `aws-data-analytics` · ⬇ 369

> Data lake, analytics, and ETL workflows with S3 Tables, AWS Glue, and Athena.

- **為什麼會用**：雲端 / 部署平台整合，用該平台的專案才需要
- **怎麼用**：`claude plugin install aws-data-analytics@claude-plugins-official --scope <user|project>`

### 資料庫 / 儲存 (18)

**Scope 預設**：project

### `supabase` · ⬇ 97,378

> Supabase MCP integration for database operations, authentication, storage, and real-time subscriptions. Manage your Supabase projects, run SQL queries, and interact with your backend directly.

- **為什麼會用**：Supabase MCP：DB 操作、auth、storage、realtime
- **怎麼用**：用 Supabase 後端的專案

### `firebase` · ⬇ 21,407

> Google Firebase MCP integration. Manage Firestore databases, authentication, cloud functions, hosting, and storage. Build and manage your Firebase backend directly from your development workflow.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install firebase@claude-plugins-official --scope <user|project>`

### `pinecone` · ⬇ 8,798

> Pinecone vector database integration. Streamline your Pinecone development with powerful tools for managing vector indexes, querying data, and rapid prototyping. Use slash commands like /quickstart to generate AGENTS.md files and initialize Python projects and /query to quickly explore indexes. Access the Pinecone MCP server for creating, describing, upserting and querying indexes with Claude. Perfect for developers building semantic search, RAG applications, recommendation systems, and other vector-based applications with Pinecone.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install pinecone@claude-plugins-official --scope <user|project>`

### `prisma` · ⬇ 4,925

> Prisma MCP integration for Postgres database management, schema migrations, SQL queries, and connection string management. Provision Prisma Postgres databases, run migrations, and interact with your data directly.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install prisma@claude-plugins-official --scope <user|project>`

### `mongodb` · ⬇ 4,826

> Official Claude plugin for MongoDB (MCP Server + Skills). Connect to databases, explore data, manage collections, optimize queries, generate reliable code, implement best practices, develop advanced features, and more.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install mongodb@claude-plugins-official --scope <user|project>`

### `neon` · ⬇ 2,047

> Manage your Neon projects and databases with the neon-postgres agent skill and the Neon MCP Server.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install neon@claude-plugins-official --scope <user|project>`

### `planetscale` · ⬇ 1,895

> An authenticated hosted MCP server that accesses your PlanetScale organizations, databases, branches, schema, and Insights data. Query against your data, surface slow queries, and get organizational and account information.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install planetscale@claude-plugins-official --scope <user|project>`

### `cockroachdb` · ⬇ 1,454

> Connect Claude Code directly to your CockroachDB clusters for hands-on database work — explore schemas, write optimized SQL, debug queries, and manage distributed database clusters. This plugin provides 14 tools across two active MCP backends (self-hosted MCP Toolbox and managed CockroachDB Cloud MCP Server), three specialized agents (DBA, Developer, Operator), 32 skills across 6 operational domains, and built-in safety hooks.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install cockroachdb@claude-plugins-official --scope <user|project>`

### `atlan` · ⬇ 1,357

> Atlan data catalog plugin for Claude Code. Search, explore, govern, and manage your data assets through natural language. Powered by the Atlan MCP server with semantic search, lineage traversal, glossary management, data quality rules, and more.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install atlan@claude-plugins-official --scope <user|project>`

### `dataverse` · ⬇ 1,248

> Agent skills for building on, analyzing, and managing Microsoft Dataverse — with Dataverse MCP, PAC CLI, and Python SDK.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install dataverse@claude-plugins-official --scope <user|project>`

### `databases-on-aws` · ⬇ 1,102

> Expert database guidance for the AWS database portfolio. Design schemas, execute queries, handle migrations, and choose the right database for your workload.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install databases-on-aws@claude-plugins-official --scope <user|project>`

### `cloud-sql-postgresql` · ⬇ 935

> Create, connect, and interact with a Cloud SQL for PostgreSQL database and data.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install cloud-sql-postgresql@claude-plugins-official --scope <user|project>`

### `box` · ⬇ 796

> Work with your Box content directly from Claude Code — search files, organize folders, collaborate with your team, and use Box AI to answer questions, summarize documents, and extract data without leaving your workflow.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install box@claude-plugins-official --scope <user|project>`

### `snowflake-cortex-code` · ⬇ 669

> Automatically route Snowflake prompts from Claude Code to Cortex Code for execution. Provides slash commands for code review and task delegation, plus skills for routing, run, and setup.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install snowflake-cortex-code@claude-plugins-official --scope <user|project>`

### `alloydb` · ⬇ 389

> Create, connect, and interact with an AlloyDB for PostgreSQL database and data.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install alloydb@claude-plugins-official --scope <user|project>`

### `qdrant-skills` · ⬇ 384

> Agent skills for Qdrant vector search covering scaling, performance optimization, search quality, monitoring, deployment, model migration, version upgrades, and SDK usage across Python, TypeScript, Rust, Go, .NET, and Java.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install qdrant-skills@claude-plugins-official --scope <user|project>`

### `zilliz` · ⬇ 325

> Zilliz Cloud management plugin with 14 skills covering cluster lifecycle, collection schema, vector search, index tuning, bulk import, RBAC, backups, and monitoring.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install zilliz@claude-plugins-official --scope <user|project>`

### `clickhouse` · ⬇ 270

> Connect Claude to your ClickHouse Cloud databases. Browse organizations, services, databases, and table schemas. Run read-only SQL queries against your data and get instant analytical answers. Monitor service backups, review billing costs, and inspect ClickPipe configurations - all through natural conversation.

- **為什麼會用**：資料庫 MCP 整合，用該 DB 的專案才需要
- **怎麼用**：`claude plugin install clickhouse@claude-plugins-official --scope <user|project>`

### 支付 / 訂閱 (4)

**Scope 預設**：project

### `stripe` · ⬇ 28,988

> Stripe development plugin for Claude

- **為什麼會用**：Stripe 開發 plugin
- **怎麼用**：做金流的 SaaS

### `revenuecat` · ⬇ 2,069

> Configure RevenueCat projects, apps, products, entitlements, and offerings directly from Claude Code. Manage your in-app purchase backend without leaving your development workflow.

- **為什麼會用**：金流整合，做 SaaS 才需要
- **怎麼用**：`claude plugin install revenuecat@claude-plugins-official --scope <user|project>`

### `sumup` · ⬇ 1,732

> SumUp payment integrations across terminal and online checkout flows. Build Android and iOS POS apps with SumUp card readers, online checkout with server SDKs and the checkout widget, and control card readers remotely via Cloud API.

- **為什麼會用**：金流整合，做 SaaS 才需要
- **怎麼用**：`claude plugin install sumup@claude-plugins-official --scope <user|project>`

### `mercadopago` · ⬇ 179

> Mercado Pago full-product integration toolkit. Covers online checkout (Pro, Bricks, API), in-store (QR, Point), subscriptions, marketplace, wallet, money-out, security (3DS, PCI), reporting, SDKs, and specialized integrations. Hybrid architecture: 13 skills provide stable integration intelligence, MCP provides live API data.

- **為什麼會用**：金流整合，做 SaaS 才需要
- **怎麼用**：`claude plugin install mercadopago@claude-plugins-official --scope <user|project>`

### 訊息 / 通訊 (8)

**Scope 預設**：project

### `telegram` · ⬇ 80,186

> Telegram messaging bridge with built-in access control. Manage pairing, allowlists, and policy via /telegram:access.

- **為什麼會用**：Telegram 訊息 bridge，含 access control
- **怎麼用**：想用 TG 接通知時

### `slack` · ⬇ 67,687

> Slack workspace integration. Search messages, access channels, read threads, and stay connected with your team's communications while coding. Find relevant discussions and context quickly.

- **為什麼會用**：搜訊息、頻道、thread
- **怎麼用**：想跟 Slack 整合時

### `discord` · ⬇ 25,083

> Discord messaging bridge with built-in access control. Manage pairing, allowlists, and policy via /discord:access.

- **為什麼會用**：即時訊息整合，想接通知時
- **怎麼用**：`claude plugin install discord@claude-plugins-official --scope <user|project>`

### `imessage` · ⬇ 11,796

> iMessage messaging bridge with built-in access control. Reads chat.db directly, sends via AppleScript. Manage pairing, allowlists, and policy via /imessage:access.

- **為什麼會用**：即時訊息整合，想接通知時
- **怎麼用**：`claude plugin install imessage@claude-plugins-official --scope <user|project>`

### `legalzoom` · ⬇ 2,247

> Attorney guidance and legal tools for business and personal needs. AI-powered document review identifies critical risks and important clauses, advises when to engage an attorney, and routes to LegalZoom's network when professional expertise is needed.

- **為什麼會用**：即時訊息整合，想接通知時
- **怎麼用**：`claude plugin install legalzoom@claude-plugins-official --scope <user|project>`

### `zoom-plugin` · ⬇ 2,146

> Claude plugin for planning, building, and debugging Zoom integrations across REST APIs, SDKs, webhooks, bots, and MCP workflows.

- **為什麼會用**：即時訊息整合，想接通知時
- **怎麼用**：`claude plugin install zoom-plugin@claude-plugins-official --scope <user|project>`

### `intercom` · ⬇ 2,052

> Intercom integration for Claude Code. Search conversations, analyze customer support patterns, look up contacts and companies, and install the Intercom Messenger. Connect your Intercom workspace to get real-time insights from customer data.

- **為什麼會用**：即時訊息整合，想接通知時
- **怎麼用**：`claude plugin install intercom@claude-plugins-official --scope <user|project>`

### `twilio-developer-kit` · ⬇ 453

> Twilio Skills provide procedural knowledge for AI coding agents — which APIs to use, in what order, and what to avoid. Covers SMS, Voice, WhatsApp, Verify, SendGrid, Compliance, and 30+ products.

- **為什麼會用**：即時訊息整合，想接通知時
- **怎麼用**：`claude plugin install twilio-developer-kit@claude-plugins-official --scope <user|project>`

### 專案管理 / Issue 追蹤 (4)

**Scope 預設**：project

### `atlassian` · ⬇ 71,597

> Connect to Atlassian products including Jira and Confluence. Search and create issues, access documentation, manage sprints, and integrate your development workflow with Atlassian's collaboration tools.

- **為什麼會用**：Jira + Confluence：search/create issues、文件、sprint
- **怎麼用**：用 Atlassian 工作的團隊

### `linear` · ⬇ 38,635

> Linear issue tracking integration. Create issues, manage projects, update statuses, search across workspaces, and streamline your software development workflow with Linear's modern issue tracker.

- **為什麼會用**：Linear issue tracking 整合
- **怎麼用**：用 Linear 的團隊

### `asana` · ⬇ 9,017

> Asana project management integration. Create and manage tasks, search projects, update assignments, track progress, and integrate your development workflow with Asana's work management platform.

- **為什麼會用**：專案管理 / Issue tracker 整合
- **怎麼用**：`claude plugin install asana@claude-plugins-official --scope <user|project>`

### `notion` · ⬇ 0

> Notion workspace integration. Search pages, create and update documents, manage databases, and access your team's knowledge base directly from Claude Code for seamless documentation workflows.

- **為什麼會用**：專案管理 / Issue tracker 整合
- **怎麼用**：`claude plugin install notion@claude-plugins-official --scope <user|project>`

### 監控 / Observability (8)

**Scope 預設**：project

### `sentry` · ⬇ 31,401

> Sentry error monitoring integration. Access error reports, analyze stack traces, search issues by fingerprint, and debug production errors directly from your development environment.

- **為什麼會用**：錯誤監控整合，看 stack trace、search issues
- **怎麼用**：線上產品 debug

### `posthog` · ⬇ 10,371

> Access PostHog analytics, feature flags, experiments, error tracking, and insights directly from Claude Code.

- **為什麼會用**：APM / 監控整合，有線上產品才用
- **怎麼用**：`claude plugin install posthog@claude-plugins-official --scope <user|project>`

### `pagerduty` · ⬇ 3,729

> Enhance code quality and security through PagerDuty risk scoring and incident correlation. Score pre-commit diffs against historical incident data and surface deployment risk before you ship.

- **為什麼會用**：APM / 監控整合，有線上產品才用
- **怎麼用**：`claude plugin install pagerduty@claude-plugins-official --scope <user|project>`

### `datadog` · ⬇ 2,104

> Use Datadog directly in Claude Code through a preconfigured Datadog MCP server. Query logs, metrics, traces, dashboards, and more through natural conversation. This plugin is in preview.

- **為什麼會用**：APM / 監控整合，有線上產品才用
- **怎麼用**：`claude plugin install datadog@claude-plugins-official --scope <user|project>`

### `amplitude` · ⬇ 1,220

> Use Amplitude as an expert analyst — instrument Amplitude, discover product opportunities, analyze charts, create dashboards, manage experiments, and understand users and accounts.

- **為什麼會用**：APM / 監控整合，有線上產品才用
- **怎麼用**：`claude plugin install amplitude@claude-plugins-official --scope <user|project>`

### `logfire` · ⬇ 469

> Add Logfire observability to Python applications with auto-instrumentation for FastAPI, httpx, asyncpg, SQLAlchemy, and more

- **為什麼會用**：APM / 監控整合，有線上產品才用
- **怎麼用**：`claude plugin install logfire@claude-plugins-official --scope <user|project>`

### `dash0` · ⬇ 225

> OpenTelemetry observability for Claude Code sessions. Captures tool calls, LLM invocations, token usage, and errors as OTel traces. Send telemetry to Dash0 or any OpenTelemetry-compatible backend.

- **為什麼會用**：APM / 監控整合，有線上產品才用
- **怎麼用**：`claude plugin install dash0@claude-plugins-official --scope <user|project>`

### `fullstory` · ⬇ 113

> Connect Claude to Fullstory to query behavioral analytics, session replays, and customer experience insights.

- **為什麼會用**：APM / 監控整合，有線上產品才用
- **怎麼用**：`claude plugin install fullstory@claude-plugins-official --scope <user|project>`

### 生產力 / 工作流程 (8)

**Scope 預設**：user (通用) / project (專案性)

### `remember` · ⬇ 28,582

> Continuous memory for Claude Code. Extracts, summarizes, and compresses conversations into tiered daily logs. Claude remembers what you did yesterday.

- **為什麼會用**：日常工作流程強化
- **怎麼用**：`claude plugin install remember@claude-plugins-official --scope <user|project>`

### `microsoft-docs` · ⬇ 16,973

> Access official Microsoft documentation, API references, and code samples for Azure, .NET, Windows, and more.

- **為什麼會用**：日常工作流程強化
- **怎麼用**：`claude plugin install microsoft-docs@claude-plugins-official --scope <user|project>`

### `postman` · ⬇ 13,771

> Full API lifecycle management for Claude Code. Sync collections, generate client code, discover APIs, run tests, create mocks, publish docs, and audit security. Powered by the Postman MCP Server.

- **為什麼會用**：日常工作流程強化
- **怎麼用**：`claude plugin install postman@claude-plugins-official --scope <user|project>`

### `circleback` · ⬇ 10,611

> Circleback conversational context integration. Search and access meetings, emails, calendar events, and more.

- **為什麼會用**：日常工作流程強化
- **怎麼用**：`claude plugin install circleback@claude-plugins-official --scope <user|project>`

### `session-report` · ⬇ 5,697

> Generate an explorable HTML report of Claude Code session usage — tokens, cache efficiency, subagents, skills, and the most expensive prompts — from local ~/.claude/projects transcripts.

- **為什麼會用**：日常工作流程強化
- **怎麼用**：`claude plugin install session-report@claude-plugins-official --scope <user|project>`

### `mintlify` · ⬇ 5,088

> Build beautiful documentation sites with Mintlify. Convert non-markdown files into properly formatted MDX pages, add and modify content with correct component use, and automate documentation updates.

- **為什麼會用**：日常工作流程強化
- **怎麼用**：`claude plugin install mintlify@claude-plugins-official --scope <user|project>`

### `desktop-commander` · ⬇ 1,687

> MCP server for terminal commands, process management, and file operations across text, code, PDF, DOCX, Excel, images, and structured data.

- **為什麼會用**：日常工作流程強化
- **怎麼用**：`claude plugin install desktop-commander@claude-plugins-official --scope <user|project>`

### `airtable` · ⬇ 233

> Airtable is the database and operations layer for your agents — whether running product, marketing, sales, ops, HR, or a custom business app. It combines structured data with multiplayer visual surfaces (grid, kanban, calendar, gallery, timeline) humans and agents share — plus sync integrations to Jira, Salesforce, Zendesk, Google Drive, Databricks, and the rest of your stack, all backed by enterprise governance. This plugin makes Claude fluent in Airtable: creating bases and schema, working with records, and sharing UI for collaboration. Bundles the official Airtable MCP server.

- **為什麼會用**：日常工作流程強化
- **怎麼用**：`claude plugin install airtable@claude-plugins-official --scope <user|project>`

### AI / Agent / ML 平台 (17)

**Scope 預設**：project

### `agent-sdk-dev` · ⬇ 57,027

> Development kit for working with the Claude Agent SDK

- **為什麼會用**：Claude Agent SDK 開發工具集
- **怎麼用**：寫自訂 agent 時

### `huggingface-skills` · ⬇ 27,835

> Build, train, evaluate, and use open source AI models, datasets, and spaces.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install huggingface-skills@claude-plugins-official --scope <user|project>`

### `mcp-server-dev` · ⬇ 15,813

> Skills for designing and building MCP servers that work seamlessly with Claude. Guides you through deployment models (remote HTTP, MCPB, local), tool design patterns, auth, and interactive MCP apps.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install mcp-server-dev@claude-plugins-official --scope <user|project>`

### `atomic-agents` · ⬇ 11,383

> Comprehensive development workflow for building AI agents with the Atomic Agents framework. Includes specialized agents for schema design, architecture planning, code review, and tool development. Features guided workflows, progressive-disclosure skills, and best practice validation.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install atomic-agents@claude-plugins-official --scope <user|project>`

### `qodo-skills` · ⬇ 9,995

> Qodo Skills provides a curated library of reusable AI agent capabilities that extend Claude's functionality for software development workflows. Each skill is designed to integrate seamlessly into your development process, enabling tasks like code quality checks, automated testing, security scanning, and compliance validation. Skills operate across your entire SDLC—from IDE to CI/CD—ensuring consistent standards and catching issues early.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install qodo-skills@claude-plugins-official --scope <user|project>`

### `pydantic-ai` · ⬇ 2,349

> Write accurate Pydantic AI code from the start. Up-to-date patterns, decision trees, and common gotchas for agents, tools, structured output, streaming, and multi-agent apps.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install pydantic-ai@claude-plugins-official --scope <user|project>`

### `rc` · ⬇ 2,240

> Configure RevenueCat projects, apps, products, entitlements, and offerings directly from Claude Code. Manage your in-app purchase backend without leaving your development workflow.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install rc@claude-plugins-official --scope <user|project>`

### `math-olympiad` · ⬇ 2,029

> Solve competition math (IMO, Putnam, USAMO) with adversarial verification that catches what self-verification misses. Fresh-context verifiers attack proofs with specific failure patterns. Calibrated abstention over bluffing.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install math-olympiad@claude-plugins-official --scope <user|project>`

### `fiftyone` · ⬇ 1,816

> Build high-quality datasets and computer vision models. Visualize datasets, analyze models, find duplicates, run inference, evaluate predictions, and develop custom plugins.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install fiftyone@claude-plugins-official --scope <user|project>`

### `liquid-skills` · ⬇ 1,610

> Liquid language fundamentals, CSS/JS/HTML coding standards, and WCAG accessibility patterns for Shopify themes

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install liquid-skills@claude-plugins-official --scope <user|project>`

### `astronomer-data-agents` · ⬇ 1,561

> Data engineering for Apache Airflow and Astronomer. Author DAGs with best practices, debug pipeline failures, trace data lineage, profile tables, migrate Airflow 2 to 3, and manage local and cloud deployments.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install astronomer-data-agents@claude-plugins-official --scope <user|project>`

### `data-agent-kit-starter-pack` · ⬇ 818

> Specialized suite of skills for data engineers on Google Cloud — architect data pipelines, transform data with dbt, write Spark and BigQuery SQL notebooks, and orchestrate end-to-end workflows across BigQuery, Spanner, BigLake, and Dataproc.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install data-agent-kit-starter-pack@claude-plugins-official --scope <user|project>`

### `youdotcom-agent-skills` · ⬇ 736

> You.com agent skills for web search, research with citations, and content extraction. Guided integrations for Vercel AI SDK, Claude Agent SDK, OpenAI Agents SDK, crewAI, LangChain, Microsoft Teams.ai, direct REST API, and bash CLI.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install youdotcom-agent-skills@claude-plugins-official --scope <user|project>`

### `datarobot-agent-skills` · ⬇ 526

> DataRobot skills for AI/ML workflows — model training, deployment, predictions, feature engineering, monitoring, explainability, data preparation, App Framework CI/CD, and external agent monitoring.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install datarobot-agent-skills@claude-plugins-official --scope <user|project>`

### `agentforce-adlc` · ⬇ 373

> Agentforce Agent Development Life Cycle — author, discover, scaffold, deploy, test, and optimize .agent files

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install agentforce-adlc@claude-plugins-official --scope <user|project>`

### `cwc-makers` · ⬇ 231

> Onboard a Code-with-Claude Makers Cardputer with one /maker-setup command — clones the build-with-claude repo, flashes UIFlow firmware, and installs the Claude Buddy app bundle.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install cwc-makers@claude-plugins-official --scope <user|project>`

### `outputai` · ⬇ 229

> Output.ai workflow development toolkit for Claude Code. Adds 5 specialist agents (planner, builder, debugger, prompt writer, quality reviewer), 40+ slash-command skills covering scaffolding, debugging, evaluation, and credential management, plus a SessionStart hook that auto-loads Output SDK conventions so Claude understands the framework before the first prompt.

- **為什麼會用**：AI / Agent 框架，特定 ML workflow
- **怎麼用**：`claude plugin install outputai@claude-plugins-official --scope <user|project>`

### 安全性 / 漏洞掃描 (11)

**Scope 預設**：user (通用)/ project (特定 vendor)

### `security-guidance` · ⬇ 162,177

> Security reminder hook that warns about potential security issues when editing files, including command injection, XSS, and unsafe code patterns

- **為什麼會用**：編輯時警告 command injection、XSS、SQL injection 等 OWASP 風險
- **怎麼用**：通用品質防線，user scope

### `sonatype-guide` · ⬇ 6,471

> Sonatype Guide MCP server for software supply chain intelligence and dependency security. Analyze dependencies for vulnerabilities, get secure version recommendations, and check component quality metrics.

- **為什麼會用**：安全掃描 / 風險偵測
- **怎麼用**：`claude plugin install sonatype-guide@claude-plugins-official --scope <user|project>`

### `aikido` · ⬇ 3,924

> Aikido Security scanning for Claude Code — SAST, secrets, and IaC vulnerability detection powered by the Aikido MCP server.

- **為什麼會用**：安全掃描 / 風險偵測
- **怎麼用**：`claude plugin install aikido@claude-plugins-official --scope <user|project>`

### `ai-plugins` · ⬇ 2,848

> Set up endorctl and use Endor Labs to scan, prioritize, and fix security risks across your software supply chain

- **為什麼會用**：安全掃描 / 風險偵測
- **怎麼用**：`claude plugin install ai-plugins@claude-plugins-official --scope <user|project>`

### `auth0` · ⬇ 1,463

> Add authentication to any app with Auth0. This plugin detects your framework, scaffolds the right Auth0 SDK integration, and guides you through login, logout, sessions, and protected routes — using current SDK patterns.

- **為什麼會用**：安全掃描 / 風險偵測
- **怎麼用**：`claude plugin install auth0@claude-plugins-official --scope <user|project>`

### `nightvision` · ⬇ 1,383

> Skills for working with NightVision, a DAST and API Discovery platform that finds exploitable vulnerabilities in web applications and REST APIs

- **為什麼會用**：安全掃描 / 風險偵測
- **怎麼用**：`claude plugin install nightvision@claude-plugins-official --scope <user|project>`

### `zscaler` · ⬇ 822

> Manage Zscaler cloud security platform including ZPA (private access), ZIA (internet access), ZDX (digital experience), ZCC (client connector), EASM (attack surface), and Z-Insights (analytics). Create and manage policies, troubleshoot connectivity, audit security configurations, and investigate incidents across the full Zscaler ecosystem.

- **為什麼會用**：安全掃描 / 風險偵測
- **怎麼用**：`claude plugin install zscaler@claude-plugins-official --scope <user|project>`

### `42crunch-api-security-testing` · ⬇ 555

> Automate API security directly in Claude Code with 42Crunch - automatically audit OpenAPI specs, detect vulnerabilities aligned with OWASP API Security risks (including BOLA/BFLA), and apply AI-powered fixes. Designed for AI-assisted development workflows, it provides continuous guardrails through an audit->scan->remediate->validate loop, ensuring APIs meet enterprise security standards before deployment.

- **為什麼會用**：安全掃描 / 風險偵測
- **怎麼用**：`claude plugin install 42crunch-api-security-testing@claude-plugins-official --scope <user|project>`

### `vanta-mcp-plugin` · ⬇ 548

> The Vanta plugin connects Claude Code to Vanta's security and compliance platform through the Vanta MCP server. It combines Vanta's test-specific remediation intelligence with your local repository context to help you fix compliance failures faster.

- **為什麼會用**：安全掃描 / 風險偵測
- **怎麼用**：`claude plugin install vanta-mcp-plugin@claude-plugins-official --scope <user|project>`

### `crowdstrike-falcon-foundry` · ⬇ 361

> CrowdStrike Falcon Foundry development skills for building cybersecurity applications on the Falcon platform. Includes UI development, collections, functions, workflows, API integration, security patterns, and debugging workflows.

- **為什麼會用**：安全掃描 / 風險偵測
- **怎麼用**：`claude plugin install crowdstrike-falcon-foundry@claude-plugins-official --scope <user|project>`

### `jfrog` · ⬇ 100

> Use the JFrog Platform from Claude Code: Artifactory repos and artifacts, security findings and exposures, Catalog package safety and downloads, workflows across the SDLC, and platform administration.

- **為什麼會用**：安全掃描 / 風險偵測
- **怎麼用**：`claude plugin install jfrog@claude-plugins-official --scope <user|project>`

### 測試 (1)

**Scope 預設**：project

### `fakechat` · ⬇ 6,003

> Localhost web chat for testing the channel notification flow. No tokens, no access control, no third-party service.

- **為什麼會用**：測試 workflow
- **怎麼用**：`claude plugin install fakechat@claude-plugins-official --scope <user|project>`

### 資料工程 (4)

**Scope 預設**：project

### `data-engineering` · ⬇ 9,937

> Data engineering plugin - warehouse exploration, pipeline authoring, Airflow integration

- **為什麼會用**：資料工程 / ETL pipeline
- **怎麼用**：`claude plugin install data-engineering@claude-plugins-official --scope <user|project>`

### `data` · ⬇ 5,544

> Data engineering for Apache Airflow and Astronomer. Author DAGs with best practices, debug pipeline failures, trace data lineage, profile tables, migrate Airflow 2 to 3, and manage local and cloud deployments.

- **為什麼會用**：資料工程 / ETL pipeline
- **怎麼用**：`claude plugin install data@claude-plugins-official --scope <user|project>`

### `bigdata-com` · ⬇ 903

> Official Bigdata.com plugin providing financial research, analytics, and intelligence tools powered by Bigdata MCP.

- **為什麼會用**：資料工程 / ETL pipeline
- **怎麼用**：`claude plugin install bigdata-com@claude-plugins-official --scope <user|project>`

### `oracle-ai-data-platform-workbench-spark-connectors` · ⬇ 330

> Oracle AI Data Platform Workbench Spark connectors for Claude Code. 18 connector skills covering every data source workbench customers commonly need: Oracle Autonomous DB family (ALH/ADW/ATP) via wallet/IAM-DB-Token/API-key, ExaCS, Fusion ERP REST, Fusion BICC, EPM Cloud Planning, Essbase 21c, OCI Streaming (Kafka), OCI Object Storage, Apache Iceberg, plus external systems (PostgreSQL, MySQL/HeatWave, SQL Server, Snowflake, Azure ADLS Gen2, AWS S3, generic REST, custom JDBC, Excel). Live-validated on the workbench `tpcds` cluster (Spark 3.5.0): 17 PASS / 4 ship-as-is out of 21 test rows.

- **為什麼會用**：資料工程 / ETL pipeline
- **怎麼用**：`claude plugin install oracle-ai-data-platform-workbench-spark-connectors@claude-plugins-official --scope <user|project>`

### 創意 / 媒體 (2)

**Scope 預設**：project

### `adobe-for-creativity` · ⬇ 943

> Harness Adobe's creative AI-powered tools to edit images, automate design workflows, and bring creative visions to life — from background removal to vectorization and professional retouching.

- **為什麼會用**：創意 / 媒體處理
- **怎麼用**：`claude plugin install adobe-for-creativity@claude-plugins-official --scope <user|project>`

### `spotify-ads-api` · ⬇ 753

> Manage Spotify ad campaigns with natural language. Create campaigns, ad sets, ads, pull reports, and handle OAuth — all through conversation.

- **為什麼會用**：創意 / 媒體處理
- **怎麼用**：`claude plugin install spotify-ads-api@claude-plugins-official --scope <user|project>`

### 企業 / 特定行業 (21)

**Scope 預設**：project (有用該服務的專案才裝)

### `laravel-boost` · ⬇ 18,752

> Laravel development toolkit MCP server. Provides intelligent assistance for Laravel applications including Artisan commands, Eloquent queries, routing, migrations, and framework-specific code generation.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install laravel-boost@claude-plugins-official --scope <user|project>`

### `wordpress.com` · ⬇ 4,558

> Uses Claude Code to create and edit WordPress sites with WordPress Studio before deploying changes to your WordPress.com site.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install wordpress.com@claude-plugins-official --scope <user|project>`

### `shopify-ai-toolkit` · ⬇ 2,420

> Shopify's AI Toolkit provides 18 development skills for building on the Shopify platform, covering documentation search, API schema access, GraphQL and Liquid code validation, Hydrogen storefronts, Polaris UI extensions, store management via CLI, and onboarding guidance for both developers and merchants.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install shopify-ai-toolkit@claude-plugins-official --scope <user|project>`

### `wix` · ⬇ 2,415

> Build, manage, and deploy Wix sites and apps. CLI development skills for dashboard extensions, backend APIs, site widgets, and service plugins with the Wix Design System, plus MCP server for site management.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install wix@claude-plugins-official --scope <user|project>`

### `amazon-location-service` · ⬇ 2,388

> Guide developers through adding maps, places search, geocoding, routing, and other geospatial features with Amazon Location Service, including authentication setup, SDK integration, and best practices.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install amazon-location-service@claude-plugins-official --scope <user|project>`

### `postiz` · ⬇ 2,200

> Social media automation CLI for scheduling posts, managing integrations, uploading media, and tracking analytics across 28+ platforms including X, LinkedIn, Reddit, YouTube, TikTok, Instagram, and more

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install postiz@claude-plugins-official --scope <user|project>`

### `zapier` · ⬇ 2,064

> Connect 8,000+ apps to your AI workflow. Discover, enable, and execute Zapier actions directly from your client.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install zapier@claude-plugins-official --scope <user|project>`

### `shopify` · ⬇ 1,796

> Shopify developer tools for Claude Code — search Shopify docs, generate and validate GraphQL, Liquid, and UI extension code

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install shopify@claude-plugins-official --scope <user|project>`

### `qt-development-skills` · ⬇ 974

> Agentic engineering skills for Qt software development — Qt C++/QML code review, QML coding, and Qt C++/QML code documentation.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install qt-development-skills@claude-plugins-official --scope <user|project>`

### `ui5` · ⬇ 945

> SAPUI5 / OpenUI5 plugin for Claude. Create and validate UI5 projects, access API documentation, run UI5 linter, get development guidelines and best practices for UI5 development.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install ui5@claude-plugins-official --scope <user|project>`

### `base44` · ⬇ 941

> Build and deploy Base44 full-stack apps with CLI project management and JavaScript/TypeScript SDK development skills

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install base44@claude-plugins-official --scope <user|project>`

### `cds-mcp` · ⬇ 758

> AI-assisted development of SAP Cloud Application Programming Model (CAP) projects. Search CDS models and CAP documentation.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install cds-mcp@claude-plugins-official --scope <user|project>`

### `windsor-ai` · ⬇ 743

> Connect Claude Code to 325+ business data sources via Windsor.ai. Query marketing, sales, CRM, ecommerce, finance, and analytics data from Google Ads, Meta, HubSpot, Salesforce, Shopify, Stripe, and hundreds more — directly from your terminal.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install windsor-ai@claude-plugins-official --scope <user|project>`

### `apollo` · ⬇ 608

> Prospect, enrich leads, load outreach sequences, and query sales analytics with Apollo.io — one-click MCP server integration for Claude Code and Cowork.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install apollo@claude-plugins-official --scope <user|project>`

### `netsuite-suitecloud` · ⬇ 563

> NetSuite agent skills from Oracle — authoring guidance for SuiteCloud Development Framework (SDF) objects and UIF single-page-app components, plus runtime guidance for the NetSuite AI Service Connector.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install netsuite-suitecloud@claude-plugins-official --scope <user|project>`

### `quarkus-agent` · ⬇ 474

> MCP server for AI coding agents to create, manage, and interact with Quarkus applications. Provides tools for project scaffolding, dev mode lifecycle, extension skills, Dev MCP proxy, and documentation search.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install quarkus-agent@claude-plugins-official --scope <user|project>`

### `sap-mdk-server` · ⬇ 289

> MCP server for SAP Mobile Development Kit (MDK). Build and modify MDK applications with AI assistance — schema lookups, action validation, rule editing, and project scaffolding.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install sap-mdk-server@claude-plugins-official --scope <user|project>`

### `pigment` · ⬇ 192

> Analyze business data and build custom Pigment models, metrics, and boards through natural language.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install pigment@claude-plugins-official --scope <user|project>`

### `sap-fiori-mcp-server` · ⬇ 190

> MCP server for SAP Fiori development tools for Claude Code. Build and modify SAP Fiori applications with AI assistance.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install sap-fiori-mcp-server@claude-plugins-official --scope <user|project>`

### `servicenow-sdk` · ⬇ 173

> Create, edit, and deploy ServiceNow applications with the Fluent SDK effortlessly through Claude AI.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install servicenow-sdk@claude-plugins-official --scope <user|project>`

### `sap-cds-mcp` · ⬇ 157

> AI-assisted development of SAP Cloud Application Programming Model (CAP) projects. Search CDS models and CAP documentation.

- **為什麼會用**：特定企業 / 行業專用，用該系統才需要
- **怎麼用**：`claude plugin install sap-cds-mcp@claude-plugins-official --scope <user|project>`


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

| 量級 | 數量 | 範圍 |
|------|------|------|
| 100k+ | 11 | 通用 dev 工具 + 熱門整合服務 |
| 10k–100k | 27 | 主流整合（GitHub/Figma/Vercel/Supabase 等） |
| 1k–10k | 89 | 中型 / 特定領域 |
| < 1k | 45 | niche / 企業 / 新發布 |

**Top 5**：`frontend-design` (790k) → `superpowers` (713k) → `context7` (337k) → `code-review` (333k) → `code-simplifier` (273k)

### E. 怎麼定期回顧這份目錄

1. 用 `claude plugin list --available --json | python3 -c '...'` 重抓
2. 對照本目錄差集，更新本檔
3. 建議每 1-2 個月跑一次，因為 marketplace 在持續新增 plugin

---

## 變更紀錄

- 2026-05-24：初版，涵蓋當時 marketplace 全部 172 個 plugin
