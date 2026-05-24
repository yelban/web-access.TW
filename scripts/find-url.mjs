#!/usr/bin/env node
// find-url - 從本地 Chromium 系瀏覽器（Chrome / Edge）書籤/歷史中檢索 URL
// 用於定位公網搜尋覆蓋不到的目標（組織內部系統、SSO 後臺、內網域名等）。
//
// 用法：
//   node find-url.mjs [關鍵詞...] [--only bookmarks|history] [--limit N] [--since 1d|7h|YYYY-MM-DD]
//
//   <關鍵詞>             空格分詞、多詞 AND，匹配 title + url；可省略
//   --only <source>      限定資料來源（bookmarks / history），預設兩者都查
//   --browser <id>       限定瀏覽器（chrome / edge），預設遍歷所有已安裝的
//   --limit N            條數上限，預設 20；0 = 不限
//   --since <window>     時間窗（僅作用於歷史）。1d / 7h / 30m 或 YYYY-MM-DD
//   --sort recent|visits 歷史排序：按最近訪問 / 按訪問次數，預設 recent
//
// 示例：
//   node find-url.mjs 財務小智
//   node find-url.mjs agent skills
//   node find-url.mjs github --since 7d --only history
//   node find-url.mjs --since 7d --only history --sort visits   # 最近一週高頻網站
//   node find-url.mjs --since 2d --only history --limit 0
//   node find-url.mjs github --browser edge                     # 只查 Edge

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

// --- 引數解析 -----------------------------------------------------------
function parseArgs(argv) {
  const a = { keywords: [], only: null, browser: null, limit: 20, since: null, sort: 'recent' };
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i];
    if (v === '--only')         a.only    = argv[++i];
    else if (v === '--browser') a.browser = argv[++i];
    else if (v === '--limit')   a.limit   = parseInt(argv[++i], 10);
    else if (v === '--since')   a.since   = parseSince(argv[++i]);
    else if (v === '--sort')    a.sort    = argv[++i];
    else if (v === '-h' || v === '--help') { printUsage(); process.exit(0); }
    else if (v.startsWith('--')) die(`未知引數: ${v}`);
    else a.keywords.push(v);
  }
  if (a.only && !['bookmarks', 'history'].includes(a.only)) die(`--only 僅支援 bookmarks|history`);
  if (!['recent', 'visits'].includes(a.sort)) die(`--sort 僅支援 recent|visits`);
  if (Number.isNaN(a.limit) || a.limit < 0) die('--limit 需為非負整數');
  return a;
}

function parseSince(s) {
  if (!s) die('--since 需要值');
  const m = s.match(/^(\d+)([dhm])$/);
  if (m) {
    const n = parseInt(m[1], 10);
    const ms = { d: 86400000, h: 3600000, m: 60000 }[m[2]];
    return new Date(Date.now() - n * ms);
  }
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) die(`無效 --since 值: ${s}（用 1d / 7h / 30m / YYYY-MM-DD）`);
  return d;
}

function die(msg) { console.error(msg); process.exit(1); }
function printUsage() { console.error(fs.readFileSync(new URL(import.meta.url)).toString().split('\n').slice(1, 21).map(l => l.replace(/^\/\/ ?/, '')).join('\n')); }

// --- 瀏覽器使用者資料目錄（跨平台 + 多瀏覽器） -----------------------------
// 加新瀏覽器：只改這裡
function knownBrowserDataDirs() {
  const home = os.homedir();
  const localAppData = process.env.LOCALAPPDATA || '';
  switch (os.platform()) {
    case 'darwin':
      return [
        { id: 'chrome', label: 'Chrome', dir: path.join(home, 'Library/Application Support/Google/Chrome') },
        { id: 'edge',   label: 'Edge',   dir: path.join(home, 'Library/Application Support/Microsoft Edge') },
      ];
    case 'linux':
      return [
        { id: 'chrome', label: 'Chrome', dir: path.join(home, '.config/google-chrome') },
        { id: 'edge',   label: 'Edge',   dir: path.join(home, '.config/microsoft-edge') },
      ];
    case 'win32':
      return [
        { id: 'chrome', label: 'Chrome', dir: path.join(localAppData, 'Google/Chrome/User Data') },
        { id: 'edge',   label: 'Edge',   dir: path.join(localAppData, 'Microsoft/Edge/User Data') },
      ];
    default:
      return [];
  }
}

