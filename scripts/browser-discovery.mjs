// 瀏覽器 CDP 埠發現 + 選擇 - 單一職責模組
// 被 check-deps.mjs 和 cdp-proxy.mjs 共享。
//
// 選擇規則（resolution）：
//   1. 呼叫方傳入 override 引數（來自命令列 --browser） → 嚴格模式，找不到則硬錯
//   2. config.env 裡 WEB_ACCESS_BROWSER 設了 → 嚴格模式，找不到則硬錯
//   3. 都沒設 → "ask" 模式，提示呼叫方詢問使用者
//
// 不擅自降級：偏好不可用一律硬錯，讓使用者介入。
// 持久態只有 config.env 一處；override 是單次 spawn 透過命令列引數表達，不讀 process.env。

import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = path.join(SKILL_ROOT, 'config.env');

// 已知支援 chrome://inspect#remote-debugging toggle 的瀏覽器
// 加新瀏覽器：只改這裡
export function knownBrowsers() {
  const home = os.homedir();
  const localAppData = process.env.LOCALAPPDATA || '';
  switch (os.platform()) {
    case 'darwin':
      return [
        { id: 'chrome',        label: 'Chrome',         devToolsPath: path.join(home, 'Library/Application Support/Google/Chrome/DevToolsActivePort') },
        { id: 'chrome-canary', label: 'Chrome Canary',  devToolsPath: path.join(home, 'Library/Application Support/Google/Chrome Canary/DevToolsActivePort') },
        { id: 'chromium',      label: 'Chromium',       devToolsPath: path.join(home, 'Library/Application Support/Chromium/DevToolsActivePort') },
        { id: 'edge',          label: 'Microsoft Edge', devToolsPath: path.join(home, 'Library/Application Support/Microsoft Edge/DevToolsActivePort') },
      ];
    case 'linux':
      return [
        { id: 'chrome',   label: 'Chrome',         devToolsPath: path.join(home, '.config/google-chrome/DevToolsActivePort') },
        { id: 'chromium', label: 'Chromium',       devToolsPath: path.join(home, '.config/chromium/DevToolsActivePort') },
        { id: 'edge',     label: 'Microsoft Edge', devToolsPath: path.join(home, '.config/microsoft-edge/DevToolsActivePort') },
      ];
    case 'win32':
      return [
        { id: 'chrome',   label: 'Chrome',         devToolsPath: path.join(localAppData, 'Google/Chrome/User Data/DevToolsActivePort') },
        { id: 'chromium', label: 'Chromium',       devToolsPath: path.join(localAppData, 'Chromium/User Data/DevToolsActivePort') },
        { id: 'edge',     label: 'Microsoft Edge', devToolsPath: path.join(localAppData, 'Microsoft/Edge/User Data/DevToolsActivePort') },
      ];
    default:
      return [];
  }
}

// TCP 埠監聽檢測
// 用 TCP connect 而非 WebSocket，避免觸發瀏覽器的遠端除錯授權彈窗。
export function checkPort(port, host = '127.0.0.1', timeoutMs = 2000) {
  return new Promise((resolve) => {
    const socket = net.createConnection(port, host);
    const timer = setTimeout(() => { socket.destroy(); resolve(false); }, timeoutMs);
    socket.once('connect', () => { clearTimeout(timer); socket.destroy(); resolve(true); });
    socket.once('error',   () => { clearTimeout(timer); resolve(false); });
  });
}

// 讀 config.env 檔案（不寫入 process.env，分清來源）
// 格式：KEY=VALUE，# 開頭是註釋
function readConfig() {
  const cfg = {};
  let content;
  try { content = fs.readFileSync(CONFIG_PATH, 'utf8'); }
  catch { return cfg; }
  for (const line of content.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (k && v) cfg[k] = v;
  }
  return cfg;
}

// 返回所有開了 toggle 且埠活的瀏覽器
async function detectAll() {
  const result = [];
  for (const browser of knownBrowsers()) {
    let content;
    try { content = fs.readFileSync(browser.devToolsPath, 'utf8'); }
    catch { continue; }
    const lines = content.trim().split(/\r?\n/).filter(Boolean);
    const port = parseInt(lines[0], 10);
    if (!(port > 0 && port < 65536)) continue;
    if (!(await checkPort(port))) continue;
    result.push({ ...browser, port, wsPath: lines[1] || null });
  }
  return result;
}

// 決策入口
// 引數：override — 呼叫方解析自命令列 --browser 的值（null 表示未傳）
// 返回 { kind, browser?, source?, detected, configured, override? }
//   kind ∈ 'ok' | 'ambiguous' | 'mismatch' | 'empty'
//   source ∈ 'override' | 'preference' | undefined
//   ambiguous = 沒設偏好 + 至少一個瀏覽器開了 toggle，需問使用者
//   mismatch  = override/配偏好設了但未檢測到對應 toggle，硬錯
//   empty     = 0 瀏覽器開 toggle 且未設偏好/override
export async function selectBrowser(override = null) {
  const detected = await detectAll();
  const configured = readConfig().WEB_ACCESS_BROWSER || null;

  // 1. 命令列 override（最高優先，單次有效）
  if (override) {
    const match = detected.find(b => b.id === override);
    if (match) return { kind: 'ok', browser: match, source: 'override', detected, configured, override };
    return { kind: 'mismatch', source: 'override', detected, configured, override };
  }

  // 2. config.env preference（持久）
  if (configured) {
    const match = detected.find(b => b.id === configured);
    if (match) return { kind: 'ok', browser: match, source: 'preference', detected, configured };
    return { kind: 'mismatch', source: 'preference', detected, configured };
  }

  // 3. 無偏好 —— 一律詢問使用者（哪怕 detected 只有一個）
  if (detected.length === 0) {
    return { kind: 'empty', detected, configured };
  }
  return { kind: 'ambiguous', detected, configured };
}

// 兜底：掃描常用固定埠
// 適用場景：使用者手動 --remote-debugging-port=9222 啟動瀏覽器，
// 此時 DevToolsActivePort 可能不在預設 user-data-dir。
export async function findFallbackPort() {
  for (const port of [9222, 9229, 9333]) {
    if (await checkPort(port)) return port;
  }
  return null;
}
