#!/usr/bin/env node
// 環境檢查 + 確保 CDP Proxy 就緒
//
// 用法：
//   node check-deps.mjs                  預設行為：讀 config.env 偏好
//   node check-deps.mjs --browser edge   本次臨時指定瀏覽器（不寫 config.env）
//
// 持久偏好 → config.env (skill 根目錄, gitignored)
// 單次覆蓋 → --browser 命令列引數（全鏈路 argv，不碰 process.env）

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { selectBrowser, knownBrowsers, findFallbackPort } from './browser-discovery.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROXY_SCRIPT = path.join(ROOT, 'scripts', 'cdp-proxy.mjs');
const PROXY_PORT = Number(process.env.CDP_PROXY_PORT || 3456);
const CONFIG_PATH = path.join(ROOT, 'config.env');
const CONFIG_TEMPLATE = path.join(ROOT, 'templates', 'config.env.template');

// --- 引數解析 ---

function parseArgs(argv) {
  const opts = { browser: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--browser' && argv[i + 1]) { opts.browser = argv[i + 1]; i++; }
    else if (argv[i].startsWith('--browser=')) { opts.browser = argv[i].slice('--browser='.length); }
  }
  return opts;
}

// --- 首次安裝：從模板建立 config.env ---

function ensureConfigExists() {
  if (fs.existsSync(CONFIG_PATH)) return;
  try {
    fs.copyFileSync(CONFIG_TEMPLATE, CONFIG_PATH);
    console.log(`config: 已從模板建立 ${CONFIG_PATH}`);
  } catch {
    // 模板不存在或複製失敗 —— 不阻塞，readConfig 會兜底
  }
}

// --- Node.js 版本檢查 ---

function checkNode() {
  const major = Number(process.versions.node.split('.')[0]);
  const version = `v${process.versions.node}`;
  if (major >= 22) console.log(`node: ok (${version})`);
  else console.log(`node: warn (${version}, 建議升級到 22+)`);
}

// --- CDP Proxy 啟動與等待 ---

function httpGetJson(url, timeoutMs = 3000) {
  return fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
    .then(async (res) => { try { return JSON.parse(await res.text()); } catch { return null; } })
    .catch(() => null);
}

function startProxyDetached(browserOverride) {
  const logFile = path.join(os.tmpdir(), 'cdp-proxy.log');
  const logFd = fs.openSync(logFile, 'a');
  const args = [PROXY_SCRIPT];
  if (browserOverride) args.push('--browser', browserOverride);
  const child = spawn(process.execPath, args, {
    detached: true,
    stdio: ['ignore', logFd, logFd],
    ...(os.platform() === 'win32' ? { windowsHide: true } : {}),
  });
  child.unref();
  fs.closeSync(logFd);
}