// --- Profile 列舉 -------------------------------------------------------
function listProfiles(dataDir) {
  try {
    const state = JSON.parse(fs.readFileSync(path.join(dataDir, 'Local State'), 'utf-8'));
    const info = state?.profile?.info_cache || {};
    const list = Object.keys(info).map(dir => ({ dir, name: info[dir].name || dir }));
    if (list.length) return list;
  } catch { /* 回退 */ }
  return [{ dir: 'Default', name: 'Default' }];
}

// --- 書籤檢索 -----------------------------------------------------------
function searchBookmarks(profileDir, profileName, browserLabel, keywords) {
  const file = path.join(profileDir, 'Bookmarks');
  if (!fs.existsSync(file)) return [];
  let data;
  try { data = JSON.parse(fs.readFileSync(file, 'utf-8')); } catch { return []; }
  if (!keywords.length) return [];  // 書籤無時間維度，無關鍵詞不返回

  const needles = keywords.map(k => k.toLowerCase());
  const out = [];
  function walk(node, trail) {
    if (!node) return;
    if (node.type === 'url') {
      const hay = `${node.name || ''} ${node.url || ''}`.toLowerCase();
      if (needles.every(n => hay.includes(n))) {
        out.push({ browser: browserLabel, profile: profileName, name: node.name || '', url: node.url || '', folder: trail.join(' / ') });
      }
    }
    if (Array.isArray(node.children)) {
      const sub = node.name ? [...trail, node.name] : trail;
      for (const c of node.children) walk(c, sub);
    }
  }
  for (const root of Object.values(data.roots || {})) walk(root, []);
  return out;
}

// --- 歷史檢索（SQLite 執行時鎖定，需 copy 到 tmp） ------------------------
const WEBKIT_EPOCH_DIFF_US = 11644473600000000n;  // 1601→1970 微秒差

function searchHistory(profileDir, profileName, browserLabel, keywords, since, limit, sort) {
  const src = path.join(profileDir, 'History');
  if (!fs.existsSync(src)) return [];
  const tmp = path.join(os.tmpdir(), `browser-history-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.sqlite`);
  try {
    fs.copyFileSync(src, tmp);
    const conds = ['last_visit_time > 0'];
    for (const kw of keywords) {
      const esc = kw.toLowerCase().replace(/'/g, "''");
      conds.push(`LOWER(title || ' ' || url) LIKE '%${esc}%'`);
    }
    if (since) {
      const webkitUs = BigInt(since.getTime()) * 1000n + WEBKIT_EPOCH_DIFF_US;
      conds.push(`last_visit_time >= ${webkitUs}`);
    }
    const limitClause = limit === 0 ? -1 : limit;
    const orderBy = sort === 'visits'
      ? 'visit_count DESC, last_visit_time DESC'
      : 'last_visit_time DESC';
    const sql = `SELECT title, url,
      datetime((last_visit_time - 11644473600000000)/1000000, 'unixepoch', 'localtime') AS visit,
      visit_count
      FROM urls WHERE ${conds.join(' AND ')}
      ORDER BY ${orderBy} LIMIT ${limitClause};`;

    const raw = execFileSync('sqlite3', ['-separator', '\t', tmp, sql], { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
    return raw.trim().split('\n').filter(Boolean).map(line => {
      const [title, url, visit, visit_count] = line.split('\t');
      return { browser: browserLabel, profile: profileName, title, url, visit, visit_count: parseInt(visit_count, 10) };
    });
  } catch (e) {
    if (e.code === 'ENOENT') die('未找到 sqlite3 命令。macOS/Linux 通常自帶；Windows 可用 `winget install sqlite.sqlite` 或從 https://sqlite.org/download.html 下載後加入 PATH。');
    return [];
  } finally {
    try { fs.unlinkSync(tmp); } catch {}
  }
}

// --- 輸出格式化 ---------------------------------------------------------
// 用 `|` 作欄位分隔符；欄位內含 `|` 的替換成 `│`（全寬豎線）避免歧義
const clean = s => String(s ?? '').replaceAll('|', '│').trim();

function originTag(item, showBrowser, showProfile) {
  if (showBrowser && showProfile) return '@' + clean(item.browser) + '-' + clean(item.profile);
  if (showBrowser) return '@' + clean(item.browser);
  if (showProfile) return '@' + clean(item.profile);
  return null;
}

function printBookmarks(items, showBrowser, showProfile) {
  console.log(`[書籤] ${items.length} 條`);
  for (const b of items) {
    const segs = [clean(b.name) || '(無標題)', clean(b.url)];
    if (b.folder) segs.push(clean(b.folder));
    const tag = originTag(b, showBrowser, showProfile);
    if (tag) segs.push(tag);
    console.log('  ' + segs.join(' | '));
  }
}

function printHistory(items, showBrowser, showProfile, sortLabel) {
  console.log(`[歷史] ${items.length} 條（${sortLabel}）`);
  for (const h of items) {
    const segs = [clean(h.title) || '(無標題)', clean(h.url), h.visit];
    if (h.visit_count > 1) segs.push(`visits=${h.visit_count}`);
    const tag = originTag(h, showBrowser, showProfile);
    if (tag) segs.push(tag);
    console.log('  ' + segs.join(' | '));
  }
}

// --- main ---------------------------------------------------------------
const args = parseArgs(process.argv.slice(2));

let browsers = knownBrowserDataDirs().filter(b => fs.existsSync(b.dir));
if (args.browser) {
  const filtered = browsers.filter(b => b.id === args.browser);
  if (!filtered.length) {
    const available = browsers.map(b => b.id).join('、') || '無';
    die(`未找到瀏覽器 ${args.browser} 的使用者資料目錄（已檢測到：${available}）`);
  }
  browsers = filtered;
}
if (!browsers.length) die('未找到任何瀏覽器（Chrome / Edge）的使用者資料目錄');

const doBookmarks = args.only !== 'history';
const doHistory   = args.only !== 'bookmarks';

const bookmarks = [];
const history = [];
for (const browser of browsers) {
  const profiles = listProfiles(browser.dir);
  for (const p of profiles) {
    const pDir = path.join(browser.dir, p.dir);
    if (!fs.existsSync(pDir)) continue;
    if (doBookmarks) bookmarks.push(...searchBookmarks(pDir, p.name, browser.label, args.keywords));
    if (doHistory)   history.push(...searchHistory(pDir, p.name, browser.label, args.keywords, args.since, args.limit === 0 ? 0 : args.limit * 2, args.sort));
  }
}

// 歷史跨 profile/瀏覽器 合併後按指定 sort 重排 + 切頂
if (args.sort === 'visits') {
  history.sort((a, b) => (b.visit_count || 0) - (a.visit_count || 0) || (b.visit || '').localeCompare(a.visit || ''));
} else {
  history.sort((a, b) => (b.visit || '').localeCompare(a.visit || ''));
}
const bookmarksOut = args.limit === 0 ? bookmarks : bookmarks.slice(0, args.limit);
const historyOut   = args.limit === 0 ? history   : history.slice(0, args.limit);

// 僅當結果真的橫跨多個 browser/profile 時才輸出 @ 標註（避免單源場景噪音）
const seenBrowsers = new Set([...bookmarksOut, ...historyOut].map(x => x.browser));
const seenProfiles = new Set([...bookmarksOut, ...historyOut].map(x => x.profile));
const showBrowser = seenBrowsers.size > 1;
const showProfile = seenProfiles.size > 1;

const sortLabel = args.sort === 'visits' ? '按訪問次數' : '按最近訪問';
if (doBookmarks) printBookmarks(bookmarksOut, showBrowser, showProfile);
if (doBookmarks && doHistory) console.log();
if (doHistory)   printHistory(historyOut, showBrowser, showProfile, sortLabel);

if (!args.keywords.length && doBookmarks && !doHistory) {
  console.error('\n提示：書籤無時間維度，無關鍵詞查詢無意義。加關鍵詞或切換 --only history。');
}