async function ensureProxy(expectedBrowserId, browserOverride) {
  const healthUrl = `http://127.0.0.1:${PROXY_PORT}/health`;
  const targetsUrl = `http://127.0.0.1:${PROXY_PORT}/targets`;

  // 複用：proxy 已執行 + 已連線瀏覽器 → 校驗 expected vs actual
  const health = await httpGetJson(healthUrl);
  if (health?.status === 'ok' && health.connected) {
    const runningId = health.browser?.id;
    const runningLabel = health.browser?.label || runningId || 'unknown';
    if (expectedBrowserId && runningId && runningId !== 'unknown' && runningId !== expectedBrowserId) {
      console.log(`proxy: 瀏覽器不一致 — 當前已連著 ${runningLabel}，但本次需要 ${expectedBrowserId}`);
      console.log('  請在終端執行 pkill -f cdp-proxy.mjs 重置後再試');
      return false;
    }
    console.log(`proxy: ready (${runningLabel})`);
    return true;
  }

  console.log('proxy: connecting...');
  startProxyDetached(browserOverride);

  await new Promise((r) => setTimeout(r, 2000));

  for (let i = 1; i <= 15; i++) {
    const result = await httpGetJson(targetsUrl, 8000);
    if (Array.isArray(result)) {
      const newHealth = await httpGetJson(healthUrl);
      const label = newHealth?.browser?.label || 'unknown';
      console.log(`proxy: ready (${label})`);
      return true;
    }
    if (i === 1) {
      console.log('⚠️  瀏覽器可能有授權彈窗，請點選「允許」後等待連線...');
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log('❌ 連線超時，請檢查瀏覽器除錯設定');
  console.log(`  日誌：${path.join(os.tmpdir(), 'cdp-proxy.log')}`);
  return false;
}

// --- 輸出瀏覽器選擇結果，返回是否可以繼續啟動 proxy ---

function printAvailableHint(detected) {
  const detectedIds = new Set(detected.map(b => b.id));
  const configurable = knownBrowsers().filter(b => !detectedIds.has(b.id));
  if (detected.length) {
    console.log(`  已開啟遠端除錯：${detected.map(b => `${b.label} (${b.id}, port ${b.port})`).join('、')}`);
  }
  if (configurable.length) {
    console.log(`  其他可配置：${configurable.map(b => `${b.label} (${b.id})`).join('、')}`);
  }
}

async function resolveAndReport(override) {
  const result = await selectBrowser(override);

  switch (result.kind) {
    case 'ok': {
      const sourceTag = result.source === 'override' ? '[--browser 指定]' : '[config.env 偏好]';
      console.log(`browser: ok (${result.browser.label}, port ${result.browser.port}) ${sourceTag}`);
      return { proceed: true, browserId: result.browser.id };
    }

    case 'ambiguous': {
      console.log('browser: needs decision — 使用者尚未在 config.env 設定偏好');
      printAvailableHint(result.detected);
      console.log('  請詢問使用者：哪個瀏覽器作為 Agent 的預設？（寫入 config.env 的 WEB_ACCESS_BROWSER）');
      console.log('  若僅本次使用，可重跑：node check-deps.mjs --browser <id>');
      return { proceed: false, exitCode: 2 };
    }

    case 'mismatch': {
      const expected = result.override || result.configured;
      const expectedLabel = knownBrowsers().find(b => b.id === expected)?.label || expected;
      const sourceDesc = result.source === 'override' ? '本次指定' : '預設偏好';
      console.log(`browser: error — ${sourceDesc}的瀏覽器是 "${expected}" (${expectedLabel})，但沒連上`);
      console.log(`  Agent 處理順序：`);
      console.log(`    1. 先用系統命令開啟 ${expectedLabel}（按你所在平台自行選擇，如 macOS 的 open -a），再重新執行 node check-deps.mjs`);
      console.log(`    2. 若仍報相同錯誤，可能是因為遠端除錯開關沒啟用 —— 告訴使用者：在 ${expectedLabel} 的位址列訪問 ${expected}://inspect/#remote-debugging，勾選 "Allow remote debugging for this browser instance"`);
      printAvailableHint(result.detected);
      if (result.source === 'preference') {
        console.log(`  也可以編輯 config.env 改預設偏好，或本次臨時換瀏覽器：node check-deps.mjs --browser <id>`);
      }
      return { proceed: false, exitCode: 1 };
    }

    case 'empty': {
      // 末路兜底：嘗試常見固定埠（使用者手動 --remote-debugging-port=9222 啟動的場景）
      const fallbackPort = await findFallbackPort();
      if (fallbackPort) {
        console.log(`browser: ok (port ${fallbackPort}) [透過手動除錯埠連線]`);
        return { proceed: true };
      }
      console.log('browser: 未連線 — 沒有任何瀏覽器開啟遠端除錯開關');
      console.log(`  支援的瀏覽器：${knownBrowsers().map(b => b.label).join('、')}`);
      console.log('  在你想用的瀏覽器位址列開啟 chrome://inspect/#remote-debugging 或 edge://inspect/#remote-debugging，勾選 "Allow remote debugging for this browser instance"');
      return { proceed: false, exitCode: 1 };
    }
  }
}

// --- main ---

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  ensureConfigExists();
  checkNode();

  const { proceed, exitCode, browserId } = await resolveAndReport(opts.browser);
  if (!proceed) process.exit(exitCode);

  const proxyOk = await ensureProxy(browserId, opts.browser);
  if (!proxyOk) process.exit(1);

  // 列出已有站點經驗
  const patternsDir = path.join(ROOT, 'references', 'site-patterns');
  try {
    const sites = fs.readdirSync(patternsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace(/\.md$/, ''));
    if (sites.length) {
      console.log(`\nsite-patterns: ${sites.join(', ')}`);
    }
  } catch {}
}

await main();
