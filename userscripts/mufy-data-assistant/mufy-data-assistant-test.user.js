// ==UserScript==
// @name         Mufy 角色与面具找回助手 3.0 开发版
// @namespace    local.mufy.session-recovery.test
// @version      3.0.0-dev.85
// @description  Mufy 角色、聊天与面具管理工具的 3.0 开发版本。
// 来源：小红薯廿叁，仅供交流和学习，禁止二传。
// @match        https://chat.mufy.ai/*
// @updateURL    https://raw.githubusercontent.com/Star7861/CloudFlare-ImgBed/main/userscripts/mufy-data-assistant/mufy-data-assistant-test.user.js
// @downloadURL  https://raw.githubusercontent.com/Star7861/CloudFlare-ImgBed/main/userscripts/mufy-data-assistant/mufy-data-assistant-test.user.js
// @grant        unsafeWindow
// @grant        GM_info
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const SCRIPT_VERSION = typeof GM_info !== 'undefined' && GM_info?.script?.version
    ? String(GM_info.script.version)
    : '3.0.0-dev.85';
  const DISPLAY_VERSION = (SCRIPT_VERSION.match(/^\d+(?:\.\d+)*/) || [SCRIPT_VERSION])[0];
  const TEST_UPDATE_URL = 'https://raw.githubusercontent.com/Star7861/CloudFlare-ImgBed/main/userscripts/mufy-data-assistant/mufy-data-assistant-test.user.js';
  const UPDATE_CHECK_KEY = 'mufy-recovery-update-check-v1';
  const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000;
  const MASK_LIBRARY_KEY = 'mufy-recovery-mask-library-v1';
  const MASK_LIBRARY_BACKUP_KEY = 'mufy-recovery-mask-library-backup-v1';
  const MASK_BINDINGS_KEY = 'mufy-recovery-mask-bindings-v1';
  const MASK_ACCOUNT_MIGRATION_OWNER_KEY = 'mufy-recovery-mask-account-migration-owner-v1';
  const MASK_INDEXEDDB_ACTIVE_KEY = 'mufy-recovery-mask-indexeddb-active-v1';
  const MASK_DATABASE_NAME = 'mufy-recovery-mask-storage';
  const MASK_DATABASE_VERSION = 1;
  const MASK_DATABASE_STORE = 'account-data';
  const ROLE_HISTORY_RECORD_PREFIX = 'role-history:';
  const AUTO_SWITCH_KEY = 'mufy-recovery-auto-switch-v1';
  const AUTO_SWITCH_RELOAD_KEY = 'mufy-recovery-auto-switch-reload-v1';
  const TOGGLE_POSITION_KEY = 'mufy-recovery-toggle-position-v1';
  const TOGGLE_HINT_KEY = 'mufy-recovery-toggle-hint-v1';
  const PANEL_HEIGHT_KEY = 'mufy-recovery-panel-height-v1';
  const ROLE_CACHE_KEY = 'mufy-role-links-only-role-cache-v1';
  const ROLE_CACHE_ACCOUNT_MIGRATION_OWNER_KEY = 'mufy-role-links-only-role-cache-migration-owner-v1';
  const AUTHOR_CACHE_KEY = 'mufy-role-links-only-author-cache-v1';
  const SHARE_CODE_CACHE_KEY = 'mufy-role-links-only-share-code-cache-v1';
  const SHARE_CODE_ACCOUNT_MIGRATION_OWNER_KEY = 'mufy-role-links-only-share-code-migration-owner-v1';
  const SHARE_FAVORITE_JOB_KEY = 'mufy-role-links-only-share-favorite-job-v1';
  const SHARE_FAVORITE_RESULT_KEY = 'mufy-role-links-only-share-favorite-result-v1';
  const SHARE_FAVORITE_JOB_RECORD_KEY = 'share-favorite-job:active';
  const FAVORITE_SHARE_RECOVERY_JOB_KEY = 'mufy-role-links-only-favorite-share-recovery-test-v1';
  const MANUAL_FAVORITE_CHAT_KEY = 'mufy-role-links-only-manual-favorite-chat-v1';
  const MANUAL_FAVORITE_CHAT_CURRENT_KEY = 'mufy-role-links-only-manual-favorite-chat-current-v1';
  const MANUAL_FAVORITE_NEXT_DISMISSED_KEY = 'mufy-role-links-only-manual-favorite-next-dismissed-v1';
  const MANUAL_AUTO_CHAT_MESSAGE_KEY = 'mufy-role-links-only-manual-auto-chat-message-v1';
  const MANUAL_AUTO_CHAT_DELAY_KEY = 'mufy-role-links-only-manual-auto-chat-delay-v1';
  const MANUAL_AUTO_CHAT_DELAY_MIN_KEY = 'mufy-role-links-only-manual-auto-chat-delay-min-v1';
  const MANUAL_AUTO_CHAT_DELAY_MAX_KEY = 'mufy-role-links-only-manual-auto-chat-delay-max-v1';
  const MANUAL_AUTO_CHAT_JOB_KEY = 'mufy-role-links-only-manual-auto-chat-job-v1';
  const CHAT_MODEL_CONFIG_KEY = 'mufy-role-links-only-chat-model-config-v1';
  const CHAT_JUMP_KEY = 'mufy-role-links-only-chat-jump-v1';
  const QUOTE_CARD_KEY = 'mufy-role-links-only-quote-cards-v1';
  const QUOTE_STYLE_KEY = 'mufy-role-links-only-quote-style-v1';
  const PANEL_THEME_KEY = 'mufy-recovery-panel-theme-v1';
  const PROMPT_LIBRARY_KEY = 'mufy-role-links-only-prompt-library-v1';
  const EXTRA_LIBRARY_KEY = 'mufy-role-links-only-extra-library-v1';
  const ACCOUNT_SWITCH_PROFILES_KEY = 'mufy-recovery-account-switch-profiles-v1';
  const ACCOUNT_SWITCH_PENDING_KEY = 'mufy-recovery-account-switch-pending-v1';
  const ACCOUNT_SWITCH_CURRENT_ID_KEY = 'mufy-recovery-account-switch-current-id-v1';
  const CONTENT_LIBRARY_RECORD_PREFIX = 'content-library:';
  const MODEL_MONITOR_SELECTION_KEY = 'mufy-role-links-only-model-monitor-selection-v1';
  const MODEL_MONITOR_SNAPSHOT_KEY = 'mufy-role-links-only-model-monitor-snapshot-v1';
  const MODEL_MONITOR_NOTIFY_KEY = 'mufy-role-links-only-model-monitor-notify-v1';
  const MODEL_MONITOR_INTERVAL_MS = 5 * 60 * 1000;
  const SESSIONLESS_ROLE_IDS_KEY = 'mufy-role-links-only-sessionless-role-ids-v1';
  const ROLE_FALLBACK_PENDING_KEY = 'mufy-role-links-only-role-fallback-pending-v1';
  const DEFAULT_MANUAL_AUTO_CHAT_MESSAGE = '≽^⚈⩊⚈^≼';
  const AUTHOR_FOLDER_MIGRATION_KEY = 'mufy-recovery-author-folder-migration-v1';
  const AUTHOR_FOLDER_MAP_KEY = 'mufy-recovery-author-folder-map-v1';
  const AUTO_ADD_FAVORITE_FOLDER_KEY = 'mufy-recovery-auto-add-favorite-folder-v1';
  const MAX_SITE_MASKS = 5;
  const ROLE_EXPORT_BATCH_SIZE = 1000;
  const ROLE_REQUEST_INTERVAL_MS = 200;
  const METADATA_REQUESTS_PER_SECOND = 5;
  const METADATA_REQUEST_INTERVAL_MS = Math.floor(1000 / METADATA_REQUESTS_PER_SECOND);
  const METADATA_MAX_IN_FLIGHT = 3;
  const RUN_LOG_KEY = 'mufy-recovery-run-log-v1';
  const RUN_LOG_LIMIT = 500;
  let authorization = '';
  let maskAccountScope = '';
  let maskLibraryStorageWarning = '';
  let maskStorageMode = 'initializing';
  let maskStorageReady = false;
  let maskDatabasePromise = null;
  let maskStorageWriteQueue = Promise.resolve();
  let maskStorageGeneration = 0;
  let roleHistoryWriteQueue = Promise.resolve();
  let roleHistoryGeneration = 0;
  let contentStorageMode = 'localStorage';
  let contentStorageGeneration = 0;
  let contentStorageWriteQueue = Promise.resolve();
  let liveHistoryPendingKey = '';
  let liveHistorySavedKey = '';
  let manualAutoChatProcessing = false;
  let manualAutoChatToastTimer = null;
  let accountLogoutRequesting = false;
  let scriptUpdateTimer = null;
  let chatModelConfigCache = new Map();
  let shareFavoriteJobCache = null;
  let shareFavoriteJobStoragePromise = null;
  let shareFavoriteJobStorageGeneration = 0;
  const AUTH_HOOK_MARK = '__mufyRecoveryAuthHookedV3Test';
  let authCaptureLogged = false;
  const observedChatApiSignatures = new Set();

  function chatApiObservationTarget(requestUrl) {
    try {
      const url = new URL(String(requestUrl || ''), location.href);
      const hostname = String(url.hostname || '').toLowerCase();
      const isMufyHost = hostname === 'mufy.ai' || hostname.endsWith('.mufy.ai')
        || hostname === 'mufyai.com' || hostname.endsWith('.mufyai.com');
      if (!isMufyHost || !/(?:^|\/)api(?:\/|$)/i.test(url.pathname)) return null;
      if (!/(conversation|message|chat|sessions?\/(?:history|detail|messages?))/i.test(url.pathname)) return null;
      return url;
    } catch (_) { return null; }
  }

  function chatRequestFieldSummary(url, body) {
    const fields = new Set([...url.searchParams.keys()]);
    if (typeof body === 'string' && body.trim()) {
      try {
        const parsed = JSON.parse(body);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) Object.keys(parsed).forEach(key => fields.add(key));
      } catch (_) {}
    }
    return [...fields].sort().join(', ') || '无';
  }

  function chatResponseShape(value, depth = 0) {
    if (Array.isArray(value)) return `数组(${value.length})${value.length && depth < 2 ? `[${chatResponseShape(value[0], depth + 1)}]` : ''}`;
    if (!value || typeof value !== 'object') return typeof value;
    const keys = Object.keys(value).slice(0, 20);
    if (depth >= 2) return `{${keys.join(', ')}}`;
    return `{${keys.map(key => `${key}:${chatResponseShape(value[key], depth + 1)}`).join(', ')}}`;
  }

  function recordChatApiObservation(requestUrl, response, method = 'GET', requestBody = '') {
    const url = chatApiObservationTarget(requestUrl);
    if (!url || !response) return;
    const signature = `${String(method || 'GET').toUpperCase()} ${url.hostname}${url.pathname}`;
    if (observedChatApiSignatures.has(signature)) return;
    observedChatApiSignatures.add(signature);
    const finish = body => {
      appendRunLog('info', `聊天接口侦测：${signature}；请求字段：${chatRequestFieldSummary(url, requestBody)}；响应结构：${chatResponseShape(body)}。未记录聊天正文和凭证。`);
    };
    try {
      if (typeof response.clone === 'function') {
        response.clone().json().then(finish).catch(() => finish('非 JSON 响应'));
        return;
      }
      if (response.responseType === 'json' && response.response) finish(response.response);
      else if (typeof response.responseText === 'string' && response.responseText.trim()) {
        try { finish(JSON.parse(response.responseText)); } catch (_) { finish('非 JSON 响应'); }
      }
    } catch (_) {}
  }

  function decodeJwtPayload(authValue) {
    try {
      const token = String(authValue || '').replace(/^Bearer\s+/i, '');
      const encoded = token.split('.')[1];
      if (!encoded) return null;
      const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
      const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
      const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (_) { return null; }
  }

  function shortStableHash(value) {
    let hash = 2166136261;
    for (const char of String(value || '')) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36).padStart(7, '0');
  }

  function maskAccountScopeFromAuthorization(authValue) {
    const payload = decodeJwtPayload(authValue);
    if (!payload || typeof payload !== 'object') return '';
    const nestedUser = payload.user && typeof payload.user === 'object' ? payload.user : {};
    const accountId = payload.sub ?? payload.userId ?? payload.user_id ?? payload.uid
      ?? payload.accountId ?? payload.account_id ?? nestedUser.id ?? nestedUser.userId ?? nestedUser.user_id
      ?? payload.email ?? nestedUser.email;
    if (accountId == null || String(accountId).trim() === '') return '';
    return `account-${shortStableHash(`${payload.iss || 'mufy'}|${String(accountId).trim()}`)}`;
  }

  function accountStorageKey(baseKey, scope = maskAccountScope) {
    return scope ? `${baseKey}:account:${scope}` : baseKey;
  }

  function loadAndMigrateScopedValue(baseKey, scope = maskAccountScope) {
    try {
      const scopedKey = accountStorageKey(baseKey, scope);
      const scoped = localStorage.getItem(scopedKey);
      if (scoped != null || !scope) return scoped;
      const legacy = localStorage.getItem(baseKey);
      if (legacy == null) return null;
      localStorage.setItem(scopedKey, legacy);
      if (localStorage.getItem(scopedKey) === legacy) localStorage.removeItem(baseKey);
      return legacy;
    } catch (_) {
      return null;
    }
  }

  function maskAccountLabel() {
    return maskAccountScope ? `账号分区 ${maskAccountScope.slice(-7)}` : '未识别账号（暂用旧版公共分区）';
  }

  function accountIdentityFromAuthorization(authValue = authorization) {
    const payload = decodeJwtPayload(authValue) || {};
    const user = payload.user && typeof payload.user === 'object' ? payload.user : {};
    const email = String(payload.email ?? payload.userEmail ?? payload.user_email ?? user.email ?? '').trim();
    const label = String(payload.nickname ?? payload.nickName ?? payload.name ?? payload.username
      ?? payload.displayName ?? user.nickname ?? user.nickName ?? user.name ?? user.username ?? '').trim();
    return { email, label, scope: maskAccountScopeFromAuthorization(authValue) };
  }

  function loadAccountSwitchProfiles() {
    try {
      const rows = JSON.parse(localStorage.getItem(ACCOUNT_SWITCH_PROFILES_KEY) || '[]');
      return Array.isArray(rows) ? rows.filter(row => row && row.id && row.email).map(row => ({
        id: String(row.id),
        email: String(row.email || '').trim(),
        label: String(row.label || row.email || '').trim(),
        scope: String(row.scope || ''),
        createdAt: Number(row.createdAt || Date.now()),
        lastUsedAt: Number(row.lastUsedAt || 0)
      })).filter(row => row.email) : [];
    } catch (_) { return []; }
  }

  function saveAccountSwitchProfiles(rows = []) {
    const normalized = Array.isArray(rows) ? rows.slice(0, 30) : [];
    localStorage.setItem(ACCOUNT_SWITCH_PROFILES_KEY, JSON.stringify(normalized));
    if (roleStateReady) state.accountSwitchProfiles = normalized;
  }

  function currentAccountSwitchId() {
    try { return String(localStorage.getItem(ACCOUNT_SWITCH_CURRENT_ID_KEY) || ''); } catch (_) { return ''; }
  }

  function setCurrentAccountSwitchId(accountId) {
    try {
      if (accountId) localStorage.setItem(ACCOUNT_SWITCH_CURRENT_ID_KEY, String(accountId));
      else localStorage.removeItem(ACCOUNT_SWITCH_CURRENT_ID_KEY);
    } catch (_) {}
  }

  function pendingAccountSwitch() {
    try {
      const value = JSON.parse(sessionStorage.getItem(ACCOUNT_SWITCH_PENDING_KEY) || 'null');
      return value && value.email && Date.now() - Number(value.startedAt || 0) < 10 * 60 * 1000 ? value : null;
    } catch (_) { return null; }
  }

  function completePendingAccountSwitch(authValue = authorization) {
    const pending = pendingAccountSwitch();
    if (!pending || pending.phase === 'logout') return;
    const identity = accountIdentityFromAuthorization(authValue);
    if (identity.email && identity.email.toLowerCase() !== String(pending.email).toLowerCase()) return;
    if (!identity.email) {
      if (!identity.scope || !pending.sourceScope || identity.scope === pending.sourceScope) return;
      if (pending.targetScope && pending.targetScope !== pending.sourceScope && identity.scope !== pending.targetScope) return;
    }
    try { sessionStorage.removeItem(ACCOUNT_SWITCH_PENDING_KEY); } catch (_) {}
    const rows = loadAccountSwitchProfiles().map(row => row.id === pending.id ? { ...row, lastUsedAt: Date.now(), scope: identity.scope || row.scope } : row);
    saveAccountSwitchProfiles(rows);
    setCurrentAccountSwitchId(pending.id);
    showManualAutoChatToast(`已切换到“${pending.label || pending.email}”。`, { tone: 'success', duration: 5000 });
  }

  function saveCurrentAccountShortcut() {
    scanStoredAuthorization();
    const identity = accountIdentityFromAuthorization();
    const email = String(pageWindow.prompt('请输入这个 Mufy 账号的登录邮箱：\n只保存在当前浏览器本地，不保存密码。', identity.email || '') || '').trim();
    if (!email) return;
    const label = String(pageWindow.prompt('给这个账号起一个便于识别的名称：', identity.label || email.split('@')[0] || email) || '').trim() || email;
    const rows = loadAccountSwitchProfiles();
    const existing = rows.find(row => row.email.toLowerCase() === email.toLowerCase());
    let savedId = '';
    if (existing) {
      existing.label = label;
      existing.scope = identity.scope || existing.scope;
      existing.lastUsedAt = Date.now();
      savedId = existing.id;
    } else {
      const next = { id: pageWindow.crypto?.randomUUID?.() || `account-${Date.now()}`, email, label, scope: identity.scope, createdAt: Date.now(), lastUsedAt: Date.now() };
      rows.push(next);
      savedId = next.id;
    }
    saveAccountSwitchProfiles(rows);
    setCurrentAccountSwitchId(savedId);
    state.status = `已保存账号“${label}”；仅保存邮箱和备注，不保存密码、Cookie 或登录令牌。`;
    render();
  }

  function setWebsiteInputValue(input, value) {
    const descriptor = Object.getOwnPropertyDescriptor(pageWindow.HTMLInputElement.prototype, 'value');
    descriptor?.set?.call(input, value);
    input.dispatchEvent(new pageWindow.Event('input', { bubbles: true }));
    input.dispatchEvent(new pageWindow.Event('change', { bubbles: true }));
  }

  function visibleWebsiteElement(element) {
    if (!element || element.closest('#mufy-recovery-panel')) return false;
    const rect = element.getBoundingClientRect();
    const style = pageWindow.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0;
  }

  function officialLoginControl() {
    const direct = [...document.querySelectorAll('button,a,[role="button"],[tabindex]')].filter(visibleWebsiteElement);
    const leaves = [...document.querySelectorAll('body *')].filter(item => item.children.length === 0 && visibleWebsiteElement(item));
    let best = null;
    let bestScore = 0;
    for (const item of [...direct, ...leaves]) {
      const text = String(item.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text || text.length > 28 || /退出|注册|忘记密码/i.test(text)) continue;
      let score = 0;
      if (/^(登录|登入|login|sign in)$/i.test(text)) score += 8;
      else if (/登录|登入|\blogin\b|sign in/i.test(text)) score += 4;
      const hint = `${item.getAttribute('aria-label') || ''} ${item.getAttribute('title') || ''}`;
      if (/登录|登入|login|sign in/i.test(hint)) score += 4;
      if (item.matches('button,a,[role="button"]')) score += 2;
      if (score > bestScore) {
        best = item.matches('button,a,[role="button"]') ? item : item.closest('button,a,[role="button"],[tabindex]') || item;
        bestScore = score;
      }
    }
    return bestScore >= 4 ? best : null;
  }

  function installAccountSwitchLoginAssist() {
    const pending = pendingAccountSwitch();
    if (!pending) return;
    if (pending.phase === 'logout') {
      setTimeout(() => attemptOfficialAccountLogout(pending), 200);
      return;
    }
    let attempts = 0;
    let sawEmailInput = false;
    let emailNoticeShown = false;
    let emailReadyAt = 0;
    const timer = setInterval(() => {
      attempts += 1;
      const officialDialog = document.querySelector('div[role="dialog"][aria-modal="true"][data-state="open"]');
      const emailInput = officialDialog?.querySelector('input[type="email"][name="email"]')
        || [...document.querySelectorAll('input')].find(input => input.type === 'email'
        || /邮箱|email/i.test(`${input.placeholder || ''} ${input.name || ''} ${input.autocomplete || ''}`));
      if (emailInput) {
        sawEmailInput = true;
        if (!emailReadyAt) emailReadyAt = Date.now();
        if (String(emailInput.value || '').trim() !== String(pending.email)) {
          setWebsiteInputValue(emailInput, pending.email);
        }
        const form = emailInput.closest('form') || officialDialog?.querySelector('form');
        const passwordInput = form?.querySelector('input[type="password"][name="password"],input[type="password"]');
        const submitButton = form?.querySelector('button[type="submit"],input[type="submit"]');
        const browserHadTimeToAutofill = emailReadyAt && Date.now() - emailReadyAt >= 1200;
        if (passwordInput && submitButton && !submitButton.disabled
          && (String(passwordInput.value || '').length > 0 || browserHadTimeToAutofill)) {
          clearInterval(timer);
          state.status = `正在通过 Mufy 官方登录表单切换到“${pending.label || pending.email}”…`;
          showManualAutoChatToast(state.status, { tone: 'success', duration: 6000 });
          // 走 Mufy 登录按钮自身的点击处理，避免 requestSubmit 绕过按钮绑定的表单状态同步。
          submitButton.click();
          return;
        }
        if (!emailNoticeShown) {
          emailNoticeShown = true;
          emailInput.focus();
          showManualAutoChatToast(`已填入“${pending.label || pending.email}”的邮箱，正在等待 Edge 自动补全密码…`, { tone: 'info', duration: 6000 });
        }
        return;
      }
      if (attempts >= 2 && attempts % 4 === 2 && !document.querySelector('input[type="password"]')) {
        const loginButton = officialLoginControl();
        if (loginButton) {
          loginButton.click();
          state.status = `已找到 Mufy 登录入口，正在等待邮箱输入框…`;
          if (panel) render();
        }
      }
      if (attempts >= 90) {
        clearInterval(timer);
        showManualAutoChatToast(sawEmailInput
          ? '邮箱已填入，但 Edge 没有在等待时间内补全密码，请手动选择已保存的密码并登录。'
          : '仍未找到 Mufy 登录邮箱框，请手动点网站“登录”；目标邮箱仍保留，可刷新后继续自动填入。', { tone: 'warn', duration: 9000 });
      }
    }, 500);
  }

  function savePendingAccountSwitch(value) {
    try { sessionStorage.setItem(ACCOUNT_SWITCH_PENDING_KEY, JSON.stringify(value)); } catch (_) {}
  }

  function finishAccountLogout(pending) {
    const next = { ...pending, phase: 'login', logoutRequestedAt: Date.now() };
    savePendingAccountSwitch(next);
    pageWindow.location.assign('/');
  }

  async function attemptOfficialAccountLogout(pending = pendingAccountSwitch()) {
    if (!pending || accountLogoutRequesting) return;
    accountLogoutRequesting = true;
    try {
      scanStoredAuthorization();
      const headers = { Accept: 'application/json' };
      if (authorization) headers.Authorization = authorization;
      const response = await pageWindow.fetch('/api/users/logout', {
        method: 'POST',
        headers,
        credentials: 'include',
        cache: 'no-store'
      });
      let body = null;
      try { body = await response.json(); } catch (_) {}
      const success = response.ok && (Number(body?.code) === 200 || String(body?.reason || '').toLowerCase() === 'success');
      if (!success) throw new Error(`官方 logout 失败（HTTP ${response.status}${body?.reason ? `：${body.reason}` : ''}）`);
      appendRunLog('info', '已通过 POST /api/users/logout 正式退出当前账号。');
      finishAccountLogout(pending);
    } catch (error) {
      try { sessionStorage.removeItem(ACCOUNT_SWITCH_PENDING_KEY); } catch (_) {}
      state.status = `切换已停止：${explainFailure(error)}。当前账号不会被清除。`;
      appendRunLog('error', '账号切换的官方 logout 请求失败', error);
      showManualAutoChatToast(state.status, { tone: 'error', duration: 9000 });
      render();
    } finally {
      accountLogoutRequesting = false;
    }
  }

  function switchToSavedAccount(accountId) {
    const row = loadAccountSwitchProfiles().find(item => item.id === String(accountId || ''));
    if (!row) return;
    if (!pageWindow.confirm(`切换到“${row.label}”？\n\n脚本会退出当前 Mufy 登录并打开官方登录窗口，自动填入邮箱；密码仍由 Edge 或你本人填写。`)) return;
    const pending = { id: row.id, email: row.email, label: row.label, targetScope: row.scope || '', sourceScope: maskAccountScope || accountIdentityFromAuthorization().scope, phase: 'logout', startedAt: Date.now() };
    savePendingAccountSwitch(pending);
    state.status = `正在切换到“${row.label}”…`;
    showManualAutoChatToast(`正在退出当前账号，然后切换到“${row.label}”…`, { tone: 'info', duration: 5000 });
    attemptOfficialAccountLogout(pending);
  }

  function loadUpdateCheckSnapshot() {
    try {
      const value = JSON.parse(localStorage.getItem(UPDATE_CHECK_KEY) || 'null');
      return value && typeof value === 'object' ? value : { latestVersion: '', checkedAt: 0 };
    } catch (_) { return { latestVersion: '', checkedAt: 0 }; }
  }

  function compareScriptVersions(left, right) {
    const a = String(left || '').match(/\d+/g)?.map(Number) || [];
    const b = String(right || '').match(/\d+/g)?.map(Number) || [];
    for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
      const difference = (a[index] || 0) - (b[index] || 0);
      if (difference) return difference;
    }
    return 0;
  }

  async function checkForScriptUpdate(force = false) {
    if (state.updateChecking) return state.updateAvailable;
    const cached = loadUpdateCheckSnapshot();
    if (!force && cached.checkedAt && Date.now() - Number(cached.checkedAt) < UPDATE_CHECK_INTERVAL_MS) {
      state.latestScriptVersion = String(cached.latestVersion || '');
      state.updateAvailable = compareScriptVersions(state.latestScriptVersion, SCRIPT_VERSION) > 0;
      render();
      return state.updateAvailable;
    }
    state.updateChecking = true;
    state.updateError = '';
    render();
    try {
      const response = await pageWindow.fetch(`${TEST_UPDATE_URL}?check=${Date.now()}`, { cache: 'no-store', credentials: 'omit' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const header = (await response.text()).slice(0, 3000);
      const latestVersion = String(header.match(/^\/\/\s*@version\s+([^\s]+)\s*$/mi)?.[1] || '');
      if (!latestVersion) throw new Error('更新文件没有找到版本号');
      const wasAvailable = state.updateAvailable;
      state.latestScriptVersion = latestVersion;
      state.updateAvailable = compareScriptVersions(latestVersion, SCRIPT_VERSION) > 0;
      localStorage.setItem(UPDATE_CHECK_KEY, JSON.stringify({ latestVersion, checkedAt: Date.now() }));
      if (state.updateAvailable && !wasAvailable) {
        showManualAutoChatToast(`发现测试版更新 ${latestVersion}，打开脚本后点击“检查更新”即可安装。`, { tone: 'success', duration: 9000 });
      }
      return state.updateAvailable;
    } catch (error) {
      state.updateError = explainFailure(error);
      appendRunLog('warn', '检查脚本更新失败', error);
      return false;
    } finally {
      state.updateChecking = false;
      render();
    }
  }

  async function handleScriptUpdateEntry() {
    const available = state.updateAvailable || await checkForScriptUpdate(true);
    if (available) {
      pageWindow.open(TEST_UPDATE_URL, '_blank', 'noopener');
      state.status = `已打开 ${state.latestScriptVersion || '最新测试版'} 安装页；请在篡改猴页面确认更新。`;
    } else if (state.updateError) {
      state.status = `检查更新失败：${state.updateError}。可稍后重试。`;
    } else {
      state.status = `当前已是最新测试版 ${SCRIPT_VERSION}。`;
    }
    render();
  }

  function adoptMaskAccountFromAuthorization(authValue) {
    const nextScope = maskAccountScopeFromAuthorization(authValue);
    if (!nextScope || nextScope === maskAccountScope) return;
    const previousScope = maskAccountScope;
    maskAccountScope = nextScope;
    chatModelConfigCache = loadChatModelConfigCache();
    if (!roleStateReady) return;
    state.roleHistory = [];
    reloadShareCodeCacheForAccount();
    reloadShareFavoriteJobStorageForAccount();
    initializeRoleHistoryForAccount(nextScope);
    reloadRoleCacheForAccount();
    state.quoteCards = loadQuoteCards();
    state.quoteStyle = loadQuoteStyle();
    state.quoteSelectedId = '';
    state.promptLibrary = loadMaterialLibrary(PROMPT_LIBRARY_KEY, 'prompt');
    state.extraLibrary = loadMaterialLibrary(EXTRA_LIBRARY_KEY, 'extra');
    initializeContentStorageForAccount(nextScope);
    state.modelMonitorSelectedIds = loadModelMonitorSelection();
    state.modelMonitorRows = [];
    state.modelMonitorLastChecked = '';
    state.modelMonitorNotify = loadModelMonitorNotify();
    state.sessionlessRoleIds = loadSessionlessRoleIds();
    state.autoAddFavoriteFolder = loadAutoAddFavoriteFolderSetting();
    reloadMaskAccountPartition(previousScope, nextScope);
  }

  function logDetailText(detail) {
    if (detail == null || detail === '') return '';
    if (detail instanceof Error || (detail && typeof detail === 'object' && ('name' in detail || 'message' in detail))) {
      const label = `${String(detail.name || 'Error')}: ${String(detail.message || '未知错误')}`;
      const stack = String(detail.stack || '');
      return stack && !stack.includes(String(detail.message || '')) ? `${label}\n${stack}` : (stack || label);
    }
    if (typeof detail === 'string') return detail;
    try { return JSON.stringify(detail); } catch (_) { return String(detail); }
  }

  function loadRunLogs() {
    try {
      const rows = JSON.parse(localStorage.getItem(RUN_LOG_KEY) || '[]');
      return Array.isArray(rows) ? rows.filter(row => row && typeof row === 'object').slice(-RUN_LOG_LIMIT) : [];
    } catch (_) { return []; }
  }

  function appendRunLog(level, message, detail = '') {
    try {
      const rows = loadRunLogs();
      rows.push({
        time: new Date().toISOString(),
        level: String(level || 'info').toLowerCase(),
        message: String(message || ''),
        detail: logDetailText(detail)
      });
      localStorage.setItem(RUN_LOG_KEY, JSON.stringify(rows.slice(-RUN_LOG_LIMIT)));
    } catch (_) {}
  }

  function installRunLogCapture() {
    const consoleObject = pageWindow.console;
    if (!consoleObject || consoleObject.__mufyRecoveryLogCaptured) return;
    ['warn', 'error'].forEach(level => {
      const original = typeof consoleObject[level] === 'function' ? consoleObject[level].bind(consoleObject) : null;
      if (!original) return;
      consoleObject[level] = (...args) => {
        try {
          const text = args.map(logDetailText).join(' ');
          if (/\[Mufy/i.test(text)) appendRunLog(level, text);
        } catch (_) {}
        original(...args);
      };
    });
    try { consoleObject.__mufyRecoveryLogCaptured = true; } catch (_) {}
  }

  installRunLogCapture();

  function loginErrorMessage(status, target = '请求') {
    if (!authorization) {
      return `${target}失败（HTTP ${status}）：脚本还没接到登录凭证。请先确认已登录 chat.mufy.ai，再打开任意角色聊天页，等页面加载完成后重试。`;
    }
    if (status === 401) {
      return `${target}失败（HTTP 401）：已接到登录凭证，但网站认为登录状态已过期。请重新登录 Mufy 后再试。`;
    }
    return `${target}失败（HTTP 403）：已接到登录凭证，但网站拒绝了这次访问，可能是账号权限或该内容的访问限制。`;
  }

  function captureAuthorization(headers, requestUrl) {
    try {
      const url = new URL(String(requestUrl || ''), location.href);
      const hostname = String(url.hostname || '').toLowerCase();
      const isMufyHost = hostname === 'mufy.ai' || hostname.endsWith('.mufy.ai')
        || hostname === 'mufyai.com' || hostname.endsWith('.mufyai.com');
      if (!isMufyHost || !/(?:^|\/)api(?:\/|$)/i.test(url.pathname)) return;
      const candidate = new pageWindow.Headers(headers || {}).get('authorization') || '';
      if (/^Bearer\s+\S+/i.test(candidate)) {
        authorization = candidate;
        adoptMaskAccountFromAuthorization(candidate);
        completePendingAccountSwitch(candidate);
        if (!authCaptureLogged) {
          authCaptureLogged = true;
          appendRunLog('info', `已从 Mufy API 请求捕获登录凭证（${url.hostname}${url.pathname}；不记录凭证内容）。`);
        }
        setTimeout(() => scheduleAutoMaskSwitch(), 0);
      }
    } catch (_) {}
  }

  function scanStoredAuthorization() {
    if (authorization) return authorization;
    const storages = [];
    try { if (pageWindow.localStorage) storages.push(pageWindow.localStorage); } catch (_) {}
    try { if (pageWindow.sessionStorage) storages.push(pageWindow.sessionStorage); } catch (_) {}
    for (const storage of storages) {
      try {
        for (let index = 0; index < storage.length; index += 1) {
          const key = String(storage.key(index) || '');
          if (!/(token|authorization|access.?token|jwt)/i.test(key)) continue;
          const rawValue = String(storage.getItem(key) || '').replace(/^"|"$/g, '');
          let nestedValue = '';
          try {
            const parsed = JSON.parse(rawValue);
            nestedValue = String(parsed?.accessToken || parsed?.access_token || parsed?.token || parsed?.authorization || '');
          } catch (_) {}
          const value = nestedValue || rawValue;
          const candidate = /^Bearer\s+\S+/i.test(value)
            ? value
            : (/^[\w-]+\.[\w-]+\.[\w-]+$/.test(value) ? `Bearer ${value}` : '');
          if (candidate) {
            authorization = candidate;
            adoptMaskAccountFromAuthorization(candidate);
            completePendingAccountSwitch(candidate);
            return authorization;
          }
        }
      } catch (_) {}
    }
    return authorization;
  }

  function loadChatModelConfigCache() {
    try {
      const value = JSON.parse(loadAndMigrateScopedValue(CHAT_MODEL_CONFIG_KEY) || '{}');
      return new Map(Object.entries(value && typeof value === 'object' ? value : {}).filter(([, row]) => row?.modelId && row?.modelTemplateId));
    } catch (_) { return new Map(); }
  }

  function saveChatModelConfigCache() {
    try { localStorage.setItem(accountStorageKey(CHAT_MODEL_CONFIG_KEY), JSON.stringify(Object.fromEntries(chatModelConfigCache))); } catch (_) {}
  }

  function modelConfigFromObject(value, depth = 0) {
    if (!value || typeof value !== 'object' || depth > 7) return null;
    if (!Array.isArray(value) && value.modelId != null && value.modelTemplateId != null) {
      const modelId = Number(value.modelId);
      const modelTemplateId = Number(value.modelTemplateId);
      if (Number.isFinite(modelId) && Number.isFinite(modelTemplateId)) return { modelId, modelTemplateId };
    }
    for (const child of Array.isArray(value) ? value : Object.values(value)) {
      const found = modelConfigFromObject(child, depth + 1);
      if (found) return found;
    }
    return null;
  }

  function rememberChatModelConfig(characterId, value) {
    const id = String(characterId || '');
    const config = modelConfigFromObject(value);
    if (!id || !config) return false;
    const saved = { ...config, savedAt: Date.now() };
    chatModelConfigCache.set(id, saved);
    chatModelConfigCache.set('__last__', saved);
    saveChatModelConfigCache();
    return true;
  }

  function captureChatCompletionRequest(requestUrl, body) {
    try {
      const url = new URL(String(requestUrl || ''), location.href);
      if (!/\/api\/v1\/chat\/completions$/i.test(url.pathname)) return;
      const payload = typeof body === 'string' ? JSON.parse(body) : body;
      rememberChatModelConfig(payload?.characterId || currentRoleContext().characterId, payload);
    } catch (_) {}
  }

  function captureChatModelConfigResponse(requestUrl, response) {
    try {
      const url = new URL(String(requestUrl || ''), location.href);
      if (!/(?:model|preference|current)/i.test(url.pathname) || !response?.clone) return;
      const characterId = url.searchParams.get('characterId') || currentRoleContext().characterId;
      if (!characterId) return;
      response.clone().json().then(body => rememberChatModelConfig(characterId, body)).catch(() => {});
    } catch (_) {}
  }

  function captureChatModelConfigXhr(requestUrl, xhr) {
    try {
      const url = new URL(String(requestUrl || ''), location.href);
      if (!/(?:model|preference|current)/i.test(url.pathname)) return;
      const characterId = url.searchParams.get('characterId') || currentRoleContext().characterId;
      if (!characterId) return;
      const body = xhr.responseType === 'json' ? xhr.response : JSON.parse(String(xhr.responseText || ''));
      rememberChatModelConfig(characterId, body);
    } catch (_) {}
  }
  // Mufy 给 /api 请求添加 Bearer 令牌。这里只在内存中接住它，
  // 用于请求同一个网站的会话列表；不会显示、保存或导出令牌。
  let roleStateReady = false;
  const pendingSiteCaptureRows = [];
  let siteCaptureRenderTimer = 0;
  let siteCapturePageKey = '';

  function installAuthCapture() {
    const XHR = pageWindow.XMLHttpRequest;
    if (XHR && !XHR.prototype[AUTH_HOOK_MARK]) {
      XHR.prototype[AUTH_HOOK_MARK] = true;
      const originalOpen = XHR.prototype.open;
      const originalSetRequestHeader = XHR.prototype.setRequestHeader;
      const originalSend = XHR.prototype.send;
      XHR.prototype.open = function (method, url, ...rest) {
        this.__mufyRecoveryUrl = String(url || '');
        this.__mufyRecoveryMethod = String(method || 'GET');
        this.__mufyRecoveryPageScope = currentSiteCaptureScope();
        if (!this.__mufyRecoveryCaptureHooked && this.addEventListener) {
          this.__mufyRecoveryCaptureHooked = true;
          this.addEventListener('loadend', function () {
            tryCaptureSiteCharacterXhr(this.__mufyRecoveryUrl, this, this.__mufyRecoveryPageScope);
            recordChatApiObservation(this.__mufyRecoveryUrl, this, this.__mufyRecoveryMethod, this.__mufyRecoveryBody);
            captureChatModelConfigXhr(this.__mufyRecoveryUrl, this);
          });
        }
        return originalOpen.call(this, method, url, ...rest);
      };
      XHR.prototype.setRequestHeader = function (name, value) {
        if (/^authorization$/i.test(String(name))) captureAuthorization({ authorization: value }, this.__mufyRecoveryUrl);
        return originalSetRequestHeader.call(this, name, value);
      };
      XHR.prototype.send = function (body) {
        this.__mufyRecoveryBody = typeof body === 'string' ? body : '';
        captureChatCompletionRequest(this.__mufyRecoveryUrl, this.__mufyRecoveryBody);
        return originalSend.apply(this, arguments);
      };
    }
    if (pageWindow.fetch && !pageWindow.fetch[AUTH_HOOK_MARK]) {
      const originalFetch = pageWindow.fetch;
      const wrappedFetch = function (input, init) {
        let requestUrl = '';
        const pageScope = currentSiteCaptureScope();
        try {
          requestUrl = typeof input === 'string' ? input : input?.url || String(input || '');
        } catch (_) {}
        captureAuthorization(init?.headers, requestUrl);
        captureAuthorization(input?.headers, requestUrl);
        captureChatCompletionRequest(requestUrl, init?.body || '');
        const result = originalFetch.apply(this, arguments);
        try {
          return Promise.resolve(result).then(response => {
            tryCaptureSiteCharacterResponse(requestUrl, response, pageScope);
            recordChatApiObservation(requestUrl, response, init?.method || input?.method || 'GET', init?.body || '');
            captureChatModelConfigResponse(requestUrl, response);
            return response;
          });
        } catch (_) {
          return result;
        }
      };
      wrappedFetch[AUTH_HOOK_MARK] = true;
      pageWindow.fetch = wrappedFetch;
    }
  }
  try {
    installAuthCapture();
  } catch (error) {
    console.warn('[Mufy 角色与面具找回助手] 页面请求监听安装失败，仍继续加载面板。', error);
  }
  try {
    scanStoredAuthorization();
  } catch (error) {
    console.warn('[Mufy 角色与面具找回助手] 读取登录状态失败，仍继续加载面板。', error);
  }

  function loadRoleCache() {
    try {
      if (!maskAccountScope) return null;
      const scopedKey = accountStorageKey(ROLE_CACHE_KEY);
      let raw = localStorage.getItem(scopedKey) || '';
      if (!raw) {
        const legacy = localStorage.getItem(ROLE_CACHE_KEY) || '';
        const owner = localStorage.getItem(ROLE_CACHE_ACCOUNT_MIGRATION_OWNER_KEY) || '';
        if (legacy && (!owner || owner === maskAccountScope)) {
          raw = legacy;
          try {
            localStorage.setItem(ROLE_CACHE_ACCOUNT_MIGRATION_OWNER_KEY, maskAccountScope);
            localStorage.setItem(scopedKey, legacy);
            if (localStorage.getItem(scopedKey) === legacy) localStorage.removeItem(ROLE_CACHE_KEY);
          } catch (_) {
            // 空间不足时仍可读取旧缓存；新历史索引另写 IndexedDB。
          }
        }
      }
      const cached = JSON.parse(raw || 'null');
      if (!cached || typeof cached !== 'object') return null;
      const valid = value => Array.isArray(value) ? value.filter(row => row && row.characterId).map(row => {
        if (typeof row.favoriteKnown === 'boolean') return row;
        const favoriteState = favoriteStatusFrom(row);
        return {
          ...row,
          isFavorite: favoriteState === true,
          isFollowed: favoriteState === true,
          favoriteKnown: favoriteState !== null
        };
      }).map(clearLegacyUnavailableStatus) : [];
      return {
        chatted: valid(cached.chatted),
        chattedNotFavorite: valid(cached.chattedNotFavorite),
        favoriteOnly: valid(cached.favoriteOnly),
        siteFavoriteStates: cached.siteFavoriteStates && typeof cached.siteFavoriteStates === 'object'
          ? Object.fromEntries(Object.entries(cached.siteFavoriteStates).filter(([, value]) => typeof value === 'boolean'))
          : {},
        archived: valid(cached.archived),
        archiveCheckedCharacterIds: Array.isArray(cached.archiveCheckedCharacterIds)
          ? cached.archiveCheckedCharacterIds.map(String)
          : [],
        savedAt: String(cached.savedAt || '')
      };
    } catch (_) {
      return null;
    }
  }

  function loadAuthorProfileCache() {
    try {
      const value = JSON.parse(localStorage.getItem(AUTHOR_CACHE_KEY) || '{}');
      return new Map(Object.entries(value).filter(([, name]) => typeof name === 'string' && name));
    } catch (_) {
      return new Map();
    }
  }

  function loadManualFavoriteChats() {
    try {
      const rows = JSON.parse(loadAndMigrateScopedValue(MANUAL_FAVORITE_CHAT_KEY) || '[]');
      return Array.isArray(rows) ? rows.filter(row => row && row.characterId) : [];
    } catch (_) { return []; }
  }
  function saveManualFavoriteChats(rows) {
    try { localStorage.setItem(accountStorageKey(MANUAL_FAVORITE_CHAT_KEY), JSON.stringify(rows)); } catch (_) {}
  }

  function loadManualFavoriteNextDismissed() {
    try { return loadAndMigrateScopedValue(MANUAL_FAVORITE_NEXT_DISMISSED_KEY) === '1'; }
    catch (_) { return false; }
  }

  function dismissManualFavoriteNext() {
    state.manualFavoriteNextDismissed = true;
    try { localStorage.setItem(accountStorageKey(MANUAL_FAVORITE_NEXT_DISMISSED_KEY), '1'); } catch (_) {}
    render();
  }

  function loadManualAutoChatMessage() {
    try { return String(loadAndMigrateScopedValue(MANUAL_AUTO_CHAT_MESSAGE_KEY) || DEFAULT_MANUAL_AUTO_CHAT_MESSAGE); }
    catch (_) { return DEFAULT_MANUAL_AUTO_CHAT_MESSAGE; }
  }

  function saveManualAutoChatMessage(message) {
    const value = String(message || '').trim() || DEFAULT_MANUAL_AUTO_CHAT_MESSAGE;
    try { localStorage.setItem(accountStorageKey(MANUAL_AUTO_CHAT_MESSAGE_KEY), value); } catch (_) {}
    return value;
  }

  function normalizedManualAutoChatDelayRange(minimum, maximum) {
    const first = Math.max(0, Math.min(300, Math.round(Number(minimum) || 0)));
    const second = Math.max(0, Math.min(300, Math.round(Number(maximum) || 0)));
    return { min: Math.min(first, second), max: Math.max(first, second) };
  }

  function loadManualAutoChatDelayRange() {
    try {
      const legacy = loadAndMigrateScopedValue(MANUAL_AUTO_CHAT_DELAY_KEY);
      const rawMin = loadAndMigrateScopedValue(MANUAL_AUTO_CHAT_DELAY_MIN_KEY);
      const rawMax = loadAndMigrateScopedValue(MANUAL_AUTO_CHAT_DELAY_MAX_KEY);
      const fallbackMin = legacy == null || legacy === '' ? 8 : Number(legacy);
      const fallbackMax = legacy == null || legacy === '' ? 20 : Number(legacy);
      return normalizedManualAutoChatDelayRange(rawMin == null || rawMin === '' ? fallbackMin : rawMin, rawMax == null || rawMax === '' ? fallbackMax : rawMax);
    } catch (_) { return { min: 8, max: 20 }; }
  }

  function saveManualAutoChatDelayRange(minimum, maximum) {
    const range = normalizedManualAutoChatDelayRange(minimum, maximum);
    try {
      localStorage.setItem(accountStorageKey(MANUAL_AUTO_CHAT_DELAY_MIN_KEY), String(range.min));
      localStorage.setItem(accountStorageKey(MANUAL_AUTO_CHAT_DELAY_MAX_KEY), String(range.max));
    } catch (_) {}
    return range;
  }

  function loadManualAutoChatJob() {
    try {
      const job = JSON.parse(loadAndMigrateScopedValue(MANUAL_AUTO_CHAT_JOB_KEY) || 'null');
      return job && typeof job === 'object' && job.active ? job : null;
    } catch (_) { return null; }
  }

  function saveManualAutoChatJob(job) {
    if (!job || typeof job !== 'object') return false;
    try {
      localStorage.setItem(accountStorageKey(MANUAL_AUTO_CHAT_JOB_KEY), JSON.stringify({
        ...job,
        active: true,
        accountScope: String(maskAccountScope || job.accountScope || ''),
        updatedAt: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      appendRunLog('error', '普通角色自动聊天任务保存失败', error);
      return false;
    }
  }

  function clearManualAutoChatJob() {
    try { localStorage.removeItem(accountStorageKey(MANUAL_AUTO_CHAT_JOB_KEY)); } catch (_) {}
    state.manualAutoChatStopRequested = false;
  }

  function defaultQuoteStyle() {
    return { theme: 'tarot', background: '#29243d', textColor: '#f6f0ff', accent: '#b89cff', fontSize: 18, fontFamily: 'serif', align: 'left', showRole: true };
  }

  function effectiveQuoteStyle() {
    const style = state.quoteStyle;
    return style.theme === 'book'
      ? { ...style, background: '#fff9ef', textColor: '#352824', accent: '#856556', fontFamily: 'serif', align: 'left' }
      : style;
  }

  function bookQuoteParagraphs(text) {
    return String(text).split(/\r?\n+/).map(paragraph => paragraph.trim()).filter(Boolean);
  }

  function loadQuoteCards() {
    try {
      const rows = JSON.parse(loadAndMigrateScopedValue(QUOTE_CARD_KEY) || '[]');
      return Array.isArray(rows) ? rows.filter(row => row && row.id && row.text && row.characterId) : [];
    } catch (_) { return []; }
  }

  function saveQuoteCards() {
    try {
      localStorage.setItem(accountStorageKey(QUOTE_CARD_KEY), JSON.stringify(state.quoteCards.slice(0, 2000)));
      return true;
    } catch (error) {
      appendRunLog('error', '摘录收藏保存失败', error);
      state.status = '摘录收藏未能保存，可能是浏览器本地空间不足。';
      return false;
    }
  }

  function loadQuoteStyle() {
    try {
      const saved = JSON.parse(loadAndMigrateScopedValue(QUOTE_STYLE_KEY) || 'null');
      return saved && typeof saved === 'object' ? { ...defaultQuoteStyle(), ...saved } : defaultQuoteStyle();
    } catch (_) { return defaultQuoteStyle(); }
  }

  function saveQuoteStyle() {
    try { localStorage.setItem(accountStorageKey(QUOTE_STYLE_KEY), JSON.stringify(state.quoteStyle)); } catch (_) {}
  }

  const PANEL_THEME_PRESETS = {
    midnight: { background: '#191820', accent: '#7765c7', textColor: '#f4f2f8' },
    rose: { background: '#fff8fb', accent: '#b94376', textColor: '#2b1d25' },
    mist: { background: '#f6fafc', accent: '#397ba5', textColor: '#1d2c36' },
    sage: { background: '#f5faf6', accent: '#397553', textColor: '#1d3025' },
    black: { background: '#111214', accent: '#777b87', textColor: '#f3f4f6' }
  };

  function defaultPanelTheme() {
    return { preset: 'midnight', ...PANEL_THEME_PRESETS.midnight, opacity: 96, fontSize: 13, radius: 18 };
  }

  function normalizePanelTheme(value = {}) {
    const base = defaultPanelTheme();
    const legacyBackground = String(value?.background || '').toLowerCase();
    const requestedPreset = legacyBackground === '#2a1c25' ? 'rose' : String(value?.preset || '');
    const preset = Object.prototype.hasOwnProperty.call(PANEL_THEME_PRESETS, requestedPreset) ? requestedPreset : 'midnight';
    const palette = PANEL_THEME_PRESETS[preset];
    return {
      preset,
      ...palette,
      opacity: Math.max(72, Math.min(100, Number(value.opacity) || base.opacity)),
      fontSize: Math.max(11, Math.min(17, Number(value.fontSize) || base.fontSize)),
      radius: Math.max(0, Math.min(28, Number.isFinite(Number(value.radius)) ? Number(value.radius) : base.radius))
    };
  }

  function loadPanelTheme() {
    try { return normalizePanelTheme(JSON.parse(localStorage.getItem(PANEL_THEME_KEY) || 'null') || defaultPanelTheme()); }
    catch (_) { return defaultPanelTheme(); }
  }

  function savePanelTheme() {
    try { localStorage.setItem(PANEL_THEME_KEY, JSON.stringify(state.panelTheme)); } catch (_) {}
  }

  function panelThemeRgb(hex) {
    const value = String(hex || '').replace('#', '');
    const number = Number.parseInt(value, 16);
    return { red: number >> 16 & 255, green: number >> 8 & 255, blue: number & 255 };
  }

  function panelThemeRgba(hex, opacity) {
    const { red, green, blue } = panelThemeRgb(hex);
    return `rgba(${red},${green},${blue},${Math.max(0, Math.min(1, Number(opacity)))})`;
  }

  function applyPanelTheme() {
    if (!panel) return;
    const theme = normalizePanelTheme(state.panelTheme);
    state.panelTheme = theme;
    const backgroundRgb = panelThemeRgb(theme.background);
    const luminance = (0.2126 * backgroundRgb.red + 0.7152 * backgroundRgb.green + 0.0722 * backgroundRgb.blue) / 255;
    const light = luminance >= 0.58;
    const layerStrength = (theme.opacity - 72) / 28;
    const surfaceLift = light ? 4 + layerStrength * 5 : 4 + layerStrength * 6;
    const strongLift = light ? 8 + layerStrength * 7 : 8 + layerStrength * 8;
    const themeMix = (color, amount, base = theme.background) => `color-mix(in srgb,${color} ${amount.toFixed(1)}%,${base})`;
    panel.style.setProperty('--mufy-panel-accent', theme.accent);
    panel.style.setProperty('--mufy-panel-on-accent', '#ffffff');
    panel.style.setProperty('--mufy-panel-text', theme.textColor);
    panel.style.setProperty('--mufy-panel-bg', theme.background);
    panel.style.setProperty('--mufy-panel-muted', panelThemeRgba(theme.textColor, light ? 0.76 : 0.7));
    panel.style.setProperty('--mufy-panel-surface', themeMix('#ffffff', surfaceLift));
    panel.style.setProperty('--mufy-panel-surface-strong', themeMix('#ffffff', strongLift));
    panel.style.setProperty('--mufy-panel-input', light ? '#ffffff' : themeMix('#ffffff', 7));
    panel.style.setProperty('--mufy-panel-border', themeMix(theme.textColor, light ? 14 : 18));
    panel.style.setProperty('--mufy-panel-accent-soft', themeMix(theme.accent, light ? 14 : 26));
    panel.style.setProperty('--mufy-panel-accent-button', themeMix(theme.accent, light ? 18 : 32));
    panel.style.setProperty('--mufy-panel-accent-text', light ? theme.accent : theme.textColor);
    panel.dataset.panelTone = light ? 'light' : 'dark';
    panel.style.background = theme.background;
    panel.style.color = theme.textColor;
    panel.style.fontSize = `${theme.fontSize}px`;
    panel.style.borderRadius = `${theme.radius}px`;
    panel.style.borderColor = `${theme.accent}66`;
  }

  function renderPanelBeautyControls() {
    if (!panel) return;
    const theme = normalizePanelTheme(state.panelTheme);
    const values = { preset: theme.preset, background: theme.background, accent: theme.accent, textColor: theme.textColor, opacity: theme.opacity, fontSize: theme.fontSize, radius: theme.radius };
    Object.entries(values).forEach(([key, value]) => {
      const control = panel.querySelector(`[data-panel-theme="${key}"]`);
      if (control && document.activeElement !== control) control.value = String(value);
    });
    const summary = panel.querySelector('#mufy-recovery-panel-beauty-summary');
    if (summary) summary.textContent = `卡片层次 ${theme.opacity}% · 字号 ${theme.fontSize}px · 圆角 ${theme.radius}px`;
  }

  function contentPreview(value, maxLength = 260) {
    const text = String(value ?? '').replace(/\s+/g, ' ').trim();
    return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
  }

  function normalizeMaterialItem(row = {}, kind = 'prompt') {
    return {
      id: String(row.id || pageWindow.crypto?.randomUUID?.() || `material-${Date.now()}-${Math.random().toString(36).slice(2)}`),
      title: String(row.title || row.name || (kind === 'extra' ? '未命名番外' : '未命名指令')).trim() || (kind === 'extra' ? '未命名番外' : '未命名指令'),
      content: String(row.content || row.text || row.prompt || ''),
      updatedAt: String(row.updatedAt || new Date().toISOString())
    };
  }

  function loadMaterialLibrary(key, kind) {
    try {
      const rows = JSON.parse(loadAndMigrateScopedValue(key) || '[]');
      return Array.isArray(rows) ? rows.filter(row => row && typeof row === 'object').map(row => normalizeMaterialItem(row, kind)).filter(row => row.content) : [];
    } catch (_) { return []; }
  }

  function saveMaterialLibraries() {
    if (contentStorageMode === 'indexedDB') return queueContentStoragePersist('指令与番外库');
    try {
      localStorage.setItem(accountStorageKey(PROMPT_LIBRARY_KEY), JSON.stringify(state.promptLibrary));
      localStorage.setItem(accountStorageKey(EXTRA_LIBRARY_KEY), JSON.stringify(state.extraLibrary));
      return true;
    } catch (error) {
      state.status = '素材库保存失败，可能是浏览器本地空间不足。';
      appendRunLog('error', '素材库保存失败', error);
      return false;
    }
  }

  function activeMaterialRows() {
    return state.materialKind === 'extra' ? state.extraLibrary : state.promptLibrary;
  }

  function renderMaterialSection() {
    const list = panel?.querySelector('#mufy-recovery-material-list');
    if (!list) return;
    panel.querySelectorAll('[data-material-kind]').forEach(button => button.classList.toggle('active', button.dataset.materialKind === state.materialKind));
    const rows = activeMaterialRows();
    const label = state.materialKind === 'extra' ? '番外' : '指令';
    const add = panel.querySelector('#mufy-recovery-material-add');
    if (add) add.textContent = `新增${label}`;
    list.innerHTML = rows.map(row => `<article class="mufy-material-card" data-material-fill="${esc(row.id)}" title="点击填入聊天输入框"><div><strong>${esc(row.title)}</strong><small>${esc(contentPreview(row.content, 260))}</small></div><span><button data-material-edit="${esc(row.id)}">编辑</button><button data-material-delete="${esc(row.id)}">删除</button></span></article>`).join('') || `<div class="mufy-recovery-empty">还没有${label}。点击“新增${label}”保存常用内容。</div>`;
  }

  function renderAccountSection() {
    const list = panel?.querySelector('#mufy-recovery-account-list');
    if (!list) return;
    scanStoredAuthorization();
    const current = accountIdentityFromAuthorization();
    state.accountSwitchProfiles = loadAccountSwitchProfiles();
    let currentId = currentAccountSwitchId();
    const scopeMatches = current.scope ? state.accountSwitchProfiles.filter(row => row.scope === current.scope) : [];
    if (scopeMatches.length === 1 && scopeMatches[0].id !== currentId) {
      currentId = scopeMatches[0].id;
      setCurrentAccountSwitchId(currentId);
    } else if (!state.accountSwitchProfiles.some(row => row.id === currentId)) {
      currentId = scopeMatches.length === 1 ? scopeMatches[0].id : '';
      if (currentId) setCurrentAccountSwitchId(currentId);
    }
    const currentSaved = state.accountSwitchProfiles.find(row => row.id === currentId);
    const currentBox = panel.querySelector('#mufy-recovery-account-current');
    if (currentBox) currentBox.innerHTML = `<strong>当前账号</strong><span>${esc(currentSaved?.label || current.label || current.email || maskAccountLabel())}</span><small>${esc(currentSaved?.email || current.email || '网站令牌没有提供邮箱，可用“保存当前账号”手动填写')}</small>`;
    list.innerHTML = state.accountSwitchProfiles.map(row => {
      const active = row.id === currentId;
      return `<article class="mufy-account-card ${active ? 'is-current' : ''}"><div><strong>${esc(row.label)}</strong><small>${esc(row.email)}</small>${active ? '<em>当前登录</em>' : ''}</div><span>${active ? '' : `<button data-account-mark-current="${esc(row.id)}" title="网站已经登录此账号时，用它纠正当前标记">设为当前</button><button data-account-switch="${esc(row.id)}">切换</button>`}<button data-account-edit="${esc(row.id)}">修改</button><button data-account-delete="${esc(row.id)}">删除</button></span></article>`;
    }).join('') || '<div class="mufy-recovery-empty">还没有保存账号。先登录一个 Mufy 账号，再点“保存当前账号”。</div>';
  }

  function editSavedAccount(accountId) {
    const rows = loadAccountSwitchProfiles();
    const row = rows.find(item => item.id === String(accountId || ''));
    if (!row) return;
    const email = String(pageWindow.prompt('登录邮箱：', row.email) || '').trim();
    if (!email) return;
    const label = String(pageWindow.prompt('账号名称：', row.label) || '').trim() || email;
    row.email = email;
    row.label = label;
    saveAccountSwitchProfiles(rows);
    renderAccountSection();
  }

  function markSavedAccountCurrent(accountId) {
    const rows = loadAccountSwitchProfiles();
    const row = rows.find(item => item.id === String(accountId || ''));
    if (!row) return;
    const currentScope = accountIdentityFromAuthorization().scope || maskAccountScope;
    for (const item of rows) {
      if (item.id === row.id) item.scope = currentScope || item.scope;
      else if (currentScope && item.scope === currentScope) item.scope = '';
    }
    saveAccountSwitchProfiles(rows);
    setCurrentAccountSwitchId(row.id);
    try { sessionStorage.removeItem(ACCOUNT_SWITCH_PENDING_KEY); } catch (_) {}
    state.status = `已将“${row.label}”标记为当前实际登录账号。`;
    showManualAutoChatToast(state.status, { tone: 'success', duration: 5000 });
    render();
  }

  function deleteSavedAccount(accountId) {
    const rows = loadAccountSwitchProfiles();
    const row = rows.find(item => item.id === String(accountId || ''));
    if (!row || !pageWindow.confirm(`只删除快速切换列表中的“${row.label}”？\n不会删除 Mufy 账号和其他脚本数据。`)) return;
    saveAccountSwitchProfiles(rows.filter(item => item.id !== row.id));
    if (currentAccountSwitchId() === row.id) setCurrentAccountSwitchId('');
    state.status = `已从快速切换列表删除“${row.label}”。`;
    renderAccountSection();
    render();
  }

  function openMaterialEditor(itemId = '') {
    const row = activeMaterialRows().find(item => item.id === String(itemId || ''));
    state.materialEditingId = row?.id || '';
    const modal = panel.querySelector('#mufy-recovery-material-editor');
    panel.querySelector('#mufy-recovery-material-editor-title').textContent = `${row ? '编辑' : '新增'}${state.materialKind === 'extra' ? '番外' : '指令'}`;
    panel.querySelector('#mufy-recovery-material-title').value = row?.title || '';
    panel.querySelector('#mufy-recovery-material-content').value = row?.content || '';
    modal.hidden = false;
    setTimeout(() => panel.querySelector('#mufy-recovery-material-title')?.focus(), 0);
  }

  function saveMaterialEditor() {
    const title = String(panel.querySelector('#mufy-recovery-material-title').value || '').trim();
    const content = String(panel.querySelector('#mufy-recovery-material-content').value || '').trim();
    if (!content) {
      state.status = '内容不能为空。';
      showRecoveryNotice(state.status, 'error');
      render();
      return;
    }
    const rows = activeMaterialRows();
    const existing = rows.find(row => row.id === state.materialEditingId);
    const next = normalizeMaterialItem({ ...existing, id: existing?.id, title: title || (state.materialKind === 'extra' ? '未命名番外' : '未命名指令'), content, updatedAt: new Date().toISOString() }, state.materialKind);
    if (existing) rows.splice(rows.indexOf(existing), 1, next);
    else rows.unshift(next);
    if (!saveMaterialLibraries()) { render(); return; }
    panel.querySelector('#mufy-recovery-material-editor').hidden = true;
    state.materialEditingId = '';
    state.status = `已保存${state.materialKind === 'extra' ? '番外' : '指令'}“${next.title}”。`;
    showRecoveryNotice(state.status);
    renderMaterialSection();
    render();
  }

  function fillMaterialIntoComposer(itemId) {
    const row = activeMaterialRows().find(item => item.id === String(itemId || ''));
    if (!row) return;
    const composer = findManualChatComposer();
    if (!composer.textarea || composer.textarea.disabled || composer.textarea.readOnly) {
      state.status = '当前页面没有可用的聊天输入框，请先进入角色聊天页面。';
      showRecoveryNotice(state.status, 'error', 6000);
      render();
      return;
    }
    setManualChatTextareaValue(composer.textarea, row.content);
    composer.textarea.focus();
    state.status = `已将“${row.title}”填入聊天输入框，尚未发送。`;
    showRecoveryNotice(state.status);
    render();
  }

  function exportMaterialLibrary() {
    const kind = state.materialKind === 'extra' ? 'extra' : 'prompt';
    const label = kind === 'extra' ? '番外库' : '指令库';
    const items = activeMaterialRows();
    download(`mufy-${kind}-library-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ version: 1, kind, label, items }, null, 2), 'application/json;charset=utf-8');
    state.status = `已导出${label}（${items.length} 条）。`;
    showRecoveryNotice(state.status);
    render();
  }

  async function importMaterialLibrary(file) {
    if (!file) return;
    const kind = state.materialKind === 'extra' ? 'extra' : 'prompt';
    const label = kind === 'extra' ? '番外库' : '指令库';
    try {
      const parsed = JSON.parse(await file.text());
      const source = Array.isArray(parsed) ? parsed
        : Array.isArray(parsed?.items) ? parsed.items
          : Array.isArray(parsed?.[kind === 'extra' ? 'extraLibrary' : 'promptLibrary']) ? parsed[kind === 'extra' ? 'extraLibrary' : 'promptLibrary'] : [];
      const imported = source.filter(row => row && typeof row === 'object').map(row => normalizeMaterialItem(row, kind)).filter(row => row.content);
      if (!imported.length) throw new Error(`文件中没有可识别的${label}内容`);
      const replace = pageWindow.confirm(`读取到 ${imported.length} 条${label}内容。\n\n确定：替换当前${label}\n取消：与当前${label}合并`);
      const target = kind === 'extra' ? 'extraLibrary' : 'promptLibrary';
      state[target] = replace ? imported : [...state[target], ...imported];
      if (!saveMaterialLibraries()) return;
      state.status = `已导入 ${imported.length} 条${label}内容。`;
      showRecoveryNotice(state.status);
      renderMaterialSection();
      render();
    } catch (error) {
      state.status = `${label}导入失败：${explainFailure(error)}`;
      showRecoveryNotice(state.status, 'error', 7000);
      appendRunLog('error', `${label}导入失败`, error);
      render();
    }
  }

  function loadModelMonitorSelection() {
    try {
      const ids = JSON.parse(loadAndMigrateScopedValue(MODEL_MONITOR_SELECTION_KEY) || '[]');
      return new Set(Array.isArray(ids) ? ids.map(String).filter(Boolean) : []);
    } catch (_) { return new Set(); }
  }

  function saveModelMonitorSelection() {
    try { localStorage.setItem(accountStorageKey(MODEL_MONITOR_SELECTION_KEY), JSON.stringify([...state.modelMonitorSelectedIds])); } catch (_) {}
  }

  function loadModelMonitorNotify() {
    try { return loadAndMigrateScopedValue(MODEL_MONITOR_NOTIFY_KEY) === '1'; }
    catch (_) { return false; }
  }

  function saveModelMonitorNotify(enabled) {
    try { localStorage.setItem(accountStorageKey(MODEL_MONITOR_NOTIFY_KEY), enabled ? '1' : '0'); } catch (_) {}
  }

  function loadModelMonitorSnapshot() {
    try {
      const value = JSON.parse(loadAndMigrateScopedValue(MODEL_MONITOR_SNAPSHOT_KEY) || 'null');
      return value && typeof value === 'object' ? value : { rows: [], checkedAt: '' };
    } catch (_) { return { rows: [], checkedAt: '' }; }
  }

  function saveModelMonitorSnapshot(rows, checkedAt) {
    try { localStorage.setItem(accountStorageKey(MODEL_MONITOR_SNAPSHOT_KEY), JSON.stringify({ rows, checkedAt })); } catch (_) {}
  }

  function loadSessionlessRoleIds() {
    try {
      const ids = JSON.parse(loadAndMigrateScopedValue(SESSIONLESS_ROLE_IDS_KEY) || '[]');
      return new Set(Array.isArray(ids) ? ids.map(String).filter(Boolean) : []);
    } catch (_) { return new Set(); }
  }

  function saveSessionlessRoleIds() {
    try { localStorage.setItem(accountStorageKey(SESSIONLESS_ROLE_IDS_KEY), JSON.stringify([...state.sessionlessRoleIds])); } catch (_) {}
  }


  function goToNextManualFavoriteChat() {
    if (!state.manualFavoriteChats.length) {
      state.status = '普通待聊列表为空。';
      render();
      return;
    }
    const currentId = String(state.manualFavoriteChatCurrentId || '');
    if (currentId) {
      state.manualFavoriteChats = state.manualFavoriteChats.filter(item => String(item.characterId) !== currentId);
      saveManualFavoriteChats(state.manualFavoriteChats);
      state.manualFavoriteChatCurrentId = '';
      try { localStorage.removeItem(accountStorageKey(MANUAL_FAVORITE_CHAT_CURRENT_KEY)); } catch (_) {}
    }
    const nextRow = state.manualFavoriteChats[0];
    if (!nextRow) {
      state.status = '待聊角色已全部处理完毕。';
      render();
      return;
    }
    state.manualFavoriteChatCurrentId = String(nextRow.characterId);
    try { localStorage.setItem(accountStorageKey(MANUAL_FAVORITE_CHAT_CURRENT_KEY), state.manualFavoriteChatCurrentId); } catch (_) {}
    pageWindow.location.assign(sessionUrl(nextRow));
  }

  const cachedRoles = loadRoleCache();
  const authorProfileCache = loadAuthorProfileCache();
  const shareCodeCache = loadShareCodeCache();

  const state = {
    chatted: cachedRoles?.chatted || [],
    chattedNotFavorite: cachedRoles?.chattedNotFavorite || [],
    favoriteOnly: cachedRoles?.favoriteOnly || [],
    manualFavoriteChats: loadManualFavoriteChats(),
    manualFavoriteChatCurrentId: (() => { try { return loadAndMigrateScopedValue(MANUAL_FAVORITE_CHAT_CURRENT_KEY) || ''; } catch (_) { return ''; } })(),
    manualFavoriteNextDismissed: loadManualFavoriteNextDismissed(),
    manualAutoChatMessage: loadManualAutoChatMessage(),
    manualAutoChatDelayMin: loadManualAutoChatDelayRange().min,
    manualAutoChatDelayMax: loadManualAutoChatDelayRange().max,
    manualAutoChatRunning: Boolean(loadManualAutoChatJob() && !loadManualAutoChatJob()?.paused),
    manualAutoChatStopRequested: false,
    chatExportLoading: false,
    chatExportStopRequested: false,
    chatExportAbortController: null,
    chatSearchLoading: false,
    chatSearchStopRequested: false,
    chatSearchAbortController: null,
    chatSearchResults: [],
    chatSearchQuery: '',
    chatSearchScope: 'all',
    chatSearchCharacterId: '',
    quoteCards: loadQuoteCards(),
    quoteStyle: loadQuoteStyle(),
    quoteSelectedId: '',
    panelTheme: loadPanelTheme(),
    promptLibrary: loadMaterialLibrary(PROMPT_LIBRARY_KEY, 'prompt'),
    extraLibrary: loadMaterialLibrary(EXTRA_LIBRARY_KEY, 'extra'),
    materialKind: 'prompt',
    materialEditingId: '',
    accountSwitchProfiles: loadAccountSwitchProfiles(),
    modelMonitorRows: loadModelMonitorSnapshot().rows || [],
    modelMonitorSelectedIds: loadModelMonitorSelection(),
    modelMonitorLoading: false,
    modelMonitorLastChecked: loadModelMonitorSnapshot().checkedAt || '',
    modelMonitorError: '',
    modelMonitorNotify: loadModelMonitorNotify(),
    sessionlessRoleIds: loadSessionlessRoleIds(),
    archived: cachedRoles?.archived || [],
    roleHistory: [],
    archiveCheckedCharacterIds: new Set(cachedRoles?.archiveCheckedCharacterIds || []),
    archiveOpenCharacterIds: new Set(),
    masks: [],
    currentSiteMasks: [],
    siteMaskIds: [],
    library: loadMaskLibrary(),
    maskBindings: loadMaskBindings(),
    autoSwitch: loadAutoSwitchSetting(),
    autoSwitchRunning: false,
    autoSwitchKey: '',
    visibleRows: [],
    section: 'home',
    active: 'allRoles',
    roleQuery: '',
    siteSearchRows: [],
    siteFavoriteStates: cachedRoles?.siteFavoriteStates || {},
    selectedSiteCharacterIds: new Set(),
    siteFavoriteStateLoading: false,
    maskQuery: '',
    loading: false,
    roleLoading: false,
    rolePauseRequested: false,
    rolePaused: false,
    roleReadMode: 'full',
    roleLatestPages: 2,
    roleProgress: { phase: 'recent', recentPage: 1, favoritePage: 1 },
    rolePendingRecent: [],
    rolePendingFavorites: [],
    metadataLoading: false,
    metadataTask: null,
    metadataStopRequested: false,
    metadataAbortControllers: new Set(),
    lastRoleReadIds: null,
    favoriteRunning: false,
    favoriteInterruptMode: '',
    autoAddFavoriteFolder: loadAutoAddFavoriteFolderSetting(),
    authorFolderLoading: false,
    favoriteFolderDeleteLoading: false,
    favoriteFolderDeleteRows: [],
    selectedFavoriteFolderIds: new Set(),
    favoriteFolderDeleteEmptyOnly: true,
    latestScriptVersion: loadUpdateCheckSnapshot().latestVersion || '',
    updateAvailable: compareScriptVersions(loadUpdateCheckSnapshot().latestVersion, SCRIPT_VERSION) > 0,
    updateChecking: false,
    updateError: '',
    favoritePendingIds: new Set(),
    statusFilter: 'all',
    shareLinkLoading: false,
    shareRecoveryLoading: false,
    shareRecoveryCharacterId: '',
    maskLoading: false,
    maskStopRequested: false,
    archiveLoading: false,
    openAuthors: new Set(),
    authorFavoriteGroup: null,
    undoLibrary: null,
    undoBindings: null,
    undoLabel: '',
    undoSite: null,
    status: cachedRoles?.savedAt
      ? `已恢复上次读取的角色列表（${new Date(cachedRoles.savedAt).toLocaleString('zh-CN')}）。`
      : '准备就绪。首次安装后请刷新一次 Mufy 页面。'
  };
  if (maskLibraryStorageWarning) state.status = maskLibraryStorageWarning;
roleStateReady = true;
  chatModelConfigCache = loadChatModelConfigCache();
  if (pendingSiteCaptureRows.length) {
    pendingSiteCaptureRows.splice(0).forEach(item => addCapturedSiteRows(item.rows, item.pageScope));
  }
  const metadataFailureReasons = new Set();

  function cleanOrphanedMaskBindings(shouldPersist = true) {
    const before = state.maskBindings.length;
    state.maskBindings = state.maskBindings.filter(binding => {
      if (binding.libraryId) return state.library.some(item => item.libraryId === binding.libraryId);
      return Boolean(binding.snapshot && typeof binding.snapshot === 'object');
    });
    if (shouldPersist && state.maskBindings.length !== before) persistMaskBindings();
  }

  // 初始化阶段先只清理内存；待 IndexedDB 就绪后再写入，避免已满的 localStorage 再次报错。
  cleanOrphanedMaskBindings(false);
  initializeMaskStorageForAccount(maskAccountScope);
  initializeContentStorageForAccount(maskAccountScope);
  if (maskAccountScope) initializeRoleHistoryForAccount(maskAccountScope);
  initializeShareFavoriteJobStorage();

  function saveRoleCache() {
    if (!maskAccountScope) return;
    try {
      localStorage.setItem(accountStorageKey(ROLE_CACHE_KEY), JSON.stringify({
        chatted: state.chatted,
        chattedNotFavorite: state.chattedNotFavorite,
        favoriteOnly: state.favoriteOnly,
        siteFavoriteStates: state.siteFavoriteStates,
        archived: state.archived,
        archiveCheckedCharacterIds: [...state.archiveCheckedCharacterIds],
        savedAt: new Date().toISOString()
      }));
    } catch (error) {
      appendRunLog('error', '角色列表缓存写入 localStorage 失败；历史索引仍会尝试保存到 IndexedDB', error);
    }
  }

  function reloadRoleCacheForAccount() {
    const cached = loadRoleCache();
    state.chatted = cached?.chatted || [];
    state.chattedNotFavorite = cached?.chattedNotFavorite || [];
    state.favoriteOnly = cached?.favoriteOnly || [];
    state.siteFavoriteStates = cached?.siteFavoriteStates || {};
    state.archived = cached?.archived || [];
    state.archiveCheckedCharacterIds = new Set(cached?.archiveCheckedCharacterIds || []);
    state.archiveOpenCharacterIds.clear();
    state.manualFavoriteChats = loadManualFavoriteChats();
    try { state.manualFavoriteChatCurrentId = loadAndMigrateScopedValue(MANUAL_FAVORITE_CHAT_CURRENT_KEY) || ''; } catch (_) { state.manualFavoriteChatCurrentId = ''; }
    state.manualFavoriteNextDismissed = loadManualFavoriteNextDismissed();
    state.manualAutoChatMessage = loadManualAutoChatMessage();
    ({ min: state.manualAutoChatDelayMin, max: state.manualAutoChatDelayMax } = loadManualAutoChatDelayRange());
    state.manualAutoChatRunning = Boolean(loadManualAutoChatJob() && !loadManualAutoChatJob()?.paused);
    state.manualAutoChatStopRequested = false;
    state.lastRoleReadIds = null;
    state.rolePendingRecent = [];
    state.rolePendingFavorites = [];
    render();
  }

  function saveAuthorProfileCache() {
    try { localStorage.setItem(AUTHOR_CACHE_KEY, JSON.stringify(Object.fromEntries(authorProfileCache))); } catch (_) {}
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  class ManualAutoChatPausedError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ManualAutoChatPausedError';
    }
  }

  function isVisibleElement(element) {
    if (!element || !element.isConnected) return false;
    const style = pageWindow.getComputedStyle?.(element);
    if (style?.display === 'none' || style?.visibility === 'hidden') return false;
    const rect = element.getBoundingClientRect?.();
    return !rect || rect.width > 0 && rect.height > 0;
  }

  function findManualChatComposer() {
    const textareas = [...document.querySelectorAll('textarea[placeholder*="发送消息"], textarea[placeholder*="Enter"]')]
      .filter(textarea => !textarea.closest('#mufy-recovery-panel') && isVisibleElement(textarea));
    const textarea = textareas.find(item => String(item.placeholder || '').includes('发送消息')) || textareas[0] || null;
    if (!textarea) return { textarea: null, button: null };
    let container = textarea.parentElement;
    let buttons = [];
    for (let depth = 0; container && depth < 5; depth += 1, container = container.parentElement) {
      buttons = [...container.querySelectorAll('button')].filter(button => !button.closest('#mufy-recovery-panel') && isVisibleElement(button));
      if (buttons.length) break;
    }
    const sendButton = buttons.find(button => button.querySelector('path[d^="M3.79 2.773"]'))
      || buttons.find(button => /发送|send/i.test(`${button.getAttribute('aria-label') || ''} ${button.title || ''}`))
      || buttons.at(-1)
      || null;
    return { textarea, button: sendButton };
  }

  function setManualChatTextareaValue(textarea, value) {
    const prototype = pageWindow.HTMLTextAreaElement?.prototype || globalThis.HTMLTextAreaElement?.prototype;
    const setter = prototype ? Object.getOwnPropertyDescriptor(prototype, 'value')?.set : null;
    if (setter) setter.call(textarea, value);
    else textarea.value = value;
    try {
      textarea.dispatchEvent(new pageWindow.InputEvent('input', {
        bubbles: true,
        inputType: 'insertText',
        data: value
      }));
    } catch (_) {
      textarea.dispatchEvent(new pageWindow.Event('input', { bubbles: true }));
    }
    textarea.dispatchEvent(new pageWindow.Event('change', { bubbles: true }));
  }

  function isManualChatSendButton(button) {
    if (!button) return false;
    if (button.querySelector('path[d^="M3.79 2.773"]')) return true;
    return /发送|send/i.test(`${button.getAttribute('aria-label') || ''} ${button.title || ''}`);
  }

  function hasVisibleChatStopControl() {
    return [...document.querySelectorAll('button')].some(button => {
      if (button.closest('#mufy-recovery-panel') || button.id === 'mufy-recovery-next' || !isVisibleElement(button)) return false;
      const label = `${button.getAttribute('aria-label') || ''} ${button.title || ''} ${button.textContent || ''}`.trim();
      return /停止生成|停止回复|停止响应|stop generating|stop response|stop generation/i.test(label);
    });
  }

  function manualAutoChatWasStopped() {
    const job = loadManualAutoChatJob();
    return state.manualAutoChatStopRequested || !job || job.paused;
  }

  function showManualAutoChatToast(message, options = {}) {
    const toast = document.getElementById('mufy-recovery-auto-chat-toast');
    if (!toast) return;
    if (manualAutoChatToastTimer) clearTimeout(manualAutoChatToastTimer);
    manualAutoChatToastTimer = null;
    toast.textContent = String(message || '');
    toast.dataset.tone = String(options.tone || 'progress');
    toast.classList.add('show');
    const duration = Math.max(0, Number(options.duration) || 0);
    if (duration) {
      manualAutoChatToastTimer = setTimeout(() => {
        toast.classList.remove('show');
        manualAutoChatToastTimer = null;
      }, duration);
    }
  }

  function showRecoveryNotice(message, tone = 'success', duration = 4200) {
    showManualAutoChatToast(message, { tone, duration });
  }

  async function waitForManualChatComposer(timeoutMs = 60000) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
      if (manualAutoChatWasStopped()) throw new ManualAutoChatPausedError('任务已暂停');
      const composer = findManualChatComposer();
      if (composer.textarea && composer.button && !composer.textarea.disabled && !composer.textarea.readOnly) return composer;
      await wait(300);
    }
    throw new Error('等待聊天输入框超过 60 秒');
  }

  async function waitForEnabledManualChatButton(textarea, timeoutMs = 15000) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
      if (manualAutoChatWasStopped()) throw new ManualAutoChatPausedError('任务已暂停');
      const composer = findManualChatComposer();
      if (composer.textarea === textarea && composer.button && !composer.button.disabled && composer.button.getAttribute('aria-disabled') !== 'true') {
        return composer.button;
      }
      await wait(150);
    }
    throw new Error('消息已写入，但发送按钮在 15 秒内没有启用');
  }

  async function manualChatSendStarted(textarea, expectedText, previousSessionId, timeoutMs = 2200) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
      const current = currentRoleContext();
      const composer = findManualChatComposer();
      const draftCleared = String(textarea?.value || '').trim() !== String(expectedText || '').trim();
      const sessionCreated = Boolean(current.sessionId && current.sessionId !== String(previousSessionId || ''));
      const sendControlChanged = Boolean(composer.button && !isManualChatSendButton(composer.button));
      if (draftCleared || sessionCreated || sendControlChanged || hasVisibleChatStopControl()) return true;
      await wait(120);
    }
    return false;
  }

  function reactPropsOf(element) {
    if (!element) return null;
    try {
      const key = Reflect.ownKeys(element).find(name => String(name).startsWith('__reactProps$'));
      return key ? element[key] : null;
    } catch (_) { return null; }
  }

  function callReactEventHandler(element, handlerNames, eventValues = {}) {
    const props = reactPropsOf(element);
    const handlerName = handlerNames.find(name => typeof props?.[name] === 'function');
    if (!handlerName) return false;
    let defaultPrevented = false;
    const event = {
      target: element,
      currentTarget: element,
      nativeEvent: null,
      bubbles: true,
      cancelable: true,
      defaultPrevented: false,
      preventDefault() { defaultPrevented = true; this.defaultPrevented = true; },
      stopPropagation() {},
      persist() {},
      isDefaultPrevented() { return defaultPrevented; },
      isPropagationStopped() { return false; },
      ...eventValues
    };
    event.nativeEvent = event;
    props[handlerName](event);
    return true;
  }

  async function activateManualChatSend(textarea, button, message) {
    const previousSessionId = currentRoleContext().sessionId;
    const attempts = [
      () => {
        const nativeClick = pageWindow.HTMLElement?.prototype?.click;
        if (nativeClick) nativeClick.call(button);
        else button.click();
      },
      () => {
        if (!callReactEventHandler(button, ['onClick', 'onPointerUp', 'onMouseUp'], { type: 'click', button: 0, buttons: 0 })) {
          throw new Error('发送按钮上没有找到页面框架的点击处理器');
        }
      },
      () => {
        const form = textarea.closest('form') || button.closest('form');
        if (!form) throw new Error('聊天输入区没有可提交的表单');
        if (typeof form.requestSubmit === 'function') form.requestSubmit(button);
        else form.dispatchEvent(new pageWindow.Event('submit', { bubbles: true, cancelable: true }));
      },
      () => {
        const PointerEventCtor = pageWindow.PointerEvent || pageWindow.MouseEvent;
        const MouseEventCtor = pageWindow.MouseEvent;
        button.dispatchEvent(new PointerEventCtor('pointerdown', { bubbles: true, cancelable: true, pointerType: 'mouse', button: 0 }));
        button.dispatchEvent(new PointerEventCtor('pointerup', { bubbles: true, cancelable: true, pointerType: 'mouse', button: 0 }));
        button.dispatchEvent(new MouseEventCtor('click', { bubbles: true, cancelable: true, view: pageWindow, button: 0 }));
      },
      () => {
        textarea.focus();
        if (callReactEventHandler(textarea, ['onKeyDown', 'onKeyPress'], {
          type: 'keydown', key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
          shiftKey: false, ctrlKey: false, altKey: false, metaKey: false
        })) return;
        const KeyboardEventCtor = pageWindow.KeyboardEvent;
        textarea.dispatchEvent(new KeyboardEventCtor('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
        textarea.dispatchEvent(new KeyboardEventCtor('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
      }
    ];
    const failures = [];
    for (let index = 0; index < attempts.length; index += 1) {
      try { attempts[index](); } catch (error) { failures.push(String(error?.message || error)); }
      if (await manualChatSendStarted(textarea, message, previousSessionId)) return;
      if (index + 1 < attempts.length) {
        const composer = findManualChatComposer();
        if (!composer.textarea || String(composer.textarea.value || '').trim() !== String(message || '').trim()) return;
        button = composer.button || button;
      }
    }
    throw new Error(`发送按钮已启用，但页面的点击、框架事件、表单提交和 Enter 都没有生效${failures.length ? `（${[...new Set(failures)].join('；')}）` : ''}`);
  }

  async function resolveManualChatModelConfig(characterId, timeoutMs = 12000) {
    const id = String(characterId || '');
    const startedAt = Date.now();
    while (Date.now() - startedAt < Math.min(timeoutMs, 1800)) {
      const cached = chatModelConfigCache.get(id);
      if (cached?.modelId && cached?.modelTemplateId) return cached;
      await wait(250);
    }
    try {
      const headers = { Accept: 'application/json' };
      if (authorization) headers.Authorization = authorization;
      const response = await pageWindow.fetch(new URL('/api/models/tree', location.origin).href, {
        method: 'GET', credentials: 'include', cache: 'no-store', headers
      });
      const body = await response.json();
      const rows = flattenModelMonitorRows(body?.data || body);
      const normalizeLabel = value => String(value || '').toLocaleLowerCase('zh-CN').replace(/[\s·•—_()（）【】\[\]]+/g, '');
      const composerRect = findManualChatComposer().textarea?.getBoundingClientRect?.();
      const visibleLabels = [...document.querySelectorAll('button,[role="button"]')]
        .filter(element => !element.closest('#mufy-recovery-panel') && isVisibleElement(element))
        .map(element => {
          const text = String(element.textContent || element.getAttribute('aria-label') || element.title || '').trim();
          const rect = element.getBoundingClientRect?.();
          const distance = composerRect && rect
            ? Math.abs((rect.top + rect.bottom) / 2 - (composerRect.top + composerRect.bottom) / 2)
            : 9999;
          return { text, distance };
        })
        .filter(item => item.text && item.text.length <= 80 && item.distance <= 240);
      const matches = rows.map(row => {
        const name = normalizeLabel(row.name);
        const score = visibleLabels.reduce((best, item) => {
          const normalized = normalizeLabel(item.text);
          if (!normalized || !name) return best;
          if (normalized === name) return Math.max(best, 2000 + name.length - item.distance);
          if (normalized.includes(name) || name.includes(normalized)) return Math.max(best, 1000 + name.length - item.distance);
          return best;
        }, 0);
        return { row, score };
      }).filter(item => item.score > 0 && item.row.modelId && item.row.templateId)
        .sort((a, b) => b.score - a.score);
      if (matches.length) {
        const selected = { modelId: Number(matches[0].row.modelId), modelTemplateId: Number(matches[0].row.templateId) };
        rememberChatModelConfig(id, selected);
        appendRunLog('info', `一键扣数已按页面模型名称“${matches[0].row.name}”匹配 modelId=${selected.modelId}、modelTemplateId=${selected.modelTemplateId}。`);
        return selected;
      }
    } catch (error) {
      appendRunLog('warn', '一键扣数自动匹配当前模型失败', error);
    }
    const recent = chatModelConfigCache.get('__last__');
    if (recent?.modelId && recent?.modelTemplateId) return recent;
    while (Date.now() - startedAt < timeoutMs) {
      const cached = chatModelConfigCache.get(id);
      if (cached?.modelId && cached?.modelTemplateId) return cached;
      await wait(250);
    }
    throw new Error('没有获取到当前角色所选模型的 modelId/modelTemplateId；请刷新该角色页面，等待模型名称显示后再继续');
  }

  function sessionIdFromStreamValue(value, depth = 0) {
    if (!value || depth > 7) return '';
    if (typeof value === 'object') {
      if (value.sessionId && String(value.sessionId) !== '00000000-0000-0000-0000-000000000000') return String(value.sessionId);
      for (const child of Array.isArray(value) ? value : Object.values(value)) {
        const found = sessionIdFromStreamValue(child, depth + 1);
        if (found) return found;
      }
    }
    return '';
  }

  async function findCreatedManualChatSession(characterId, previousSessionId = '', timeoutMs = 20000) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
      const data = await requestPage(1, false);
      const row = extractCharacterRows(data).map(normalize).find(item => String(item.characterId) === String(characterId));
      const sessionId = String(row?.lastSessionId || '');
      if (sessionId && sessionId !== String(previousSessionId || '')) return sessionId;
      await wait(800);
    }
    return '';
  }

  async function sendManualChatViaApi(job, textarea) {
    scanStoredAuthorization();
    const characterId = String(job.activeCharacterId || '');
    const config = await resolveManualChatModelConfig(characterId);
    const current = currentRoleContext();
    const previousSessionId = String(current.sessionId || '');
    const requestSessionId = previousSessionId || '00000000-0000-0000-0000-000000000000';
    const headers = { Accept: 'text/event-stream', 'Content-Type': 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const payload = {
      userInput: String(job.message || DEFAULT_MANUAL_AUTO_CHAT_MESSAGE),
      sessionId: requestSessionId,
      modelId: Number(config.modelId),
      modelTemplateId: Number(config.modelTemplateId),
      characterId,
      itemText: null,
      skipRedPacket: false
    };
    const response = await pageWindow.fetch(new URL('/api/v1/chat/completions', location.origin).href, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(payload)
    });
    if (response.status === 401 || response.status === 403) throw new Error(loginErrorMessage(response.status, '自动发送消息'));
    if (!response.ok) {
      const raw = await response.text().catch(() => '');
      throw new Error(`自动发送消息失败（HTTP ${response.status}${raw ? `：${raw.slice(0, 240)}` : ''}）`);
    }
    if (!response.body?.getReader) throw new Error('聊天接口没有返回可读取的 EventStream');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let doneReceived = false;
    let createdSessionId = '';
    const inspectLine = line => {
      const trimmed = String(line || '').trim();
      if (!trimmed || trimmed.startsWith(':') || /^(?:event|id|retry):/i.test(trimmed)) return;
      const dataText = trimmed.replace(/^data:\s*/i, '');
      if (dataText === '[DONE]') { doneReceived = true; return; }
      try {
        const event = JSON.parse(dataText);
        createdSessionId = createdSessionId || sessionIdFromStreamValue(event);
        if (String(event?.type || '').toLowerCase() === 'done' || String(event?.content || '').trim() === '[DONE]') doneReceived = true;
      } catch (_) {}
    };
    while (true) {
      if (manualAutoChatWasStopped()) {
        try { await reader.cancel(); } catch (_) {}
        throw new ManualAutoChatPausedError('任务已暂停；当前接口回复流已停止读取');
      }
      const chunk = await reader.read();
      buffer += decoder.decode(chunk.value || new Uint8Array(), { stream: !chunk.done });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';
      lines.forEach(inspectLine);
      if (chunk.done) break;
    }
    if (buffer) inspectLine(buffer);
    if (!doneReceived) throw new Error('EventStream 已结束，但没有收到 done/[DONE] 完成标记');
    if (!createdSessionId) createdSessionId = await findCreatedManualChatSession(characterId, previousSessionId);
    if (!createdSessionId) throw new Error('已收到回复完成标记，但没有取得新生成的 sessionId');
    if (textarea) setManualChatTextareaValue(textarea, '');
    return createdSessionId;
  }

  async function waitForManualChatResponse(job) {
    const startedAt = Number(job.sentAt) || Date.now();
    let lastMutationAt = Date.now();
    let meaningfulMutations = 0;
    let stopControlObserved = false;
    const observer = new MutationObserver(mutations => {
      const meaningful = mutations.some(mutation => {
        const target = mutation.target?.nodeType === 1 ? mutation.target : mutation.target?.parentElement;
        return !target?.closest?.('#mufy-recovery-panel, #mufy-recovery-toggle, #mufy-recovery-next');
      });
      if (meaningful) {
        meaningfulMutations += 1;
        lastMutationAt = Date.now();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled'] });
    try {
      const timeoutMs = 7 * 60 * 1000;
      while (Date.now() - startedAt < timeoutMs) {
        if (manualAutoChatWasStopped()) throw new ManualAutoChatPausedError('任务已暂停；当前已经发送的回复不会被中断');
        const currentJob = loadManualAutoChatJob() || job;
        const currentRole = currentRoleContext();
        const composer = findManualChatComposer();
        const stopVisible = hasVisibleChatStopControl();
        if (stopVisible) stopControlObserved = true;
        const hasSession = Boolean(currentRole.sessionId);
        const elapsed = Date.now() - startedAt;
        const quietFor = Date.now() - lastMutationAt;
        const composerReady = Boolean(composer.textarea && !composer.textarea.disabled && !composer.textarea.readOnly);
        const sendControlRestored = Boolean(composer.button && isManualChatSendButton(composer.button));
        const observedResponseActivity = meaningfulMutations > 0 || stopControlObserved;
        const resumedAfterLikelyCompletion = currentJob.phase === 'waiting-response' && elapsed >= 30000;
        if (hasSession && composerReady && sendControlRestored && !stopVisible && elapsed >= 8000 && quietFor >= 5000
            && (observedResponseActivity || resumedAfterLikelyCompletion)) {
          return currentRole.sessionId;
        }
        await wait(500);
      }
      throw new Error('等待角色回复完成超过 7 分钟');
    } finally {
      observer.disconnect();
    }
  }

  function navigateManualAutoChatToNext(job) {
    const nextRow = state.manualFavoriteChats[0];
    if (!nextRow) return false;
    job.phase = 'navigating';
    job.activeCharacterId = String(nextRow.characterId);
    job.activeCharacterName = String(nextRow.name || '');
    job.navigationStartedAt = Date.now();
    job.sentAt = 0;
    if (!saveManualAutoChatJob(job)) throw new Error('无法保存下一个普通角色任务');
    state.manualFavoriteChatCurrentId = job.activeCharacterId;
    try { localStorage.setItem(accountStorageKey(MANUAL_FAVORITE_CHAT_CURRENT_KEY), job.activeCharacterId); } catch (_) {}
    const current = currentRoleContext();
    if (pageWindow.location.pathname === '/chat' && String(current.characterId) === job.activeCharacterId) {
      setTimeout(() => processManualAutoChatJob(), 200);
    } else {
      pageWindow.location.assign(roleUrl(job.activeCharacterId));
    }
    return true;
  }

  async function waitManualAutoChatCooldown(job) {
    const legacy = job.delaySeconds;
    const range = normalizedManualAutoChatDelayRange(
      job.delayMin ?? legacy ?? state.manualAutoChatDelayMin,
      job.delayMax ?? legacy ?? state.manualAutoChatDelayMax
    );
    const seconds = range.min + Math.floor(Math.random() * (range.max - range.min + 1));
    if (!seconds) return;
    showManualAutoChatToast(`已完成 ${Number(job.completed || 0)}/${Number(job.total || 0)}，正在等待随机冷却后继续…`);
    const endAt = Date.now() + seconds * 1000;
    let lastShown = -1;
    while (Date.now() < endAt) {
      if (manualAutoChatWasStopped()) throw new ManualAutoChatPausedError('任务已暂停');
      const remaining = Math.max(1, Math.ceil((endAt - Date.now()) / 1000));
      if (remaining !== lastShown) {
        lastShown = remaining;
        state.status = `已完成 ${Number(job.completed || 0)}/${Number(job.total || 0)} 个；冷却 ${remaining} 秒后打开下一个角色……`;
        render();
      }
      await wait(Math.min(500, Math.max(50, endAt - Date.now())));
    }
  }

  function finishManualAutoChatJob(job) {
    clearManualAutoChatJob();
    state.manualAutoChatRunning = false;
    state.manualFavoriteChatCurrentId = '';
    try { localStorage.removeItem(accountStorageKey(MANUAL_FAVORITE_CHAT_CURRENT_KEY)); } catch (_) {}
    state.status = `一键扣数完成：成功处理 ${Number(job.completed) || 0}/${Number(job.total) || Number(job.completed) || 0} 个普通收藏角色。`;
    render();
    showManualAutoChatToast(`所有发言已结束（${Number(job.completed) || 0}/${Number(job.total) || Number(job.completed) || 0}），请刷新页面获取最新情况。`, { tone: 'success', duration: 12000 });
  }

  async function processManualAutoChatJob() {
    if (manualAutoChatProcessing) return;
    let job = loadManualAutoChatJob();
    if (!job || job.paused) return;
    manualAutoChatProcessing = true;
    state.manualAutoChatRunning = true;
    state.manualAutoChatStopRequested = false;
    render();
    showManualAutoChatToast(`一键扣数进行中：已完成 ${Number(job.completed || 0)}/${Number(job.total || 0)}，正在准备当前角色…`);
    try {
      if (job.accountScope && maskAccountScope && job.accountScope !== maskAccountScope) {
        throw new Error('自动聊天任务属于另一个 Mufy 账号');
      }
      if (!state.manualFavoriteChats.length) {
        finishManualAutoChatJob(job);
        return;
      }
      if (!job.activeCharacterId) {
        navigateManualAutoChatToNext(job);
        return;
      }
      const current = currentRoleContext();
      if (pageWindow.location.pathname !== '/chat' || String(current.characterId) !== String(job.activeCharacterId)) {
        job.phase = 'navigating';
        job.navigationStartedAt = Date.now();
        saveManualAutoChatJob(job);
        pageWindow.location.assign(roleUrl(job.activeCharacterId));
        return;
      }
      if (job.phase === 'sending') {
        const composer = findManualChatComposer();
        const messageStillInDraft = Boolean(
          composer.textarea
          && String(composer.textarea.value || '').trim() === String(job.message || '').trim()
          && !current.sessionId
          && !hasVisibleChatStopControl()
        );
        if (messageStillInDraft) {
          job.phase = 'ready-to-send';
          job.sentAt = 0;
          if (!saveManualAutoChatJob(job)) throw new Error('无法恢复发送未生效的任务');
        } else {
          throw new Error('上次任务在点击发送时中断，页面状态无法确认；为避免重复发送已暂停');
        }
      }
      if (job.phase === 'waiting-response') {
        const composer = findManualChatComposer();
        const messageStillInDraft = Boolean(
          composer.textarea
          && String(composer.textarea.value || '').trim() === String(job.message || '').trim()
          && !current.sessionId
          && !hasVisibleChatStopControl()
        );
        if (messageStillInDraft) {
          job.phase = 'ready-to-send';
          job.sentAt = 0;
          if (!saveManualAutoChatJob(job)) throw new Error('无法恢复尚未真正发送的任务');
          state.status = '检测到消息仍停留在输入框，正在重新发送……';
          render();
        }
      }
      if (job.phase !== 'waiting-response' && job.phase !== 'response-complete') {
        state.status = `一键扣数 ${Number(job.completed || 0) + 1}/${job.total}：正在等待“${job.activeCharacterName || job.activeCharacterId}”的输入框……`;
        render();
        showManualAutoChatToast(`一键扣数 ${Number(job.completed || 0) + 1}/${job.total}：正在准备并发送消息…`);
        const { textarea } = await waitForManualChatComposer();
        const existingDraft = String(textarea.value || '').trim();
        if (existingDraft && existingDraft !== String(job.message || '').trim()) {
          throw new Error('输入框中已有其他草稿，为避免覆盖已暂停任务');
        }
        setManualChatTextareaValue(textarea, String(job.message || DEFAULT_MANUAL_AUTO_CHAT_MESSAGE));
        await waitForEnabledManualChatButton(textarea);
        job.phase = 'sending';
        job.sentAt = Date.now();
        if (!saveManualAutoChatJob(job)) throw new Error('发送前无法保存任务状态');
        showManualAutoChatToast(`一键扣数 ${Number(job.completed || 0) + 1}/${job.total}：消息发送中，正在等待完整回复…`);
        const createdSessionId = await sendManualChatViaApi(job, textarea);
        job.phase = 'response-complete';
        job.completedSessionId = createdSessionId;
        if (!saveManualAutoChatJob(job)) throw new Error('回复完成后无法保存任务状态');
      }
      if (job.phase === 'waiting-response') {
        state.status = `一键扣数 ${Number(job.completed || 0) + 1}/${job.total}：消息已发送，正在等待完整回复和 sessionId……`;
        render();
        showManualAutoChatToast(`一键扣数 ${Number(job.completed || 0) + 1}/${job.total}：已发送，正在等待完整回复…`);
        job.completedSessionId = await waitForManualChatResponse(job);
      } else {
        state.status = `一键扣数 ${Number(job.completed || 0) + 1}/${job.total}：EventStream 已收到 done，回复完成。`;
        render();
      }
      if (manualAutoChatWasStopped()) throw new ManualAutoChatPausedError('任务已暂停');
      const finishedId = String(job.activeCharacterId);
      state.manualFavoriteChats = state.manualFavoriteChats.filter(row => String(row.characterId) !== finishedId);
      saveManualFavoriteChats(state.manualFavoriteChats);
      state.manualFavoriteChatCurrentId = '';
      try { localStorage.removeItem(accountStorageKey(MANUAL_FAVORITE_CHAT_CURRENT_KEY)); } catch (_) {}
      job.completed = Number(job.completed || 0) + 1;
      job.activeCharacterId = '';
      job.activeCharacterName = '';
      job.phase = 'navigating';
      job.sentAt = 0;
      job.completedSessionId = '';
      if (!state.manualFavoriteChats.length) {
        finishManualAutoChatJob(job);
        return;
      }
      saveManualAutoChatJob(job);
      state.status = `已完成 ${job.completed}/${job.total} 个，准备打开下一个普通收藏角色……`;
      render();
      await waitManualAutoChatCooldown(job);
      navigateManualAutoChatToNext(job);
    } catch (error) {
      const persistedJob = loadManualAutoChatJob();
      if (!persistedJob) {
        state.manualAutoChatRunning = false;
        render();
        return;
      }
      job = persistedJob;
      job.paused = true;
      job.pauseReason = String(error?.message || error || '未知错误');
      saveManualAutoChatJob(job);
      state.manualAutoChatRunning = false;
      state.manualAutoChatStopRequested = false;
      state.status = error instanceof ManualAutoChatPausedError
        ? error.message
        : `一键扣数已暂停：${explainFailure(error)}`;
      if (!(error instanceof ManualAutoChatPausedError)) appendRunLog('error', '普通角色一键扣数暂停', error);
      render();
      showManualAutoChatToast(state.status, { tone: 'error', duration: 9000 });
    } finally {
      manualAutoChatProcessing = false;
    }
  }

  function startOrResumeManualAutoChat() {
    const existing = loadManualAutoChatJob();
    if (existing && !existing.paused) {
      existing.paused = true;
      existing.pauseReason = '用户手动停止';
      saveManualAutoChatJob(existing);
      state.manualAutoChatStopRequested = true;
      state.manualAutoChatRunning = false;
      state.status = '已请求停止一键扣数；当前已经发送的回复不会被打断，脚本不会再进入下一个角色。';
      render();
      return;
    }
    if (!state.manualFavoriteChats.length) {
      state.status = '普通待聊列表为空，没有需要一键扣数的角色。';
      render();
      return;
    }
    if (existing?.paused) {
      existing.paused = false;
      existing.pauseReason = '';
      if (!saveManualAutoChatJob(existing)) return;
      state.manualAutoChatStopRequested = false;
      state.manualAutoChatRunning = true;
      state.status = '正在继续一键扣数任务……';
      render();
      processManualAutoChatJob();
      return;
    }
    const message = saveManualAutoChatMessage(state.manualAutoChatMessage);
    const delayRange = saveManualAutoChatDelayRange(state.manualAutoChatDelayMin, state.manualAutoChatDelayMax);
    if (!message) return;
    if (!pageWindow.confirm(`将依次给 ${state.manualFavoriteChats.length} 个普通收藏角色发送：\n\n${message}\n\n每个角色会等待完整回复，再随机冷却 ${delayRange.min}～${delayRange.max} 秒后进入下一个。确定开始吗？`)) return;
    const first = state.manualFavoriteChats[0];
    const job = {
      active: true,
      paused: false,
      phase: 'navigating',
      message,
      delayMin: delayRange.min,
      delayMax: delayRange.max,
      total: state.manualFavoriteChats.length,
      completed: 0,
      activeCharacterId: String(first?.characterId || ''),
      activeCharacterName: String(first?.name || ''),
      navigationStartedAt: Date.now(),
      sentAt: 0,
      accountScope: String(maskAccountScope || ''),
      startedAt: new Date().toISOString()
    };
    if (!saveManualAutoChatJob(job)) {
      state.status = '无法保存一键扣数任务，未开始发送。';
      render();
      return;
    }
    state.manualAutoChatRunning = true;
    state.manualAutoChatStopRequested = false;
    state.manualFavoriteChatCurrentId = job.activeCharacterId;
    try { localStorage.setItem(accountStorageKey(MANUAL_FAVORITE_CHAT_CURRENT_KEY), job.activeCharacterId); } catch (_) {}
    state.status = `一键扣数即将开始，共 ${job.total} 个角色。`;
    render();
    const current = currentRoleContext();
    if (pageWindow.location.pathname === '/chat' && String(current.characterId) === job.activeCharacterId) processManualAutoChatJob();
    else pageWindow.location.assign(roleUrl(job.activeCharacterId));
  }

  function cancelManualAutoChatJob() {
    const job = loadManualAutoChatJob();
    if (!job) return;
    if (!pageWindow.confirm('确定取消一键扣数任务吗？\n\n已经发送的消息不会撤回，尚未处理的角色会继续保留在普通待聊列表。')) return;
    clearManualAutoChatJob();
    state.manualAutoChatRunning = false;
    state.manualAutoChatStopRequested = true;
    state.manualFavoriteChatCurrentId = '';
    try { localStorage.removeItem(accountStorageKey(MANUAL_FAVORITE_CHAT_CURRENT_KEY)); } catch (_) {}
    state.status = '已取消一键扣数任务；未处理角色仍保留在普通待聊列表。';
    render();
  }

  async function favoriteFetch(url, options = {}, label = '收藏请求', timeoutMs = 20000) {
    const Controller = pageWindow.AbortController || globalThis.AbortController;
    if (!Controller) {
      return Promise.race([
        pageWindow.fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error(`${label}超过 ${Math.round(timeoutMs / 1000)} 秒未响应`)), timeoutMs))
      ]);
    }
    const controller = new Controller();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await pageWindow.fetch(url, { ...options, signal: controller.signal });
    } catch (error) {
      if (error?.name === 'AbortError') throw new Error(`${label}超过 ${Math.round(timeoutMs / 1000)} 秒未响应`);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  function loadShareCodeCache() {
    try {
      if (!maskAccountScope) return new Map();
      const scopedKey = accountStorageKey(SHARE_CODE_CACHE_KEY);
      let raw = localStorage.getItem(scopedKey) || '';
      // 旧版公共缓存只允许当前第一个已识别账号认领一次，不能复制给后续账号。
      if (!raw) {
        const legacy = localStorage.getItem(SHARE_CODE_CACHE_KEY) || '';
        const owner = localStorage.getItem(SHARE_CODE_ACCOUNT_MIGRATION_OWNER_KEY) || '';
        if (legacy && (!owner || owner === maskAccountScope)) {
          localStorage.setItem(scopedKey, legacy);
          localStorage.setItem(SHARE_CODE_ACCOUNT_MIGRATION_OWNER_KEY, maskAccountScope);
          raw = localStorage.getItem(scopedKey) || '';
          if (raw === legacy) localStorage.removeItem(SHARE_CODE_CACHE_KEY);
        }
      }
      const value = JSON.parse(raw || '{}');
      return new Map(Object.entries(value).filter(([id, code]) => id && typeof code === 'string' && code));
    } catch (_) {
      return new Map();
    }
  }

  function saveShareCodeCache() {
    if (!maskAccountScope) return;
    try { localStorage.setItem(accountStorageKey(SHARE_CODE_CACHE_KEY), JSON.stringify(Object.fromEntries(shareCodeCache))); } catch (_) {}
  }

  function reloadShareCodeCacheForAccount() {
    const next = loadShareCodeCache();
    shareCodeCache.clear();
    next.forEach((code, id) => shareCodeCache.set(id, code));
  }

  function compactFavoriteJobRow(row) {
    const characterId = String(row?.characterId || '').trim();
    if (!characterId) return null;
    return {
      characterId,
      name: String(row?.name || '未命名角色'),
      authorId: String(row?.authorId || ''),
      authorName: String(row?.authorName || ''),
      isFavorite: Boolean(row?.isFavorite),
      favoriteKnown: row?.favoriteKnown === true
    };
  }

  function compactShareFavoriteJob(job) {
    if (!job || !Array.isArray(job.rows)) return null;
    return {
      label: String(job.label || '收藏任务'),
      rows: job.rows.map(compactFavoriteJobRow).filter(Boolean),
      index: Math.max(0, Number(job.index) || 0),
      activeCharacterId: String(job.activeCharacterId || ''),
      activeShareCode: String(job.activeShareCode || ''),
      shareSuccess: Number(job.shareSuccess) || 0,
      normalSuccess: Number(job.normalSuccess) || 0,
      alreadyFavoriteSkipped: Number(job.alreadyFavoriteSkipped) || 0,
      normalFallback: Array.isArray(job.normalFallback) ? job.normalFallback.map(item => ({
        characterId: String(item?.characterId || ''),
        name: String(item?.name || '未命名角色')
      })).filter(item => item.characterId) : [],
      shareLookupFailures: Array.isArray(job.shareLookupFailures) ? job.shareLookupFailures.map(String) : [],
      failures: Array.isArray(job.failures) ? job.failures.map(String) : [],
      favoritedIds: Array.isArray(job.favoritedIds) ? [...new Set(job.favoritedIds.map(String).filter(Boolean))] : [],
      paused: Boolean(job.paused),
      pauseReason: String(job.pauseReason || ''),
      navigationStartedAt: Number(job.navigationStartedAt) || 0,
      accountScope: String(job.accountScope || maskAccountScope || ''),
      updatedAt: new Date().toISOString()
    };
  }

  function readLegacyShareFavoriteJob() {
    try {
      const job = JSON.parse(localStorage.getItem(SHARE_FAVORITE_JOB_KEY) || 'null');
      return compactShareFavoriteJob(job);
    } catch (_) {
      return null;
    }
  }

  function loadShareFavoriteJob() {
    return shareFavoriteJobCache ? cloneValue(shareFavoriteJobCache) : null;
  }

  function shareFavoriteJobRecordKey(scope = maskAccountScope) {
    return scope ? `${SHARE_FAVORITE_JOB_RECORD_KEY}:${scope}` : '';
  }

  function reloadShareFavoriteJobStorageForAccount() {
    shareFavoriteJobStorageGeneration += 1;
    shareFavoriteJobCache = null;
    shareFavoriteJobStoragePromise = null;
    if (maskAccountScope) void initializeShareFavoriteJobStorage();
  }

  async function initializeShareFavoriteJobStorage() {
    if (shareFavoriteJobStoragePromise) return shareFavoriteJobStoragePromise;
    const generation = shareFavoriteJobStorageGeneration;
    const scope = maskAccountScope;
    shareFavoriteJobStoragePromise = (async () => {
      if (!scope) {
        if (generation === shareFavoriteJobStorageGeneration) shareFavoriteJobCache = null;
        return false;
      }
      const legacyJob = readLegacyShareFavoriteJob();
      const database = await openMaskDatabase();
      const recordKey = shareFavoriteJobRecordKey(scope);
      let record = await readMaskDatabaseRecord(database, recordKey);
      if (!record) {
        const oldRecord = await readMaskDatabaseRecord(database, SHARE_FAVORITE_JOB_RECORD_KEY);
        const oldJob = compactShareFavoriteJob(oldRecord?.job);
        if (oldJob && (!oldJob.accountScope || oldJob.accountScope === scope)) record = oldRecord;
      }
      let job = compactShareFavoriteJob(record?.job);
      if (job?.accountScope && job.accountScope !== scope) job = null;
      const migratableLegacyJob = legacyJob && (!legacyJob.accountScope || legacyJob.accountScope === scope) ? legacyJob : null;
      if (!job && migratableLegacyJob) job = migratableLegacyJob;
      if (job && record?.accountKey !== recordKey) {
        job.accountScope = scope;
        const transaction = database.transaction(MASK_DATABASE_STORE, 'readwrite');
        const done = transactionDone(transaction);
        const store = transaction.objectStore(MASK_DATABASE_STORE);
        store.put({
          accountKey: recordKey,
          schemaVersion: 1,
          job,
          updatedAt: new Date().toISOString()
        });
        if (record?.accountKey === SHARE_FAVORITE_JOB_RECORD_KEY) store.delete(SHARE_FAVORITE_JOB_RECORD_KEY);
        await done;
      }
      if (generation === shareFavoriteJobStorageGeneration && scope === maskAccountScope) shareFavoriteJobCache = job;
      if (migratableLegacyJob) try { localStorage.removeItem(SHARE_FAVORITE_JOB_KEY); } catch (_) {}
      return true;
    })().catch(error => {
      if (generation === shareFavoriteJobStorageGeneration && scope === maskAccountScope) {
        const legacyJob = readLegacyShareFavoriteJob();
        shareFavoriteJobCache = legacyJob?.accountScope && legacyJob.accountScope !== scope ? null : legacyJob;
      }
      appendRunLog('error', '收藏任务 IndexedDB 初始化失败', error);
      return false;
    });
    return shareFavoriteJobStoragePromise;
  }

  async function saveShareFavoriteJob(job) {
    await initializeShareFavoriteJobStorage();
    const compact = compactShareFavoriteJob(job);
    if (!compact) {
      appendRunLog('error', '收藏任务保存失败', new Error('收藏队列格式无效'));
      return false;
    }
    if (!maskAccountScope || (compact.accountScope && compact.accountScope !== maskAccountScope)) {
      appendRunLog('error', '收藏任务保存失败', new Error('收藏队列所属账号与当前账号不一致'));
      return false;
    }
    compact.accountScope = maskAccountScope;
    const recordKey = shareFavoriteJobRecordKey(maskAccountScope);
    const previousCache = shareFavoriteJobCache;
    shareFavoriteJobCache = compact;
    try {
      const database = await openMaskDatabase();
      const transaction = database.transaction(MASK_DATABASE_STORE, 'readwrite');
      const done = transactionDone(transaction);
      transaction.objectStore(MASK_DATABASE_STORE).put({
        accountKey: recordKey,
        schemaVersion: 1,
        job: compact,
        updatedAt: new Date().toISOString()
      });
      await done;
      const verified = await readMaskDatabaseRecord(database, recordKey);
      if (!Array.isArray(verified?.job?.rows)
          || verified.job.rows.length !== compact.rows.length
          || Number(verified.job.index || 0) !== compact.index) {
        throw new Error('收藏任务写入后回读校验失败');
      }
      try { localStorage.removeItem(SHARE_FAVORITE_JOB_KEY); } catch (_) {}
      return true;
    } catch (error) {
      shareFavoriteJobCache = previousCache;
      appendRunLog('error', '收藏任务写入 IndexedDB 失败', error);
      return false;
    }
  }

  async function clearShareFavoriteJob() {
    const recordKey = shareFavoriteJobRecordKey(maskAccountScope);
    shareFavoriteJobStorageGeneration += 1;
    shareFavoriteJobCache = null;
    try { localStorage.removeItem(SHARE_FAVORITE_JOB_KEY); } catch (_) {}
    try {
      const database = await openMaskDatabase();
      const transaction = database.transaction(MASK_DATABASE_STORE, 'readwrite');
      const done = transactionDone(transaction);
      if (recordKey) transaction.objectStore(MASK_DATABASE_STORE).delete(recordKey);
      await done;
      return true;
    } catch (error) {
      appendRunLog('error', '清除收藏任务 IndexedDB 记录失败', error);
      return false;
    }
  }

  function saveShareFavoriteResult(result) {
    try {
      localStorage.setItem(accountStorageKey(SHARE_FAVORITE_RESULT_KEY), JSON.stringify({
        ...result,
        rows: (result?.rows || []).map(compactFavoriteJobRow).filter(Boolean)
      }));
      return true;
    } catch (error) {
      appendRunLog('error', '收藏完成结果写入 localStorage 失败', error);
      return false;
    }
  }

  function takeShareFavoriteResult() {
    try {
      const key = accountStorageKey(SHARE_FAVORITE_RESULT_KEY);
      const result = JSON.parse(loadAndMigrateScopedValue(SHARE_FAVORITE_RESULT_KEY) || 'null');
      localStorage.removeItem(key);
      return result;
    } catch (_) {
      return null;
    }
  }

  function loadFavoriteShareRecoveryJob() {
    try {
      if (!maskAccountScope) return null;
      const task = JSON.parse(localStorage.getItem(accountStorageKey(FAVORITE_SHARE_RECOVERY_JOB_KEY)) || 'null');
      if (Array.isArray(task?.rows)) return task;
      // 兼容 2.9.34 及更早版本尚未完成的单角色恢复任务。
      if (task?.row?.characterId && task?.shareCode) {
        return {
          version: 2,
          rows: [task.row],
          index: 0,
          phase: task.phase || 'unfavorited',
          shareCode: task.shareCode,
          shareUrl: task.shareUrl || shareUrlFromCode(task.shareCode),
          paused: false,
          pauseRequested: false,
          converted: 0,
          skipped: 0,
          failures: [],
          navigationStartedAt: Number(task.navigationStartedAt || 0)
        };
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  function saveFavoriteShareRecoveryJob(task) {
    try {
      if (!maskAccountScope) return false;
      localStorage.setItem(accountStorageKey(FAVORITE_SHARE_RECOVERY_JOB_KEY), JSON.stringify(task));
      const saved = loadFavoriteShareRecoveryJob();
      return Boolean(saved
        && Array.isArray(saved.rows)
        && saved.rows.length === (task?.rows?.length || 0)
        && Number(saved.index || 0) === Number(task?.index || 0)
        && String(saved.phase || '') === String(task?.phase || ''));
    } catch (_) {
      return false;
    }
  }

  function clearFavoriteShareRecoveryJob() {
    if (!maskAccountScope) return;
    try { localStorage.removeItem(accountStorageKey(FAVORITE_SHARE_RECOVERY_JOB_KEY)); } catch (_) {}
  }

  class RateLimitError extends Error {
    constructor(endpoint) {
      super(`${endpoint}请求过于频繁（HTTP 429）`);
      this.name = 'RateLimitError';
    }
  }

  class FavoriteStorageError extends Error {
    constructor(message) {
      super(message);
      this.name = 'FavoriteStorageError';
    }
  }


  function explainFailure(error) {
    const message = String(error?.message || error || '未知错误');
    if (/429/.test(message)) return `${message}。请求太快，网站暂时限流，查询已暂停，请稍后再试或降低速度。`;
    if (/401|403|登录权限/.test(message)) return `${message}。登录状态失效或没有权限，请刷新网站后重试。`;
    if (/404/.test(message)) return `${message}。接口或目标数据不存在，通常不是脚本本身的问题。`;
    if (/500|502|503/.test(message)) return `${message}。网站服务器暂时异常，稍后再试即可。`;
    if (/share_link_expired|分享已失效/.test(message)) return `${message}。角色的分享链接已经失效，接口没有可恢复的当前链接。`;
    if (/failed to fetch|networkerror|网络|连接/i.test(message)) return `${message}。浏览器没有连上网站，可能是网络、代理或页面连接暂时中断。`;
    if (/json|unexpected end|空响应|没有返回有效数据/i.test(message)) return `${message}。网站返回内容为空或格式不完整，稍后重试即可。`;
    return `${message}。网站返回了脚本无法识别的失败结果。`;
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function cloneValue(value) {
    if (value == null) return value;
    try { return structuredClone(value); } catch (_) {
      try { return JSON.parse(JSON.stringify(value)); } catch (_) { return value; }
    }
  }

  function makeLibraryId() {
    return globalThis.crypto?.randomUUID?.() || `mask-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function ensureLegacyMaskAccountMigration() {
    if (!maskAccountScope) return;
    try {
      let owner = localStorage.getItem(MASK_ACCOUNT_MIGRATION_OWNER_KEY) || '';
      if (!owner) {
        owner = maskAccountScope;
        localStorage.setItem(MASK_ACCOUNT_MIGRATION_OWNER_KEY, owner);
      }
      if (owner !== maskAccountScope) return;
      const doneKey = `${MASK_ACCOUNT_MIGRATION_OWNER_KEY}:done:${maskAccountScope}`;
      if (localStorage.getItem(doneKey) === '1') return;
      // 不在 localStorage 内复制大段面具正文；存储已满的设备会在复制阶段再次失败。
      // 当前账号可以直接读取公共旧键，随后一次性迁移进 IndexedDB。
      localStorage.setItem(doneKey, '1');
    } catch (error) {
      maskLibraryStorageWarning = '账号迁移标记写入失败，暂未删除任何旧数据。脚本仍会尝试直接迁移到 IndexedDB。';
      appendRunLog('error', maskLibraryStorageWarning, error);
    }
  }

  function currentAccountOwnsLegacyMaskKeys() {
    if (!maskAccountScope) return true;
    try {
      const owner = localStorage.getItem(MASK_ACCOUNT_MIGRATION_OWNER_KEY) || '';
      return !owner || owner === maskAccountScope;
    } catch (_) { return true; }
  }

  function normalizeMaskLibraryRows(value) {
    if (!Array.isArray(value)) throw new Error('保存内容不是面具数组');
    return value
      .filter(row => row && typeof row === 'object')
      .map(row => ({ ...row, libraryId: row.libraryId || makeLibraryId() }));
  }

  function normalizeMaskBindingRows(value) {
    return Array.isArray(value)
      ? value.filter(row => row && typeof row === 'object' && row.characterId)
      : [];
  }

  function maskDataSnapshot(library = state.library, bindings = state.maskBindings) {
    return {
      library: cloneValue(Array.isArray(library) ? library : []),
      bindings: cloneValue(Array.isArray(bindings) ? bindings : [])
    };
  }

  function normalizeMaskDatabaseSnapshot(value) {
    if (!value || typeof value !== 'object') throw new Error('IndexedDB 面具记录为空');
    return {
      library: normalizeMaskLibraryRows(value.library || []),
      bindings: normalizeMaskBindingRows(value.bindings || [])
    };
  }

  function sameMaskDataSnapshot(left, right) {
    try { return JSON.stringify(left) === JSON.stringify(right); } catch (_) { return false; }
  }

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('IndexedDB 请求失败'));
    });
  }

  function transactionDone(transaction) {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error || new Error('IndexedDB 事务已中止'));
      transaction.onerror = () => reject(transaction.error || new Error('IndexedDB 事务失败'));
    });
  }

  function openMaskDatabase() {
    if (maskDatabasePromise) return maskDatabasePromise;
    maskDatabasePromise = new Promise((resolve, reject) => {
      let settled = false;
      const finish = (callback, value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        callback(value);
      };
      const timeout = setTimeout(() => finish(reject, new Error('IndexedDB 打开超时')), 6000);
      try {
        const factory = pageWindow.indexedDB || globalThis.indexedDB;
        if (!factory) throw new Error('当前浏览器环境不支持 IndexedDB');
        const request = factory.open(MASK_DATABASE_NAME, MASK_DATABASE_VERSION);
        request.onupgradeneeded = () => {
          const database = request.result;
          if (!database.objectStoreNames.contains(MASK_DATABASE_STORE)) {
            database.createObjectStore(MASK_DATABASE_STORE, { keyPath: 'accountKey' });
          }
        };
        request.onsuccess = () => {
          const database = request.result;
          database.onversionchange = () => {
            database.close();
            maskDatabasePromise = null;
          };
          finish(resolve, database);
        };
        request.onerror = () => finish(reject, request.error || new Error('IndexedDB 打开失败'));
        request.onblocked = () => finish(reject, new Error('IndexedDB 被其他页面占用，请关闭其他 Mufy 标签页后重试'));
      } catch (error) {
        finish(reject, error);
      }
    }).catch(error => {
      maskDatabasePromise = null;
      throw error;
    });
    return maskDatabasePromise;
  }

  async function testMaskDatabase(database) {
    const testKey = `__test__-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const testValue = { accountKey: testKey, value: 'ok' };
    const writeTransaction = database.transaction(MASK_DATABASE_STORE, 'readwrite');
    const writeDone = transactionDone(writeTransaction);
    writeTransaction.objectStore(MASK_DATABASE_STORE).put(testValue);
    await writeDone;
    const readTransaction = database.transaction(MASK_DATABASE_STORE, 'readonly');
    const readDone = transactionDone(readTransaction);
    const found = await requestResult(readTransaction.objectStore(MASK_DATABASE_STORE).get(testKey));
    await readDone;
    if (found?.value !== 'ok') throw new Error('IndexedDB 写入后回读校验失败');
    const deleteTransaction = database.transaction(MASK_DATABASE_STORE, 'readwrite');
    const deleteDone = transactionDone(deleteTransaction);
    deleteTransaction.objectStore(MASK_DATABASE_STORE).delete(testKey);
    await deleteDone;
  }

  async function readMaskDatabaseRecord(database, accountKey) {
    const transaction = database.transaction(MASK_DATABASE_STORE, 'readonly');
    const done = transactionDone(transaction);
    const record = await requestResult(transaction.objectStore(MASK_DATABASE_STORE).get(accountKey));
    await done;
    return record || null;
  }

  function contentDataSnapshot() {
    return {
      promptLibrary: cloneValue(state.promptLibrary || []),
      extraLibrary: cloneValue(state.extraLibrary || [])
    };
  }

  function normalizeContentDataSnapshot(value) {
    const source = value && typeof value === 'object' ? value : {};
    return {
      promptLibrary: Array.isArray(source.promptLibrary) ? source.promptLibrary.map(row => normalizeMaterialItem(row, 'prompt')).filter(row => row.content) : [],
      extraLibrary: Array.isArray(source.extraLibrary) ? source.extraLibrary.map(row => normalizeMaterialItem(row, 'extra')).filter(row => row.content) : []
    };
  }

  async function writeContentDatabaseSnapshot(database, scope, snapshot) {
    const accountKey = `${CONTENT_LIBRARY_RECORD_PREFIX}${scope}`;
    const existing = await readMaskDatabaseRecord(database, accountKey);
    const merged = { ...(existing?.current && typeof existing.current === 'object' ? existing.current : {}), ...cloneValue(snapshot) };
    const transaction = database.transaction(MASK_DATABASE_STORE, 'readwrite');
    const done = transactionDone(transaction);
    transaction.objectStore(MASK_DATABASE_STORE).put({ accountKey, schemaVersion: 1, current: merged, updatedAt: new Date().toISOString() });
    await done;
    const verified = await readMaskDatabaseRecord(database, accountKey);
    if (!verified?.current || JSON.stringify(normalizeContentDataSnapshot(verified.current)) !== JSON.stringify(normalizeContentDataSnapshot(snapshot))) {
      throw new Error('指令与番外库写入 IndexedDB 后回读校验失败');
    }
    return verified;
  }

  function removeLegacyContentStorage(scope) {
    [PROMPT_LIBRARY_KEY, EXTRA_LIBRARY_KEY].forEach(key => {
      try { localStorage.removeItem(accountStorageKey(key, scope)); } catch (_) {}
    });
  }

  function applyContentDataSnapshot(snapshot) {
    const normalized = normalizeContentDataSnapshot(snapshot);
    state.promptLibrary = normalized.promptLibrary;
    state.extraLibrary = normalized.extraLibrary;
  }

  async function initializeContentStorageForAccount(scope = maskAccountScope) {
    const generation = ++contentStorageGeneration;
    if (!scope) { contentStorageMode = 'localStorage'; return; }
    contentStorageMode = 'initializing';
    try {
      const database = await openMaskDatabase();
      await testMaskDatabase(database);
      if (generation !== contentStorageGeneration || scope !== maskAccountScope) return;
      const accountKey = `${CONTENT_LIBRARY_RECORD_PREFIX}${scope}`;
      const record = await readMaskDatabaseRecord(database, accountKey);
      if (record?.current) {
        applyContentDataSnapshot(record.current);
        contentStorageMode = 'indexedDB';
        removeLegacyContentStorage(scope);
        appendRunLog('info', `已从 IndexedDB 载入指令库和番外库。`, { prompts: state.promptLibrary.length, extras: state.extraLibrary.length });
      } else {
        const snapshot = contentDataSnapshot();
        await writeContentDatabaseSnapshot(database, scope, snapshot);
        if (generation !== contentStorageGeneration || scope !== maskAccountScope) return;
        contentStorageMode = 'indexedDB';
        removeLegacyContentStorage(scope);
        appendRunLog('info', `已将指令库和番外库迁移到 IndexedDB。`, { prompts: snapshot.promptLibrary.length, extras: snapshot.extraLibrary.length });
      }
      renderMaterialSection();
      render();
    } catch (error) {
      if (generation !== contentStorageGeneration || scope !== maskAccountScope) return;
      contentStorageMode = 'localStorage';
      appendRunLog('error', '指令与番外库 IndexedDB 初始化失败，继续使用 localStorage', error);
      state.status = `IndexedDB 初始化失败，指令和番外暂时继续保存在 localStorage：${explainFailure(error)}`;
      render();
    }
  }

  function queueContentStoragePersist(reason) {
    const scope = maskAccountScope;
    if (!scope || contentStorageMode !== 'indexedDB') return false;
    const snapshot = contentDataSnapshot();
    contentStorageWriteQueue = contentStorageWriteQueue.catch(() => {}).then(async () => {
      if (scope !== maskAccountScope || contentStorageMode !== 'indexedDB') return;
      const database = await openMaskDatabase();
      await writeContentDatabaseSnapshot(database, scope, snapshot);
      appendRunLog('info', `${reason}已写入 IndexedDB`);
    }).catch(error => {
      appendRunLog('error', `${reason}写入 IndexedDB 失败`, error);
      state.status = `${reason}保存失败：${explainFailure(error)}`;
      render();
    });
    return true;
  }

  function compactRoleHistoryRow(row, previous = null) {
    const characterId = String(row?.characterId || '').trim();
    if (!characterId) return null;
    const now = new Date().toISOString();
    const name = String(row?.name || '').trim();
    const authorName = String(row?.authorName || '').trim();
    const incomingTime = Date.parse(String(row?.lastInteracted || '')) || 0;
    const previousTime = Date.parse(String(previous?.lastInteracted || '')) || 0;
    const useIncomingSession = Boolean(row?.lastSessionId) && (!previous?.lastSessionId || incomingTime >= previousTime);
    return {
      characterId,
      name: name && name !== '未命名角色' ? name : (previous?.name || '未命名角色'),
      authorName: authorName || previous?.authorName || '',
      authorId: String(row?.authorId || previous?.authorId || ''),
      tags: normalizeRoleTags(previous?.tags, row?.tags),
      lastSessionId: String(useIncomingSession ? row.lastSessionId : (previous?.lastSessionId || row?.lastSessionId || '')),
      lastInteracted: String(incomingTime >= previousTime ? (row?.lastInteracted || previous?.lastInteracted || '') : previous?.lastInteracted || ''),
      firstSeenAt: previous?.firstSeenAt || now,
      lastSeenAt: now
    };
  }

  async function readRoleHistoryForAccount(scope) {
    if (!scope) return [];
    const database = await openMaskDatabase();
    const record = await readMaskDatabaseRecord(database, `${ROLE_HISTORY_RECORD_PREFIX}${scope}`);
    return Array.isArray(record?.rows) ? record.rows.filter(row => row?.characterId) : [];
  }

  async function initializeRoleHistoryForAccount(scope) {
    const generation = ++roleHistoryGeneration;
    state.roleHistory = [];
    setTimeout(() => {
      if (generation === roleHistoryGeneration) render();
    }, 0);
    if (!scope) return;
    try {
      const rows = await readRoleHistoryForAccount(scope);
      if (maskAccountScope !== scope || generation !== roleHistoryGeneration) return;
      state.roleHistory = rows;
      render();
    } catch (error) {
      if (maskAccountScope !== scope || generation !== roleHistoryGeneration) return;
      appendRunLog('error', '历史角色索引读取失败', error);
      state.status = `历史角色索引读取失败：${explainFailure(error)}当前角色读取仍可使用。`;
      render();
    }
  }

  function queueRoleHistoryPersist(rows) {
    const scope = maskAccountScope;
    // 会话列表有时只给角色 ID；角色主页链接仍然可以永久记录。
    const incoming = rows.filter(row => row?.characterId);
    if (!scope || !incoming.length) return Promise.resolve(!incoming.length);
    const persist = async () => {
      const database = await openMaskDatabase();
      const accountKey = `${ROLE_HISTORY_RECORD_PREFIX}${scope}`;
      const existing = await readMaskDatabaseRecord(database, accountKey);
      const byId = new Map((Array.isArray(existing?.rows) ? existing.rows : [])
        .filter(row => row?.characterId).map(row => [String(row.characterId), row]));
      incoming.forEach(row => {
        const id = String(row.characterId);
        byId.set(id, compactRoleHistoryRow(row, byId.get(id)));
      });
      const merged = [...byId.values()];
      const transaction = database.transaction(MASK_DATABASE_STORE, 'readwrite');
      const done = transactionDone(transaction);
      transaction.objectStore(MASK_DATABASE_STORE).put({ accountKey, schemaVersion: 1, rows: merged, updatedAt: new Date().toISOString() });
      await done;
      const verified = await readMaskDatabaseRecord(database, accountKey);
      if (!Array.isArray(verified?.rows) || verified.rows.length !== merged.length) {
        throw new Error('历史角色索引写入后回读校验失败');
      }
      if (maskAccountScope === scope) {
        roleHistoryGeneration += 1;
        state.roleHistory = verified.rows;
        render();
      }
      return true;
    };
    roleHistoryWriteQueue = roleHistoryWriteQueue.catch(() => {}).then(persist);
    return roleHistoryWriteQueue.catch(error => {
      appendRunLog('error', '历史角色索引写入失败', error);
      if (maskAccountScope === scope) {
        state.status = `历史角色索引未能保存：${explainFailure(error)}请及时导出已读取的角色链接。`;
        render();
      }
      return false;
    });
  }

  async function writeMaskDatabaseSnapshot(database, accountKey, snapshot, options = {}) {
    // Safari 会较积极地自动关闭空闲事务，因此读取和写入分成两个短事务。
    const existing = await readMaskDatabaseRecord(database, accountKey);
    const record = {
      accountKey,
      schemaVersion: 1,
      current: cloneValue(snapshot),
      previous: cloneValue(existing?.current || existing?.previous || snapshot),
      updatedAt: new Date().toISOString(),
      migration: options.migration || existing?.migration || null
    };
    const transaction = database.transaction(MASK_DATABASE_STORE, 'readwrite');
    const done = transactionDone(transaction);
    transaction.objectStore(MASK_DATABASE_STORE).put(record);
    await done;
    const verified = await readMaskDatabaseRecord(database, accountKey);
    if (!verified || !sameMaskDataSnapshot(verified.current, snapshot)) {
      throw new Error('IndexedDB 保存后回读校验不一致');
    }
    return verified;
  }

  function legacyMaskKeysForScope(scope) {
    const keys = [
      accountStorageKey(MASK_LIBRARY_KEY, scope),
      accountStorageKey(MASK_LIBRARY_BACKUP_KEY, scope),
      accountStorageKey(MASK_BINDINGS_KEY, scope)
    ];
    try {
      const owner = localStorage.getItem(MASK_ACCOUNT_MIGRATION_OWNER_KEY) || '';
      if (!owner || owner === scope) {
        keys.push(MASK_LIBRARY_KEY, MASK_LIBRARY_BACKUP_KEY, MASK_BINDINGS_KEY);
      }
    } catch (_) {}
    return [...new Set(keys)];
  }

  function removeLegacyMaskBackupKeys(keys) {
    keys.filter(key => /mask-library-backup/i.test(key)).forEach(key => {
      try { localStorage.removeItem(key); } catch (_) {}
    });
  }

  function removeLegacyMaskContentKeys(keys) {
    keys.forEach(key => {
      try { localStorage.removeItem(key); } catch (_) {}
    });
  }

  function indexedDbActiveMarkerKey(scope = maskAccountScope) {
    return accountStorageKey(MASK_INDEXEDDB_ACTIVE_KEY, scope);
  }

  function hasIndexedDbActiveMarker(scope = maskAccountScope) {
    try { return Boolean(scope) && localStorage.getItem(indexedDbActiveMarkerKey(scope)) === '1'; } catch (_) { return false; }
  }

  function setIndexedDbActiveMarker(scope = maskAccountScope) {
    try { if (scope) localStorage.setItem(indexedDbActiveMarkerKey(scope), '1'); } catch (error) {
      appendRunLog('warn', 'IndexedDB 已校验成功，但兼容状态标记写入失败', error);
    }
  }

  async function updateMaskMigrationVerification(database, record) {
    const migration = record?.migration;
    if (!migration || migration.completed) return record;
    const verifiedLoads = Math.max(1, Number(migration.verifiedLoads) || 1) + 1;
    const nextMigration = { ...migration, verifiedLoads, completed: verifiedLoads >= 2 };
    const updated = await writeMaskDatabaseSnapshot(database, record.accountKey, record.current, { migration: nextMigration });
    if (nextMigration.completed) {
      removeLegacyMaskContentKeys(Array.isArray(nextMigration.sourceKeys) ? nextMigration.sourceKeys : []);
      appendRunLog('info', `${maskAccountLabel()}已连续两次通过 IndexedDB 校验，旧 localStorage 面具正文已清理。`);
    }
    return updated;
  }

  function handleIndexedDbStorageFailure(message, error, duringInitialization = false) {
    appendRunLog('error', message, error);
    if (duringInitialization) {
      if (hasIndexedDbActiveMarker()) {
        maskStorageMode = 'indexedDB-error';
        maskStorageReady = false;
        maskLibraryStorageWarning = `${message} 此账号已经使用 IndexedDB，为防止旧 localStorage 覆盖新数据，已停止保存；请重开浏览器或复制反馈日志。`;
      } else {
        maskStorageMode = 'localStorage';
        maskStorageReady = true;
        maskLibraryStorageWarning = `${message} 已保留并继续使用 localStorage；面具较多时请及时导出。`;
      }
    } else {
      maskStorageMode = 'indexedDB-error';
      maskStorageReady = false;
      maskLibraryStorageWarning = `${message} 为防止旧数据覆盖新数据，已停止继续保存；请先导出面具并复制反馈日志。`;
      try { pageWindow.alert(maskLibraryStorageWarning); } catch (_) {}
    }
    if (typeof state !== 'undefined') {
      state.status = maskLibraryStorageWarning;
      render();
    }
  }

  async function initializeMaskStorageForAccount(scope = maskAccountScope) {
    const generation = ++maskStorageGeneration;
    if (!scope) {
      maskStorageMode = 'localStorage';
      maskStorageReady = true;
      return;
    }
    maskStorageMode = 'initializing';
    maskStorageReady = false;
    try {
      const database = await openMaskDatabase();
      await testMaskDatabase(database);
      if (generation !== maskStorageGeneration || scope !== maskAccountScope) return;
      let record = await readMaskDatabaseRecord(database, scope);
      if (record?.current) {
        let snapshot;
        let recoveredFromPrevious = false;
        try {
          snapshot = normalizeMaskDatabaseSnapshot(record.current);
        } catch (currentError) {
          if (!record.previous) throw currentError;
          snapshot = normalizeMaskDatabaseSnapshot(record.previous);
          recoveredFromPrevious = true;
          appendRunLog('warn', 'IndexedDB 当前面具记录损坏，已使用上一版备份恢复。', currentError);
        }
        if (!sameMaskDataSnapshot(snapshot, record.current)) {
          record = await writeMaskDatabaseSnapshot(database, scope, snapshot, { migration: record.migration || null });
        }
        if (generation !== maskStorageGeneration || scope !== maskAccountScope) return;
        state.library = snapshot.library;
        state.maskBindings = snapshot.bindings;
        record = await updateMaskMigrationVerification(database, record);
        setIndexedDbActiveMarker(scope);
        maskStorageMode = 'indexedDB';
        maskStorageReady = true;
        cleanOrphanedMaskBindings();
        if (recoveredFromPrevious) {
          state.status = `IndexedDB 当前记录异常，已从上一版备份恢复 ${state.library.length} 个面具。`;
        } else {
          appendRunLog('info', `已从 IndexedDB 载入面具库（${state.library.length} 个）。`);
        }
        render();
        if (state.autoSwitch) scheduleAutoMaskSwitch();
        return;
      }

      const snapshot = maskDataSnapshot(state.library, state.maskBindings);
      const sourceKeys = legacyMaskKeysForScope(scope);
      const migration = {
        sourceKeys,
        verifiedLoads: 1,
        completed: false,
        migratedAt: new Date().toISOString()
      };
      await writeMaskDatabaseSnapshot(database, scope, snapshot, { migration });
      if (generation !== maskStorageGeneration || scope !== maskAccountScope) return;
      removeLegacyMaskBackupKeys(sourceKeys);
      setIndexedDbActiveMarker(scope);
      maskStorageMode = 'indexedDB';
      maskStorageReady = true;
      appendRunLog('info', `已将 ${state.library.length} 个面具迁移到 IndexedDB，旧数据暂留到下次校验。`);
      render();
      if (state.autoSwitch) scheduleAutoMaskSwitch();
    } catch (error) {
      if (generation !== maskStorageGeneration || scope !== maskAccountScope) return;
      handleIndexedDbStorageFailure('IndexedDB 初始化或迁移失败。', error, true);
    }
  }

  function queueIndexedDbMaskPersist(reason) {
    const scope = maskAccountScope;
    const snapshot = maskDataSnapshot();
    maskStorageWriteQueue = maskStorageWriteQueue
      .catch(() => {})
      .then(async () => {
        if (!scope || scope !== maskAccountScope || maskStorageMode !== 'indexedDB') return;
        const database = await openMaskDatabase();
        await writeMaskDatabaseSnapshot(database, scope, snapshot);
        appendRunLog('info', `${reason}已写入 IndexedDB`, { account: maskAccountLabel(), masks: snapshot.library.length, bindings: snapshot.bindings.length });
      })
      .catch(error => handleIndexedDbStorageFailure(`${reason}写入 IndexedDB 失败。`, error, false));
    return true;
  }

  function loadMaskLibrary() {
    const parseRows = raw => {
      if (!raw) return null;
      return normalizeMaskLibraryRows(JSON.parse(raw));
    };
    try {
      ensureLegacyMaskAccountMigration();
      const primaryKey = accountStorageKey(MASK_LIBRARY_KEY);
      const backupKey = accountStorageKey(MASK_LIBRARY_BACKUP_KEY);
      const ownsLegacy = currentAccountOwnsLegacyMaskKeys();
      const primaryRaw = localStorage.getItem(primaryKey)
        ?? (ownsLegacy ? localStorage.getItem(MASK_LIBRARY_KEY) : null);
      const primary = parseRows(primaryRaw);
      if (primary) return primary;
      const backupRaw = localStorage.getItem(backupKey)
        ?? (ownsLegacy ? localStorage.getItem(MASK_LIBRARY_BACKUP_KEY) : null);
      const backup = parseRows(backupRaw);
      if (backup) {
        maskLibraryStorageWarning = `检测到主面具库为空，已读取本地备份中的 ${backup.length} 个面具，等待迁移到 IndexedDB。`;
        appendRunLog('warn', maskLibraryStorageWarning);
        return backup;
      }
      return [];
    } catch (error) {
      try {
        const backupRaw = localStorage.getItem(accountStorageKey(MASK_LIBRARY_BACKUP_KEY))
          ?? (currentAccountOwnsLegacyMaskKeys() ? localStorage.getItem(MASK_LIBRARY_BACKUP_KEY) : null);
        const backup = parseRows(backupRaw);
        if (backup) {
          maskLibraryStorageWarning = `主面具库数据损坏，已读取本地备份中的 ${backup.length} 个面具，等待迁移到 IndexedDB。`;
          appendRunLog('warn', maskLibraryStorageWarning, error);
          return backup;
        }
      } catch (_) {}
      maskLibraryStorageWarning = '面具库本地数据读取失败。请不要继续覆盖保存，先导出日志并检查浏览器是否清理了网站数据。';
      appendRunLog('error', maskLibraryStorageWarning, error);
      return [];
    }
  }

  function persistMaskLibrary() {
    if (maskStorageMode === 'indexedDB') return queueIndexedDbMaskPersist('面具库');
    if (maskStorageMode === 'indexedDB-error') {
      handleIndexedDbStorageFailure('面具库存储尚未恢复，无法继续保存。', new Error('IndexedDB 当前不可用'), false);
      return false;
    }
    const payload = JSON.stringify(state.library);
    const primaryKey = accountStorageKey(MASK_LIBRARY_KEY);
    const backupKey = accountStorageKey(MASK_LIBRARY_BACKUP_KEY);
    try {
      localStorage.setItem(primaryKey, payload);
      if (localStorage.getItem(primaryKey) !== payload) throw new Error('写入后校验内容不一致');
      // 备份写入失败不影响已经校验成功的主数据，常见原因是浏览器存储空间接近上限。
      try { localStorage.setItem(backupKey, payload); } catch (backupError) {
        appendRunLog('warn', '面具库主数据已保存，但本地备份写入失败', backupError);
      }
      maskLibraryStorageWarning = '';
      return true;
    } catch (error) {
      maskLibraryStorageWarning = '面具库未能写入浏览器本地存储；当前画面里的修改在刷新后可能消失。请立即导出面具并检查无痕模式、自动清理网站数据或存储空间。';
      appendRunLog('error', maskLibraryStorageWarning, error);
      try { pageWindow.alert(maskLibraryStorageWarning); } catch (_) {}
      setTimeout(() => {
        state.status = maskLibraryStorageWarning;
        render();
      }, 0);
      return false;
    }
  }

  function loadMaskBindings() {
    try {
      ensureLegacyMaskAccountMigration();
      const raw = localStorage.getItem(accountStorageKey(MASK_BINDINGS_KEY))
        ?? (currentAccountOwnsLegacyMaskKeys() ? localStorage.getItem(MASK_BINDINGS_KEY) : null)
        ?? '[]';
      const rows = JSON.parse(raw);
      return normalizeMaskBindingRows(rows);
    } catch (error) {
      appendRunLog('error', `${maskAccountLabel()}的面具绑定读取失败`, error);
      return [];
    }
  }

  function persistMaskBindings() {
    if (maskStorageMode === 'indexedDB') return queueIndexedDbMaskPersist('面具绑定');
    if (maskStorageMode === 'indexedDB-error') {
      handleIndexedDbStorageFailure('面具绑定存储尚未恢复，无法继续保存。', new Error('IndexedDB 当前不可用'), false);
      return false;
    }
    try {
      localStorage.setItem(accountStorageKey(MASK_BINDINGS_KEY), JSON.stringify(state.maskBindings));
      return true;
    } catch (error) {
      appendRunLog('error', `${maskAccountLabel()}的面具绑定写入失败`, error);
      state.status = '面具绑定未能写入浏览器本地存储，刷新后可能丢失。请复制反馈日志。';
      return false;
    }
  }

  function reloadMaskAccountPartition(previousScope, nextScope) {
    if (!roleStateReady || maskAccountScope !== nextScope) return;
    maskStorageGeneration += 1;
    maskStorageMode = 'initializing';
    maskStorageReady = false;
    maskLibraryStorageWarning = '';
    state.library = loadMaskLibrary();
    state.maskBindings = loadMaskBindings();
    state.undoLibrary = null;
    state.undoBindings = null;
    state.undoLabel = '';
    state.autoSwitchKey = '';
    const switchText = previousScope ? '检测到账号已切换' : '已识别当前账号';
    state.status = `${switchText}，正在读取${maskAccountLabel()}的 IndexedDB 面具库……`;
    render();
    initializeMaskStorageForAccount(nextScope).then(() => {
      if (maskAccountScope === nextScope && state.autoSwitch) scheduleAutoMaskSwitch();
    });
  }

  function loadAutoSwitchSetting() {
    try {
      const saved = localStorage.getItem(AUTO_SWITCH_KEY);
      return saved == null ? true : saved === '1';
    } catch (_) { return true; }
  }

  function setAutoSwitchSetting(enabled) {
    state.autoSwitch = Boolean(enabled);
    localStorage.setItem(AUTO_SWITCH_KEY, state.autoSwitch ? '1' : '0');
    if (state.autoSwitch) scheduleAutoMaskSwitch();
  }

  function sessionUrl(row, forceSession = false) {
    const url = new URL('/chat', location.origin);
    url.searchParams.set('roleId', row.characterId);
    const useSession = forceSession || !state.sessionlessRoleIds?.has(String(row.characterId));
    if (useSession && row.lastSessionId) url.searchParams.set('sessionId', row.lastSessionId);
    return url.href;
  }

  function roleUrl(characterId) {
    const url = new URL('/chat', location.origin);
    url.searchParams.set('roleId', String(characterId || ''));
    return url.href;
  }

  function archiveSessionKey(row) {
    return `${row.characterId}|${row.lastSessionId}`;
  }

  // 导出当前角色和账号历史索引；同一角色即使开过多个会话也只导出一条。
  function exportRoleRows() {
    const found = new Map();
    [...state.chatted, ...state.favoriteOnly, ...state.archived, ...state.roleHistory].forEach(row => {
      const key = String(row?.characterId || '');
      if (!key) return;
      const previous = found.get(key);
      const { defaultMaskId: _ignoredDefaultMaskId, ...role } = row;
      const merged = previous ? {
        ...role,
        ...previous,
        name: previous.name && previous.name !== '未命名角色' ? previous.name : role.name,
        lastSessionId: previous.lastSessionId || role.lastSessionId || '',
        authorName: previous.authorName || role.authorName || '',
        authorId: previous.authorId || role.authorId || ''
      } : role;
      const shareCode = shareCodeCache.get(key) || '';
      found.set(key, {
        ...merged,
        url: sessionUrl(merged),
        roleUrl: roleUrl(key),
        shareCode,
        shareUrl: shareCode ? shareUrlFromCode(shareCode) : ''
      });
    });
    return [...found.values()];
  }

  // 面具导出同时保留本地库和当前网站面具；同内容只保留一份，避免重复导出。
  function exportMaskRows() {
    const libraryMasks = state.library.map(row => ({ ...row, source: 'local-library' }));
    const siteMasks = state.masks.map(row => ({ ...row, source: 'website' }));
    const rows = [...libraryMasks];
    const found = new Set(libraryMasks.map(maskContentIdentity));
    for (const row of siteMasks) {
      const key = maskContentIdentity(row);
      if (found.has(key)) continue;
      found.add(key);
      rows.push(row);
    }
    return rows;
  }

  function normalizeArchive(row, character) {
    const sessionId = String(row?.sourceSessionId || row?.sessionId || '');
    if (!character?.characterId || !sessionId) return null;
    return {
      ...character,
      lastSessionId: sessionId,
      archiveId: String(row?.archiveId || ''),
      archiveRemark: String(row?.remark || row?.name || ''),
      archiveCreatedAt: String(row?.createdAt || ''),
      archiveUpdatedAt: String(row?.updatedAt || ''),
      lastInteracted: String(row?.updatedAt || row?.createdAt || character.lastInteracted || ''),
      archive: true
    };
  }

  async function requestArchives(characterId) {
    scanStoredAuthorization();
    const url = new URL('/api/sessions/query_archives', location.origin);
    url.searchParams.set('characterId', String(characterId));
    const headers = { Accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const response = await pageWindow.fetch(url.href, {
      method: 'GET', credentials: 'include', headers
    });
    if (response.status === 429) throw new RateLimitError('归档记录');
    if (response.status === 401 || response.status === 403) {
      throw new Error(loginErrorMessage(response.status, '归档记录查询'));
    }
    let body = null;
    try { body = await response.json(); } catch (_) {}
    if (!response.ok || body?.code !== 200) {
      throw new Error(body?.reason || body?.message || `归档接口请求失败（HTTP ${response.status}）`);
    }
    return Array.isArray(body.data)
      ? body.data
      : (Array.isArray(body.data?.data) ? body.data.data : []);
  }

  async function recoverArchivesForCharacter(character) {
    if (!character?.characterId || state.loading || state.metadataLoading || state.archiveLoading) return;
    const characterId = String(character.characterId);
    if (state.archiveCheckedCharacterIds.has(characterId)) {
      if (state.archiveOpenCharacterIds.has(characterId)) state.archiveOpenCharacterIds.delete(characterId);
      else state.archiveOpenCharacterIds.add(characterId);
      render();
      return;
    }
    state.archiveLoading = true;
    state.status = `正在查询“${character.name}”的归档旧档……`;
    render();
    try {
      const found = new Map(state.archived
        .filter(row => String(row.characterId) !== characterId)
        .map(row => [archiveSessionKey(row), row]));
      const rows = await requestArchives(characterId);
      rows.map(row => normalizeArchive(row, character)).filter(Boolean)
        .forEach(row => found.set(archiveSessionKey(row), row));
      state.archived = [...found.values()].sort((a, b) =>
        new Date(b.archiveUpdatedAt || b.archiveCreatedAt) - new Date(a.archiveUpdatedAt || a.archiveCreatedAt));
      state.archiveCheckedCharacterIds.add(characterId);
      state.archiveOpenCharacterIds.add(characterId);
      saveRoleCache();
      state.status = rows.length
        ? `“${character.name}”找到 ${rows.length} 条归档旧档。`
        : `“${character.name}”没有找到归档旧档。`;
    } catch (error) {
      state.status = `查询“${character.name}”的归档失败：${explainFailure(error)}`;
    } finally {
      state.archiveLoading = false;
      render();
    }
  }

  function favoriteStatusFrom(...sources) {
    const keys = ['isFavorite', 'isFavorited', 'favorited', 'followed', 'isFollowed', 'isFollowing', 'isCollected', 'collected', 'isStarred', 'starred'];
    const values = [];
    const add = source => {
      if (!source || typeof source !== 'object' || Array.isArray(source)) return;
      keys.forEach(key => {
        if (source[key] !== undefined && source[key] !== null && source[key] !== '') values.push(source[key]);
      });
    };
    sources.forEach(add);
    for (const value of values) {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'number' && (value === 0 || value === 1)) return value === 1;
      const text = String(value).trim().toLowerCase();
      if (['true', '1', 'yes', 'on', 'active', 'favorited', 'followed', 'collected', 'starred', '已收藏', '收藏'].includes(text)) return true;
      if (['false', '0', 'no', 'off', 'inactive', 'unfavorited', 'unfollowed', 'uncollected', 'unstarred', '未收藏'].includes(text)) return false;
    }
    return null;
  }

  function normalizeRoleTags(...sources) {
    const found = new Map();
    const addText = value => {
      String(value ?? '').split(/[,，、|]/).forEach(part => {
        const tag = part.trim().replace(/^#+/, '');
        if (!tag) return;
        const key = tag.toLocaleLowerCase('zh-CN');
        if (!found.has(key)) found.set(key, tag);
      });
    };
    const addValue = value => {
      if (value == null || value === '') return;
      if (Array.isArray(value)) {
        value.forEach(addValue);
        return;
      }
      if (typeof value === 'object') {
        const label = value.name ?? value.tagName ?? value.label ?? value.title ?? value.value ?? value.text;
        if (label != null && label !== '') addText(label);
        return;
      }
      addText(value);
    };
    const fields = ['tags', 'tagList', 'tagNames', 'characterTags', 'labels', 'categories', 'categoryNames'];
    sources.forEach(source => {
      if (Array.isArray(source) || typeof source === 'string') {
        addValue(source);
        return;
      }
      if (!source || typeof source !== 'object') return;
      fields.forEach(field => addValue(source[field]));
    });
    return [...found.values()];
  }

  function normalize(row) {
    const character = row?.character || row?.characterInfo || row?.characterData || row?.role || {};
    const author = row?.author || row?.authorInfo || row?.creator || row?.creatorInfo || row?.user || row?.userInfo || row?.owner
      || row?.createdBy || row?.createdByUser || character?.author || character?.authorInfo || character?.creator || character?.creatorInfo
      || character?.user || character?.userInfo || character?.owner || character?.createdBy || {};
    const value = (...keys) => keys.map(key => row?.[key] ?? character?.[key]).find(item => item != null && item !== '');
    // 已经标准化过的记录必须保持幂等：favoriteKnown=false 表示来源没有提供收藏状态，
    // 不能因为内部补出的 isFavorite=false，在第二次 normalize 时变成“明确未收藏”。
    const favoriteState = row?.favoriteKnown === false
      ? null
      : row?.favoriteKnown === true
        ? Boolean(row?.isFavorite)
        : favoriteStatusFrom(row, character);
    return {
      characterId: String(value('characterId', 'id', 'roleId', 'character_id', 'characterID', 'role_id', 'roleID') || ''),
      lastSessionId: String(value('lastSessionId', 'sessionId') || ''),
      name: String(value('name', 'characterName', 'character_name', 'roleName', 'role_name', 'charName', 'characterTitle', 'displayName', 'title') || '未命名角色'),
      avatarUrl: String(value('avatarUrl', 'avatar', 'imageUrl', 'coverUrl', 'cover', 'icon') || ''),
      lastInteracted: String(value('lastInteracted', 'updatedAt', 'lastChatAt') || ''),
      isFollowed: favoriteState === true,
      isFavorite: favoriteState === true,
      favoriteKnown: favoriteState !== null,
      favoriteNeedsDetail: Boolean(row?.favoriteNeedsDetail),
      authorId: String(value('authorId', 'creatorId', 'userId', 'author_id', 'creator_id', 'user_id') || author?.id || author?.userId || author?.user_id || ''),
      authorName: String(value('authorName', 'creatorName', 'userName', 'ownerName', 'createdByName', 'createdByNickname', 'authorNickname', 'authorNickName', 'creatorNickname', 'creatorNickName', 'creatorUsername', 'nickname', 'nickName', 'username', 'displayName')
        || authorNameFrom(author) || ''),
      visibility: visibilityFrom({ ...row, ...character }),
      availability: String(value('availability', 'status') || ''),
      tags: normalizeRoleTags(row, character),
      metadataError: String(row?.metadataError || ''),
      metadataErrorCode: Number(row?.metadataErrorCode) || 0,
      metadataChecked: Boolean(row?.metadataChecked)
    };
  }

  function authorNameFrom(author) {
    if (typeof author === 'string') return author;
    if (!author || typeof author !== 'object') return '';
    return author.name || author.nickname || author.nickName || author.username || author.displayName
      || author.userName || author.userNickname || author.userNickName || author.profile?.name
      || author.profile?.nickname || author.userInfo?.name || author.userInfo?.nickname
      || author.userInfo?.nickName || '';
  }

  function visibilityFrom(row) {
    const rawVisibility = row?.visibility;
    const textVisibility = String(rawVisibility ?? '').trim().toLowerCase();
    if (['公开', 'public', 'open', '全网公开'].includes(textVisibility)) return '公开';
    if (['仅链接', 'link', 'link_only', 'only_link', 'unlisted', '私密链接'].includes(textVisibility)) return '仅链接';
    if (['私密', '非公开', '仅链接/非公开', 'private', 'closed', 'nonpublic', 'non-public'].includes(textVisibility)) return '私密';
    const numericVisibility = Number(rawVisibility);
    if (numericVisibility === 2) return '公开';
    if (numericVisibility === 3) return '仅链接';
    for (const field of ['isPublic', 'public', 'isPubliclyVisible', 'sharePublic', 'isSharePublic']) {
      if (typeof row?.[field] === 'boolean') return row[field] ? '公开' : '私密';
    }
    for (const field of ['isPrivate', 'private', 'isLinkOnly', 'linkOnly']) {
      if (typeof row?.[field] !== 'boolean') continue;
      if (field === 'isLinkOnly' || field === 'linkOnly') return row[field] ? '仅链接' : '公开';
      return row[field] ? '私密' : '公开';
    }
    const values = [row?.visibility, row?.visibilityType, row?.shareType, row?.accessType, row?.permission]
      .map(value => String(value ?? '').trim().toLowerCase()).filter(Boolean);
    if (values.some(value => ['public', '公开', 'open', '全网公开'].includes(value))) return '公开';
    if (values.some(value => ['link', 'link_only', 'only_link', 'unlisted', '仅链接', '私密链接'].includes(value))) return '仅链接';
    if (values.some(value => ['private', 'closed', 'nonpublic', 'non-public', '私密', '非公开'].includes(value))) return '私密';
    return '未知';
  }

  function authorKey(row) {
    if (row.authorId) return `id:${row.authorId}`;
    if (row.authorName && row.authorName !== '未知作者' && !isDefaultAuthorName(row.authorName)) return `name:${String(row.authorName).trim()}`;
    return `unknown:${row.characterId}`;
  }

  function isDefaultAuthorName(value) {
    const name = String(value || '').trim().replace(/\s+/g, ' ');
    if (!name) return true;
    return /^(未知作者|未知用户|匿名作者|匿名用户|默认作者|默认用户|默认名称|默认昵称|作者|用户|未命名作者|未命名用户|未设置|无名氏|暂无作者|暂无用户|访客|游客|新用户|新作者|mufy用户|mufy user|mufyer|unknown|anonymous|default)$/i.test(name);
  }

  function authorLabel(row) {
    if (!row.authorName && !row.authorId && row.availability === '角色已删除') return '角色已删除，无法读取作者';
    return row.authorName || (row.authorId ? `作者 ID ${row.authorId}（接口未返回作者名称）` : '未知作者（接口未返回作者信息）');
  }

  function mergeRole(existing, incoming) {
    if (!incoming || typeof incoming !== 'object') return existing || {};
    if (!existing || typeof existing !== 'object') return normalize(incoming);
    return {
      ...existing,
      ...incoming,
      name: existing.name || incoming.name,
      avatarUrl: existing.avatarUrl || incoming.avatarUrl,
      lastSessionId: existing.lastSessionId || incoming.lastSessionId,
      lastInteracted: existing.lastInteracted || incoming.lastInteracted,
      authorId: existing.authorId || incoming.authorId,
      authorName: existing.authorName || incoming.authorName,
      tags: normalizeRoleTags(existing?.tags, incoming?.tags),
      visibility: incoming.metadataChecked
        ? visibilityFrom(incoming)
        : visibilityFrom(existing) !== '未知'
          ? visibilityFrom(existing)
          : visibilityFrom(incoming),
      availability: incoming.metadataChecked
        ? String(incoming.availability || '')
        : existing.availability || incoming.availability,
      metadataError: incoming.metadataError !== undefined ? incoming.metadataError : existing.metadataError || '',
      metadataErrorCode: incoming.metadataErrorCode !== undefined ? Number(incoming.metadataErrorCode) || 0 : Number(existing.metadataErrorCode) || 0,
      metadataChecked: incoming.metadataChecked !== undefined ? Boolean(incoming.metadataChecked) : Boolean(existing.metadataChecked),
      // 明确的新状态覆盖旧状态；来源没给状态时才沿用旧值。
      isFavorite: incoming.favoriteNeedsDetail
        ? Boolean(existing.isFavorite)
        : incoming.favoriteKnown === true
          ? Boolean(incoming.isFavorite)
          : Boolean(existing.isFavorite),
      favoriteKnown: incoming.favoriteNeedsDetail
        ? Boolean(existing.favoriteKnown)
        : incoming.favoriteKnown === true || existing.favoriteKnown === true,
      favoriteNeedsDetail: Boolean(incoming.favoriteNeedsDetail && existing.favoriteKnown !== true)
    };
  }

  function normalizeMask(row) {
    const maskId = String(row?.maskId ?? row?.id ?? '');
    const createdAt = String(row?.createdAt || row?.createTime || '');
    const fallbackDate = createdAt && !Number.isNaN(new Date(createdAt).getTime())
      ? new Date(createdAt).toLocaleString('zh-CN')
      : '';
    return {
      maskId,
      name: String(row?.remark || fallbackDate || row?.maskName || '未命名面具'),
      maskName: String(row?.maskName || ''),
      remark: String(row?.remark || ''),
      gender: String(row?.gender || ''),
      createdAt,
      description: String(row?.description || ''),
      favorite: cloneValue(row?.favorite ?? ''),
      command: cloneValue(row?.command ?? '')
    };
  }

  function maskContentIdentity(row) {
    return JSON.stringify([
      row?.maskName || '', row?.remark || '', row?.gender || '',
      row?.description || '', row?.favorite ?? '', row?.command ?? ''
    ]);
  }

  function maskIdentity(row) {
    const maskId = String(row?.maskId || row?.sourceMaskId || '').trim();
    return maskId ? `id:${maskId}|content:${maskContentIdentity(row)}` : `content:${maskContentIdentity(row)}`;
  }

  function sameMaskContent(left, right) {
    return maskContentIdentity(left) === maskContentIdentity(right);
  }

  function dedupeMasks(rows) {
    const found = new Map();
    for (const row of Array.isArray(rows) ? rows : []) {
      const key = maskIdentity(row);
      if (!found.has(key)) found.set(key, row);
    }
    return [...found.values()];
  }

  function visibleLibraryRows() {
    // 本地库是历史备份，必须和网站当前面具分开显示；相同 ID 也不能隐藏备份。
    return state.library;
  }

  function maskSnapshot(row, options = {}) {
    return {
      libraryId: options.libraryId || makeLibraryId(),
      sourceMaskId: String(row?.maskId || row?.sourceMaskId || ''),
      name: String(options.name || row?.name || row?.remark || row?.maskName || '未命名面具'),
      maskName: String(row?.maskName || ''),
      remark: String(row?.remark || ''),
      gender: String(row?.gender || ''),
      createdAt: String(row?.createdAt || row?.createTime || ''),
      description: String(row?.description || ''),
      favorite: cloneValue(row?.favorite ?? ''),
      command: cloneValue(row?.command ?? ''),
      storedAt: options.storedAt || new Date().toISOString()
    };
  }

  function maskCopyText(row) {
    const id = String(row?.maskId || row?.sourceMaskId || '').trim() || '未知';
    const displayName = String(row?.name || row?.remark || row?.maskName || '未命名面具');
    const section = (label, value) => `${label}：\n${maskEditorText(value).trim() || '（空）'}`;
    return [
      `面具：${displayName}`,
      `面具 ID：${id}`,
      `备注：${String(row?.remark || '').trim() || '（空）'}`,
      `名称：${String(row?.maskName || '').trim() || '（空）'}`,
      `性别：${String(row?.gender || '').trim() || '（空）'}`,
      '',
      section('我的描述', row?.description),
      '',
      section('我的喜好', row?.favorite),
      '',
      section('指令', row?.command)
    ].join('\n');
  }

  async function writeClipboardText(text) {
    let clipboardError = null;
    if (pageWindow.navigator?.clipboard?.writeText) {
      try {
        await pageWindow.navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        clipboardError = error;
      }
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw clipboardError || new Error('浏览器拒绝访问剪贴板');
  }

  async function copyMaskInfo(row) {
    try {
      await writeClipboardText(maskCopyText(row));
      state.status = `已复制面具“${row?.name || row?.remark || row?.maskName || '未命名面具'}”的完整信息。`;
    } catch (error) {
      appendRunLog('error', '复制面具信息失败', error);
      state.status = `复制面具信息失败：${explainFailure(error)}`;
    }
    render();
  }

  async function copyMaskEditorField(fieldName, label) {
    const editor = panel?.querySelector('#mufy-recovery-mask-editor');
    const field = editor?.querySelector(`[name="${fieldName}"]`);
    if (!editor || editor.hidden || !field) return;
    try {
      await writeClipboardText(String(field.value || ''));
      state.status = field.value ? `已复制“${label}”。` : `“${label}”当前为空，已复制空内容。`;
    } catch (error) {
      appendRunLog('error', `复制面具字段“${label}”失败`, error);
      state.status = `复制“${label}”失败：${explainFailure(error)}`;
    }
    const status = panel?.querySelector('#mufy-recovery-status');
    if (status) status.textContent = state.status;
  }

  function siteSlotNumbers(row) {
    return state.currentSiteMasks
      .map((siteMask, index) => sameMaskContent(siteMask, row) ? String(index + 1) : '')
      .filter(Boolean);
  }

  function saveUndo(label, siteRestore = null) {
    state.undoLibrary = cloneValue(state.library);
    state.undoBindings = cloneValue(state.maskBindings);
    state.undoLabel = label;
    state.undoSite = siteRestore ? cloneValue(siteRestore) : null;
  }

  async function undoLastLibraryChange() {
    if (!state.undoLibrary) return;
    const library = state.undoLibrary;
    const bindings = state.undoBindings;
    const label = state.undoLabel;
    const siteRestore = state.undoSite;
    state.loading = Boolean(siteRestore);
    state.status = siteRestore ? '正在撤回上一次网站面具变更……' : '正在撤回上一次面具库变更……';
    render();
    try {
      if (siteRestore) {
        if (siteRestore.mode === 'created') await deleteMask(siteRestore.maskId);
        else await updateMask(siteRestore.maskId, siteRestore.source);
      }
      state.library = library;
      if (bindings) {
        state.maskBindings = bindings;
        persistMaskBindings();
      }
      state.undoLibrary = null;
      state.undoBindings = null;
      state.undoLabel = '';
      state.undoSite = null;
      persistMaskLibrary();
      if (siteRestore) {
        const refreshed = await fetchCurrentSiteMasks();
        state.currentSiteMasks = refreshed.slice();
        state.masks = refreshed;
        state.siteMaskIds = state.masks.map(row => row.maskId);
      }
      state.status = `已撤回${label ? `：${label}` : '上一次本地变更'}。`;
    } catch (error) {
      state.status = `撤回失败：${explainFailure(error)}`;
    } finally {
      state.loading = false;
      render();
    }
  }

  function maskUpdatePayload(targetMaskId, source) {
    const text = value => {
      if (value == null) return '';
      if (typeof value === 'string') return value;
      try { return JSON.stringify(value); } catch (_) { return String(value); }
    };
    return {
      maskId: Number.isSafeInteger(Number(targetMaskId)) ? Number(targetMaskId) : String(targetMaskId || ''),
      remark: text(source?.remark),
      maskName: text(source?.maskName),
      gender: text(source?.gender),
      description: text(source?.description),
      favorite: text(source?.favorite),
      command: text(source?.command)
    };
  }

  function isOlderThanTwoMonths(dateText) {
    const date = new Date(dateText);
    if (Number.isNaN(date.getTime())) return false;
    const boundary = new Date();
    boundary.setMonth(boundary.getMonth() - 2);
    boundary.setDate(1);
    boundary.setHours(0, 0, 0, 0);
    return date < boundary;
  }

  async function requestPage(pageNum, isFollowed, pageParameter = 'pageNum') {
    scanStoredAuthorization();
    const url = new URL('/api/characters/query_session', location.origin);
    url.searchParams.set(pageParameter, String(pageNum));
    url.searchParams.set('pageSize', '20');
    url.searchParams.set('isFollowed', String(isFollowed));

    const headers = { Accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const response = await pageWindow.fetch(url.href, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers
    });
    if (response.status === 429) throw new RateLimitError('角色列表');
    if (response.status === 401 || response.status === 403) {
      throw new Error(loginErrorMessage(response.status, '读取角色列表'));
    }
    if (!response.ok) throw new Error(`接口请求失败（HTTP ${response.status}）`);
    const body = await response.json();
    if (body?.code !== 200 || !body?.data) throw new Error(body?.reason || body?.message || '接口返回异常');
    return body.data;
  }

  function pageHasMore(data, rows, pageSize, page) {
    const sources = [
      data,
      data?.data,
      data?.result,
      data?.pagination,
      data?.data?.pagination,
      data?.result?.pagination
    ].filter(source => source && typeof source === 'object' && !Array.isArray(source));
    const numberFrom = keys => {
      for (const source of sources) {
        for (const key of keys) {
          if (source[key] == null || source[key] === '') continue;
          const value = Number(source[key]);
          if (Number.isFinite(value)) return value;
        }
      }
      return NaN;
    };
    const totalPages = numberFrom(['totalPages', 'pageCount', 'pages']);
    if (Number.isFinite(totalPages) && totalPages > 0) return page < totalPages;
    const hasNext = sources.find(source => typeof source.hasNext === 'boolean')?.hasNext;
    if (typeof hasNext === 'boolean') return hasNext;
    const hasMore = sources.find(source => typeof source.hasMore === 'boolean')?.hasMore;
    if (typeof hasMore === 'boolean') return hasMore;
    const total = numberFrom(['total', 'totalCount', 'count']);
    const responsePageSize = numberFrom(['pageSize', 'size', 'limit']);
    const responsePage = numberFrom(['pageNum', 'page', 'currentPage', 'current']);
    const effectivePageSize = Number.isFinite(responsePageSize) && responsePageSize > 0 ? responsePageSize : pageSize;
    const effectivePage = Number.isFinite(responsePage) && responsePage >= 0 ? responsePage : page;
    if (Number.isFinite(total) && total >= 0) {
      const consumedPages = effectivePage === 0 ? 1 : effectivePage;
      return consumedPages * effectivePageSize < total;
    }
    if (!rows.length) return false;
    return rows.length >= pageSize;
  }

  function extractCharacterRows(data) {
    if (Array.isArray(data)) return data;
    const candidates = [data?.data, data?.rows, data?.list, data?.records, data?.items, data?.content, data?.results];
    for (const value of candidates) {
      if (Array.isArray(value)) return value;
      if (value && typeof value === 'object') {
        const nested = extractCharacterRows(value);
        if (nested.length) return nested;
      }
    }
    return [];
  }

  async function fetchAll(isFollowed, label, maxPages = 500, startPage = 1) {
    const found = new Map();
    const seenPages = new Set();
    let paused = false;
    let nextPage = startPage;
    let consecutiveEmptyPages = 0;
    for (let page = startPage; page <= maxPages; page += 1) {
      if (state.rolePauseRequested) {
        paused = true;
        nextPage = page;
        break;
      }
      state.status = `正在读取${label}第 ${page} 页，已找到 ${found.size} 条……`;
      render();
      let data = await requestPage(page, isFollowed);
      nextPage = page + 1;
      let rows = extractCharacterRows(data);
      let normalizedRows = rows.map(normalize).filter(row => row.characterId).map(row => (
        isFollowed ? { ...row, isFavorite: true, isFollowed: true, favoriteKnown: true } : row
      ));
      let hasMore = pageHasMore(data, rows, 20, page);

      // 某些账号的接口会偶发返回空页，但分页元数据仍明确表示后面还有数据。
      // 重试两次后再跳过该页，避免一次临时空响应截断整个历史列表。
      if (!normalizedRows.length && hasMore) {
        for (let attempt = 1; attempt <= 2 && !normalizedRows.length; attempt += 1) {
          state.status = `${label}第 ${page} 页暂时为空，正在重试 ${attempt}/2……`;
          render();
          await wait(350 * attempt);
          data = await requestPage(page, isFollowed);
          rows = extractCharacterRows(data);
          normalizedRows = rows.map(normalize).filter(row => row.characterId).map(row => (
            isFollowed ? { ...row, isFavorite: true, isFollowed: true, favoriteKnown: true } : row
          ));
          hasMore = pageHasMore(data, rows, 20, page);
        }
      }

      let pageSignature = normalizedRows.map(row => String(row.characterId)).join('|');
      if (pageSignature && seenPages.has(pageSignature)) {
        // 部分接口变体只识别 page 而不是 pageNum。仅在确认重复页后尝试备用参数，
        // 不改变正常账号原有的请求方式。
        state.status = `${label}第 ${page} 页与前页重复，正在尝试备用分页参数……`;
        render();
        const alternateData = await requestPage(page, isFollowed, 'page');
        const alternateRows = extractCharacterRows(alternateData);
        const alternateNormalized = alternateRows.map(normalize).filter(row => row.characterId).map(row => (
          isFollowed ? { ...row, isFavorite: true, isFollowed: true, favoriteKnown: true } : row
        ));
        const alternateSignature = alternateNormalized.map(row => String(row.characterId)).join('|');
        if (alternateSignature && !seenPages.has(alternateSignature)) {
          data = alternateData;
          rows = alternateRows;
          normalizedRows = alternateNormalized;
          pageSignature = alternateSignature;
          hasMore = pageHasMore(data, rows, 20, page);
          appendRunLog('info', `${label}第 ${page} 页已自动切换为 page 分页参数。`);
        } else {
          appendRunLog('warn', `${label}第 ${page} 页重复，pageNum 与 page 两种参数都没有取得新数据，已停止继续翻页。`);
          break;
        }
      }

      if (!normalizedRows.length) {
        consecutiveEmptyPages += 1;
        appendRunLog('warn', `${label}第 ${page} 页重试后仍为空${hasMore ? '，但接口表示仍有下一页' : ''}。`);
        if (!hasMore || consecutiveEmptyPages >= 3) break;
        continue;
      }
      consecutiveEmptyPages = 0;
      seenPages.add(pageSignature);
      normalizedRows.forEach(row => {
        found.set(row.characterId, row);
      });
      if (!hasMore) break;
      await wait(ROLE_REQUEST_INTERVAL_MS);
    }
    return { rows: [...found.values()], paused, nextPage };
  }

  function clearLegacyUnavailableStatus(row) {
    if (!row || typeof row !== 'object') return row;
    const error = String(row.metadataError || '');
    const wasLegacyGuess = (row.availability === '分享已失效' && /HTTP 503。角色的分享链接已经失效/.test(error))
      || (row.availability === '角色已删除' && /HTTP 500。角色已被删除/.test(error));
    if (!wasLegacyGuess) return row;
    return { ...row, availability: '', metadataChecked: false, metadataError: '旧版把分享状态或 HTTP 状态误作角色状态，等待重新检测', metadataErrorCode: 0 };
  }

  function explicitCharacterDeleted(body, raw = '') {
    const codes = [body?.error, body?.errorCode, body?.reasonCode, body?.data?.error, body?.data?.errorCode]
      .filter(value => value != null).map(value => String(value).trim().toLowerCase());
    const text = `${codes.join(' ')} ${String(raw || '')}`.toLowerCase();
    return codes.some(code => ['character_deleted', 'character_not_found', 'role_deleted', 'role_not_found', 'character removed by creator'].includes(code))
      || /角色.{0,18}(?:已被.{0,10}删除|已删除|不存在|找不到|已下架)/.test(text)
      || /(?:character|role).{0,30}(?:removed by creator|deleted|not found|does not exist)/i.test(text);
  }

  function isShareLinkResponse(body, raw = '') {
    const codes = [body?.error, body?.errorCode, body?.reasonCode, body?.data?.error, body?.data?.errorCode]
      .filter(value => value != null).map(value => String(value).trim().toLowerCase());
    const text = `${codes.join(' ')} ${String(raw || '')}`.toLowerCase();
    return codes.some(code => ['share_link_expired', 'share_expired', 'invalid_share_link'].includes(code))
      || /分享(?:链接|码).{0,12}(?:失效|过期|不存在)/.test(text)
      || /share.{0,16}(?:expired|invalid|not found)/i.test(text);
  }

  async function requestCharacterDetail(characterId, signal) {
    const url = new URL('/api/characters/get', location.origin);
    url.searchParams.set('id', characterId);
    const headers = { Accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;
    try {
      let response = await pageWindow.fetch(url.href, { method: 'GET', credentials: 'include', headers, signal });
      // 网页可能已经用 Cookie 刷新登录，但脚本内存里仍保留旧 Bearer。
      // 服务端会优先校验这个旧令牌并返回 401/403，因此去掉它后用当前 Cookie 重试一次。
      if ((response.status === 401 || response.status === 403) && headers.Authorization) {
        authorization = '';
        response = await pageWindow.fetch(url.href, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
          signal
        });
      }
      const raw = await response.text();
      let body = null;
      try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
      const apiSucceeded = response.ok && (body?.code == null || Number(body.code) === 200);
      if (!apiSucceeded) {
        if (response.status === 429) throw new RateLimitError('角色详情');
        const error = new Error(`角色详情返回 HTTP ${response.status}${body?.message ? `：${body.message}` : body?.reason ? `：${body.reason}` : ''}`);
        if (explicitCharacterDeleted(body, raw)) {
          return { availability: '角色已删除', metadataError: explainFailure(error), metadataErrorCode: response.status, metadataChecked: true };
        }
        if (isShareLinkResponse(body, raw)) {
          state.sessionlessRoleIds.add(String(characterId));
          saveSessionlessRoleIds();
          const explanation = '角色详情明确返回 share_link_expired；已只对该角色改用不含 sessionId 的链接，等待打开后二次验证。';
          return { availability: '分享已失效', metadataError: explanation, metadataErrorCode: response.status, metadataChecked: true };
        }
        const explanation = explainFailure(error);
        metadataFailureReasons.add(explanation);
        // 鉴权失败和临时 HTTP 错误不代表资料已经检查完成；保留旧状态并允许下次重试。
        return { metadataError: explanation, metadataErrorCode: response.status, metadataChecked: false };
      }
      const detail = body?.data?.data || body?.data || body?.character || body;
      return detail && typeof detail === 'object' ? normalize({ ...detail, characterId, metadataChecked: true }) : { metadataChecked: true };
    } catch (error) {
      if (error?.name === 'AbortError') throw error;
      if (error instanceof RateLimitError) throw error;
      const explanation = explainFailure(error);
      metadataFailureReasons.add(explanation);
      return { metadataError: explanation, metadataErrorCode: Number(error?.status) || 0, metadataChecked: false };
    }
  }

  async function requestAuthorProfile(userId, signal) {
    if (authorProfileCache.has(userId)) return authorProfileCache.get(userId);
    const url = new URL('/api/users/profiles', location.origin);
    url.searchParams.set('userId', userId);
    const headers = { Accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;
    try {
      let response = await pageWindow.fetch(url.href, { method: 'GET', credentials: 'include', headers, signal });
      if ((response.status === 401 || response.status === 403) && headers.Authorization) {
        authorization = '';
        response = await pageWindow.fetch(url.href, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
          signal
        });
      }
      if (response.status === 429) throw new RateLimitError('作者资料');
      const raw = await response.text();
      let body = null;
      try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
      if (!response.ok || body?.code !== 200) {
        if (response.status !== 500 && response.status !== 503) {
          metadataFailureReasons.add(explainFailure(new Error(`作者资料返回 HTTP ${response.status}${body?.message ? `：${body.message}` : body?.reason ? `：${body.reason}` : ''}`)));
        }
        return null;
      }
      const profile = body?.data?.data || body?.data || body?.profile || body;
      if (!profile || typeof profile !== 'object') return null;
      const name = String(profile.username || profile.nickname || profile.nickName || profile.name || profile.displayName || '');
      if (name) {
        authorProfileCache.set(userId, name);
        saveAuthorProfileCache();
      }
      return name;
    } catch (error) {
      if (error?.name === 'AbortError') throw error;
      if (error instanceof RateLimitError) throw error;
      metadataFailureReasons.add(explainFailure(error));
      return null;
    }
  }

  async function enrichRoles(rows) {
    const targets = rows.filter(row => !isUnavailable(row) && (!row.metadataChecked || !row.authorName));
    const enriched = new Map(rows.map(row => [row.characterId, row]));
    const statusResult = await runMetadataQueue(targets, '角色状态', async (row, signal) => {
      const detail = await requestCharacterDetail(row.characterId, signal);
      if (detail) {
        const merged = mergeRole(row, detail);
        if (detail.availability) merged.availability = detail.availability;
        merged.metadataError = detail.metadataError || '';
        merged.metadataErrorCode = Number(detail.metadataErrorCode) || 0;
        enriched.set(row.characterId, merged);
      }
    });
    const authorIds = [...new Set([...enriched.values()]
      .filter(row => row.authorId && !row.authorName)
      .map(row => row.authorId))];
    const authorNames = new Map();
    const authorResult = statusResult.rateLimited || statusResult.stopped
      ? { rateLimited: false, stopped: statusResult.stopped, completed: 0, total: authorIds.length }
      : await runMetadataQueue(authorIds, '作者名称', async (authorId, signal) => {
      const name = await requestAuthorProfile(authorId, signal);
      if (name) authorNames.set(authorId, name);
    });
    if (authorNames.size) {
      for (const [characterId, row] of enriched) {
        const name = authorNames.get(row.authorId);
        if (name && !row.authorName) enriched.set(characterId, mergeRole(row, { authorName: name }));
      }
    }
    return {
      rows: [...enriched.values()],
      rateLimited: statusResult.rateLimited || authorResult.rateLimited,
      stopped: statusResult.stopped || authorResult.stopped,
      completed: statusResult.completed + authorResult.completed,
      total: statusResult.total + authorResult.total
    };
  }

  async function runMetadataQueue(items, label, runItem) {
    let nextIndex = 0;
    let completed = 0;
    let rateLimited = false;
    let nextStartAt = Date.now();
    const inFlight = new Set();
    const startItem = (item) => {
      let task;
      const controller = typeof pageWindow.AbortController === 'function' ? new pageWindow.AbortController() : null;
      if (controller) state.metadataAbortControllers.add(controller);
      let aborted = false;
      task = (async () => {
        try {
          await runItem(item, controller?.signal);
        } catch (error) {
          if (error?.name === 'AbortError') aborted = true;
          else if (error instanceof RateLimitError) rateLimited = true;
          else metadataFailureReasons.add(explainFailure(error));
        } finally {
          if (controller) state.metadataAbortControllers.delete(controller);
          if (!aborted) completed += 1;
          state.status = `正在更新${label}：已完成 ${completed}/${items.length}${rateLimited ? '；检测到限流，已暂停' : state.metadataStopRequested ? '；正在停止' : ''}……`;
          render();
        }
      })().finally(() => inFlight.delete(task));
      inFlight.add(task);
    };
    while (nextIndex < items.length && !rateLimited && !state.metadataStopRequested) {
      while (inFlight.size >= METADATA_MAX_IN_FLIGHT && !rateLimited && !state.metadataStopRequested) await Promise.race(inFlight);
      if (rateLimited || state.metadataStopRequested) break;
      const delay = nextStartAt - Date.now();
      if (delay > 0) await wait(delay);
      if (rateLimited || state.metadataStopRequested) break;
      nextStartAt = Date.now() + METADATA_REQUEST_INTERVAL_MS;
      startItem(items[nextIndex]);
      nextIndex += 1;
    }
    await Promise.all(inFlight);
    return { rateLimited, stopped: state.metadataStopRequested && !rateLimited, completed, total: items.length };
  }

  const MASK_PAGE_SIZE = 20;

  async function requestMaskPage(page, search = '', pageSize = MASK_PAGE_SIZE) {
    const url = new URL('/api/masks/query', location.origin);
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const requestOptions = {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers,
      body: JSON.stringify({
        page,
        pageSize,
        priorityMaskIds: state.currentSiteMasks.map(row => Number(row.maskId)).filter(Number.isFinite),
        ...(search ? { search } : {})
      })
    };
    let response = await pageWindow.fetch(url.href, requestOptions);
    // Mufy 页面加载后偶尔会保留或发出一枚旧 Bearer。服务器会优先拒绝
    // 这枚旧令牌，即使当前浏览器的 Cookie 登录仍然有效；去掉它重试可避免
    // 出现“页面未加载完能读取，加载完成反而显示没有登录权限”的误报。
    if ((response.status === 401 || response.status === 403) && authorization) {
      const cookieHeaders = new pageWindow.Headers(headers);
      cookieHeaders.delete('Authorization');
      response = await pageWindow.fetch(url.href, { ...requestOptions, headers: cookieHeaders });
      if (response.ok) {
        authorization = '';
        appendRunLog('warn', '面具接口拒绝了页面令牌，已改用当前登录 Cookie 并读取成功。');
      }
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error(`面具接口没有获得登录权限（HTTP ${response.status}）。已同时尝试页面令牌和当前登录 Cookie，请重新登录 Mufy 后再试`);
    }
    if (!response.ok) throw new Error(`面具接口请求失败（HTTP ${response.status}）`);
    const body = await response.json();
    if (body?.code !== 200 || !body?.data) throw new Error(body?.reason || body?.message || '面具接口返回异常');
    return body.data;
  }

  function extractMaskRows(data) {
    if (Array.isArray(data)) return data;
    for (const key of ['data', 'rows', 'list', 'records', 'items', 'content', 'results']) {
      if (Array.isArray(data?.[key])) return data[key];
    }
    if (data?.data && typeof data.data === 'object') return extractMaskRows(data.data);
    return [];
  }

  function maskPageHasNext(data, rows, requestedPageSize, page) {
    const sources = [data, data?.data, data?.result, data?.result?.data, data?.pagination, data?.data?.pagination].filter(Boolean);
    const numberFrom = keys => {
      for (const source of sources) {
        for (const key of keys) {
          if (source?.[key] == null || source[key] === '') continue;
          const value = Number(source?.[key]);
          if (Number.isFinite(value)) return value;
        }
      }
      return NaN;
    };
    const totalPages = numberFrom(['totalPages', 'pageCount', 'pages']);
    if (totalPages > 0) return page < totalPages;
    const total = numberFrom(['total', 'totalCount', 'count']);
    if (total >= 0) return page * requestedPageSize < total;

    // Some responses report hasNext=false even when more pages are available.
    // Continue while a full page is returned; stop on a short or empty page.
    const hasNext = sources.find(source => typeof source?.hasNext === 'boolean')?.hasNext;
    const hasMore = sources.find(source => typeof source?.hasMore === 'boolean')?.hasMore;
    if (hasNext === true || hasMore === true) return true;
    if (hasNext === false || hasMore === false) return rows.length >= requestedPageSize;
    return rows.length >= requestedPageSize;
  }

  async function fetchAllMasks(search = '') {
    const found = new Map();
    let emptyOrRepeatedPages = 0;
    let stopped = false;
    let firstPageRows = [];
    for (let page = 1; page <= 500; page += 1) {
      if (state.maskStopRequested) {
        stopped = true;
        break;
      }
      state.status = `正在读取面具第 ${page} 页，已找到 ${found.size} 个……`;
      render();
      let data;
      try {
        data = await requestMaskPage(page, search);
      } catch (error) {
        if (!state.maskStopRequested) throw error;
        stopped = true;
        break;
      }
      const rows = extractMaskRows(data);
      if (page === 1) firstPageRows = dedupeMasks(rows.map(normalizeMask).filter(row => row.maskId));
      const before = found.size;
      rows.map(normalizeMask).filter(row => row.maskId).forEach(row => found.set(maskIdentity(row), row));
      if (found.size === before) emptyOrRepeatedPages += 1;
      else emptyOrRepeatedPages = 0;
      if (state.maskStopRequested) {
        stopped = true;
        break;
      }
      if (!rows.length || emptyOrRepeatedPages >= 2 || !maskPageHasNext(data, rows, MASK_PAGE_SIZE, page)) break;
    }
    return { rows: dedupeMasks([...found.values()]), firstPageRows, stopped };
  }

  // The list view may contain historical masks across many pages, but binding and
  // slot replacement must only ever operate on the account's current slots.
  async function fetchCurrentSiteMasks() {
    const data = await requestMaskPage(1, '', MASK_PAGE_SIZE);
    const rows = dedupeMasks(extractMaskRows(data).map(normalizeMask).filter(row => row.maskId));
    // Mufy prioritizes the active masks in this response. Keep the hard account
    // limit here as a guard so historical pages can never become slot capacity.
    return rows.slice(0, MAX_SITE_MASKS);
  }

  async function loadCurrentSiteMasks() {
    if (state.loading) return;
    state.loading = true;
    state.active = 'masks';
    state.status = '正在分页读取网站面具……';
    render();
    try {
      const result = await fetchAllMasks('');
      const current = result.firstPageRows;
      state.currentSiteMasks = current.slice();
      state.masks = result.rows;
      state.siteMaskIds = current.map(row => row.maskId);
      state.status = result.stopped
        ? `已停止读取，保留已找到的 ${state.masks.length} 个网站面具。`
        : `已读取网站面具 ${state.masks.length} 个（自动翻页完成）。`;
    } catch (error) {
      state.status = `读取网站面具失败：${explainFailure(error)}`;
      appendRunLog('error', '读取网站面具失败', error);
    } finally {
      state.loading = false;
      render();
    }
  }

  async function recoverMasks() {
    if (state.maskLoading) {
      state.maskStopRequested = true;
      state.status = '正在完成当前面具请求，随后停止搜索；已经找到的面具会保留。';
      render();
      return;
    }
    const input = panel?.querySelector('#mufy-recovery-mask-search');
    const query = input?.value.trim() || '';
    if (!query) {
      state.status = '请先输入面具关键词；点击顶部“面具”会显示当前网站面具。';
      render();
      return;
    }
    state.loading = true;
    state.maskLoading = true;
    state.maskStopRequested = false;
    state.active = 'masks';
    state.status = `正在向服务器搜索面具：“${query}”……`;
    render();
    try {
      const result = await fetchAllMasks(query);
      const matches = result.rows;
      const merged = new Map(dedupeMasks(state.masks).map(row => [maskIdentity(row), row]));
      matches.forEach(row => merged.set(maskIdentity(row), row));
      state.masks = dedupeMasks([...merged.values()]).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      state.status = result.stopped
        ? `已停止面具搜索，保留本次找到的 ${matches.length} 个结果；当前面具列表共 ${state.masks.length} 个。再次点击可重新搜索。`
        : `服务器搜索“${query}”返回 ${matches.length} 个结果；当前面具列表共 ${state.masks.length} 个。`;
    } catch (error) {
      state.status = `服务器搜索失败：${explainFailure(error)}`;
      appendRunLog('error', `面具搜索失败：${query}`, error);
    } finally {
      state.maskLoading = false;
      state.maskStopRequested = false;
      state.loading = false;
      render();
    }
  }

  function addMaskToLibrary(mask, name) {
    const snapshot = maskSnapshot(mask, { name });
    const duplicate = state.library.findIndex(item => sameMaskContent(item, snapshot));
    if (duplicate >= 0) {
      state.status = `“${snapshot.name}”已经在本地面具库中，未覆盖原备份。`;
      render();
      return;
    }
    saveUndo('存入面具');
    state.library.unshift(snapshot);
    persistMaskLibrary();
    state.status = `“${snapshot.name}”已保存到本地面具库。`;
    render();
  }

  function addAllMasksToLibrary() {
    if (!state.masks.length) return;
    let added = 0;
    const before = state.library.length;
    const previousLibrary = cloneValue(state.library);
    dedupeMasks(state.masks).forEach(mask => {
      const snapshot = maskSnapshot(mask);
      const duplicate = state.library.findIndex(item => sameMaskContent(item, snapshot));
      if (duplicate < 0) {
        state.library.push(snapshot);
        added += 1;
      }
    });
    if (state.library.length > before) {
      // 同时保存绑定快照，撤回批量导入/保存时不会丢失本地绑定信息。
      state.undoLibrary = previousLibrary;
      state.undoBindings = cloneValue(state.maskBindings);
      state.undoLabel = '批量存入面具';
      state.undoSite = null;
    }
    persistMaskLibrary();
    state.status = added
      ? `已将 ${added} 个网站面具备份到本地面具库；已有备份未覆盖。`
      : '网站当前面具都已经有相同备份，未重复写入。';
    render();
  }

  async function updateMask(targetMaskId, source) {
    const url = new URL('/api/masks/update', location.origin);
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const payload = maskUpdatePayload(targetMaskId, source);
    let response;
    try {
      response = await pageWindow.fetch(url.href, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(payload)
      });
    } catch (error) {
      throw new Error(`请求未发出：${error?.message || error}`);
    }
    const raw = await response.text();
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
    const detail = body?.reason || body?.message || body?.error || raw || '服务器没有返回错误说明';
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(`HTTP ${response.status}：没有面具更新权限或登录令牌已失效。服务器：${detail}`);
      }
      throw new Error(`HTTP ${response.status} ${response.statusText || ''}：${detail}`.trim());
    }
    if (body?.code !== 200) throw new Error(`接口返回 code ${body?.code ?? '未知'}：${detail}`);
  }

  function maskContentPayload(source) {
    return {
      remark: String(source?.remark ?? ''),
      maskName: String(source?.maskName ?? ''),
      gender: String(source?.gender ?? ''),
      description: String(source?.description ?? ''),
      favorite: cloneValue(source?.favorite ?? ''),
      command: cloneValue(source?.command ?? '')
    };
  }

  async function createMask(source) {
    const url = new URL('/api/masks/create', location.origin);
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (authorization) headers.Authorization = authorization;
    let response;
    try {
      response = await pageWindow.fetch(url.href, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(maskContentPayload(source))
      });
    } catch (error) {
      throw new Error(`请求未发出：${error?.message || error}`);
    }
    const raw = await response.text();
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
    const detail = body?.reason || body?.message || body?.error || raw || '服务器没有返回错误说明';
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(`HTTP ${response.status}：没有新增面具权限或登录令牌已失效。服务器：${detail}`);
      }
      throw new Error(`HTTP ${response.status} ${response.statusText || ''}：${detail}`.trim());
    }
    if (body?.code !== 200) throw new Error(`接口返回 code ${body?.code ?? '未知'}：${detail}`);
    const created = Array.isArray(body?.data) ? body.data[0] : body?.data;
    return created && typeof created === 'object' ? normalizeMask(created) : null;
  }

  async function deleteMask(maskId) {
    const url = new URL('/api/masks/delete', location.origin);
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const response = await pageWindow.fetch(url.href, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ maskId: Number.isSafeInteger(Number(maskId)) ? Number(maskId) : String(maskId || '') })
    });
    const raw = await response.text();
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
    const detail = body?.reason || body?.message || body?.error || raw || '服务器没有返回错误说明';
    if (!response.ok || body?.code !== 200) {
      throw new Error(`删除面具失败（HTTP ${response.status}）：${detail}`);
    }
  }

  function bindingMaskId(mask) {
    const value = mask?.maskId || mask?.sourceMaskId || '';
    return String(value).trim();
  }

  function knownCharacters() {
    const found = new Map();
    [...state.chatted, ...state.favoriteOnly].forEach(row => {
      if (row?.characterId && !found.has(row.characterId)) found.set(row.characterId, row);
    });
    return [...found.values()];
  }

  function knownBindingMasks() {
    const found = new Map();
    const sources = [
      ...state.library.map(row => ({ ...row, _bindingSource: '面具库' })),
      ...state.currentSiteMasks.map(row => ({ ...row, _bindingSource: '网站当前面具' }))
    ];
    sources.forEach(row => {
      const key = maskContentIdentity(row);
      if (!key) return;
      const existing = found.get(key);
      if (!existing) {
        found.set(key, row);
        return;
      }
      const sources = new Set(String(existing._bindingSource || '').split(' / ').filter(Boolean));
      if (row._bindingSource) sources.add(row._bindingSource);
      existing._bindingSource = [...sources].join(' / ');
    });
    return [...found.values()];
  }

  function maskDisplayName(mask) {
    return String(mask?.name || mask?.remark || mask?.maskName || '未命名面具');
  }

  function maskContentFingerprint(mask) {
    const text = maskContentIdentity(mask);
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0').slice(0, 6);
  }

  function maskBindingLabel(mask) {
    return `${maskDisplayName(mask)}（内容 ${maskContentFingerprint(mask)}）`;
  }

  function localBindingForCharacter(characterId) {
    return state.maskBindings.find(row => String(row.characterId) === String(characterId)) || null;
  }

  function resolveLocalBinding(binding) {
    if (!binding) return null;
    if (binding.libraryId) {
      const libraryItem = state.library.find(row => String(row.libraryId) === String(binding.libraryId));
      if (libraryItem) return libraryItem;
      // 导入到另一浏览器后，旧的 libraryId 可能无法映射；只要导出文件带有快照，
      // 就继续使用快照，不要因为 ID 不同而把本地绑定误判成不存在。
    }
    if (binding.snapshot && typeof binding.snapshot === 'object') {
      const matchingLibrary = state.library.find(row => sameMaskContent(row, binding.snapshot));
      return matchingLibrary || binding.snapshot;
    }
    // 旧版只有来源 ID 的绑定无法确认具体内容，不能按复用中的网站槽位 ID 猜测面具。
    return null;
  }

  function maskMatchesBinding(mask, binding) {
    const boundMask = resolveLocalBinding(binding);
    return Boolean(boundMask && mask && sameMaskContent(boundMask, mask));
  }

  function bindingForMask(mask) {
    const libraryId = String(mask?.libraryId || '');
    return {
      libraryId,
      sourceMaskId: bindingMaskId(mask),
      // 网站槽位 ID 会在置换后复用；绑定必须保留当时的面具内容。
      snapshot: libraryId ? null : maskSnapshot(mask),
      name: maskDisplayName(mask)
    };
  }

  function saveLocalMaskBinding(character, mask) {
    const entry = {
      characterId: String(character.characterId),
      characterName: String(character.name || ''),
      ...bindingForMask(mask),
      savedAt: new Date().toISOString()
    };
    state.maskBindings = state.maskBindings.filter(row => String(row.characterId) !== entry.characterId);
    state.maskBindings.push(entry);
    persistMaskBindings();
    return entry;
  }

  function removeLocalMaskBinding(characterId) {
    const before = state.maskBindings.length;
    state.maskBindings = state.maskBindings.filter(row => String(row.characterId) !== String(characterId));
    if (state.maskBindings.length !== before) persistMaskBindings();
  }

  function currentRoleContext() {
    const url = new URL(pageWindow.location.href);
    return {
      characterId: url.searchParams.get('roleId') || '',
      sessionId: url.searchParams.get('sessionId') || ''
    };
  }

  function exactRoleFailureOnPage() {
    const nodes = document.querySelectorAll('h1,h2,h3,[role="alert"],[role="status"],p,span,pre');
    for (const node of nodes) {
      if (!isVisibleElement(node)) continue;
      const text = String(node.textContent || '').trim().replace(/\s+/g, ' ');
      if (!text || text.length > 240) continue;
      if (/share_link_expired|分享链接已失效/i.test(text)) return { type: 'share', text };
      if (/character removed by creator|该角色已被创作者删除/i.test(text)) return { type: 'deleted', text };
    }
    return null;
  }

  function updateRoleFallbackRecord(characterId, availability = '') {
    const id = String(characterId || '');
    const update = row => String(row?.characterId || '') !== id ? row : {
      ...row,
      availability,
      metadataChecked: true,
      metadataError: availability
        ? (availability === '角色已删除' ? '页面明确显示角色已被创作者删除' : '去掉 sessionId 后仍明确显示分享链接已失效')
        : '',
      metadataErrorCode: 0
    };
    state.chatted = state.chatted.map(update);
    state.chattedNotFavorite = state.chattedNotFavorite.map(update);
    state.favoriteOnly = state.favoriteOnly.map(update);
    state.archived = state.archived.map(update);
    state.roleHistory = state.roleHistory.map(update);
    state.siteSearchRows = state.siteSearchRows.map(update);
    saveRoleCache();
  }

  function installExactRoleFallback() {
    if (pageWindow.location.pathname !== '/chat') return;
    const context = currentRoleContext();
    if (!context.characterId) return;
    let pending = null;
    try { pending = JSON.parse(sessionStorage.getItem(ROLE_FALLBACK_PENDING_KEY) || 'null'); } catch (_) {}
    if (pending && (String(pending.characterId) !== context.characterId || Date.now() - Number(pending.startedAt || 0) > 120000)) {
      try { sessionStorage.removeItem(ROLE_FALLBACK_PENDING_KEY); } catch (_) {}
      pending = null;
    }
    let checks = 0;
    const timer = setInterval(() => {
      checks += 1;
      const failure = exactRoleFailureOnPage();
      const textarea = findChatTextarea();
      const ready = Boolean(textarea && !textarea.disabled && isVisibleElement(textarea));
      if (pending) {
        if (ready && checks >= 3) {
          clearInterval(timer);
          try { sessionStorage.removeItem(ROLE_FALLBACK_PENDING_KEY); } catch (_) {}
          state.sessionlessRoleIds.add(context.characterId);
          saveSessionlessRoleIds();
          updateRoleFallbackRecord(context.characterId, '');
          state.status = '原会话链接失效，但纯角色链接可以打开；以后该角色将自动使用不含 sessionId 的链接。';
          render();
          return;
        }
        if (!ready && failure) {
          clearInterval(timer);
          try { sessionStorage.removeItem(ROLE_FALLBACK_PENDING_KEY); } catch (_) {}
          const availability = failure.type === 'deleted' ? '角色已删除' : '分享已失效';
          updateRoleFallbackRecord(context.characterId, availability);
          state.status = `纯角色链接二次验证仍然失效：${failure.text}`;
          render();
          return;
        }
      } else if (context.sessionId && !ready && failure?.type === 'share') {
        clearInterval(timer);
        try {
          sessionStorage.setItem(ROLE_FALLBACK_PENDING_KEY, JSON.stringify({
            characterId: context.characterId,
            sessionId: context.sessionId,
            startedAt: Date.now()
          }));
        } catch (_) {}
        pageWindow.location.replace(roleUrl(context.characterId));
        return;
      } else if (!context.sessionId && state.sessionlessRoleIds.has(context.characterId)) {
        if (ready && checks >= 3) {
          clearInterval(timer);
          updateRoleFallbackRecord(context.characterId, '');
          state.status = '纯角色链接验证成功；已清除该角色的失效标记。';
          render();
          return;
        }
        if (!ready && failure) {
          clearInterval(timer);
          updateRoleFallbackRecord(context.characterId, failure.type === 'deleted' ? '角色已删除' : '分享已失效');
          state.status = `纯角色链接二次验证仍然失效：${failure.text}`;
          render();
          return;
        }
      } else if (!ready && failure?.type === 'deleted') {
        clearInterval(timer);
        updateRoleFallbackRecord(context.characterId, '角色已删除');
        state.status = `角色已被创作者删除：${failure.text}`;
        render();
        return;
      }
      if (checks >= 40) {
        clearInterval(timer);
        if (pending) try { sessionStorage.removeItem(ROLE_FALLBACK_PENDING_KEY); } catch (_) {}
      }
    }, 500);
  }

  async function recordCurrentChatHistory() {
    if (pageWindow.location.pathname !== '/chat' || !roleStateReady) return;
    const { characterId, sessionId } = currentRoleContext();
    // 仅打开角色开场白没有 sessionId，不应算作已经聊过。
    if (!characterId || !sessionId) return;
    if (!maskAccountScope) scanStoredAuthorization();
    const scope = maskAccountScope;
    if (!scope) return;
    const key = `${scope}|${characterId}|${sessionId}`;
    if (key === liveHistoryPendingKey || key === liveHistorySavedKey) return;
    liveHistoryPendingKey = key;
    try {
      const known = [...state.chatted, ...state.favoriteOnly, ...state.roleHistory, ...state.siteSearchRows]
        .find(row => String(row?.characterId || '') === characterId);
      let detail = known;
      if (!detail?.name || detail.name === '未命名角色') {
        detail = await requestCharacterDetail(characterId);
      }
      if (maskAccountScope !== scope) return;
      const saved = await queueRoleHistoryPersist([{
        characterId,
        lastSessionId: sessionId,
        name: detail?.name || known?.name || '未命名角色',
        authorName: detail?.authorName || known?.authorName || '',
        authorId: detail?.authorId || known?.authorId || ''
      }]);
      if (saved) liveHistorySavedKey = key;
    } catch (error) {
      appendRunLog('error', '聊天会话实时记录到历史索引失败', error);
    } finally {
      if (liveHistoryPendingKey === key) liveHistoryPendingKey = '';
    }
  }

  function characterMaskLabel(character) {
    const local = localBindingForCharacter(character?.characterId);
    if (local) return `自动面具：${maskBindingLabel(resolveLocalBinding(local))}`;
    return '未绑定脚本面具';
  }

  function boundCharacterNames(mask) {
    // 绑定本身可能来自导入文件，而对应角色不一定已经进入当前角色缓存。
    // 因此不能只从 knownCharacters() 反查，否则“自动切换正常但卡片不显示绑定”。
    const knownNames = new Map(knownCharacters().map(row => [
      String(row.characterId), row.name || row.characterId
    ]));
    const names = state.maskBindings
      .filter(binding => maskMatchesBinding(mask, binding))
      .map(binding => (
        binding.characterName ||
        knownNames.get(String(binding.characterId)) ||
        binding.characterId
      ))
      .filter(Boolean);
    const uniqueNames = [...new Set(names.map(name => String(name)))];
    if (!uniqueNames.length) return '';
    return uniqueNames.length > 4
      ? `${uniqueNames.slice(0, 4).join('、')} 等 ${uniqueNames.length} 个角色`
      : uniqueNames.join('、');
  }

  function chooseCharacter(characters) {
    if (!characters.length) return null;
    const limit = Math.min(characters.length, 100);
    const choices = characters.slice(0, limit).map((row, index) =>
      `${index + 1}. ${row.name}（${row.characterId}）`
    ).join('\n');
    const answer = prompt(
      `从已读取的角色中选择目标：输入序号即可；也可输入角色名或 ID 关键词筛选。\n显示前 ${limit}/${characters.length} 个：\n\n${choices}`,
      '1'
    );
    if (answer == null) return null;
    const value = answer.trim();
    const index = Number(value) - 1;
    if (/^\d+$/.test(value)) {
      if (Number.isInteger(index) && index >= 0 && index < limit) return characters[index];
      alert('角色序号无效。');
      return null;
    }
    const query = value.toLowerCase();
    const matches = characters.filter(row => `${row.name} ${row.characterId}`.toLowerCase().includes(query));
    if (!matches.length) {
      alert('没有找到匹配的已读取角色。请先点击“找回角色链接”更新角色列表，或换一个关键词。');
      return null;
    }
    if (matches.length === 1) return matches[0];
    const filteredChoices = matches.slice(0, 100).map((row, matchIndex) =>
      `${matchIndex + 1}. ${row.name}（${row.characterId}）`
    ).join('\n');
    const filteredAnswer = prompt(`匹配到 ${matches.length} 个已读取角色，请输入序号：\n\n${filteredChoices}`, '1');
    if (filteredAnswer == null) return null;
    const filteredIndex = Number.parseInt(filteredAnswer.trim(), 10) - 1;
    if (!Number.isInteger(filteredIndex) || filteredIndex < 0 || filteredIndex >= Math.min(matches.length, 100)) {
      alert('角色序号无效。');
      return null;
    }
    return matches[filteredIndex];
  }

  function chooseMask(masks) {
    const keyword = prompt('输入要绑定的面具名称或面具 ID 关键词：', '');
    if (keyword == null) return null;
    const query = keyword.trim().toLowerCase();
    const matches = masks.filter(row => !query || `${maskDisplayName(row)} ${row.maskId || row.sourceMaskId || ''}`.toLowerCase().includes(query));
    if (!matches.length) {
      alert('没有找到匹配的面具。先点击“面具”分类读取网站面具，或先把面具存入面具库。');
      return null;
    }
    if (matches.length === 1) return matches[0];
    const choices = matches.slice(0, 100).map((row, index) =>
      `${index + 1}. ${maskBindingLabel(row)}（${row._bindingSource || '未知来源'}，${bindingMaskId(row) ? `ID ${bindingMaskId(row)}` : '本地版本'}）`
    ).join('\n');
    const answer = prompt(`找到 ${matches.length} 个面具，请输入序号：\n\n${choices}`, '1');
    if (answer == null) return null;
    const index = Number.parseInt(answer.trim(), 10) - 1;
    if (!Number.isInteger(index) || index < 0 || index >= Math.min(matches.length, 100)) {
      alert('面具序号无效。');
      return null;
    }
    return matches[index];
  }

  async function setCharacterDefaultMask(characterId, maskId) {
    const url = new URL('/api/characters/mask', location.origin);
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const numericMaskId = Number(maskId);
    const payload = {
      characterId: String(characterId),
      maskId: Number.isSafeInteger(numericMaskId) ? numericMaskId : String(maskId)
    };
    let response;
    try {
      response = await pageWindow.fetch(url.href, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(payload)
      });
    } catch (error) {
      throw new Error(`请求未发出：${error?.message || error}`);
    }
    const raw = await response.text();
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
    const detail = body?.reason || body?.message || body?.error || raw || '服务器没有返回错误说明';
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(`HTTP ${response.status}：没有角色面具绑定权限或登录令牌已失效。服务器：${detail}`);
      }
      throw new Error(`HTTP ${response.status} ${response.statusText || ''}：${detail}`.trim());
    }
    if (body?.code != null && body.code !== 200) {
      throw new Error(`接口返回 code ${body.code}：${detail}`);
    }
  }

  async function setSessionMask(sessionId, maskId) {
    if (!sessionId || !maskId) return;
    const url = new URL('/api/sessions/mask', location.origin);
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const response = await pageWindow.fetch(url.href, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({
        sessionId: String(sessionId),
        maskId: Number.isSafeInteger(Number(maskId)) ? Number(maskId) : String(maskId)
      })
    });
    const raw = await response.text();
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
    const detail = body?.reason || body?.message || body?.error || raw || '服务器没有返回错误说明';
    if (!response.ok || (body?.code != null && body.code !== 200)) {
      throw new Error(`当前会话面具切换失败（HTTP ${response.status}）：${detail}`);
    }
  }

  function protectedAutoMaskIds(siteMasks) {
    const protectedIds = new Set();
    state.maskBindings.forEach(binding => {
      const boundMask = resolveLocalBinding(binding);
      const current = siteMasks.find(mask => boundMask && sameMaskContent(mask, boundMask));
      if (current?.maskId) protectedIds.add(current.maskId);
    });
    return protectedIds;
  }

  function chooseAutoReplacementMask(siteMasks) {
    const protectedIds = protectedAutoMaskIds(siteMasks);
    const available = siteMasks.filter(mask => !protectedIds.has(mask.maskId));
    return available.at(-1) || siteMasks.at(-1) || null;
  }

  function updateSiteMaskState(rows) {
    state.currentSiteMasks = rows.slice();
    state.masks = rows.slice();
    state.siteMaskIds = rows.map(row => row.maskId);
  }

  async function ensureMaskAvailable(targetMask) {
    const siteMasks = await fetchCurrentSiteMasks();
    let active = siteMasks.find(mask => sameMaskContent(mask, targetMask));
    if (active) {
      updateSiteMaskState(siteMasks);
      return active;
    }
    if (siteMasks.length < MAX_SITE_MASKS) {
      active = await createMask(targetMask);
      const refreshed = await fetchCurrentSiteMasks();
      active = refreshed.find(mask => sameMaskContent(mask, targetMask)) || active;
      updateSiteMaskState(refreshed);
      return active;
    }
    const replacement = chooseAutoReplacementMask(siteMasks);
    if (!replacement) throw new Error('没有可置换的网站面具槽位');
    const oldSnapshot = maskSnapshot(replacement, { name: replacement.name });
    if (!state.library.some(item => sameMaskContent(item, oldSnapshot))) {
      state.library.unshift(oldSnapshot);
      persistMaskLibrary();
    }
    await updateMask(replacement.maskId, targetMask);
    const refreshed = await fetchCurrentSiteMasks();
    active = refreshed.find(mask => sameMaskContent(mask, targetMask)) || { ...targetMask, maskId: replacement.maskId };
    updateSiteMaskState(refreshed);
    return active;
  }

  async function ensureAutoMaskForCurrentRole(options = {}) {
    if ((!state.autoSwitch && !options.force) || state.autoSwitchRunning) return;
    const context = currentRoleContext();
    if (!context.characterId) return;
    const binding = localBindingForCharacter(context.characterId);
    if (!binding) return;
    const key = `${context.characterId}|${context.sessionId}|${binding.libraryId || binding.sourceMaskId || binding.savedAt}`;
    if (state.autoSwitchKey === key) return;
    try {
      if (pageWindow.sessionStorage.getItem(AUTO_SWITCH_RELOAD_KEY) === key) {
        pageWindow.sessionStorage.removeItem(AUTO_SWITCH_RELOAD_KEY);
        state.autoSwitchKey = key;
        return;
      }
    } catch (_) {}
    const targetMask = resolveLocalBinding(binding);
    if (!targetMask) {
      state.status = `角色“${binding.characterName || context.characterId}”绑定的本地面具已不存在，请重新绑定。`;
      render();
      return;
    }
    state.autoSwitchRunning = true;
    state.loading = true;
    state.status = `正在为当前角色准备绑定面具“${maskBindingLabel(targetMask)}”……`;
    render();
    let reloadChat = false;
    try {
      const active = await ensureMaskAvailable(targetMask);
      if (!active?.maskId) throw new Error('网站没有返回可用的面具 ID');
      await setCharacterDefaultMask(context.characterId, active.maskId);
      if (context.sessionId) await setSessionMask(context.sessionId, active.maskId);
      state.autoSwitchKey = key;
      reloadChat = Boolean(context.sessionId);
      state.status = `已自动切换当前角色面具：“${maskBindingLabel(targetMask)}”${reloadChat ? '，正在同步聊天页选中状态……' : '。'}`;
    } catch (error) {
      state.status = `自动切换面具失败：${explainFailure(error)}`;
    } finally {
      state.autoSwitchRunning = false;
      state.loading = false;
      render();
    }
    if (reloadChat) {
      try {
        pageWindow.sessionStorage.setItem(AUTO_SWITCH_RELOAD_KEY, key);
        pageWindow.location.reload();
      } catch (_) {
        state.status = `面具已切换为“${maskBindingLabel(targetMask)}”，请手动刷新聊天页以同步选中状态。`;
        render();
      }
    }
  }

  let autoSwitchTimer = null;
  let autoMaskSwitchInstalled = false;
  function scheduleAutoMaskSwitch() {
    if (autoSwitchTimer) clearTimeout(autoSwitchTimer);
    autoSwitchTimer = setTimeout(() => {
      autoSwitchTimer = null;
      try { syncSiteCaptureScope(); } catch (error) { console.warn('[Mufy 角色与面具找回助手] 网站角色页面切换同步失败，面板仍可继续使用。', error); }
      try { render(); } catch (error) { console.warn('[Mufy 角色与面具找回助手] 自动面具刷新失败，面板仍可继续使用。', error); }
      try { ensureAutoMaskForCurrentRole(); } catch (error) { console.warn('[Mufy 角色与面具找回助手] 自动面具切换失败，面板仍可继续使用。', error); }
      recordCurrentChatHistory();
    }, 700);
  }

  function installAutoMaskSwitch() {
    if (autoMaskSwitchInstalled) return;
    try {
      if (pageWindow.__mufyRecoveryAutoSwitchInstalled === SCRIPT_VERSION) {
        autoMaskSwitchInstalled = true;
        return;
      }
    } catch (_) {}

    let installed = false;
    try {
      const history = pageWindow.history;
      if (history) {
        for (const method of ['pushState', 'replaceState']) {
          try {
            const original = history[method];
            if (typeof original !== 'function' || original.__mufyRecoveryWrapped) continue;
            const wrapped = function (...args) {
              let result;
              try {
                result = original.apply(this, args);
              } finally {
                try { scheduleAutoMaskSwitch(); } catch (_) {}
              }
              return result;
            };
            try { wrapped.__mufyRecoveryWrapped = true; } catch (_) {}
            history[method] = wrapped;
            installed = true;
          } catch (error) {
            console.warn('[Mufy 角色与面具找回助手] ' + method + ' 监听不可用，已跳过，不影响面板。', error);
          }
        }
      }
    } catch (error) {
      console.warn('[Mufy 角色与面具找回助手] history 监听不可用，已跳过，不影响面板。', error);
    }
    try {
      pageWindow.addEventListener('popstate', scheduleAutoMaskSwitch);
      pageWindow.addEventListener('hashchange', scheduleAutoMaskSwitch);
      installed = true;
    } catch (error) {
      console.warn('[Mufy 角色与面具找回助手] 页面路径监听不可用，已跳过，不影响面板。', error);
    }
    autoMaskSwitchInstalled = true;
    try { pageWindow.__mufyRecoveryAutoSwitchInstalled = SCRIPT_VERSION; } catch (_) {}
    try { scheduleAutoMaskSwitch(); } catch (_) {}
    if (!installed) console.warn('[Mufy 角色与面具找回助手] 自动面具监听未安装，面板仍正常加载。');
  }

  async function fillLibraryMaskIntoEmptySlot(libraryItem, emptySlots) {
    if (!confirm(`确定把“${libraryItem.name}”新增到网站面具库吗？\n\n当前还有 ${emptySlots} 个空槽，新增后会占用一个空槽。`)) return;
    state.loading = true;
    state.status = `正在把“${libraryItem.name}”填入网站空槽……`;
    render();
    try {
      const created = await createMask(libraryItem);
      if (created?.maskId) saveUndo('填充网站空槽', { mode: 'created', maskId: created.maskId });
      const refreshed = await fetchCurrentSiteMasks();
      if (!created?.maskId) {
        const createdMask = refreshed.find(row => sameMaskContent(row, libraryItem));
        if (createdMask?.maskId) saveUndo('填充网站空槽', { mode: 'created', maskId: createdMask.maskId });
      }
      updateSiteMaskState(refreshed);
      state.status = `已将“${libraryItem.name}”填入网站空槽，当前网站面具 ${refreshed.length}/${MAX_SITE_MASKS} 个。`;
    } catch (error) {
      state.status = `填充空槽失败：${explainFailure(error)}`;
    } finally {
      state.loading = false;
      render();
    }
  }

  function collectBindingConflicts(character, mask) {
    const characterId = String(character.characterId);
    const existingLocal = localBindingForCharacter(characterId);
    const conflicts = [];
    if (existingLocal && !maskMatchesBinding(mask, existingLocal)) {
      conflicts.push(`角色“${character.name}”原本绑定了“${maskBindingLabel(resolveLocalBinding(existingLocal))}”（本地）`);
    }
    return { conflicts };
  }

  async function applyMaskBinding(character, mask, options = {}) {
    const previous = localBindingForCharacter(character.characterId);
    const targetName = maskBindingLabel(mask);
    const oldLocalText = previous ? `原自动面具：${maskBindingLabel(resolveLocalBinding(previous))}` : '当前没有自动面具';
    if (!options.confirmed && !confirm(`确定把面具“${targetName}”绑定到角色“${character.name}”吗？\n\n${oldLocalText}\n\n切换到这个角色时，脚本会自动准备并使用这份面具。`)) return;
    const conflicts = collectBindingConflicts(character, mask);
    if (conflicts.conflicts.length) {
      const message = `检测到该角色已有脚本面具绑定：\n\n${conflicts.conflicts.join('\n')}\n\n确定：替换原脚本绑定\n取消：保留原绑定，本次不绑定`;
      if (!confirm(message)) {
        state.status = '已取消绑定，原有绑定保持不变。';
        render();
        return;
      }
    }
    saveLocalMaskBinding(character, mask);
    state.autoSwitchKey = '';
    if (currentRoleContext().characterId === character.characterId && state.autoSwitch) {
      await ensureAutoMaskForCurrentRole({ force: true });
    } else {
      state.loading = true;
      state.status = `正在把“${targetName}”绑定到角色“${character.name}”……`;
      render();
      try {
        const active = await ensureMaskAvailable(mask);
        if (!active?.maskId) throw new Error('网站没有返回可用的面具 ID');
        await setCharacterDefaultMask(character.characterId, active.maskId);
        state.status = `已保存本地绑定，并已将网站角色绑定到“${targetName}”。`;
      } catch (error) {
        state.status = `本地绑定已保存，但网站角色绑定失败：${explainFailure(error)}`;
      } finally {
        state.loading = false;
        render();
      }
    }
  }

  async function bindMaskToCharacter(mask) {
    const { characterId } = currentRoleContext();
    if (characterId) {
      const currentCharacter = knownCharacters().find(row => row.characterId === characterId) || {
        characterId,
        name: `当前角色 ${characterId}`
      };
      if (confirm(`将面具“${maskBindingLabel(mask)}”绑定到当前打开的角色“${currentCharacter.name}”吗？\n\n确定：绑定当前角色\n取消：选择其他角色`)) {
        await applyMaskBinding(currentCharacter, mask, { confirmed: true });
        return;
      }
    }
    let characters = knownCharacters();
    if (!characters.length) {
      await recoverRoles();
      characters = knownCharacters();
    }
    if (!characters.length) return;
    const character = chooseCharacter(characters);
    if (character) await applyMaskBinding(character, mask);
  }

  async function bindRoleToMask(character) {
    let masks = knownBindingMasks();
    if (!masks.length) {
      await loadCurrentSiteMasks();
      masks = knownBindingMasks();
    }
    if (!masks.length) return;
    const mask = chooseMask(masks);
    if (mask) await applyMaskBinding(character, mask);
  }

  async function unbindCharacterMask(character) {
    const local = localBindingForCharacter(character.characterId);
    if (!local) return;
    const label = '脚本自动面具绑定';
    if (!confirm(`确定取消角色“${character.name}”的${label}吗？`)) return;
    state.loading = true;
    state.status = `正在取消角色“${character.name}”的自动面具……`;
    render();
    try {
      removeLocalMaskBinding(character.characterId);
      state.autoSwitchKey = '';
      state.status = `已取消角色“${character.name}”的${label}。`;
    } catch (error) {
      state.status = `取消绑定失败：${explainFailure(error)}`;
    } finally {
      state.loading = false;
      render();
    }
  }

  async function swapLibraryMask(libraryItem) {
    state.loading = true;
    state.status = '正在读取网站当前面具……';
    render();
    let siteMasks;
    try {
      siteMasks = await fetchCurrentSiteMasks();
    } catch (error) {
      state.loading = false;
      state.status = `读取网站面具失败：${explainFailure(error)}`;
      render();
      return;
    }
    state.loading = false;
    state.currentSiteMasks = siteMasks.slice();
    state.masks = siteMasks;
    state.siteMaskIds = siteMasks.map(row => row.maskId);
    render();
    const emptySlots = Math.max(0, MAX_SITE_MASKS - siteMasks.length);
    if (!siteMasks.length && !emptySlots) {
      alert('网站当前没有可用面具，也没有可用空槽。');
      return;
    }
    if (emptySlots) {
      await fillLibraryMaskIntoEmptySlot(libraryItem, emptySlots);
      return;
    }
    const choices = siteMasks.map((mask, index) =>
      `面具${index + 1}：${mask.name || '未命名'}（ID ${mask.maskId}）`
    ).join('\n');
    const answer = prompt(`请选择要置换的网站面具（输入 1-${siteMasks.length}）：\n\n${choices}`, '1');
    if (answer == null) return;
    const slot = Number.parseInt(answer.trim(), 10);
    if (!Number.isInteger(slot) || slot < 1 || slot > siteMasks.length) {
      alert(`请输入 1-${siteMasks.length} 之间的数字。`);
      return;
    }
    const target = siteMasks[slot - 1];
    if (sameMaskContent(libraryItem, target)) {
      state.status = `“${libraryItem.name}”与网站面具“${target.name}”内容相同，无需置换。`;
      render();
      return;
    }
    const ok = confirm(`确定把“${libraryItem.name}”写入网站面具“${target.name}”吗？\n\n网站面具当前内容会自动保存回本地面具库。`);
    if (!ok) return;
    state.loading = true;
    state.status = `正在把“${libraryItem.name}”写入网站面具“${target.name}”……`;
    render();
    try {
      const oldTarget = maskSnapshot(target, { libraryId: libraryItem.libraryId, name: target.name });
      await updateMask(target.maskId, libraryItem);
      const libraryIndex = state.library.findIndex(item => item.libraryId === libraryItem.libraryId);
      const existingBackup = state.library.findIndex((item, index) =>
        index !== libraryIndex && sameMaskContent(item, oldTarget)
      );
      // 被换出的网站内容已有备份时，保留用户选中的本地备份，不再写入第二份。
      // 这样本地库既不产生重复项，也不会因为置换减少一条记录。
      if (libraryIndex >= 0) {
        saveUndo('面具置换', { maskId: target.maskId, source: oldTarget });
        if (existingBackup < 0) state.library.splice(libraryIndex, 1, oldTarget);
      }
      persistMaskLibrary();
      const refreshed = await fetchCurrentSiteMasks();
      state.currentSiteMasks = refreshed.slice();
      state.masks = refreshed;
      state.siteMaskIds = state.masks.map(row => row.maskId);
      state.status = existingBackup >= 0
        ? `置换完成：“${libraryItem.name}”已写入网站面具；被换出的“${target.name}”在面具库已有备份，未重复保存，原本地备份也已保留。请刷新聊天页。`
        : `置换完成：“${libraryItem.name}”已写入网站面具，“${target.name}”已保存回面具库。请刷新聊天页。`;
    } catch (error) {
      state.status = `置换失败（目标面具 ID ${target.maskId}）：${explainFailure(error)}`;
    } finally {
      state.loading = false;
      render();
    }
  }

  function removeLibraryMask(libraryItem) {
    const boundCharacters = state.maskBindings
      .filter(binding => String(binding.libraryId || '') === String(libraryItem.libraryId))
      .map(binding => binding.characterName || binding.characterId);
    const bindingNotice = boundCharacters.length
      ? `\n\n它当前绑定了：${boundCharacters.join('、')}。删除后会解除这些本地自动绑定。`
      : '';
    if (!confirm(`从本地面具库删除“${libraryItem.name}”吗？这不会删除 Mufy 服务器上的面具。${bindingNotice}`)) return;
    saveUndo('删除面具备份');
    state.library = state.library.filter(item => item.libraryId !== libraryItem.libraryId);
    if (boundCharacters.length) {
      state.maskBindings = state.maskBindings.filter(binding => String(binding.libraryId || '') !== String(libraryItem.libraryId));
      persistMaskBindings();
    }
    persistMaskLibrary();
    state.status = boundCharacters.length
      ? `已删除“${libraryItem.name}”，并解除 ${boundCharacters.length} 个本地自动绑定。`
      : `已从本地面具库删除“${libraryItem.name}”。`;
    render();
  }

  function maskEditorText(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    try { return JSON.stringify(value, null, 2); } catch (_) { return String(value); }
  }

  let maskEditorSource = null;
  let maskEditorOrigin = '';

  function closeMaskEditor() {
    const editor = panel?.querySelector('#mufy-recovery-mask-editor');
    if (!editor) return;
    editor.hidden = true;
    maskEditorSource = null;
    maskEditorOrigin = '';
  }

  function openMaskEditor(mask, origin) {
    const editor = panel?.querySelector('#mufy-recovery-mask-editor');
    const isLibrary = origin === 'library';
    if (!editor || !mask || (isLibrary ? !mask.libraryId : !mask.maskId)) return;
    maskEditorSource = cloneValue(mask);
    maskEditorOrigin = isLibrary ? 'library' : 'site';
    editor.querySelector('#mufy-recovery-mask-editor-title').textContent = `${isLibrary ? '编辑本地面具' : '编辑面具'} · ${mask.name || '未命名面具'}`;
    editor.querySelector('[name="remark"]').value = maskEditorText(mask.remark);
    editor.querySelector('[name="maskName"]').value = maskEditorText(mask.maskName);
    editor.querySelector('[name="gender"]').value = maskEditorText(mask.gender);
    editor.querySelector('[name="description"]').value = maskEditorText(mask.description);
    editor.querySelector('[name="favorite"]').value = maskEditorText(mask.favorite);
    editor.querySelector('[name="command"]').value = maskEditorText(mask.command);
    editor.querySelector('#mufy-recovery-mask-editor-hint').textContent = isLibrary
      ? '正在编辑面具库中的本地面具。“保存修改”会更新当前这份面具并保留已有角色绑定；“另存为新面具”会新增一份，原面具和原绑定不变。'
      : '编辑的是上方选中的网站面具，但保存只写入浏览器本地面具库。另存会新增一份；替换会删除面具库中的旧副本再写入当前内容，网站原面具不受影响。';
    editor.querySelector('#mufy-recovery-mask-editor-replace').textContent = isLibrary ? '保存修改' : '替换本地原面具';
    editor.hidden = false;
    editor.querySelector('[name="remark"]').focus();
  }

  function openSiteMaskEditor(mask) {
    openMaskEditor(mask, 'site');
  }

  function openLibraryMaskEditor(mask) {
    openMaskEditor(mask, 'library');
  }

  function saveMaskEditor(mode) {
    const editor = panel?.querySelector('#mufy-recovery-mask-editor');
    const source = maskEditorSource;
    const isLibrarySource = maskEditorOrigin === 'library';
    if (!editor || !source || (isLibrarySource ? !source.libraryId : !source.maskId)) {
      closeMaskEditor();
      state.status = isLibrarySource
        ? '原本地面具已经不存在，未保存编辑内容。'
        : '原网站面具已经不存在，未保存编辑内容。';
      render();
      return;
    }
    const value = name => String(editor.querySelector(`[name="${name}"]`)?.value || '');
    const edited = {
      ...source,
      remark: value('remark'),
      maskName: value('maskName'),
      gender: value('gender'),
      description: value('description'),
      favorite: value('favorite'),
      command: value('command')
    };
    edited.name = edited.remark.trim() || edited.maskName.trim() || source.name || '未命名面具';
    const replacing = mode === 'replace';
    let replaceIndex = -1;
    if (isLibrarySource) {
      replaceIndex = state.library.findIndex(item => String(item.libraryId || '') === String(source.libraryId));
    } else {
      const sourceMaskId = String(source.maskId || source.sourceMaskId || '');
      const exactSourceIndex = state.library.findIndex(item =>
        String(item.sourceMaskId || '') === sourceMaskId && sameMaskContent(item, source));
      const sourceIndex = state.library.findIndex(item => String(item.sourceMaskId || '') === sourceMaskId);
      const contentIndex = state.library.findIndex(item => sameMaskContent(item, source));
      replaceIndex = exactSourceIndex >= 0 ? exactSourceIndex : (sourceIndex >= 0 ? sourceIndex : contentIndex);
    }
    if (replacing && replaceIndex < 0) {
      state.status = isLibrarySource
        ? '面具库中已经找不到这份原面具，无法保存修改；可以选择“另存为新面具”。'
        : '面具库中没有找到这份面具的旧副本，无法替换；请先选择“另存为新面具”。';
      panel.querySelector('#mufy-recovery-status').textContent = state.status;
      return;
    }
    const replacedItem = replacing ? state.library[replaceIndex] : null;
    const snapshot = maskSnapshot(edited, {
      libraryId: replacing ? replacedItem.libraryId : makeLibraryId(),
      name: edited.name,
      storedAt: new Date().toISOString()
    });
    if (!replacing && state.library.some(item => sameMaskContent(item, snapshot))) {
      closeMaskEditor();
      state.status = '编辑后的内容已经在面具库中，未重复另存。';
      render();
      return;
    }
    saveUndo(replacing ? (isLibrarySource ? '保存本地面具修改' : '替换本地面具') : '另存编辑后的面具');
    if (replacing) {
      // 保留 libraryId，让原本绑定到这份本地面具的角色继续跟随编辑后的版本。
      state.library.splice(replaceIndex, 1, snapshot);
    } else {
      state.library.unshift(snapshot);
    }
    persistMaskLibrary();
    closeMaskEditor();
    state.active = 'library';
    state.section = 'masks';
    state.status = replacing
      ? (isLibrarySource
        ? `已保存“${snapshot.name}”的修改；原有角色绑定继续有效。`
        : `已删除面具库中的旧副本，并存入编辑后的“${snapshot.name}”；网站原面具未修改。`)
      : (isLibrarySource
        ? `已将编辑后的“${snapshot.name}”另存为新面具；原面具和原有角色绑定未修改。`
        : `已将编辑后的“${snapshot.name}”另存到面具库；网站原面具未修改。`);
    render();
  }

  function applyRoleFetchResults(recentRows, favoriteRows, replaceAll) {
    const recentSource = replaceAll ? recentRows : [...state.chatted, ...recentRows];
    const explicitlyUnfavoritedIds = new Set(recentRows
      .filter(row => row?.favoriteKnown === true && row?.isFavorite === false)
      .map(row => String(row.characterId)));
    const favoriteSource = replaceAll
      ? favoriteRows
      : [...state.favoriteOnly.filter(row => !explicitlyUnfavoritedIds.has(String(row.characterId))), ...favoriteRows];
    const favoriteIds = new Set(favoriteSource.map(row => row.characterId));
    const chatted = new Map();
    recentSource.forEach(row => {
      const current = chatted.get(row.characterId);
      const incoming = favoriteIds.has(row.characterId)
        ? { ...row, isFavorite: true, favoriteKnown: true }
        : replaceAll
          ? { ...row, isFavorite: Boolean(row.isFavorite), favoriteKnown: true }
          : row;
      chatted.set(row.characterId, current ? mergeRole(current, incoming) : incoming);
    });
    favoriteSource.filter(row => row.lastSessionId).forEach(row => {
      if (!chatted.has(row.characterId)) chatted.set(row.characterId, row);
      else chatted.set(row.characterId, mergeRole(chatted.get(row.characterId), row));
    });
    const favoriteOnlyCandidates = [...new Map(favoriteSource
      .filter(row => !chatted.has(row.characterId) && !row.lastSessionId)
      .map(row => [String(row.characterId), { ...row, isFavorite: true, isFollowed: true, favoriteKnown: true }])).values()];
    const nextChatted = [...chatted.values()]
      .sort((a, b) => new Date(b.lastInteracted) - new Date(a.lastInteracted));
    state.chatted = nextChatted;
    // 普通待聊只保留尚未出现在会话列表中的角色；
    // 用户手动发送消息后，下一次读取角色链接即可自动从待办中移除。
    const chattedIds = new Set(nextChatted.filter(row => row.lastSessionId).map(row => String(row.characterId)));
    if (chattedIds.size) {
      state.manualFavoriteChats = state.manualFavoriteChats.filter(row => !chattedIds.has(String(row.characterId)));
      saveManualFavoriteChats(state.manualFavoriteChats);
      if (state.manualFavoriteChatCurrentId && chattedIds.has(String(state.manualFavoriteChatCurrentId))) {
        state.manualFavoriteChatCurrentId = '';
        try { localStorage.removeItem(accountStorageKey(MANUAL_FAVORITE_CHAT_CURRENT_KEY)); } catch (_) {}
      }
    }
    state.chattedNotFavorite = nextChatted.filter(row => row.favoriteKnown === true && !row.isFavorite && !favoriteIds.has(row.characterId));
    state.favoriteOnly = favoriteOnlyCandidates
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  }

  async function recoverRoles() {
    if (state.roleLoading || state.metadataLoading || state.loading) return;
    scanStoredAuthorization();
    const resuming = state.rolePaused;
    if (!resuming) {
      state.lastRoleReadIds = new Set();
      state.roleProgress = { phase: 'recent', recentPage: 1, favoritePage: 1 };
      state.rolePendingRecent = [];
      state.rolePendingFavorites = [];
    }
    state.rolePauseRequested = false;
    state.rolePaused = false;
    state.roleLoading = true;
    const maxPages = state.roleReadMode === 'latest'
      ? Math.max(1, Math.min(500, Number(state.roleLatestPages) || 2))
      : 500;
    state.status = resuming ? '正在继续读取角色链接……' : (state.roleReadMode === 'latest' ? `正在读取最新 ${maxPages} 页角色链接……` : '正在读取聊过的角色……');
    render();
    let promptMetadata = false;
    try {
      if (state.roleProgress.phase === 'recent') {
        const result = await fetchAll(false, '会话', maxPages, state.roleProgress.recentPage);
        state.rolePendingRecent.push(...result.rows);
        for (const row of result.rows) state.lastRoleReadIds.add(String(row.characterId));
        state.roleProgress.recentPage = result.nextPage;
        if (result.paused) {
          state.rolePaused = true;
          applyRoleFetchResults(state.rolePendingRecent, state.rolePendingFavorites, state.roleReadMode === 'full' && !resuming);
          saveRoleCache();
          const historySaved = await queueRoleHistoryPersist(state.rolePendingRecent);
          state.status = `已暂停角色链接读取，当前已读 ${state.rolePendingRecent.length} 条会话记录。${historySaved ? '已保存到本账号历史索引。' : '历史索引未保存，请查看运行日志。'}点击“继续读取”可接着读取。`;
          return;
        }
        state.roleProgress.phase = 'favorites';
      }
      if (state.roleProgress.phase === 'favorites') {
        const result = await fetchAll(true, '收藏', maxPages, state.roleProgress.favoritePage);
        state.rolePendingFavorites.push(...result.rows);
        for (const row of result.rows) state.lastRoleReadIds.add(String(row.characterId));
        state.roleProgress.favoritePage = result.nextPage;
        if (result.paused) {
          state.rolePaused = true;
          applyRoleFetchResults(state.rolePendingRecent, state.rolePendingFavorites, state.roleReadMode === 'full' && !resuming);
          saveRoleCache();
          const historySaved = await queueRoleHistoryPersist(state.rolePendingRecent);
          state.status = `已暂停角色链接读取，当前已读 ${state.rolePendingRecent.length + state.rolePendingFavorites.length} 条记录。${historySaved ? '已保存到本账号历史索引。' : '历史索引未保存，请查看运行日志。'}点击“继续读取”可接着读取。`;
          return;
        }
      }
      applyRoleFetchResults(state.rolePendingRecent, state.rolePendingFavorites, state.roleReadMode === 'full');
      saveRoleCache();
      const historySaved = await queueRoleHistoryPersist(state.rolePendingRecent);
      const hidden = state.chatted.filter(row => isOlderThanTwoMonths(row.lastInteracted)).length;
      state.status = `角色链接已经更新完毕：聊过 ${state.chatted.length} 个；聊过未收藏 ${state.chattedNotFavorite.length} 个；收藏未聊 ${state.favoriteOnly.length} 个${hidden ? `；旧会话约 ${hidden} 个` : ''}。${historySaved ? `本账号历史索引累计 ${state.roleHistory.length} 个角色。` : '历史索引未保存，请查看运行日志。'}`;
      promptMetadata = pendingMetadataRows().length > 0;
      state.rolePendingRecent = [];
      state.rolePendingFavorites = [];
      state.roleProgress = { phase: 'recent', recentPage: 1, favoritePage: 1 };
    } catch (error) {
      state.status = `读取失败：${explainFailure(error)}已保留上次角色列表。`;
    } finally {
      state.roleLoading = false;
      render();
      if (promptMetadata && !state.rolePaused) {
        const shouldUpdate = pageWindow.confirm('角色链接已经更新完毕，接下来要更新作者信息和公开状态吗？');
        if (shouldUpdate) await refreshCachedRoleMetadata();
        else {
          state.status = '角色链接已经更新完毕，作者信息和公开状态暂未更新。';
          render();
        }
      }
    }
  }

  function pauseRoleReading() {
    if (!state.roleLoading) return;
    state.rolePauseRequested = true;
    state.status = '正在完成当前请求，随后暂停角色链接读取……';
    render();
  }

  function allRoleRows() {
    const found = new Map();
    [...state.chatted, ...state.favoriteOnly].forEach(row => {
      if (!found.has(row.characterId)) found.set(row.characterId, row);
      else found.set(row.characterId, mergeRole(found.get(row.characterId), row));
    });
    return [...found.values()];
  }

  function scopeRoleRows(rows) {
    if (!(state.lastRoleReadIds instanceof Set)) return rows;
    return rows.filter(row => state.lastRoleReadIds.has(String(row.characterId)));
  }

  function isUnavailable(row) {
    return row.availability === '角色已删除';
  }

  function visibilityLabel(row) {
    if (row.availability === '分享已失效') return '分享已失效';
    if (row.availability === '角色已删除') return '角色已删除';
    const visibility = visibilityFrom(row);
    return visibility;
  }

  function matchesStatus(row, filter) {
    if (!filter || filter === 'all') return true;
    const status = visibilityLabel(row);
    return (filter === 'public' && status === '公开')
      || (filter === 'link' && status === '仅链接')
      || (filter === 'private' && status === '私密')
      || (filter === 'expired' && status === '分享已失效')
      || (filter === 'deleted' && status === '角色已删除');
  }

  function roleStatusCounts(rows) {
    return {
      public: rows.filter(row => visibilityLabel(row) === '公开').length,
      link: rows.filter(row => visibilityLabel(row) === '仅链接').length,
      private: rows.filter(row => visibilityLabel(row) === '私密').length,
      expired: rows.filter(row => visibilityLabel(row) === '分享已失效').length,
      deleted: rows.filter(row => visibilityLabel(row) === '角色已删除').length,
      unknown: rows.filter(row => visibilityLabel(row) === '未知').length
    };
  }

  function pendingMetadataRows() {
    return scopeRoleRows(allRoleRows())
      .filter(row => !isUnavailable(row) && (!row.metadataChecked || !row.authorName));
  }

  function requestMetadataStop() {
    if (!state.metadataLoading || state.metadataStopRequested) return;
    state.metadataStopRequested = true;
    state.metadataAbortControllers.forEach(controller => {
      try { controller.abort(); } catch (_) {}
    });
    state.status = '正在停止作者和状态更新：正在中止当前请求并保存已完成的结果……';
    render();
  }

  async function refreshCachedRoleMetadata() {
    if (state.loading || state.roleLoading || state.metadataLoading) return;
    const cachedRows = pendingMetadataRows();
    if (!cachedRows.length) return;
    state.metadataLoading = true;
    state.metadataTask = 'metadata';
    state.metadataStopRequested = false;
    metadataFailureReasons.clear();
    state.status = `正在更新 ${cachedRows.length} 个角色的作者和公开状态……`;
    render();
    try {
      const result = await enrichRoles(cachedRows);
      const enriched = result.rows;
      const byId = new Map(enriched.map(row => [row.characterId, row]));
      const replace = row => byId.get(row.characterId) || row;
      state.chatted = state.chatted.map(replace);
      state.chattedNotFavorite = state.chattedNotFavorite.map(replace);
      state.favoriteOnly = state.favoriteOnly.map(replace);
      saveRoleCache();
      const remaining = pendingMetadataRows().length;
      if (result.stopped) {
        state.status = `已停止作者和状态更新：已保存已经完成的结果，剩余 ${remaining} 个角色没有继续请求。再次点击“更新状态”可继续。`;
      } else if (result.rateLimited) {
        state.status = `检测到 HTTP 429，已暂停作者信息更新；已保留已完成的部分，剩余 ${remaining} 个角色可稍后点击“更新状态”继续。`;
      } else if (remaining) {
        const counts = roleStatusCounts(enriched);
        const reason = [...metadataFailureReasons].slice(0, 2).join('；');
        state.status = `更新未完成：公开 ${counts.public} 个、仅链接 ${counts.link} 个、私密 ${counts.private} 个、已删除 ${counts.deleted} 个。${reason ? `失败说明：${reason}。` : '部分接口没有返回可识别的作者信息。'}仍有 ${remaining} 个角色待更新，可点击“更新状态”继续。`;
      } else {
        const counts = roleStatusCounts(enriched);
        state.status = `作者信息和公开状态更新完成：公开 ${counts.public} 个、仅链接 ${counts.link} 个、私密 ${counts.private} 个、已删除 ${counts.deleted} 个。`;
      }
    } catch (error) {
      const remaining = pendingMetadataRows().length;
      state.status = `作者信息更新失败：${explainFailure(error)}仍有 ${remaining} 个角色待更新，可点击“更新状态”继续。`;
    } finally {
      state.metadataAbortControllers.clear();
      state.metadataLoading = false;
      state.metadataTask = null;
      state.metadataStopRequested = false;
      render();
    }
  }

  async function refreshRoleStatuses() {
    if (state.loading || state.roleLoading || state.metadataLoading) return;
    const cachedRows = scopeRoleRows(allRoleRows());
    if (!cachedRows.length) {
      state.status = state.lastRoleReadIds instanceof Set
        ? '本次角色链接读取没有找到可查询的角色。'
        : '还没有已读取的角色，请先点击“找回角色链接”。';
      render();
      return;
    }
    state.metadataLoading = true;
    state.metadataTask = 'status';
    state.metadataStopRequested = false;
    metadataFailureReasons.clear();
    state.status = `正在重新查询本次读取的 ${cachedRows.length} 个角色状态和作者信息……`;
    render();
    try {
      const enriched = new Map(cachedRows.map(row => [row.characterId, row]));
      const queueResult = await runMetadataQueue(cachedRows, '角色状态', async (row, signal) => {
        const detail = await requestCharacterDetail(row.characterId, signal);
        if (!detail) return;
        const merged = mergeRole(row, detail);
        merged.metadataError = detail.metadataError || '';
        merged.metadataErrorCode = Number(detail.metadataErrorCode) || 0;
        enriched.set(row.characterId, merged);
      });

      // “更新状态”需要同时补查作者名称。
      // 角色详情接口经常只返回 authorId，不返回作者名称；如果这里不再查作者资料，
      // 作者合集就会退回显示“作者 ID”，看起来像是作者信息丢失。
      const authorIds = [...new Set([...enriched.values()]
        .map(row => String(row.authorId || ''))
        .filter(Boolean))];
      const authorNames = new Map();
      const authorResult = queueResult.rateLimited || queueResult.stopped
        ? { rateLimited: false, stopped: queueResult.stopped, completed: 0, total: authorIds.length }
        : await runMetadataQueue(authorIds, '作者名称', async (authorId, signal) => {
          const name = await requestAuthorProfile(authorId, signal);
          if (name) authorNames.set(authorId, name);
        });
      if (authorNames.size) {
        for (const [characterId, row] of enriched) {
          const name = authorNames.get(String(row.authorId || ''));
          if (name) enriched.set(characterId, mergeRole(row, { authorName: name }));
        }
      }

      const refreshed = [...enriched.values()];
      const byId = new Map(refreshed.map(row => [row.characterId, row]));
      const replace = row => byId.get(row.characterId) || row;
      state.chatted = state.chatted.map(replace);
      state.chattedNotFavorite = state.chattedNotFavorite.map(replace);
      state.favoriteOnly = state.favoriteOnly.map(replace);
      saveRoleCache();
      const counts = roleStatusCounts(refreshed);
      const reason = [...metadataFailureReasons].slice(0, 2).join('；');
      const stopped = queueResult.stopped || authorResult.stopped;
      const rateLimited = queueResult.rateLimited || authorResult.rateLimited;
      state.status = stopped
        ? `已停止作者和角色状态查询：已保存完成结果；其余内容未继续请求。`
        : rateLimited
          ? `作者和角色状态查询已暂停：公开 ${counts.public} 个、仅链接 ${counts.link} 个、私密 ${counts.private} 个、已删除 ${counts.deleted} 个。检测到 HTTP 429，已保留已完成的部分。`
          : `作者和角色状态重新查询完成：公开 ${counts.public} 个、仅链接 ${counts.link} 个、私密 ${counts.private} 个、已删除 ${counts.deleted} 个。${reason ? `失败说明：${reason}。` : ''}`;
    } catch (error) {
      state.status = `作者和角色状态重新查询失败：${explainFailure(error)}`;
    } finally {
      state.metadataAbortControllers.clear();
      state.metadataLoading = false;
      state.metadataTask = null;
      state.metadataStopRequested = false;
      render();
    }
  }

  async function requestFavorite(characterId, isFavorite) {
    const url = new URL('/api/characters/follow', location.origin);
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const response = await favoriteFetch(url.href, { method: 'POST', credentials: 'include', headers, body: JSON.stringify({ characterId: String(characterId), isFavorite }) }, isFavorite ? '收藏请求' : '取消收藏请求');
    const raw = await response.text();
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
    if (response.status === 429) throw new RateLimitError('收藏请求');
    if (response.status === 401 || response.status === 403) throw new Error(loginErrorMessage(response.status, '收藏操作'));
    if (!response.ok || (body?.code != null && body.code !== 200)) throw new Error(body?.message || body?.reason || raw || `HTTP ${response.status}`);
  }


  function nativeFavoriteMeta(element) {
    if (!element) return '';
    return [
      element.getAttribute('aria-label'),
      element.getAttribute('title'),
      element.getAttribute('data-tooltip'),
      element.getAttribute('data-tooltip-content'),
      element.getAttribute('data-action'),
      element.className
    ].filter(Boolean).join(' ').toLowerCase();
  }

  function nativeFavoriteState(element) {
    if (!element) return null;
    const meta = nativeFavoriteMeta(element);
    const pressed = element.getAttribute('aria-pressed');
    const dataState = element.getAttribute('data-state') || element.getAttribute('data-active');
    const iconText = String(element.textContent || '').trim();
    if (/^★$/.test(iconText)) return true;
    if (/^[☆✩]$/.test(iconText)) return false;
    if (pressed === 'true') return true;
    if (pressed === 'false') return false;
    if (/^(on|active|true|checked|selected)$/i.test(String(dataState || ''))) return true;
    if (/^(off|inactive|false|unchecked|unselected)$/i.test(String(dataState || ''))) return false;
    // Mufy 的不同角色页分别使用“收藏”和“关注”文案；完整聊天页常直接显示“已关注”。
    if (/已收藏|取消收藏|已关注|取消关注|unfollow|unfavorite|remove from favorites|is-favorite|favorited|followed/i.test(`${meta} ${iconText}`)) return true;
    const labelMeta = [
      element.getAttribute('aria-label'), element.getAttribute('title'),
      element.getAttribute('data-tooltip'), element.getAttribute('data-tooltip-content')
    ].filter(Boolean).join(' ').toLowerCase();
    if (/未收藏|添加收藏|加入收藏|收藏角色|^关注$|关注角色|add to favorites|favorite this|follow this/i.test(`${labelMeta} ${iconText}`.trim())) return false;
    const svg = element.querySelector?.('svg');
    const fill = String(svg?.getAttribute?.('fill') || svg?.style?.fill || '').trim().toLowerCase();
    if (fill && !['none', 'transparent'].includes(fill)) return true;
    if (fill === 'none') return false;
    return null;
  }

  function websiteFavoriteTargetScore(element, characterId, name) {
    const id = String(characterId || '').toLowerCase();
    const roleName = String(name || '').trim().toLowerCase();
    let score = 0;
    let node = element;
    for (let depth = 0; node && depth < 7; depth += 1, node = node.parentElement) {
      const attrs = ['data-character-id', 'data-characterid', 'data-character', 'data-role-id', 'data-id'];
      attrs.forEach(attribute => {
        if (id && String(node.getAttribute?.(attribute) || '').toLowerCase() === id) score += 160;
      });
      const href = String(node.getAttribute?.('href') || '').toLowerCase();
      if (id && href.includes(id)) score += 80;
      const nodeText = String(node.textContent || '').trim().toLowerCase();
      // 只允许较近、较小的角色卡片用名称加分；不能让 body 的整页文字使所有收藏按钮同时命中。
      if (roleName && depth <= 3 && nodeText.length <= 800 && nodeText.includes(roleName)) score += 30;
      if (node === document.body) break;
    }
    if (id && String(pageWindow.location.href || '').toLowerCase().includes(id)) score += 15;
    if (element.getClientRects?.().length) score += 4;
    return score;
  }

  function findWebsiteFavoriteControl(characterId, row = {}) {
    const id = String(characterId || '');
    const name = String(row?.name || '');
    const selectors = [
      'button', '[role="button"]',
      '[aria-label*="收藏" i]', '[title*="收藏" i]',
      '[aria-label*="favorite" i]', '[title*="favorite" i]'
    ];
    const seen = new Set();
    const candidates = [];
    selectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(element => {
          if (seen.has(element) || element.closest('#mufy-recovery-panel')) return;
          seen.add(element);
          const meta = nativeFavoriteMeta(element);
          const text = String(element.textContent || '').trim().toLowerCase();
          if (!/(收藏|关注|favorite|follow|star)/i.test(`${meta} ${text}`)) return;
          candidates.push(element);
        });
      } catch (_) {}
    });
    const ranked = candidates
      .map(element => ({ element, score: websiteFavoriteTargetScore(element, id, name) }))
      .sort((a, b) => b.score - a.score);
    if (!ranked.length) return null;
    if (ranked[0].score >= 30) return ranked[0].element;
    const visible = ranked.filter(item => item.element.getClientRects?.().length);
    return visible.length === 1 ? visible[0].element : null;
  }

  async function tryWebsiteFavoriteClick(characterId, isFavorite, row = {}) {
    const control = findWebsiteFavoriteControl(characterId, row);
    if (!control) return false;
    const before = nativeFavoriteState(control);
    if (before === Boolean(isFavorite)) return true;
    if (before === null) throw new Error(`无法确认“${row?.name || characterId}”当前是否已收藏，已跳过以避免反向切换`);
    try {
      control.click();
    } catch (error) {
      throw new Error(`点击“${row?.name || characterId}”的收藏按钮失败：${String(error?.message || error)}`);
    }
    for (let attempt = 0; attempt < 12; attempt += 1) {
      await wait(250);
      const latestControl = findWebsiteFavoriteControl(characterId, row) || control;
      const current = nativeFavoriteState(latestControl);
      if (current === Boolean(isFavorite)) return true;
      if (current === before && attempt < 11) continue;
    }
    throw new Error(`“${row?.name || characterId}”的收藏按钮点击后没有变成目标状态，未写入本地成功记录`);
  }

  async function clickWebsiteFavoriteFromKnownUnfavorite(characterId, row = {}) {
    let control = null;
    // 分享链接刚打开时页面组件可能还没有挂载，短暂等待原生收藏按钮出现。
    for (let attempt = 0; attempt < 20; attempt += 1) {
      control = findWebsiteFavoriteControl(characterId, row);
      if (control) break;
      await wait(250);
    }
    if (!control) throw new Error(`没有找到“${row?.name || characterId}”对应的网页收藏按钮`);

    try {
      control.click();
    } catch (error) {
      throw new Error(`点击“${row?.name || characterId}”的收藏按钮失败：${String(error?.message || error)}`);
    }

    // 进入队列前已经根据可靠列表状态或单角色详情确认未收藏；
    // 这里直接交给网站原生点击流程，不再为每个角色重复请求详情。
    await wait(750);
    return true;
  }

  async function ensureFavoriteFromCharacterDetail(characterId, row = {}) {
    // 作者作品列表的 isFollowed 目前不可靠；单角色详情才是服务器当前收藏状态。
    // 分享链接打开后网站有时已经自动恢复收藏，此时无需再切换一次按钮。
    const detail = await requestCharacterDetail(String(characterId));
    if (detail?.favoriteKnown === true) {
      if (detail.isFavorite) return true;
      return clickWebsiteFavoriteFromKnownUnfavorite(characterId, row);
    }
    // 接口没有返回收藏字段或临时失败时，才退回页面按钮的状态识别。
    const nativeHandled = await tryWebsiteFavoriteClick(characterId, true, row);
    if (!nativeHandled) throw new Error(`角色详情和当前页面都无法确认“${row?.name || characterId}”的收藏状态`);
    return true;
  }
  async function requestShareCode(characterId) {
    scanStoredAuthorization();
    const url = new URL('/api/characters/share_code', location.origin);
    url.searchParams.set('id', String(characterId));
    const headers = { Accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;
    let response = await favoriteFetch(url.href, { method: 'GET', credentials: 'include', headers }, '分享链接查询');
    // 页面可能还留着旧 Bearer，但 Cookie 登录仍然正常。分享链接接口先去掉旧令牌重试，
    // 避免把单个接口的 401 错报成整个账号登录过期。
    if ((response.status === 401 || response.status === 403) && authorization) {
      response = await favoriteFetch(url.href, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' }
      }, '分享链接查询（Cookie 重试）');
    }
    const raw = await response.text();
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
    if (response.status === 429) throw new RateLimitError('分享链接查询');
    if (response.status === 401 || response.status === 403) return null;
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(body?.message || body?.reason || raw || `HTTP ${response.status}`);
    if (body?.code != null && body.code !== 200) return null;
    const code = String(body?.data?.shareCode || '').trim();
    if (!code) return null;
    shareCodeCache.set(String(characterId), code);
    saveShareCodeCache();
    return code;
  }

  function shareUrlFromCode(shareCode) {
    const url = new URL('/chat', location.origin);
    url.searchParams.set('shareCode', String(shareCode));
    return url.href;
  }

  function favoriteShareRecoveryRemaining(task) {
    return Math.max(0, (task?.rows?.length || 0) - Number(task?.index || 0));
  }

  function pauseFavoriteShareRecoveryTask(task, reason = '用户中断') {
    task.paused = true;
    task.pauseRequested = false;
    task.pauseReason = reason;
    saveFavoriteShareRecoveryJob(task);
    state.status = `链接收藏检测已暂停：完成 ${Number(task.index || 0)}/${task.rows.length} 个，剩余 ${favoriteShareRecoveryRemaining(task)} 个。可以继续或彻底取消。`;
  }

  function stopFavoriteShareRecoveryAtSafePoint(task) {
    const latest = loadFavoriteShareRecoveryJob();
    if (latest) {
      task.pauseRequested = Boolean(latest.pauseRequested);
      task.cancelRequested = Boolean(latest.cancelRequested);
    }
    if (task.cancelRequested) {
      clearFavoriteShareRecoveryJob();
      state.status = `已取消链接收藏检测；已完成 ${Number(task.index || 0)}/${task.rows.length} 个，下次不会继续。`;
      return true;
    }
    if (task.pauseRequested) {
      pauseFavoriteShareRecoveryTask(task);
      return true;
    }
    return false;
  }

  function applyRecoveredFavoriteState(row) {
    const id = String(row?.characterId || '');
    if (!id) return;
    const sameId = item => String(item?.characterId || '') === id;
    // 取消收藏时该角色会先从 favoriteOnly 中移除。恢复成功后先补回来源行，
    // 再走统一状态更新，避免网站已收藏而面板计数和本地缓存仍少一个。
    if (!state.chatted.some(sameId) && !state.favoriteOnly.some(sameId)) {
      state.favoriteOnly = [{ ...row, isFavorite: true, favoriteKnown: true }, ...state.favoriteOnly];
    }
    applyFavoriteState(id, true);
  }

  async function processFavoriteShareRecoveryJob(automatic = false) {
    let task = loadFavoriteShareRecoveryJob();
    if (!task || !Array.isArray(task.rows) || state.shareRecoveryLoading || task.paused) return;
    state.shareRecoveryLoading = true;
    let navigating = false;
    let automaticWait = Boolean(automatic);
    try {
      while (task.index < task.rows.length) {
        const row = task.rows[task.index];
        if (!row?.characterId) {
          task.index += 1;
          task.phase = 'checking';
          saveFavoriteShareRecoveryJob(task);
          continue;
        }
        state.shareRecoveryCharacterId = String(row.characterId);
        state.favoritePendingIds.add(String(row.characterId));

        if (task.phase === 'unfavorited') {
          state.status = `已从分享链接打开“${row.name || '未命名角色'}”，正在重新收藏（${task.index + 1}/${task.rows.length}）……`;
          render();
          if (automaticWait) await wait(2500);
          automaticWait = false;
          try {
            await ensureFavoriteFromCharacterDetail(row.characterId, row);
            applyRecoveredFavoriteState(row);
          } catch (error) {
            task.paused = true;
            task.pauseRequested = false;
            task.pauseReason = '重新收藏失败';
            saveFavoriteShareRecoveryJob(task);
            appendRunLog('error', `分享链接重新收藏失败：${row.name || row.characterId}`, error);
            state.status = `“${row.name || '未命名角色'}”重新收藏失败，任务已暂停：${explainFailure(error)}请点击继续重试，恢复任务不会丢失。`;
            pageWindow.alert(state.status);
            return;
          }
          appendRunLog('info', `分享链接重新收藏成功：${row.name || row.characterId}`, {
            characterId: String(row.characterId),
            shareUrl: task.shareUrl || shareUrlFromCode(task.shareCode)
          });
          task.converted = Number(task.converted || 0) + 1;
          task.index += 1;
          task.phase = 'checking';
          task.shareCode = '';
          task.shareUrl = '';
          task.navigationStartedAt = 0;
          state.favoritePendingIds.delete(String(row.characterId));
          saveFavoriteShareRecoveryJob(task);
          if (stopFavoriteShareRecoveryAtSafePoint(task)) return;
          if (task.index < task.rows.length) await wait(700);
          continue;
        }

        if (stopFavoriteShareRecoveryAtSafePoint(task)) return;
        if (shareCodeCache.has(String(row.characterId))) {
          task.cachedSkipped = Number(task.cachedSkipped || 0) + 1;
          task.index += 1;
          task.phase = 'checking';
          state.favoritePendingIds.delete(String(row.characterId));
          saveFavoriteShareRecoveryJob(task);
          continue;
        }
        state.status = `正在检测 ${task.index + 1}/${task.rows.length}：“${row.name || '未命名角色'}”的分享链接……`;
        render();
        let shareCode = '';
        try {
          shareCode = shareCodeCache.get(String(row.characterId)) || await requestShareCode(row.characterId) || '';
        } catch (error) {
          if (error instanceof RateLimitError) {
            pauseFavoriteShareRecoveryTask(task, '网站限流');
            state.status += ' 检测到 HTTP 429，请稍后再继续。';
            return;
          }
          task.failures = [...(task.failures || []), `${row.name || row.characterId}：${explainFailure(error)}`];
          appendRunLog('warn', `检测角色分享链接失败：${row.name || row.characterId}`, error);
          task.index += 1;
          task.phase = 'checking';
          state.favoritePendingIds.delete(String(row.characterId));
          saveFavoriteShareRecoveryJob(task);
          continue;
        }
        if (stopFavoriteShareRecoveryAtSafePoint(task)) return;
        if (!shareCode) {
          task.skipped = Number(task.skipped || 0) + 1;
          task.index += 1;
          task.phase = 'checking';
          state.favoritePendingIds.delete(String(row.characterId));
          saveFavoriteShareRecoveryJob(task);
          continue;
        }

        task.shareCode = shareCode;
        task.shareUrl = shareUrlFromCode(shareCode);
        task.phase = 'link-ready';
        if (!saveFavoriteShareRecoveryJob(task)) throw new Error('恢复队列无法写入浏览器本地存储；为保护原收藏，任务已停止');
        let unfavorited = false;
        try {
          state.status = `已保存“${row.name || '未命名角色'}”的分享链接，正在取消原收藏……`;
          render();
          await requestFavorite(row.characterId, false);
          unfavorited = true;
          task.phase = 'unfavorited';
          task.navigationStartedAt = Date.now();
          if (!saveFavoriteShareRecoveryJob(task)) throw new Error('取消收藏后无法保存恢复状态');
          applyFavoriteState(row.characterId, false);
          state.status = `正在打开“${row.name || '未命名角色'}”的分享链接，打开后会自动重新收藏……`;
          render();
          navigating = true;
          pageWindow.location.assign(task.shareUrl);
          return;
        } catch (error) {
          if (unfavorited) {
            try {
              await requestFavorite(row.characterId, true);
              applyRecoveredFavoriteState(row);
              task.phase = 'checking';
              task.shareCode = '';
              task.shareUrl = '';
              task.navigationStartedAt = 0;
              task.failures = [...(task.failures || []), `${row.name || row.characterId}：${explainFailure(error)}`];
              task.index += 1;
              saveFavoriteShareRecoveryJob(task);
            } catch (restoreError) {
              task.phase = 'unfavorited';
              task.paused = true;
              saveFavoriteShareRecoveryJob(task);
              appendRunLog('error', `打开分享链接失败且恢复收藏失败：${row.name || row.characterId}`, restoreError);
              state.status = `“${row.name || '未命名角色'}”恢复收藏失败，任务已保留：${explainFailure(restoreError)}`;
              pageWindow.alert(state.status);
              return;
            }
          } else {
            task.failures = [...(task.failures || []), `${row.name || row.characterId}：${explainFailure(error)}`];
            task.index += 1;
            task.phase = 'checking';
            task.shareCode = '';
            task.shareUrl = '';
            saveFavoriteShareRecoveryJob(task);
          }
          appendRunLog('error', `分享链接转换失败：${row.name || row.characterId}`, error);
        }
      }

      const summary = `链接收藏检测完成：本次待处理 ${task.rows.length} 个，成功转为分享链接收藏 ${Number(task.converted || 0)} 个，本地已有记录跳过 ${Number(task.cachedSkipped || 0) + Number(task.cachedAtStart || 0)} 个，无可用链接 ${Number(task.skipped || 0)} 个，失败 ${(task.failures || []).length} 个。`;
      clearFavoriteShareRecoveryJob();
      state.status = summary;
      appendRunLog('info', summary, { failures: task.failures || [] });
      pageWindow.alert(summary);
    } catch (error) {
      task = loadFavoriteShareRecoveryJob() || task;
      if (task) {
        task.paused = true;
        task.pauseRequested = false;
        task.pauseReason = '任务异常';
        saveFavoriteShareRecoveryJob(task);
      }
      appendRunLog('error', '链接收藏检测异常暂停', error);
      state.status = `链接收藏检测出现问题并已暂停：${explainFailure(error)}队列和当前恢复状态均已保留。`;
      pageWindow.alert(state.status);
    } finally {
      if (!navigating) {
        state.favoritePendingIds.delete(String(state.shareRecoveryCharacterId || ''));
        state.shareRecoveryLoading = false;
        state.shareRecoveryCharacterId = '';
        render();
      }
    }
  }

  async function startFavoriteShareRecoveryJob() {
    if (state.shareRecoveryLoading || state.favoriteRunning) return;
    scanStoredAuthorization();
    if (!maskAccountScope) {
      state.status = '暂时无法识别当前账号，未开始检测。请先打开任意角色聊天页，等待页面加载完成后重试。';
      render();
      return;
    }
    const existing = loadFavoriteShareRecoveryJob();
    if (existing) {
      existing.paused = false;
      existing.pauseRequested = false;
      existing.cancelRequested = false;
      saveFavoriteShareRecoveryJob(existing);
      await processFavoriteShareRecoveryJob(false);
      return;
    }
    const allRows = [...new Map(state.favoriteOnly.filter(row => row?.characterId).map(row => [String(row.characterId), {
      ...row,
      characterId: String(row.characterId),
      name: row.name || '未命名角色'
    }])).values()];
    if (!allRows.length) {
      state.status = '当前没有“收藏未聊”角色需要检测。';
      render();
      return;
    }
    const rows = allRows.filter(row => !shareCodeCache.has(String(row.characterId)));
    const cachedAtStart = allRows.length - rows.length;
    if (!rows.length) {
      state.status = `当前 ${allRows.length} 个“收藏未聊”角色在本账号下都已有分享链接记录，不需要再次取消和重新收藏。`;
      render();
      return;
    }
    const confirmed = pageWindow.confirm(
      `检测 ${rows.length} 个尚无本地分享链接记录的“收藏未聊”角色吗？${cachedAtStart ? `\n本账号已有记录的 ${cachedAtStart} 个会直接跳过。` : ''}\n\n` +
      '脚本会严格一次处理一个：先取得并保存分享链接，再取消原收藏，从分享链接打开后重新收藏。没有分享链接的角色会保持原收藏不变。任务可以中断。'
    );
    if (!confirmed) return;
    const task = {
      version: 2,
      rows,
      index: 0,
      phase: 'checking',
      shareCode: '',
      shareUrl: '',
      paused: false,
      pauseRequested: false,
      cancelRequested: false,
      converted: 0,
      cachedAtStart,
      cachedSkipped: 0,
      skipped: 0,
      failures: [],
      navigationStartedAt: 0,
      createdAt: Date.now()
    };
    if (!saveFavoriteShareRecoveryJob(task)) {
      state.status = '检测队列无法保存到浏览器本地存储；为保护收藏，任务没有开始。';
      render();
      return;
    }
    appendRunLog('info', `开始检测 ${rows.length} 个收藏未聊角色的分享链接`);
    await processFavoriteShareRecoveryJob(false);
  }

  function requestFavoriteShareRecoveryPause() {
    const task = loadFavoriteShareRecoveryJob();
    if (!task) return;
    task.pauseRequested = true;
    saveFavoriteShareRecoveryJob(task);
    state.status = task.phase === 'unfavorited'
      ? '已请求中断；当前角色会先安全地重新收藏，完成后停止。'
      : '已请求中断；当前检测结束后停止，不会再处理下一个角色。';
    render();
  }

  async function cancelFavoriteShareRecoveryJob() {
    const task = loadFavoriteShareRecoveryJob();
    if (!task) return;
    if (state.shareRecoveryLoading) {
      task.cancelRequested = true;
      saveFavoriteShareRecoveryJob(task);
      state.status = task.phase === 'unfavorited'
        ? '正在取消任务；当前角色会先恢复收藏，然后清除剩余队列。'
        : '正在取消任务；当前操作结束后会清除剩余队列。';
      render();
      return;
    }
    const row = task.rows?.[task.index];
    if (task.phase === 'unfavorited' && row?.characterId) {
      state.shareRecoveryLoading = true;
      state.status = `取消任务前正在恢复“${row.name || '未命名角色'}”的收藏……`;
      render();
      try {
        await ensureFavoriteFromCharacterDetail(row.characterId, row);
        applyRecoveredFavoriteState(row);
      } catch (error) {
        state.status = `恢复当前角色收藏失败，任务没有清除：${explainFailure(error)}`;
        state.shareRecoveryLoading = false;
        render();
        return;
      }
      state.shareRecoveryLoading = false;
    }
    clearFavoriteShareRecoveryJob();
    state.status = '已彻底取消链接收藏检测；下次不会继续。';
    render();
  }

  function rememberSiteSearchRows(rows) {
    if (!Array.isArray(rows) || !rows.length) return 0;
    const found = new Map(state.siteSearchRows.map(row => [String(row.characterId), row]));
    const knownFavorites = new Map([...state.chatted, ...state.chattedNotFavorite, ...state.favoriteOnly]
      .filter(row => row?.favoriteKnown === true)
      .map(row => [String(row.characterId), row]));
    let added = 0;
    rows.map(normalize).filter(row => row.characterId).forEach(row => {
      const key = String(row.characterId);
      if (!found.has(key)) added += 1;
      const current = found.get(key);
      const cached = Object.prototype.hasOwnProperty.call(state.siteFavoriteStates, key)
        ? { characterId: key, isFavorite: Boolean(state.siteFavoriteStates[key]), favoriteKnown: true }
        : null;
      const previous = current?.favoriteKnown === true ? current : cached || knownFavorites.get(key) || current;
      found.set(key, previous ? mergeRole(previous, row) : row);
    });
    state.siteSearchRows = [...found.values()];
    const validIds = new Set(state.siteSearchRows.map(row => String(row.characterId)));
    state.selectedSiteCharacterIds = new Set([...state.selectedSiteCharacterIds].filter(id => validIds.has(String(id))));
    return added;
  }
  function applyFavoriteState(characterId, isFavorite) {
    const id = String(characterId);
    state.favoritePendingIds.delete(id);
    state.siteFavoriteStates[id] = Boolean(isFavorite);
    const sameId = item => String(item?.characterId || '') === id;
    const allRows = [...state.chatted, ...state.chattedNotFavorite, ...state.favoriteOnly, ...state.siteSearchRows];
    const sourceRow = allRows.find(sameId);
    const update = item => sameId(item) ? { ...item, isFavorite: Boolean(isFavorite), favoriteKnown: true, favoriteNeedsDetail: false } : item;
    state.chatted = state.chatted.map(update);
    state.chattedNotFavorite = state.chattedNotFavorite.map(update);
    state.favoriteOnly = state.favoriteOnly.map(update);
    state.siteSearchRows = state.siteSearchRows.map(update);
    if (isFavorite) {
      state.chattedNotFavorite = state.chattedNotFavorite.filter(item => !sameId(item));
      const row = state.chatted.find(sameId) || sourceRow;
      if (row && !state.chatted.some(sameId) && !state.favoriteOnly.some(sameId)) {
        state.favoriteOnly = [{ ...row, isFavorite: true, favoriteKnown: true }, ...state.favoriteOnly];
      }
    } else {
      state.favoriteOnly = state.favoriteOnly.filter(item => !sameId(item));
      const row = state.chatted.find(sameId) || sourceRow;
      if (row?.lastSessionId && !state.chattedNotFavorite.some(sameId)) state.chattedNotFavorite = [...state.chattedNotFavorite, { ...row, isFavorite: false, favoriteKnown: true }];
    }
    saveRoleCache();
  }

  function favoriteFolderRows(body) {
    const data = body?.data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.list)) return data.list;
    if (Array.isArray(data?.rows)) return data.rows;
    if (Array.isArray(body?.data)) return body.data;
    if (Array.isArray(body?.items)) return body.items;
    if (Array.isArray(body?.list)) return body.list;
    if (Array.isArray(body?.rows)) return body.rows;
    return [];
  }

  async function fetchFavoriteApi(url, options = {}) {
    scanStoredAuthorization();
    const originalHeaders = new Headers(options.headers || {});
    if (authorization) originalHeaders.set('Authorization', authorization);
    let response = await favoriteFetch(url, { ...options, headers: originalHeaders, credentials: 'include' }, '收藏夹请求');
    // 某些页面会暂时保留旧 Bearer；接口实际仍可用当前登录 Cookie。
    // 遇到鉴权拒绝时去掉旧令牌重试一次，避免把“登录状态正常”误判成收藏夹失败。
    if ((response.status === 401 || response.status === 403) && authorization) {
      const cookieHeaders = new Headers(options.headers || {});
      response = await favoriteFetch(url, { ...options, headers: cookieHeaders, credentials: 'include' }, '收藏夹请求（Cookie 重试）');
    }
    return response;
  }

  async function requestFavoriteFolders() {
    scanStoredAuthorization();
    const folders = [];
    const pageSize = 20;
    const seenPageSignatures = new Set();
    for (let page = 1; page <= 500; page += 1) {
      // /api/favorites/ 是读取某个收藏夹内容的接口，需要 ID；列表接口使用 /api/favorites/list.
      const url = new URL('/api/favorites/list', location.origin);
      url.searchParams.set('pageNum', String(page));
      url.searchParams.set('pageSize', String(pageSize));
      const headers = { Accept: 'application/json' };
      if (authorization) headers.Authorization = authorization;
      const response = await fetchFavoriteApi(url.href, { method: 'GET', headers });
      const raw = await response.text();
      let body = null;
      try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
      if (response.status === 429) throw new RateLimitError('收藏夹列表查询');
      if (response.status === 401 || response.status === 403) throw new Error(loginErrorMessage(response.status, '收藏夹列表查询'));
      if (!response.ok || (body?.code != null && Number(body.code) !== 200)) {
        throw new Error(body?.message || body?.reason || raw || `HTTP ${response.status}`);
      }
      const data = body?.data || {};
      const rows = favoriteFolderRows(body);
      const signature = rows.map(folder => `${String(folder?.id || '')}:${String(folder?.name || '')}`).join('|');
      if (signature && seenPageSignatures.has(signature)) {
        appendRunLog('warn', `收藏夹列表第 ${page} 页与前一页重复，已停止继续翻页以避免死循环`);
        break;
      }
      if (signature) seenPageSignatures.add(signature);
      folders.push(...rows.filter(folder => folder?.id != null));
      const total = Number(data?.total);
      const hasNext = data?.hasNext === true
        || (data?.hasNext == null && data?.hasMore === true)
        || (data?.hasNext == null && data?.hasMore == null && Number.isFinite(total) && page * pageSize < total)
        || (data?.hasNext == null && data?.hasMore == null && !Number.isFinite(total) && rows.length >= pageSize);
      if (!rows.length || !hasNext) break;
    }
    return folders;
  }

  async function createFavoriteFolder(name) {
    const url = new URL('/api/favorites/', location.origin);
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const response = await fetchFavoriteApi(url.href, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: String(name) })
    });
    const raw = await response.text();
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
    if (response.status === 429) throw new RateLimitError('创建收藏夹');
    if (response.status === 401 || response.status === 403) throw new Error(loginErrorMessage(response.status, '创建收藏夹'));
    if (!response.ok || (body?.code != null && Number(body.code) !== 200)) {
      throw new Error(body?.message || body?.reason || raw || `HTTP ${response.status}`);
    }
    const folder = body?.data;
    if (!folder?.id) throw new Error('创建收藏夹成功，但返回结果没有收藏夹 ID。');
    return folder;
  }

  async function addCharactersToFavoriteFolder(folderId, characterIds) {
    const ids = [...new Set((characterIds || []).map(String).filter(Boolean))];
    if (!folderId || !ids.length) return;
    const url = new URL('/api/favorites/characters', location.origin);
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const response = await fetchFavoriteApi(url.href, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ folderId: Number(folderId) || folderId, addCharacterIds: ids })
    });
    const raw = await response.text();
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
    if (response.status === 429) throw new RateLimitError('加入收藏夹');
    if (response.status === 401 || response.status === 403) throw new Error(loginErrorMessage(response.status, '加入收藏夹'));
    if (!response.ok || (body?.code != null && Number(body.code) !== 200) || body?.data?.success === false) {
      throw new Error(body?.message || body?.reason || raw || `HTTP ${response.status}`);
    }
  }

  function favoriteFolderCharacterRows(body) {
    const data = body?.data;
    const candidates = [
      data?.characters, data?.data, data?.items, data?.list, data?.rows,
      body?.characters, body?.items, body?.list, body?.rows
    ];
    return candidates.find(rows => Array.isArray(rows)) || [];
  }

  function favoriteFolderCharacterIds(body) {
    return new Set(favoriteFolderCharacterRows(body).map(item => String(
      item?.characterId || item?.characterID || item?.roleId || item?.id
        || item?.character?.id || item?.character?.characterId || item?.character?.characterID || ''
    ).trim()).filter(Boolean));
  }

  async function requestFavoriteFolder(folderId) {
    scanStoredAuthorization();
    const url = new URL('/api/favorites/', location.origin);
    url.searchParams.set('id', String(folderId));
    const headers = { Accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const response = await fetchFavoriteApi(url.href, { method: 'GET', headers });
    const raw = await response.text();
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
    if (response.status === 429) throw new RateLimitError('读取收藏夹内容');
    if (response.status === 401 || response.status === 403) throw new Error(loginErrorMessage(response.status, '读取收藏夹内容'));
    if (!response.ok || (body?.code != null && Number(body.code) !== 200)) {
      throw new Error(body?.message || body?.reason || raw || `HTTP ${response.status}`);
    }
    return body;
  }

  async function deleteFavoriteFolder(folderId) {
    scanStoredAuthorization();
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const url = new URL('/api/favorites/', location.origin);
    let response = await fetchFavoriteApi(url.href, {
      method: 'DELETE', headers, body: JSON.stringify({ id: Number(folderId) || folderId })
    });
    let raw = await response.text();
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
    const succeeded = response.ok && (body?.code == null || Number(body.code) === 200) && body?.data?.success !== false;
    if (!succeeded && (response.status === 400 || response.status === 404 || response.status === 405)) {
      // 兼容把 ID 放在查询参数中的接口版本；仅在第一次请求明确失败时重试。
      const queryUrl = new URL('/api/favorites/', location.origin);
      queryUrl.searchParams.set('id', String(folderId));
      response = await fetchFavoriteApi(queryUrl.href, { method: 'DELETE', headers: { Accept: 'application/json' } });
      raw = await response.text();
      try { body = raw ? JSON.parse(raw) : null; } catch (_) { body = null; }
    }
    if (response.status === 429) throw new RateLimitError('删除收藏夹');
    if (response.status === 401 || response.status === 403) throw new Error(loginErrorMessage(response.status, '删除收藏夹'));
    if (!response.ok || (body?.code != null && Number(body.code) !== 200) || body?.data?.success === false) {
      throw new Error(body?.message || body?.reason || raw || `HTTP ${response.status}`);
    }
  }

  function favoriteFolderId(folder) {
    return String(folder?.id ?? '').trim();
  }

  function favoriteFolderName(folder) {
    return String(folder?.name || folder?.folderName || `收藏夹 ${favoriteFolderId(folder) || '未知'}`);
  }

  function favoriteFolderCount(folder) {
    const value = folder?._characterCount ?? folder?.characterCount ?? folder?.charactersCount ?? folder?.count ?? folder?.total ?? folder?.characterNum;
    return Number.isFinite(Number(value)) ? Number(value) : null;
  }

  function renderFavoriteFolderDeleteModal() {
    const modal = panel?.querySelector('#mufy-recovery-folder-delete-modal');
    if (!modal) return;
    const list = modal.querySelector('#mufy-recovery-folder-delete-list');
    const selected = state.selectedFavoriteFolderIds;
    const rows = state.favoriteFolderDeleteRows;
    const emptyRows = rows.filter(folder => folder?._countVerified === true && favoriteFolderCount(folder) === 0);
    const visibleRows = state.favoriteFolderDeleteEmptyOnly ? emptyRows : rows;
    const selectedCount = rows.filter(folder => selected.has(favoriteFolderId(folder))).length;
    if (state.favoriteFolderDeleteLoading && !rows.length) {
      list.innerHTML = '<div class="mufy-recovery-folder-delete-empty">正在读取收藏夹……</div>';
    } else if (!rows.length) {
      list.innerHTML = '<div class="mufy-recovery-folder-delete-empty">没有可删除的收藏夹</div>';
    } else if (!visibleRows.length) {
      list.innerHTML = '<div class="mufy-recovery-folder-delete-empty">当前没有空收藏夹；关闭“只看空收藏夹”可管理全部收藏夹</div>';
    } else {
      list.innerHTML = visibleRows.map(folder => {
        const id = favoriteFolderId(folder);
        const count = favoriteFolderCount(folder);
        return `<label class="mufy-recovery-folder-delete-item"><input type="checkbox" data-folder-delete-id="${esc(id)}" ${selected.has(id) ? 'checked' : ''} ${state.favoriteFolderDeleteLoading ? 'disabled' : ''}><span><strong>${esc(favoriteFolderName(folder))}</strong><small>ID：${esc(id)}${count == null ? '' : ` · ${count} 个角色`}${folder?._countError ? ' · 数量读取失败' : ''}</small></span></label>`;
      }).join('');
    }
    const summary = modal.querySelector('#mufy-recovery-folder-delete-summary');
    if (summary) summary.textContent = `共 ${rows.length} 个收藏夹，其中空收藏夹 ${emptyRows.length} 个，已选择 ${selectedCount} 个。删除收藏夹不会取消其中角色的收藏。`;
    const emptyOnly = modal.querySelector('#mufy-recovery-folder-delete-empty-only');
    if (emptyOnly) {
      emptyOnly.checked = state.favoriteFolderDeleteEmptyOnly;
      emptyOnly.disabled = state.favoriteFolderDeleteLoading;
    }
    const selectAll = modal.querySelector('#mufy-recovery-folder-delete-select-all');
    const clear = modal.querySelector('#mufy-recovery-folder-delete-clear');
    const removeEmpty = modal.querySelector('#mufy-recovery-folder-delete-empty');
    const remove = modal.querySelector('#mufy-recovery-folder-delete-confirm');
    if (selectAll) selectAll.disabled = state.favoriteFolderDeleteLoading || !visibleRows.length || visibleRows.every(folder => selected.has(favoriteFolderId(folder)));
    if (clear) clear.disabled = state.favoriteFolderDeleteLoading || !selectedCount;
    if (removeEmpty) {
      removeEmpty.disabled = state.favoriteFolderDeleteLoading || !emptyRows.length;
      removeEmpty.textContent = `一键删除空夹 (${emptyRows.length})`;
    }
    if (remove) {
      remove.disabled = state.favoriteFolderDeleteLoading || !selectedCount;
      remove.textContent = state.favoriteFolderDeleteLoading ? '正在删除…' : `删除已选 (${selectedCount})`;
    }
  }

  async function openFavoriteFolderDeleteModal() {
    if (state.favoriteFolderDeleteLoading || state.favoriteRunning || state.authorFolderLoading) return;
    const modal = panel?.querySelector('#mufy-recovery-folder-delete-modal');
    if (!modal) return;
    modal.hidden = false;
    state.favoriteFolderDeleteRows = [];
    state.selectedFavoriteFolderIds.clear();
    state.favoriteFolderDeleteEmptyOnly = true;
    state.favoriteFolderDeleteLoading = true;
    state.status = '正在读取收藏夹列表……';
    renderFavoriteFolderDeleteModal();
    render();
    try {
      const folders = await requestFavoriteFolders();
      const unique = new Map();
      folders.forEach(folder => {
        const id = favoriteFolderId(folder);
        if (id && !unique.has(id)) unique.set(id, folder);
      });
      const folderRows = [...unique.values()];
      let nextFolderIndex = 0;
      let completedFolders = 0;
      let rateLimited = false;
      const scanWorker = async () => {
        while (!rateLimited) {
          const index = nextFolderIndex;
          nextFolderIndex += 1;
          if (index >= folderRows.length) return;
          const folder = folderRows[index];
          try {
            const body = await requestFavoriteFolder(favoriteFolderId(folder));
            folder._characterCount = favoriteFolderCharacterIds(body).size;
            folder._countVerified = true;
          } catch (error) {
            folder._countVerified = false;
            folder._countError = explainFailure(error);
            if (error instanceof RateLimitError) rateLimited = true;
            appendRunLog('warn', `读取收藏夹角色数量失败：${favoriteFolderName(folder)}`, error);
          } finally {
            completedFolders += 1;
            state.status = `正在并行核对收藏夹角色数量 ${completedFolders}/${folderRows.length}……`;
            const status = panel?.querySelector('#mufy-recovery-status');
            if (status) status.textContent = state.status;
          }
        }
      };
      const workerCount = Math.min(4, folderRows.length);
      await Promise.all(Array.from({ length: workerCount }, () => scanWorker()));
      state.favoriteFolderDeleteRows = folderRows;
      const emptyCount = folderRows.filter(folder => folder?._countVerified === true && favoriteFolderCount(folder) === 0).length;
      const unverifiedCount = folderRows.filter(folder => folder?._countVerified !== true).length;
      state.status = `已读取 ${folderRows.length} 个收藏夹，其中空收藏夹 ${emptyCount} 个${unverifiedCount ? `，未核验 ${unverifiedCount} 个` : ''}。默认只显示空收藏夹。`;
      if (rateLimited) state.status += ' 网站返回请求过快，已停止继续核验；稍后重新打开可再试。';
    } catch (error) {
      appendRunLog('error', '读取待删除收藏夹列表失败', error);
      state.status = `读取收藏夹失败：${explainFailure(error)}`;
      pageWindow.alert(state.status);
    } finally {
      state.favoriteFolderDeleteLoading = false;
      renderFavoriteFolderDeleteModal();
      render();
    }
  }

  async function deleteSelectedFavoriteFolders() {
    if (state.favoriteFolderDeleteLoading) return;
    const targets = state.favoriteFolderDeleteRows.filter(folder => state.selectedFavoriteFolderIds.has(favoriteFolderId(folder)));
    if (!targets.length) return;
    const preview = targets.slice(0, 12).map(folder => `• ${favoriteFolderName(folder)}`).join('\n');
    const more = targets.length > 12 ? `\n……另有 ${targets.length - 12} 个` : '';
    const confirmed = pageWindow.confirm(
      `确定删除已选的 ${targets.length} 个收藏夹吗？\n\n${preview}${more}\n\n只删除收藏夹分组，不会取消其中角色的收藏。此操作不能由脚本撤回。`
    );
    if (!confirmed) return;
    state.favoriteFolderDeleteLoading = true;
    renderFavoriteFolderDeleteModal();
    const deletedIds = new Set();
    const failures = [];
    let attempted = 0;
    for (let index = 0; index < targets.length; index += 1) {
      const folder = targets[index];
      const id = favoriteFolderId(folder);
      attempted += 1;
      state.status = `正在删除收藏夹 ${index + 1}/${targets.length}：“${favoriteFolderName(folder)}”……`;
      render();
      try {
        await deleteFavoriteFolder(id);
        deletedIds.add(id);
        appendRunLog('info', `已删除收藏夹：${favoriteFolderName(folder)}`, { folderId: id });
      } catch (error) {
        failures.push(`${favoriteFolderName(folder)}：${explainFailure(error)}`);
        appendRunLog('error', `批量删除收藏夹失败：${favoriteFolderName(folder)}`, error);
        if (error instanceof RateLimitError) break;
      }
      if (index < targets.length - 1) await wait(250);
    }
    if (deletedIds.size) {
      const folderMap = loadAuthorFolderMap();
      Object.keys(folderMap).forEach(key => {
        if (deletedIds.has(String(folderMap[key]))) delete folderMap[key];
      });
      saveAuthorFolderMap(folderMap);
      state.favoriteFolderDeleteRows = state.favoriteFolderDeleteRows.filter(folder => !deletedIds.has(favoriteFolderId(folder)));
      deletedIds.forEach(id => state.selectedFavoriteFolderIds.delete(id));
    }
    state.favoriteFolderDeleteLoading = false;
    const unprocessed = Math.max(0, targets.length - attempted);
    state.status = `收藏夹批量删除完成：成功 ${deletedIds.size} 个，失败 ${failures.length} 个${unprocessed ? `，因请求受限暂未处理 ${unprocessed} 个` : ''}。角色收藏没有取消。`;
    if (failures.length) state.status += ` 首个失败：${failures[0]}`;
    renderFavoriteFolderDeleteModal();
    render();
    pageWindow.alert(state.status);
  }

  async function deleteEmptyFavoriteFolders() {
    if (state.favoriteFolderDeleteLoading) return;
    const emptyRows = state.favoriteFolderDeleteRows.filter(folder => folder?._countVerified === true && favoriteFolderCount(folder) === 0);
    if (!emptyRows.length) return;
    state.selectedFavoriteFolderIds.clear();
    emptyRows.forEach(folder => state.selectedFavoriteFolderIds.add(favoriteFolderId(folder)));
    renderFavoriteFolderDeleteModal();
    await deleteSelectedFavoriteFolders();
  }

  function loadAuthorFolderMap() {
    try {
      const value = JSON.parse(loadAndMigrateScopedValue(AUTHOR_FOLDER_MAP_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) {
      return {};
    }
  }

  function saveAuthorFolderMap(map) {
    try { localStorage.setItem(accountStorageKey(AUTHOR_FOLDER_MAP_KEY), JSON.stringify(map || {})); } catch (_) {}
  }

  function authorFolderName(row) {
    const name = String(row?.authorName || '').trim().replace(/\s+/g, ' ');
    const authorId = String(row?.authorId || '').trim();
    if (!name || /^未知作者(?:（|$)/.test(name) || /^作者 ID\s/i.test(name)) return authorId ? `作者 ID ${authorId}` : '';
    // 默认名称不能代表唯一作者；有作者 ID 时改用 ID 命名，无 ID 时跳过而不是合并。
    if (isDefaultAuthorName(name)) return authorId ? `作者 ID ${authorId}` : '';
    return name;
  }

  function authorFolderGroupKey(row) {
    const authorId = String(row?.authorId || '').trim();
    const name = authorFolderName(row);
    return authorId ? `id:${authorId}` : (name ? `name:${name}` : `unknown:${String(row?.characterId || '')}`);
  }

  function authorFolderMigrationDone() {
    try { return loadAndMigrateScopedValue(AUTHOR_FOLDER_MIGRATION_KEY) === '1'; } catch (_) { return false; }
  }

  function markAuthorFolderMigrationDone() {
    try { localStorage.setItem(accountStorageKey(AUTHOR_FOLDER_MIGRATION_KEY), '1'); } catch (_) {}
  }

  function loadAutoAddFavoriteFolderSetting() {
    try {
      const saved = loadAndMigrateScopedValue(AUTO_ADD_FAVORITE_FOLDER_KEY);
      return saved == null ? true : saved === '1';
    } catch (_) { return true; }
  }

  function setAutoAddFavoriteFolderSetting(enabled) {
    state.autoAddFavoriteFolder = Boolean(enabled);
    try {
      localStorage.setItem(accountStorageKey(AUTO_ADD_FAVORITE_FOLDER_KEY), state.autoAddFavoriteFolder ? '1' : '0');
    } catch (error) {
      appendRunLog('error', '保存“收藏后自动加入收藏夹”设置失败', error);
      state.status = '设置未能保存到浏览器本地存储，刷新后可能恢复原值。';
    }
    render();
  }

  function rowsForAuthorFolderSync(job) {
    const done = authorFolderMigrationDone();
    // 自动收藏只整理本次收藏成功的角色；历史收藏由“按作者整理收藏夹”手动整理。
    const includeHistory = job?.manual === true || job?.includeHistory === true;
    const successfulIds = new Set((job?.favoritedIds || []).map(String).filter(Boolean));
    const found = new Map();
    const add = (row, force = false) => {
      const id = String(row?.characterId || '').trim();
      if (!id || !(force || successfulIds.has(id) || row?.isFavorite === true)) return;
      const existing = found.get(id);
      found.set(id, existing ? mergeRole(existing, row) : row);
    };
    if (includeHistory) {
      // 第一次整理或手动整理时，把脚本当前已经知道的历史收藏全部纳入；
      // 自动任务在首次整理完成后，只处理每次收藏任务中新成功的角色。
      state.favoriteOnly.forEach(row => add(row, true));
      state.chatted.forEach(row => add(row));
      state.siteSearchRows.forEach(row => add(row));
    }
    (job?.rows || []).forEach(row => add(row));
    return { done, rows: [...found.values()] };
  }

  async function organizeFavoritedCharactersByAuthor(job) {
    const sync = rowsForAuthorFolderSync(job);
    const groups = new Map();
    const rowGroupByCharacterId = new Map();
    let skippedNoAuthor = 0;
    sync.rows.forEach(row => {
      const id = String(row?.characterId || '');
      const authorName = authorFolderName(row);
      if (!authorName) {
        skippedNoAuthor += 1;
        return;
      }
      const key = authorFolderGroupKey(row);
      if (!groups.has(key)) groups.set(key, {
        key,
        authorId: String(row?.authorId || '').trim(),
        name: authorName,
        names: new Set(),
        ids: new Set()
      });
      const group = groups.get(key);
      group.names.add(authorName);
      group.ids.add(id);
      rowGroupByCharacterId.set(id, key);
    });
    const summary = {
      attempted: sync.rows.length,
      groups: groups.size,
      created: 0,
      reused: 0,
      added: 0,
      merged: 0,
      deleted: 0,
      skippedNoAuthor,
      failures: [],
      // 自动收藏只整理本次成功收藏的角色；历史收藏仅由“按作者整理收藏夹”手动整理。
      initialMigration: Boolean(!sync.done && (job?.manual || job?.includeHistory)),
      manual: Boolean(job?.manual)
    };
    if (!groups.size) return summary;
    state.status = job?.manual
      ? '正在按作者整理已知的 ' + groups.size + ' 个收藏夹……'
      : (summary.initialMigration
        ? '收藏已完成，首次整理历史收藏：正在按作者整理 ' + groups.size + ' 个收藏夹……'
        : '收藏已完成，正在按作者整理本次新增角色的 ' + groups.size + ' 个收藏夹……');
    render();
    let folders;
    try {
      folders = await requestFavoriteFolders();
    } catch (error) {
      appendRunLog('error', '读取收藏夹列表失败', error);
      summary.failures.push(`读取收藏夹列表：${explainFailure(error)}`);
      return summary;
    }
    const authorFolderMap = loadAuthorFolderMap();
    // 日常“收藏后自动归夹”只检查本次作者可能使用的收藏夹；
    // 手动“按作者整理收藏夹”才读取全部收藏夹内容并执行重复/混合收藏夹清理。
    const fullFolderAudit = Boolean(job?.manual || job?.includeHistory);
    const relevantNames = new Set([...groups.values()].flatMap(group => [...group.names, group.name]).map(name => String(name || '').trim()).filter(Boolean));
    const mappedFolderIds = new Set([...groups.values()].map(group => {
      const mapped = group.authorId ? authorFolderMap[`id:${group.authorId}`] : authorFolderMap[group.key];
      return String(mapped?.id || '');
    }).filter(Boolean));
    const foldersToInspect = fullFolderAudit
      ? folders
      : folders.filter(folder => mappedFolderIds.has(String(folder?.id || '')) || relevantNames.has(String(folder?.name || '').trim()));
    const folderDetails = new Map();
    for (let folderIndex = 0; folderIndex < foldersToInspect.length; folderIndex += 1) {
      const folder = foldersToInspect[folderIndex];
      if (!folder?.id) continue;
      state.status = fullFolderAudit
        ? `正在完整检查收藏夹 ${folderIndex + 1}/${foldersToInspect.length}：“${String(folder.name || folder.id)}”……`
        : `正在检查本次相关收藏夹 ${folderIndex + 1}/${foldersToInspect.length}：“${String(folder.name || folder.id)}”……`;
      render();
      try {
        const body = await requestFavoriteFolder(folder.id);
        const ids = favoriteFolderCharacterIds(body);
        const knownGroupKeys = new Set([...ids].map(id => rowGroupByCharacterId.get(String(id))).filter(Boolean));
        folderDetails.set(String(folder.id), {
          folder,
          ids,
          knownGroupKeys,
          mixed: knownGroupKeys.size > 1,
          unknownIds: new Set([...ids].filter(id => !rowGroupByCharacterId.has(String(id))))
        });
      } catch (error) {
        appendRunLog('error', `读取收藏夹内容失败：${String(folder.name || folder.id)}`, error);
        summary.failures.push(`读取收藏夹“${String(folder.name || folder.id)}”：${explainFailure(error)}`);
      }
    }
    const folderByName = new Map();
    folders.forEach(folder => {
      const name = String(folder?.name || '').trim();
      if (name && !folderByName.has(name)) folderByName.set(name, folder);
    });
    const targetFolderByGroup = new Map();
    const deletedFolderIds = new Set();
    const groupEntries = [...groups.values()];
    for (let groupIndex = 0; groupIndex < groupEntries.length; groupIndex += 1) {
      const group = groupEntries[groupIndex];
      const authorName = group.name;
      const ids = [...group.ids];
      state.status = `正在整理作者收藏夹 ${groupIndex + 1}/${groupEntries.length}：“${authorName}”……`;
      render();
      try {
        const mapped = group.authorId ? authorFolderMap[`id:${group.authorId}`] : authorFolderMap[group.key];
        const reliableName = !isDefaultAuthorName(authorName);
        const candidateDetails = [...folderDetails.values()].filter(detail => {
          const folderId = String(detail.folder.id);
          // 混合旧收藏夹不能作为任何作者的保留夹，否则会再次把多个作者混在一起。
          if (detail.mixed) return false;
          const exactName = reliableName && group.names.has(String(detail.folder.name || '').trim());
          const mappedId = String(mapped?.id || '') === folderId;
          const containsGroupRole = detail.knownGroupKeys.has(group.key) || ids.some(id => detail.ids.has(String(id)));
          return exactName || mappedId || containsGroupRole;
        });
        candidateDetails.sort((a, b) => {
          const aOverlap = ids.filter(id => a.ids.has(String(id))).length;
          const bOverlap = ids.filter(id => b.ids.has(String(id))).length;
          if (bOverlap !== aOverlap) return bOverlap - aOverlap;
          const aExact = group.names.has(String(a.folder.name || '').trim()) ? 1 : 0;
          const bExact = group.names.has(String(b.folder.name || '').trim()) ? 1 : 0;
          return bExact - aExact;
        });
        let folder = mapped?.id
          ? folders.find(item => String(item?.id) === String(mapped.id) && !folderDetails.get(String(item.id))?.mixed)
          : null;
        if (!folder) folder = candidateDetails[0]?.folder || (!group.authorId ? folderByName.get(authorName) : null);
        if (folder && folderDetails.get(String(folder.id))?.mixed) folder = null;
        if (folder?.id) {
          summary.reused += 1;
        } else {
          folder = await createFavoriteFolder(authorName);
          folderByName.set(authorName, folder);
          summary.created += 1;
          folderDetails.set(String(folder.id), { folder, ids: new Set(), knownGroupKeys: new Set([group.key]), mixed: false, unknownIds: new Set() });
        }
        const keepDetail = folderDetails.get(String(folder.id)) || { folder, ids: new Set(), knownGroupKeys: new Set([group.key]), mixed: false, unknownIds: new Set() };
        keepDetail.knownGroupKeys.add(group.key);
        targetFolderByGroup.set(group.key, String(folder.id));
        // 只合并明确属于当前作者的角色 ID，绝不把旧混合夹中的其他作者角色带过来。
        const sourceIds = new Set(ids);
        [...folderDetails.values()]
          .filter(detail => detail.knownGroupKeys.has(group.key))
          .forEach(detail => {
          if (String(detail.folder.id) === String(folder.id)) return;
          detail.ids.forEach(id => {
            if (rowGroupByCharacterId.get(String(id)) === group.key) sourceIds.add(String(id));
          });
          });
        const missingIds = [...sourceIds].filter(id => !keepDetail.ids.has(String(id)));
        if (missingIds.length) {
          await addCharactersToFavoriteFolder(folder.id, missingIds);
          missingIds.forEach(id => keepDetail.ids.add(String(id)));
          summary.added += missingIds.length;
        }
        const mapKey = group.authorId ? `id:${group.authorId}` : group.key;
        authorFolderMap[mapKey] = { id: String(folder.id), name: String(folder.name || authorName) };
      } catch (error) {
        appendRunLog('error', `整理作者收藏夹失败：${authorName}`, error);
        summary.failures.push(`${authorName}：${explainFailure(error)}`);
      }
    }
    if (fullFolderAudit) {
      // 只有手动完整整理才扫描并删除重复/混合旧夹，自动归夹不碰无关收藏夹。
      const allTargetDetails = new Map([...targetFolderByGroup.values()].map(id => [String(id), folderDetails.get(String(id))]).filter(([, detail]) => detail));
      for (const detail of folderDetails.values()) {
        const folderId = String(detail.folder.id);
        if (deletedFolderIds.has(folderId) || allTargetDetails.has(folderId) || !detail.ids.size) continue;
        const canDelete = detail.unknownIds.size === 0 && [...detail.ids].every(id => {
          const groupKey = rowGroupByCharacterId.get(String(id));
          const targetId = targetFolderByGroup.get(groupKey);
          const targetDetail = targetId ? folderDetails.get(String(targetId)) : null;
          return groupKey && targetId && targetId !== folderId && targetDetail?.ids.has(String(id));
        });
        if (!canDelete) {
          if (detail.mixed) {
            appendRunLog('warn', `保留未完全拆分的混合收藏夹：${String(detail.folder.name || detail.folder.id)}`);
            summary.failures.push(`收藏夹“${String(detail.folder.name || detail.folder.id)}”含无法确认归属的角色，已保留未删除`);
          }
          continue;
        }
        state.status = `正在删除已合并收藏夹：“${String(detail.folder.name || detail.folder.id)}”……`;
        render();
        try {
          await deleteFavoriteFolder(detail.folder.id);
          deletedFolderIds.add(folderId);
          summary.merged += 1;
          summary.deleted += 1;
        } catch (error) {
          appendRunLog('error', `删除重复收藏夹失败：${String(detail.folder.name || detail.folder.id)}`, error);
          summary.failures.push(`删除重复收藏夹“${String(detail.folder.name || detail.folder.id)}”：${explainFailure(error)}`);
        }
      }
    }
    state.status = `作者收藏夹整理完成：已处理 ${groupEntries.length}/${groupEntries.length} 个作者，加入 ${summary.added} 个角色，删除 ${summary.deleted} 个重复收藏夹。`;
    render();
    saveAuthorFolderMap(authorFolderMap);
    // 首次历史整理完全成功后才切换到“以后只整理新增”。
    // 如果有失败或缺少作者名，下一次收藏会继续补齐历史角色。
    if (summary.initialMigration && summary.attempted > 0 && !summary.failures.length) {
      markAuthorFolderMigrationDone();
    }
    return summary;
  }
  function authorFolderSummaryText(summary) {
    if (!summary || !summary.attempted) return '';
    const failureText = summary.failures?.length
      ? `，失败 ${summary.failures.length} 个：${summary.failures.slice(0, 2).join('；')}${summary.failures.length > 2 ? '；其余失败已省略' : ''}`
      : '';
    const skippedText = summary.skippedNoAuthor ? `，跳过无作者名 ${summary.skippedNoAuthor} 个` : '';
    const mergedText = summary.deleted ? `，合并并删除重复收藏夹 ${summary.deleted} 个` : '';
    const scopeText = summary.manual ? '（手动整理已知收藏）' : (summary.initialMigration ? '（含历史收藏首次整理）' : '（本次新增）');
    return `作者收藏夹${scopeText}：新建 ${summary.created} 个、复用 ${summary.reused} 个，加入 ${summary.added} 个角色${mergedText}${skippedText}${failureText}`;
  }

  function knownFavoritedRowsForAuthorFolders() {
    const found = new Map();
    [...allRoleRows(), ...state.siteSearchRows].forEach(row => {
      const id = String(row?.characterId || '').trim();
      if (!id || row?.isFavorite !== true) return;
      const existing = found.get(id);
      found.set(id, existing ? mergeRole(existing, row) : row);
    });
    return [...found.values()];
  }

  async function organizeAuthorFoldersNow() {
    if (state.authorFolderLoading || state.favoriteRunning || state.loading || state.metadataLoading) return;
    const rows = knownFavoritedRowsForAuthorFolders();
    if (!rows.length) {
      state.status = '当前没有可整理的已收藏角色。请先读取角色列表，或在“网页”中获取并收藏角色后再执行。';
      render();
      pageWindow.alert(state.status);
      return;
    }
    state.authorFolderLoading = true;
    state.status = '正在整理 ' + rows.length + ' 个已知收藏角色的作者收藏夹……';
    render();
    const job = {
      rows,
      favoritedIds: rows.map(row => String(row.characterId)),
      includeHistory: true,
      manual: true
    };
    let summary;
    try {
      summary = await organizeFavoritedCharactersByAuthor(job);
    } catch (error) {
      summary = { attempted: rows.length, created: 0, reused: 0, added: 0, skippedNoAuthor: 0, failures: ['整理作者收藏夹：' + explainFailure(error)], manual: true };
    } finally {
      state.authorFolderLoading = false;
    }
    state.status = authorFolderSummaryText(summary) || '没有找到可按作者整理的收藏角色。';
    render();
    pageWindow.alert(state.status);
  }


  function favoriteJobRowsMatch(job, rows) {
    const jobIds = (job?.rows || []).slice(Number(job?.index) || 0).map(row => String(row.characterId));
    const rowIds = rows.map(row => String(row.characterId));
    return jobIds.length === rowIds.length && jobIds.every((id, index) => id === rowIds[index]);
  }

  function favoriteJobStatus(job, prefix = '批量收藏完成') {
    const failures = job.failures || [];
    let message = `${prefix}：分享链接收藏 ${job.shareSuccess || 0} 个，普通收藏 ${job.normalSuccess || 0} 个`;
    if (job.alreadyFavoriteSkipped) message += `，已收藏跳过 ${job.alreadyFavoriteSkipped} 个`;
    if (failures.length) {
      const shortFailure = String(failures[0] || '')
        .replace(/：已接到登录凭证[\s\S]*$/, '')
        .replace(/。简单说：[\s\S]*$/, '')
        .replace(/。+$/, '');
      message += `；失败 ${failures.length} 个${shortFailure ? `：${shortFailure}` : ''}`;
    }
    return `${message}。`;
  }

  function favoriteJobHasRemaining(job) {
    return Boolean(job && Array.isArray(job.rows) && Number(job.index || 0) < job.rows.length);
  }

  async function persistFavoriteCheckpoint(job) {
    if (!await saveShareFavoriteJob(job)) {
      throw new FavoriteStorageError('收藏任务进度无法写入 IndexedDB，已停止以避免重复收藏');
    }
  }

  function clearFavoritePendingState(job) {
    (job?.rows || []).forEach(row => state.favoritePendingIds.delete(String(row.characterId)));
    if (!job?.rows) state.favoritePendingIds.clear();
    state.favoriteRunning = false;
    state.shareLinkLoading = false;
  }

  function applyFavoriteInterruption(job) {
    const mode = state.favoriteInterruptMode;
    if (!mode) return false;
    state.favoriteInterruptMode = '';
    clearFavoritePendingState(job);
    if (mode === 'cancel') {
      state.status = `已彻底取消本次收藏任务；已完成的收藏保留，剩余 ${Math.max(0, job.rows.length - Number(job.index || 0))} 个已从队列清除。`;
      appendRunLog('info', '用户彻底取消收藏任务', { completed: Number(job.index || 0), total: job.rows.length });
    } else {
      job.paused = true;
      job.pauseReason = 'user';
      job.activeShareCode = '';
      state.status = `已停止收藏并保留队列：完成 ${Number(job.index || 0)}/${job.rows.length} 个。请手动点击“继续收藏”后再运行。`;
      appendRunLog('info', '用户停止收藏并保留队列', { completed: Number(job.index || 0), total: job.rows.length });
    }
    render();
    return true;
  }

  async function requestFavoriteInterruption(mode) {
    const job = loadShareFavoriteJob();
    if (!favoriteJobHasRemaining(job)) {
      await clearShareFavoriteJob();
      clearFavoritePendingState(null);
      state.favoriteInterruptMode = '';
      state.status = '已强制解除收藏运行状态；当前没有可继续的收藏队列。';
      render();
      return;
    }
    state.favoriteInterruptMode = mode === 'cancel' ? 'cancel' : 'pause';
    const modal = panel?.querySelector('#mufy-recovery-favorite-interrupt-modal');
    if (modal) modal.hidden = true;
    if (state.favoriteInterruptMode === 'cancel') await clearShareFavoriteJob();
    else {
      job.paused = true;
      job.pauseReason = 'user';
      await saveShareFavoriteJob(job);
    }
    state.status = state.favoriteInterruptMode === 'cancel'
      ? '正在彻底取消收藏任务；已发出的当前请求可能完成，但不会再开始下一个……'
      : '正在停止收藏并保存剩余队列；已发出的当前请求可能完成，但不会再开始下一个……';
    render();
    if (!state.favoriteRunning) applyFavoriteInterruption(job);
  }

  async function resumeFavoriteJob() {
    await initializeShareFavoriteJobStorage();
    const job = loadShareFavoriteJob();
    if (!favoriteJobHasRemaining(job)) {
      await clearShareFavoriteJob();
      clearFavoritePendingState(null);
      state.status = '没有可继续的收藏任务。';
      render();
      return;
    }
    job.paused = false;
    job.pauseReason = '';
    state.favoriteInterruptMode = '';
    if (!await saveShareFavoriteJob(job)) {
      clearFavoritePendingState(job);
      state.status = '收藏任务无法写入 IndexedDB，已停止运行；请打开运行日志查看原因。';
      render();
      return;
    }
    state.status = `正在手动继续收藏：从 ${Number(job.index || 0) + 1}/${job.rows.length} 开始……`;
    render();
    await processShareFavoriteJob();
  }

  async function cancelPausedFavoriteJob() {
    const job = loadShareFavoriteJob();
    if (!favoriteJobHasRemaining(job)) {
      await clearShareFavoriteJob();
      clearFavoritePendingState(null);
      render();
      return;
    }
    if (!pageWindow.confirm(`确定彻底取消这次收藏任务吗？\n\n已完成的收藏不会撤销，剩余 ${Math.max(0, job.rows.length - Number(job.index || 0))} 个任务会被清空，下次不会继续。`)) return;
    state.favoriteInterruptMode = 'cancel';
    await clearShareFavoriteJob();
    applyFavoriteInterruption(job);
  }

  async function pauseShareFavoriteJob(job, error) {
    job.paused = true;
    job.pauseReason = 'rate-limit';
    job.activeCharacterId = '';
    job.activeShareCode = '';
    job.navigationStartedAt = 0;
    await saveShareFavoriteJob(job);
    state.favoriteRunning = false;
    state.shareLinkLoading = false;
    state.status = `检测到 HTTP 429，已暂停收藏，不再继续请求；已完成 ${job.index}/${job.rows.length} 个。${explainFailure(error)}稍后可手动点击“继续收藏”，也可以取消任务。`;
    render();
  }

  async function finishShareFavoriteJob(job) {
    const manualRows = new Map(state.manualFavoriteChats.map(row => [String(row.characterId), row]));
    (job.normalFallback || []).forEach(item => {
      const source = (job.rows || []).find(row => String(row.characterId) === String(item.characterId));
      if (source && (job.favoritedIds || []).some(id => String(id) === String(item.characterId)) && !state.chatted.some(row => String(row.characterId) === String(item.characterId))) {
        manualRows.set(String(item.characterId), { ...source, isFavorite: true, favoriteKnown: true, manualChatAddedAt: new Date().toISOString() });
      }
    });
    state.manualFavoriteChats = [...manualRows.values()];
    saveManualFavoriteChats(state.manualFavoriteChats);
    const result = {
      label: job.label,
      shareSuccess: job.shareSuccess || 0,
      normalSuccess: job.normalSuccess || 0,
      alreadyFavoriteSkipped: job.alreadyFavoriteSkipped || 0,
      normalFallback: job.normalFallback || [],
      failures: job.failures || [],
      shareLookupFailures: job.shareLookupFailures || [],
      favoritedIds: job.favoritedIds || [],
      rows: (job.rows || []).map(compactFavoriteJobRow).filter(Boolean),
      authorFolderSummary: null,
      completionNotified: true
    };
    saveShareFavoriteResult(result);
    await clearShareFavoriteJob();
    clearFavoritePendingState(job);
    let folderSummary;
    if (state.autoAddFavoriteFolder) {
      state.status = favoriteJobStatus(job) + ' 收藏队列已完成并清除，正在后台整理作者收藏夹……';
      render();
      state.authorFolderLoading = true;
      try {
        folderSummary = await organizeFavoritedCharactersByAuthor(job);
      } catch (error) {
        folderSummary = { attempted: (job?.favoritedIds || []).length, created: 0, reused: 0, added: 0, skippedNoAuthor: 0, failures: [`整理作者收藏夹：${explainFailure(error)}`] };
        appendRunLog('error', '收藏完成后的作者收藏夹整理失败', error);
      } finally {
        state.authorFolderLoading = false;
      }
    } else {
      folderSummary = null;
      appendRunLog('info', '已按设置跳过收藏后的自动入夹', { favorited: (job?.favoritedIds || []).length });
    }
    job.authorFolderSummary = folderSummary;
    result.authorFolderSummary = folderSummary;
    saveShareFavoriteResult(result);
    const folderText = authorFolderSummaryText(folderSummary);
    state.status = favoriteJobStatus(job) + (folderText
      ? ' ' + folderText + '。'
      : (state.autoAddFavoriteFolder ? '' : ' 已按设置保留网站收藏，未自动放入收藏夹。'));
    render();
    pageWindow.alert(state.status);
  }

  async function processShareFavoriteJob() {
    const job = loadShareFavoriteJob();
    if (!job || job.paused || !Array.isArray(job.rows)) return;
    state.favoriteRunning = true;
    state.shareLinkLoading = true;
    job.rows.slice(Number(job.index) || 0).forEach(row => state.favoritePendingIds.add(String(row.characterId)));
    rememberSiteSearchRows(job.rows);
    let navigating = false;
    try {
      if (applyFavoriteInterruption(job)) return;
      if (job.activeCharacterId) {
        const activeRow = job.rows[job.index];
        if (!activeRow || String(activeRow.characterId) !== String(job.activeCharacterId)) return;
        const openedByShareLink = Boolean(job.activeShareCode);
        state.status = `已从${openedByShareLink ? '分享链接' : '角色页面'}打开“${activeRow.name}”，正在等待页面完成加载后收藏 ${job.index + 1}/${job.rows.length}……`;
        render();
        await wait(2500);
        if (applyFavoriteInterruption(job)) return;
        try {
          // 趋势榜等可靠列表已直接给出收藏状态；作者页角色则在入队前逐个查过详情。
          // 因此到达角色页后直接执行网站原生收藏，不再重复请求每个角色详情。
          await clickWebsiteFavoriteFromKnownUnfavorite(activeRow.characterId, activeRow);
          if (applyFavoriteInterruption(job)) return;
          applyFavoriteState(activeRow.characterId, true);
          state.status = `已通过分享链接页面收藏“${activeRow.name}”（${job.index + 1}/${job.rows.length}）……`;
          render();
          job.favoritedIds = [...new Set([...(job.favoritedIds || []), String(activeRow.characterId)])];
          if (openedByShareLink) job.shareSuccess = (job.shareSuccess || 0) + 1;
          else job.normalSuccess = (job.normalSuccess || 0) + 1;
          job.index += 1;
          job.activeCharacterId = '';
          job.activeShareCode = '';
          job.navigationStartedAt = 0;
          if (applyFavoriteInterruption(job)) return;
          await persistFavoriteCheckpoint(job);
        } catch (error) {
            if (applyFavoriteInterruption(job)) return;
            if (error instanceof FavoriteStorageError) throw error;
            if (error instanceof RateLimitError) {
              await pauseShareFavoriteJob(job, error);
              return;
            }
            state.favoritePendingIds.delete(String(activeRow.characterId));
            appendRunLog('error', `${openedByShareLink ? '分享链接' : '普通'}收藏失败：${activeRow.name || activeRow.characterId}`, error);
            job.failures.push(`${activeRow.name}：${explainFailure(error)}`);
            job.index += 1;
            job.activeCharacterId = '';
            job.activeShareCode = '';
            job.navigationStartedAt = 0;
            await persistFavoriteCheckpoint(job);
        }
      }

      while (job.index < job.rows.length) {
        if (applyFavoriteInterruption(job)) return;
        const row = job.rows[job.index];
        if (!row?.characterId) {
          job.index += 1;
          await persistFavoriteCheckpoint(job);
          continue;
        }
        state.status = `正在处理收藏 ${job.index + 1}/${job.rows.length}：“${row.name}”……`;
        render();
        let shareCode = '';
        let shareLookupError = null;
        try {
          state.status = `正在查询“${row.name}”的角色分享链接……`;
          render();
          shareCode = shareCodeCache.get(String(row.characterId)) || await requestShareCode(row.characterId) || '';
          if (applyFavoriteInterruption(job)) return;
        } catch (error) {
          if (applyFavoriteInterruption(job)) return;
          if (error instanceof RateLimitError) {
            await pauseShareFavoriteJob(job, error);
            return;
          }
          shareLookupError = error;
          job.shareLookupFailures.push(`${row.name}：${explainFailure(error)}`);
        }
        if (shareCode) {
          job.activeCharacterId = String(row.characterId);
          job.activeShareCode = shareCode;
          job.navigationStartedAt = Date.now();
          await persistFavoriteCheckpoint(job);
          navigating = true;
          state.status = `正在打开“${row.name}”的角色分享链接，打开成功后会自动完成收藏……`;
          render();
          pageWindow.location.assign(shareUrlFromCode(shareCode));
          return;
        }
        if (!(job.normalFallback || []).some(item => String(item?.characterId || '') === String(row.characterId))) {
          job.normalFallback.push({ characterId: String(row.characterId), name: row.name || '未命名角色' });
        }
        appendRunLog('info', `“${row.name || '未命名角色'}”未检测到分享链接，改为直接调用一次普通收藏接口`, shareLookupError);
        state.status = `“${row.name || '未命名角色'}”没有分享链接，正在执行普通收藏 ${job.index + 1}/${job.rows.length}……`;
        render();
        try {
          // 无分享链接时只走一次接口收藏；不再打开角色页面，也不点击网页按钮，
          // 避免同一角色同时发生两次收藏操作。
          await requestFavorite(row.characterId, true);
          applyFavoriteState(row.characterId, true);
          job.favoritedIds = [...new Set([...(job.favoritedIds || []), String(row.characterId)])];
          job.normalSuccess = (job.normalSuccess || 0) + 1;
          job.index += 1;
          job.activeCharacterId = '';
          job.activeShareCode = '';
          job.navigationStartedAt = 0;
          state.status = `已普通收藏“${row.name}”（${job.index}/${job.rows.length}）……`;
          render();
          await persistFavoriteCheckpoint(job);
          if (applyFavoriteInterruption(job)) return;
          await wait(250);
        } catch (error) {
          if (error instanceof FavoriteStorageError) throw error;
          if (error instanceof RateLimitError) {
            await pauseShareFavoriteJob(job, error);
            return;
          }
          state.favoritePendingIds.delete(String(row.characterId));
          appendRunLog('error', `普通收藏失败：${row.name || row.characterId}`, error);
          job.failures.push(`${row.name}：${explainFailure(error)}`);
          job.index += 1;
          job.activeCharacterId = '';
          job.activeShareCode = '';
          job.navigationStartedAt = 0;
          await persistFavoriteCheckpoint(job);
        }
      }
      if (applyFavoriteInterruption(job)) return;
      await finishShareFavoriteJob(job);
    } catch (error) {
      if (applyFavoriteInterruption(job)) return;
      if (error instanceof FavoriteStorageError) {
        clearFavoritePendingState(job);
        await clearShareFavoriteJob();
        state.status = `${error.message}。已解除收藏状态，请查看运行日志。`;
        render();
      } else if (error instanceof RateLimitError) {
        await pauseShareFavoriteJob(job, error);
      } else {
        const failedRow = job.rows[job.index];
        if (failedRow?.characterId) state.favoritePendingIds.delete(String(failedRow.characterId));
        appendRunLog('error', '收藏任务异常中断', error);
        job.failures.push(`${failedRow?.name || '当前角色'}：${explainFailure(error)}`);
        job.index = Math.min(job.rows.length, job.index + 1);
        job.activeCharacterId = '';
        job.activeShareCode = '';
        job.navigationStartedAt = 0;
        const preserved = await saveShareFavoriteJob(job);
        if (!preserved) clearFavoritePendingState(job);
        state.status = preserved
          ? `收藏过程中出现问题：${explainFailure(error)}已保留队列，重新点击收藏可继续。`
          : `收藏过程中出现问题且队列无法保存：${explainFailure(error)}任务已停止，请查看运行日志。`;
        render();
      }
    } finally {
      if (state.favoriteInterruptMode) applyFavoriteInterruption(job);
      if (!navigating && !loadShareFavoriteJob()?.paused) {
        state.favoriteRunning = false;
        state.shareLinkLoading = false;
        render();
      }
    }
  }

  async function startShareFavoriteJob(rows, label = '当前列表') {
    if (state.favoriteRunning) return;
    await initializeShareFavoriteJobStorage();
    const candidates = rows.filter(row => row?.characterId && !row.isFavorite);
    const unknownCount = candidates.filter(row => row.favoriteKnown !== true).length;
    const unique = [...new Map(candidates
      .filter(row => row.favoriteKnown === true)
      .map(row => [String(row.characterId), row])).values()];
    if (!unique.length) {
      state.status = unknownCount
        ? `${label}有 ${unknownCount} 个角色没有读到明确收藏状态，未执行收藏。`
        : `${label}没有待收藏角色。`;
      render();
      return;
    }
    const previous = loadShareFavoriteJob();
    if (favoriteJobHasRemaining(previous) && previous.paused && !favoriteJobRowsMatch(previous, unique)) {
      state.status = `已有一项未完成的收藏任务（剩余 ${Math.max(0, previous.rows.length - Number(previous.index || 0))} 个）。请先点击“继续收藏”或“取消任务”，不会用新任务覆盖旧队列。`;
      render();
      return;
    }
    const job = previous?.paused && favoriteJobRowsMatch(previous, unique)
      ? { ...previous, paused: false }
      : {
          label,
          rows: unique.map(compactFavoriteJobRow).filter(Boolean),
          index: 0,
          activeCharacterId: '',
          activeShareCode: '',
          shareSuccess: 0,
          normalSuccess: 0,
          alreadyFavoriteSkipped: 0,
          normalFallback: [],
          shareLookupFailures: [],
          failures: [],
          favoritedIds: [],
          paused: false,
          pauseReason: '',
          navigationStartedAt: 0
        };
    state.favoriteInterruptMode = '';
    if (!await saveShareFavoriteJob(job)) {
      clearFavoritePendingState(null);
      state.status = '收藏任务无法写入 IndexedDB，已取消启动；请打开运行日志查看原因。';
      render();
      return;
    }
    appendRunLog('info', `开始收藏 ${job.rows.length} 个角色：${label}`);
    job.rows.slice(Number(job.index) || 0).forEach(row => state.favoritePendingIds.add(String(row.characterId)));
    state.favoriteRunning = true;
    state.shareLinkLoading = true;
    state.status = `${label}开始处理 ${job.rows.length} 个明确未收藏角色${unknownCount ? `；另有 ${unknownCount} 个状态不明确的角色未执行` : ''}：优先使用分享链接……`;
    render();
    await processShareFavoriteJob();
  }

  async function setFavoriteRole(row, isFavorite) {
    if (!row?.characterId || state.favoriteRunning) return;
    if (isFavorite) return startShareFavoriteJob([row], `角色“${row.name}”`);
    state.favoriteRunning = true;
    state.favoritePendingIds.add(String(row.characterId));
    state.status = `正在取消收藏“${row.name}”……`;
    render();
    try {
      await requestFavorite(row.characterId, false);
      applyFavoriteState(row.characterId, false);
      state.status = `已取消收藏“${row.name}”。`;
    } catch (error) {
      state.favoritePendingIds.delete(String(row.characterId));
      state.status = `取消收藏失败：${explainFailure(error)}`;
      appendRunLog('error', `取消收藏失败：${row?.name || row?.characterId || ''}`, error);
    } finally {
      state.favoritePendingIds.delete(String(row.characterId));
      state.favoriteRunning = false;
      render();
    }
  }

  async function favoriteRole(row) { return startShareFavoriteJob([row], `角色“${row.name}”`); }
  async function unfavoriteRole(row) { return setFavoriteRole(row, false); }

  async function favoriteRows(rows, label = '当前列表') {
    const unique = [...new Map((rows || [])
      .filter(row => row?.characterId)
      .map(row => [String(row.characterId), row])).values()];
    return startShareFavoriteJob(unique, label);
  }

  function authorWorkRows(body) {
    const data = body?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.list)) return data.list;
    if (Array.isArray(data?.rows)) return data.rows;
    if (Array.isArray(data?.records)) return data.records;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(body?.items)) return body.items;
    if (Array.isArray(body?.list)) return body.list;
    if (Array.isArray(body?.rows)) return body.rows;
    if (Array.isArray(body?.records)) return body.records;
    return [];
  }

  async function requestAuthorWorks(authorId) {
    if (!authorId) throw new Error('当前作者没有可用的作者 ID，无法读取该作者全部作品。');
    scanStoredAuthorization();
    const found = new Map();
    const seenPages = new Set();
    for (let page = 1; page <= 500; page += 1) {
      const url = new URL('/api/characters/list', location.origin);
      url.searchParams.set('creatorId', String(authorId));
      url.searchParams.set('pageNum', String(page));
      url.searchParams.set('pageSize', '20');
      const headers = { Accept: 'application/json' };
      if (authorization) headers.Authorization = authorization;
      const response = await pageWindow.fetch(url.href, { method: 'GET', credentials: 'include', headers });
      const raw = await response.text();
      let body = null;
      try { body = raw ? JSON.parse(raw) : null; } catch (_) {}
      if (response.status === 429) throw new RateLimitError('作者作品列表');
      if (response.status === 401 || response.status === 403) throw new Error(loginErrorMessage(response.status, '读取作者全部作品'));
      if (!response.ok || body?.code != null && body.code !== 200) {
        throw new Error(body?.message || body?.reason || raw || `作者作品接口请求失败（HTTP ${response.status}）`);
      }
      const rawRows = authorWorkRows(body);
      // /characters/list?creatorId=... 当前会把所有角色的 isFollowed 返回为 false，
      // 这里只读取作品资料，收藏状态统一交给单角色详情 /characters/get 核对。
      const rows = rawRows.map(item => normalize({ ...item, favoriteKnown: false, favoriteNeedsDetail: true })).filter(row => row.characterId);
      const signature = rows.map(row => String(row.characterId)).join('|');
      if (seenPages.has(signature)) break;
      seenPages.add(signature);
      rows.forEach(row => found.set(String(row.characterId), row));
      const data = body?.data;
      const totalPages = Number(data?.totalPages ?? data?.pageCount ?? body?.totalPages ?? body?.pageCount);
      const total = Number(data?.total ?? data?.totalCount ?? body?.total ?? body?.totalCount);
      const hasNext = typeof data?.hasNext === 'boolean' ? data.hasNext : typeof data?.hasMore === 'boolean' ? data.hasMore : typeof body?.hasNext === 'boolean' ? body.hasNext : null;
      if (!rows.length || hasNext === false || (Number.isFinite(totalPages) && totalPages > 0 && page >= totalPages) || (Number.isFinite(total) && total >= 0 && page * 20 >= total) || (hasNext == null && rows.length < 20)) break;
      await wait(200);
    }
    return [...found.values()];
  }

  function extractSiteCharacterRowsFromBody(body, source = '网站当前页', options = {}) {
    const found = new Map();
    const seen = new Set();
    const arrays = [];
    const normalizeSiteItem = item => normalize(options.ignoreFavoriteState
      ? { ...item, favoriteKnown: false, favoriteNeedsDetail: true }
      : { ...item, favoriteNeedsDetail: false });
    const pushRow = item => {
      const row = normalizeSiteItem(item);
      if (!row.characterId) return;
      found.set(String(row.characterId), { ...row, source });
    };
    const likelyCharacter = item => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
      const nested = item.character || item.characterInfo || item.characterData || item.role;
      const id = item.characterId || item.roleId || item.character_id || item.id || nested?.characterId || nested?.id;
      const title = item.name || item.characterName || item.title || nested?.name || nested?.characterName || nested?.title;
      const media = item.avatar || item.avatarUrl || item.imageUrl || nested?.avatar || nested?.avatarUrl;
      return Boolean(id && (title || media || nested));
    };
    const visit = (value, depth = 0) => {
      if (!value || depth > 7 || typeof value !== 'object') return;
      if (seen.has(value)) return;
      seen.add(value);
      if (Array.isArray(value)) {
        arrays.push(value);
        value.forEach(item => visit(item, depth + 1));
        return;
      }
      if (likelyCharacter(value)) pushRow(value);
      Object.entries(value).forEach(([key, item]) => {
        if (/token|authorization|password|secret/i.test(key)) return;
        visit(item, depth + 1);
      });
    };
    visit(body);
    arrays.forEach(array => {
      const normalized = array.map(item => likelyCharacter(item) ? normalizeSiteItem(item) : null).filter(row => row?.characterId);
      if (normalized.length >= 2 || (normalized.length === 1 && array.length <= 3)) {
        normalized.forEach(row => found.set(String(row.characterId), { ...row, source }));
      }
    });
    return [...found.values()];
  }

  function scheduleSiteCaptureRender(added) {
    if (!panel || !added) return;
    if (siteCaptureRenderTimer) return;
    siteCaptureRenderTimer = pageWindow.setTimeout(() => {
      siteCaptureRenderTimer = 0;
      if (!panel) return;
      if (state.section === 'favorites' && (state.active === 'siteSearch' || state.active === 'siteAuthors')) {
        if (!state.siteFavoriteStateLoading) {
          state.status = '已从当前网站页面自动捕获 ' + state.siteSearchRows.length + ' 个可收藏角色；可在网站角色里勾选/长按，然后点网页里的“立即收藏”。';
        }
        render();
      } else {
        updateSiteActionButtons();
        panel.querySelectorAll('[data-category="siteSearch"]').forEach(button => {
          button.textContent = '网站角色 (' + state.siteSearchRows.length + ')';
        });
        panel.querySelectorAll('[data-category="siteAuthors"]').forEach(button => {
          button.textContent = '网站作者 (' + authorGroups(state.siteSearchRows, '').length + ')';
        });
      }
    }, 260);
  }

  function currentSiteCaptureScope() {
    try {
      const url = new URL(pageWindow.location.href);
      const ignored = new Set(['page', 'pagenum', 'pagesize', 'pageindex', 'offset', 'cursor']);
      const params = [...url.searchParams.entries()]
        .filter(([key]) => !ignored.has(String(key).toLowerCase()))
        .sort(([leftKey, leftValue], [rightKey, rightValue]) => `${leftKey}=${leftValue}`.localeCompare(`${rightKey}=${rightValue}`));
      const query = new URLSearchParams(params).toString();
      return `${url.pathname}${query ? `?${query}` : ''}`;
    } catch (_) {
      return String(pageWindow.location.pathname || '');
    }
  }

  function syncSiteCaptureScope(pageScope = currentSiteCaptureScope()) {
    const nextScope = String(pageScope || '');
    if (siteCapturePageKey === nextScope) return false;
    siteCapturePageKey = nextScope;
    if (roleStateReady) {
      state.siteSearchRows = [];
      state.selectedSiteCharacterIds.clear();
    }
    return true;
  }

  function addCapturedSiteRows(rows, pageScope = currentSiteCaptureScope()) {
    if (!Array.isArray(rows) || !rows.length) return 0;
    if (String(pageScope || '') !== currentSiteCaptureScope()) return 0;
    if (!roleStateReady) {
      pendingSiteCaptureRows.push({ rows, pageScope });
      return rows.length;
    }
    syncSiteCaptureScope(pageScope);
    const added = rememberSiteSearchRows(rows);
    // 重复出现的角色也可能带回更新后的 isFollowed，必须刷新面板，
    // 不能只有新增角色时才重绘。
    scheduleSiteCaptureRender(rows.length);
    return added;
  }

  function isCharacterDetailUrl(requestUrl) {
    try {
      const url = new URL(String(requestUrl || ''), location.href);
      return url.origin === location.origin && /\/api\/characters\/get(?:\/|$)/i.test(url.pathname);
    } catch (_) {
      return false;
    }
  }

  function isAuthorWorksListUrl(requestUrl) {
    try {
      const url = new URL(String(requestUrl || ''), location.href);
      return url.origin === location.origin
        && /\/api\/characters\/list(?:\/|$)/i.test(url.pathname)
        && url.searchParams.has('creatorId');
    } catch (_) {
      return false;
    }
  }

  function isAuthorProfilePage() {
    return /^\/profile\/role\/?$/i.test(pageWindow.location.pathname);
  }

  function currentPageCharacterId() {
    try {
      const url = new URL(pageWindow.location.href);
      return String(url.searchParams.get('roleId') || url.searchParams.get('characterId') || url.searchParams.get('id') || '');
    } catch (_) {
      return '';
    }
  }

  function characterDetailRowFromBody(requestUrl, body) {
    try {
      const url = new URL(String(requestUrl || ''), location.href);
      const requestId = String(url.searchParams.get('id') || '');
      const detail = body?.data?.data || body?.data || body?.character || body;
      if (!detail || typeof detail !== 'object' || Array.isArray(detail)) return null;
      const row = normalize({ ...detail, characterId: detail.characterId || requestId });
      return row.characterId ? { ...row, source: '当前角色详情' } : null;
    } catch (_) {
      return null;
    }
  }

  function applyCapturedCharacterDetail(requestUrl, body) {
    const row = characterDetailRowFromBody(requestUrl, body);
    if (!row) return;
    const id = String(row.characterId);
    const isCurrentPageRole = currentPageCharacterId() === id;
    if (!roleStateReady) {
      // 页面启动阶段只接住用户当前打开的角色；脚本后台详情请求不混入网站角色。
      if (isCurrentPageRole) pendingSiteCaptureRows.push({ rows: [row], pageScope: currentSiteCaptureScope() });
      return;
    }

    let updatedStoredRole = false;
    const updateExisting = rows => rows.map(item => {
      if (String(item?.characterId || '') !== id) return item;
      updatedStoredRole = true;
      return mergeRole(item, row);
    });
    state.chatted = updateExisting(state.chatted);
    state.chattedNotFavorite = updateExisting(state.chattedNotFavorite);
    state.favoriteOnly = updateExisting(state.favoriteOnly);
    state.roleHistory = updateExisting(state.roleHistory);
    state.manualFavoriteChats = updateExisting(state.manualFavoriteChats);

    // 详情接口给出的 isFollowed 是当前服务器状态；同时修正旧分类，
    // 避免状态已变成未收藏后仍留在“仅收藏角色”中。
    if (row.favoriteKnown === true) {
      const sameId = item => String(item?.characterId || '') === id;
      if (row.isFavorite) {
        state.chattedNotFavorite = state.chattedNotFavorite.filter(item => !sameId(item));
      } else {
        state.favoriteOnly = state.favoriteOnly.filter(item => !sameId(item));
        const chattedRow = state.chatted.find(sameId);
        if (chattedRow?.lastSessionId && !state.chattedNotFavorite.some(sameId)) {
          state.chattedNotFavorite = [...state.chattedNotFavorite, { ...chattedRow, isFavorite: false, favoriteKnown: true }];
        }
      }
    }

    const existedOnWebsite = state.siteSearchRows.some(item => String(item?.characterId || '') === id);
    if (isCurrentPageRole || existedOnWebsite) rememberSiteSearchRows([row]);
    if (updatedStoredRole) saveRoleCache();
    if (isCurrentPageRole || existedOnWebsite || updatedStoredRole) {
      scheduleSiteCaptureRender(1);
    }
  }

  function shouldCaptureSiteCharacterUrl(requestUrl) {
    try {
      const url = new URL(String(requestUrl || ''), location.href);
      if (url.origin !== location.origin || !/\/api\//i.test(url.pathname)) return false;
      // 排除脚本自己读取的会话、详情和收藏操作，防止这些结果混入“网站角色”。
      if (/query_session|\/characters\/get(?:\/|$)|share_code|favorite|follow|mask|conversation|message|token|auth|users?\/profiles?/i.test(url.pathname)) return false;
      return /character|role|explore|discover|recommend|rank|trend|search/i.test(url.pathname);
    } catch (_) {
      return false;
    }
  }

  function tryCaptureSiteCharacterResponse(requestUrl, response, pageScope) {
    try {
      if (!response || !response.ok || typeof response.clone !== 'function') return;
      const url = String(requestUrl || response.url || '');
      if (isCharacterDetailUrl(url)) {
        response.clone().json().then(body => applyCapturedCharacterDetail(url, body)).catch(() => {});
        return;
      }
      if (!shouldCaptureSiteCharacterUrl(url)) return;
      response.clone().json().then(body => {
        const rows = extractSiteCharacterRowsFromBody(body, '网站已加载结果', {
          ignoreFavoriteState: isAuthorWorksListUrl(url)
        });
        if (rows.length) addCapturedSiteRows(rows, pageScope);
      }).catch(() => {});
    } catch (_) {}
  }

  function tryCaptureSiteCharacterXhr(requestUrl, xhr, pageScope) {
    try {
      if (!xhr || xhr.status < 200 || xhr.status >= 300) return;
      const body = xhr.responseType === 'json' && xhr.response ? xhr.response : JSON.parse(String(xhr.responseText || ''));
      if (isCharacterDetailUrl(requestUrl)) {
        applyCapturedCharacterDetail(requestUrl, body);
        return;
      }
      if (!shouldCaptureSiteCharacterUrl(requestUrl)) return;
      const rows = extractSiteCharacterRowsFromBody(body, '网站已加载结果', {
        ignoreFavoriteState: isAuthorWorksListUrl(requestUrl)
      });
      if (rows.length) addCapturedSiteRows(rows, pageScope);
    } catch (_) {}
  }

  function selectedSiteRows() {
    return state.siteSearchRows.filter(row => state.selectedSiteCharacterIds.has(String(row.characterId)));
  }

  function selectUnfavoriteSiteRows() {
    state.selectedSiteCharacterIds = new Set(state.siteSearchRows
      .filter(row => row.favoriteNeedsDetail || row.favoriteKnown === true && !row.isFavorite)
      .map(row => String(row.characterId)));
    state.section = 'favorites';
    state.active = 'siteSearch';
    state.status = state.selectedSiteCharacterIds.size ? ('已选中 ' + state.selectedSiteCharacterIds.size + ' 个网站角色里的未收藏或待核对项。') : '网站角色里没有未收藏项可选。';
    render();
  }

  function clearSiteSelection() {
    state.selectedSiteCharacterIds.clear();
    state.status = '已清空网站角色勾选。';
    render();
  }

  function refreshSiteRows() {
    state.status = '正在刷新当前网站页面；页面重新加载后会自动捕获当前页角色，继续翻页即可逐页获取。';
    render();
    pageWindow.location.reload();
  }

  function formatRunLogs(rows = loadRunLogs()) {
    return rows.map(row => {
      const time = row.time ? new Date(row.time).toLocaleString('zh-CN') : '';
      const level = String(row.level || 'info').toUpperCase();
      return `[${time}] [${level}] ${row.message || ''}${row.detail ? `\n${row.detail}` : ''}`;
    }).join('\n\n');
  }

  function runLogSummary(detail) {
    const lines = String(detail || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const first = lines.find(line => !/^at\s/.test(line)) || '';
    return first.replace(/^Error:\s*/i, '').trim();
  }

  function renderRunLogModal() {
    const output = panel?.querySelector('#mufy-recovery-log-output');
    if (!output) return;
    const rows = loadRunLogs();
    if (!rows.length) {
      output.innerHTML = '<div class="mufy-recovery-log-empty">暂无运行日志</div>';
      return;
    }
    output.innerHTML = rows.map(row => {
      const level = ['error', 'warn', 'info'].includes(String(row.level || '').toLowerCase())
        ? String(row.level).toLowerCase()
        : 'info';
      const levelLabel = level === 'error' ? '错误' : (level === 'warn' ? '警告' : '信息');
      const time = row.time ? new Date(row.time).toLocaleString('zh-CN') : '';
      const detail = String(row.detail || '');
      const summary = runLogSummary(detail);
      return `<article class="mufy-recovery-log-entry is-${level}">
        <div class="mufy-recovery-log-meta"><span class="mufy-recovery-log-level">${levelLabel}</span><time>${esc(time)}</time></div>
        <div class="mufy-recovery-log-message">${esc(row.message || '')}</div>
        ${summary && summary !== row.message ? `<div class="mufy-recovery-log-summary">${esc(summary)}</div>` : ''}
        ${detail ? `<details class="mufy-recovery-log-detail"><summary>展开技术详情</summary><pre>${esc(detail)}</pre></details>` : ''}
      </article>`;
    }).join('');
  }

  function openRunLogModal() {
    const modal = panel?.querySelector('#mufy-recovery-log-modal');
    if (!modal) return;
    renderRunLogModal();
    modal.hidden = false;
  }

  function clearRunLogs() {
    try { localStorage.removeItem(RUN_LOG_KEY); } catch (_) {}
    renderRunLogModal();
    state.status = '已清除所有运行日志。';
    render();
  }

  async function copyErrorLogs() {
    const rows = loadRunLogs().filter(row => {
      const level = String(row.level || '').toLowerCase();
      const message = String(row.message || '');
      return ['error', 'warn'].includes(level) || /(IndexedDB|localStorage|迁移|面具库.*载入|聊天接口侦测)/i.test(message);
    });
    const diagnostics = [
      `脚本版本：${SCRIPT_VERSION}`,
      `导出时间：${new Date().toLocaleString('zh-CN')}`,
      `页面：${location.origin}${location.pathname}`,
      `浏览器：${pageWindow.navigator?.userAgent || '未知'}`
    ].join('\n');
    const text = `${diagnostics}\n\n${formatRunLogs(rows)}`;
    if (!rows.length) {
      state.status = '当前没有可复制的错误或存储迁移日志。';
      render();
      return;
    }
    try {
      await writeClipboardText(text);
      state.status = `已复制 ${rows.length} 条反馈日志，并附带脚本版本和浏览器信息。`;
    } catch (error) {
      appendRunLog('error', '复制错误日志失败', error);
      state.status = `复制错误日志失败：${explainFailure(error)}`;
    }
    render();
  }

  function clearSiteRows() {
    state.siteSearchRows = [];
    state.selectedSiteCharacterIds.clear();
    state.status = '已清空网站角色结果；可以去发现页/搜索页刷新或滚动，脚本会重新自动捕获。';
    render();
  }

  async function favoriteSelectedSiteRows() {
    const selected = selectedSiteRows();
    const directRows = selected.filter(row => !row.favoriteNeedsDetail && row.favoriteKnown === true && !row.isFavorite);
    const detailRows = selected.filter(row => row.favoriteNeedsDetail);
    if (!directRows.length && !detailRows.length) {
      state.status = state.selectedSiteCharacterIds.size ? '选中的网站角色都已经显示为已收藏。' : '请先勾选要收藏的网站角色。';
      render();
      return;
    }
    try {
      // 趋势榜等可靠来源直接使用列表状态；只有作者列表标记的角色逐项查详情。
      const checkedDetailRows = detailRows.length
        ? await confirmAuthorRowsFavoriteState(detailRows, '当前作者页面')
        : [];
      const rows = [...directRows, ...checkedDetailRows];
      await favoriteRows(rows, '选中的 ' + rows.length + ' 个网站角色');
    } catch (error) {
      state.status = `核对作者页面角色收藏状态失败：${explainFailure(error)}`;
      render();
    }
  }

  async function confirmAuthorRowsFavoriteState(rows, authorName) {
    const checkedRows = [];
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      // 作者列表返回的收藏状态不可靠。即使这个角色曾在趋势榜留下过状态，
      // 从“收藏作者”入口执行时也必须重新逐个查询角色详情，不能沿用合并缓存。
      state.status = `正在核对作者“${authorName}”的收藏状态 ${index + 1}/${rows.length}：“${row.name}”……`;
      render();
      const detail = await requestCharacterDetail(row.characterId);
      // 作者入口只采用本次详情请求返回的收藏状态。
      const checked = {
        ...mergeRole(row, detail || {}),
        isFavorite: detail?.favoriteKnown === true ? Boolean(detail.isFavorite) : false,
        isFollowed: detail?.favoriteKnown === true ? Boolean(detail.isFavorite) : false,
        favoriteKnown: detail?.favoriteKnown === true,
        favoriteNeedsDetail: false
      };
      checkedRows.push(checked);
      if (index + 1 < rows.length) await wait(METADATA_REQUEST_INTERVAL_MS);
    }
    const confirmedRows = checkedRows.filter(row => row.favoriteKnown === true);
    confirmedRows.forEach(row => { state.siteFavoriteStates[String(row.characterId)] = Boolean(row.isFavorite); });
    if (confirmedRows.length) {
      rememberSiteSearchRows(confirmedRows);
      saveRoleCache();
    }
    return checkedRows;
  }

  async function refreshCapturedFavoriteStates() {
    if (!isAuthorProfilePage()) {
      state.status = '当前页面会自动获取可靠的收藏状态，无需手动获取。';
      render();
      return;
    }
    syncSiteCaptureScope();
    if (state.siteFavoriteStateLoading || state.favoriteRunning || !state.siteSearchRows.length) return;
    const rows = [...state.siteSearchRows];
    const groups = authorGroups(rows, '');
    const label = groups.length === 1 ? groups[0].name : '当前网页';
    state.siteFavoriteStateLoading = true;
    updateSiteActionButtons();
    try {
      const checkedRows = await confirmAuthorRowsFavoriteState(rows, label);
      const confirmedRows = checkedRows.filter(row => row.favoriteKnown === true);
      const favoriteCount = confirmedRows.filter(row => row.isFavorite).length;
      const unknownCount = checkedRows.length - confirmedRows.length;
      state.status = `已获取 ${confirmedRows.length}/${checkedRows.length} 个角色的收藏状态：已收藏 ${favoriteCount} 个，未收藏 ${confirmedRows.length - favoriteCount} 个${unknownCount ? `，${unknownCount} 个请求未确认` : ''}。现在可以“全选未收藏”。`;
    } catch (error) {
      state.status = `获取角色收藏状态失败：${explainFailure(error)}`;
    } finally {
      state.siteFavoriteStateLoading = false;
      render();
    }
  }

  async function chooseAuthorFavoriteMode(mode) {
    const group = state.authorFavoriteGroup;
    state.authorFavoriteGroup = null;
    const modal = panel?.querySelector('#mufy-recovery-author-favorite-modal');
    if (modal) modal.hidden = true;
    if (!group) return;
    if (mode === 'panel') {
      try {
        const checkedRows = await confirmAuthorRowsFavoriteState(group.rows, group.name);
        await favoriteRows(checkedRows, `作者“${group.name}”面板记录`);
      } catch (error) {
        state.status = `核对作者“${group.name}”面板作品失败：${explainFailure(error)}`;
        render();
      }
      return;
    }
    if (!group.authorId) {
      state.status = `作者“${group.name}”没有可用作者 ID，无法读取全部作品；可以选择“仅收藏面板记录的这些”。`;
      render();
      return;
    }
    state.status = `正在读取作者“${group.name}”的全部作品……`;
    render();
    try {
      const rows = await requestAuthorWorks(group.authorId);
      if (!rows.length) {
        state.status = `没有读取到作者“${group.name}”的作品，未执行收藏。`;
        render();
        return;
      }
      const checkedRows = await confirmAuthorRowsFavoriteState(rows, group.name);
      await favoriteRows(checkedRows, `作者“${group.name}”全部作品`);
    } catch (error) {
      state.status = `读取作者“${group.name}”全部作品失败：${explainFailure(error)}`;
      render();
    }
  }

  function openAuthorFavoriteDialog(group) {
    if (!group || state.favoriteRunning) return;
    state.authorFavoriteGroup = group;
    const modal = panel?.querySelector('#mufy-recovery-author-favorite-modal');
    if (modal) modal.hidden = false;
  }

  const CHAT_EXPORT_FAST_PAGE_SIZE = 100;
  const CHAT_EXPORT_SAFE_PAGE_SIZE = 16;

  function dialogRowsFromPage(data) {
    if (Array.isArray(data)) return data;
    for (const key of ['data', 'rows', 'list', 'records', 'items', 'content', 'results']) {
      if (Array.isArray(data?.[key])) return data[key];
    }
    return [];
  }

  async function requestDialogPage(context, pageNum, pageSize, signal) {
    const url = new URL('/api/dialogs/query', location.origin);
    url.searchParams.set('sessionId', context.sessionId);
    url.searchParams.set('pageNum', String(pageNum));
    url.searchParams.set('pageSize', String(pageSize));
    url.searchParams.set('characterId', context.characterId);
    const headers = { Accept: 'application/json' };
    if (authorization) headers.Authorization = authorization;
    const options = { method: 'GET', credentials: 'include', cache: 'no-store', headers, signal };
    let response;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      response = await pageWindow.fetch(url.href, options);
      if (response.status !== 429 && response.status < 500) break;
      if (attempt < 2) await wait(1200 * (attempt + 1));
    }
    if ((response.status === 401 || response.status === 403) && authorization) {
      const cookieHeaders = new pageWindow.Headers(headers);
      cookieHeaders.delete('Authorization');
      response = await pageWindow.fetch(url.href, { ...options, headers: cookieHeaders });
    }
    if (response.status === 401 || response.status === 403) throw new Error(loginErrorMessage(response.status, '聊天记录读取'));
    if (!response.ok) throw new Error(`聊天记录接口失败（HTTP ${response.status}）`);
    const body = await response.json();
    if (body?.code !== 200 || !body?.data) throw new Error(body?.reason || body?.message || '聊天记录接口返回异常');
    return body.data;
  }

  async function readCompleteDialogHistory(context, pageSize) {
    const collected = [];
    const ids = new Set();
    const totals = new Set();
    const pageSignatures = new Set();
    let duplicates = 0;
    let reachedEnd = false;
    let pageNum = 1;
    for (; pageNum <= 5000; pageNum += 1) {
      if (state.chatExportStopRequested) throw new DOMException('聊天导出已停止', 'AbortError');
      state.status = `正在完整读取当前聊天：第 ${pageNum} 页，已取得 ${ids.size} 条……`;
      render();
      const data = await requestDialogPage(context, pageNum, pageSize, state.chatExportAbortController?.signal);
      const rows = dialogRowsFromPage(data).filter(row => row && typeof row === 'object');
      const total = Number(data?.total ?? data?.totalCount ?? data?.count);
      if (Number.isFinite(total) && total >= 0) totals.add(total);
      const signature = rows.map(row => String(row.dialogsId || row.dialogId || row.id || '')).join('|');
      if (signature && pageSignatures.has(signature)) break;
      if (signature) pageSignatures.add(signature);
      for (const row of rows) {
        const id = String(row.dialogsId || row.dialogId || row.id || '');
        const fallback = `${row.role || ''}|${row.createdTime || row.updatedTime || ''}|${JSON.stringify(row.content || '')}`;
        const key = id || fallback;
        if (ids.has(key)) {
          duplicates += 1;
          continue;
        }
        ids.add(key);
        collected.push(row);
      }
      const hasNext = data?.hasNext ?? data?.hasMore;
      if (hasNext === false || !rows.length) {
        reachedEnd = hasNext === false || !rows.length;
        break;
      }
      await wait(80);
    }
    const expectedTotal = totals.size ? Math.max(...totals) : null;
    const countMatchesTotal = expectedTotal == null ? false : collected.length === expectedTotal;
    return {
      rows: collected.reverse(),
      expectedTotal,
      reachedEnd,
      countMatchesTotal,
      complete: reachedEnd && countMatchesTotal && totals.size === 1,
      pagesRead: pageNum,
      duplicates,
      totals: [...totals].sort((a, b) => a - b),
      pageSize
    };
  }

  function plainDialogContent(row) {
    const pieces = Array.isArray(row?.content) ? row.content : [row?.content];
    return pieces.filter(item => item != null).map(item => {
      const raw = typeof item === 'string' ? item : (item?.text != null ? String(item.text) : JSON.stringify(item));
      const holder = document.createElement('div');
      holder.innerHTML = raw.replace(/<br\s*\/?>/gi, '\n');
      holder.querySelectorAll('p,div,li,tr,details,hr').forEach(node => node.append('\n'));
      return String(holder.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
    }).filter(Boolean).join('\n');
  }

  function dialogSearchText(row) {
    const pieces = Array.isArray(row?.content) ? row.content : [row?.content];
    return pieces.filter(item => item != null).map(item => {
      if (typeof item === 'string') return item;
      if (item?.text != null) return String(item.text);
      try { return JSON.stringify(item); } catch (_) { return String(item); }
    }).join('\n');
  }

  function dialogMatchSnippet(row, query) {
    const plain = plainDialogContent(row).replace(/\s+/g, ' ').trim();
    const lower = plain.toLocaleLowerCase('zh-CN');
    const needle = String(query || '').toLocaleLowerCase('zh-CN');
    const index = lower.indexOf(needle);
    if (index < 0) return plain.slice(0, 180);
    const start = Math.max(0, index - 70);
    const end = Math.min(plain.length, index + needle.length + 110);
    return `${start ? '…' : ''}${plain.slice(start, end)}${end < plain.length ? '…' : ''}`;
  }

  function dialogMatchAnchor(row, query) {
    const plain = plainDialogContent(row).replace(/\s+/g, ' ').trim();
    const index = plain.toLocaleLowerCase('zh-CN').indexOf(String(query || '').toLocaleLowerCase('zh-CN'));
    if (index < 0) return String(query || '');
    return plain.slice(Math.max(0, index - 24), Math.min(plain.length, index + String(query).length + 56));
  }

  async function loadChatSearchSessions() {
    const found = new Map();
    const seenPages = new Set();
    for (let page = 1; page <= 500; page += 1) {
      if (state.chatSearchStopRequested) throw new DOMException('聊天搜索已停止', 'AbortError');
      state.status = `正在读取可搜索的会话：第 ${page} 页，已找到 ${found.size} 段……`;
      render();
      const data = await requestPage(page, false);
      const rawRows = extractCharacterRows(data);
      const rows = rawRows.map(normalize).filter(row => row.characterId && row.lastSessionId);
      const signature = rows.map(row => `${row.characterId}|${row.lastSessionId}`).join('|');
      if (signature && seenPages.has(signature)) break;
      if (signature) seenPages.add(signature);
      rows.forEach(row => found.set(String(row.lastSessionId), row));
      if (!pageHasMore(data, rawRows, 20, page)) break;
      await wait(ROLE_REQUEST_INTERVAL_MS);
    }
    return [...found.values()];
  }

  async function searchOneChatSession(row, query) {
    const context = { characterId: String(row.characterId), sessionId: String(row.lastSessionId) };
    const needle = query.toLocaleLowerCase('zh-CN');
    const seenPages = new Set();
    for (let page = 1; page <= 5000; page += 1) {
      if (state.chatSearchStopRequested) throw new DOMException('聊天搜索已停止', 'AbortError');
      const data = await requestDialogPage(context, page, CHAT_EXPORT_FAST_PAGE_SIZE, state.chatSearchAbortController?.signal);
      const dialogs = dialogRowsFromPage(data).filter(item => item && typeof item === 'object');
      const signature = dialogs.map(item => String(item.dialogsId || item.dialogId || item.id || '')).join('|');
      if (signature && seenPages.has(signature)) break;
      if (signature) seenPages.add(signature);
      for (const dialog of dialogs) {
        if (!dialogSearchText(dialog).toLocaleLowerCase('zh-CN').includes(needle)) continue;
        return {
          ...row,
          lastSessionId: context.sessionId,
          chatMatchDialogId: String(dialog.dialogsId || dialog.dialogId || dialog.id || ''),
          chatMatchSnippet: dialogMatchSnippet(dialog, query),
          chatMatchAnchor: dialogMatchAnchor(dialog, query),
          chatMatchRole: String(dialog.role || ''),
          chatMatchTime: String(dialog.createdTime || dialog.updatedTime || '')
        };
      }
      const hasNext = data?.hasNext ?? data?.hasMore;
      if (hasNext === false || !dialogs.length) break;
      await wait(80);
    }
    return null;
  }

  function chatSearchRoleChoices() {
    const found = new Map();
    [...state.chatted, ...state.roleHistory, ...state.archived].forEach(row => {
      const id = String(row?.characterId || '');
      if (!id || found.has(id)) return;
      found.set(id, { characterId: id, name: String(row?.name || '未命名角色') });
    });
    const current = currentRoleContext();
    if (current.characterId && !found.has(current.characterId)) found.set(current.characterId, { characterId: current.characterId, name: '当前角色' });
    return [...found.values()].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  }

  function refreshChatSearchDialogRoles() {
    const modal = panel?.querySelector('#mufy-recovery-chat-search-modal');
    if (!modal) return;
    const scope = modal.querySelector('#mufy-recovery-chat-search-scope');
    const role = modal.querySelector('#mufy-recovery-chat-search-role');
    const roleLabel = modal.querySelector('#mufy-recovery-chat-search-role-label');
    const choices = chatSearchRoleChoices();
    role.innerHTML = choices.map(item => `<option value="${esc(item.characterId)}">${esc(item.name)} · ${esc(item.characterId.slice(0, 8))}</option>`).join('');
    const preferred = state.chatSearchCharacterId || currentRoleContext().characterId;
    if (preferred && choices.some(item => item.characterId === preferred)) role.value = preferred;
    roleLabel.hidden = scope.value !== 'one';
  }

  function openChatSearchDialog() {
    const modal = panel?.querySelector('#mufy-recovery-chat-search-modal');
    if (!modal) return;
    const queryInput = modal.querySelector('#mufy-recovery-chat-search-query');
    queryInput.value = String(state.chatSearchQuery || '');
    modal.querySelector('#mufy-recovery-chat-search-scope').value = state.chatSearchScope === 'one' ? 'one' : 'all';
    refreshChatSearchDialogRoles();
    modal.hidden = false;
    setTimeout(() => queryInput.focus(), 0);
  }

  function handleChatSearchButton() {
    if (state.chatSearchLoading) searchRolesByChatRecord();
    else openChatSearchDialog();
  }

  async function searchRolesByChatRecord() {
    if (state.chatSearchLoading) {
      state.chatSearchStopRequested = true;
      state.chatSearchAbortController?.abort();
      state.status = '正在停止聊天记录搜索……';
      render();
      return;
    }
    const modal = panel?.querySelector('#mufy-recovery-chat-search-modal');
    const input = modal?.querySelector('#mufy-recovery-chat-search-query');
    const scope = modal?.querySelector('#mufy-recovery-chat-search-scope')?.value === 'one' ? 'one' : 'all';
    const characterId = scope === 'one' ? String(modal?.querySelector('#mufy-recovery-chat-search-role')?.value || '') : '';
    const query = String(input?.value || state.roleQuery || '').trim();
    const minimumLength = scope === 'one' ? 1 : 2;
    if (query.length < minimumLength) {
      state.status = scope === 'one' ? '搜索单个角色时请输入至少 1 个字。' : '搜索所有角色时请输入至少 2 个字，以免产生大量请求和无关结果。';
      render();
      return;
    }
    if (scope === 'one' && !characterId) {
      state.status = '请先选择要搜索的单个角色；如果列表为空，请先运行“找回角色链接”。';
      render();
      return;
    }
    state.chatSearchScope = scope;
    state.chatSearchCharacterId = characterId;
    state.roleQuery = query.toLocaleLowerCase('zh-CN');
    const mainInput = panel?.querySelector('#mufy-recovery-role-search');
    if (mainInput) mainInput.value = query;
    if (modal) modal.hidden = true;
    state.chatSearchLoading = true;
    state.chatSearchStopRequested = false;
    state.chatSearchAbortController = new AbortController();
    state.chatSearchResults = [];
    state.chatSearchQuery = query;
    render();
    try {
      scanStoredAuthorization();
      const allSessions = await loadChatSearchSessions();
      const sessions = scope === 'one' ? allSessions.filter(row => String(row.characterId) === characterId) : allSessions;
      if (!sessions.length) throw new Error('没有读取到可搜索的历史会话，请先确认账号有聊天记录');
      const selectedName = scope === 'one' ? (chatSearchRoleChoices().find(item => item.characterId === characterId)?.name || '指定角色') : '所有角色';
      const confirmed = pageWindow.confirm(`将在${selectedName}的 ${sessions.length} 段历史会话中查找“${query}”。\n\n聊天越多耗时越长，可随时点击“停止搜索”。确定开始吗？`);
      if (!confirmed) {
        state.status = '已取消聊天记录搜索。';
        return;
      }
      for (let index = 0; index < sessions.length; index += 1) {
        if (state.chatSearchStopRequested) throw new DOMException('聊天搜索已停止', 'AbortError');
        const row = sessions[index];
        state.status = `正在按聊天内容找角色：${index + 1}/${sessions.length}，已匹配 ${state.chatSearchResults.length} 个……`;
        render();
        const match = await searchOneChatSession(row, query);
        if (match) state.chatSearchResults.push(match);
        await wait(100);
      }
      state.active = 'chatMatches';
      state.section = 'chats';
      state.status = `聊天记录搜索完成：检查 ${sessions.length} 段会话，找到 ${state.chatSearchResults.length} 个匹配角色。`;
    } catch (error) {
      state.active = 'chatMatches';
      state.section = 'chats';
      if (error?.name === 'AbortError' || state.chatSearchStopRequested) {
        state.status = `已停止聊天记录搜索，保留当前找到的 ${state.chatSearchResults.length} 个结果。`;
      } else {
        state.status = `聊天记录搜索失败：${explainFailure(error)}`;
        appendRunLog('error', '聊天记录搜索失败', error);
      }
    } finally {
      state.chatSearchLoading = false;
      state.chatSearchStopRequested = false;
      state.chatSearchAbortController = null;
      render();
    }
  }

  function openChatMatchAndLocate(row) {
    if (!row?.characterId || !row?.lastSessionId || !row?.chatMatchSnippet) return;
    try {
      localStorage.setItem(CHAT_JUMP_KEY, JSON.stringify({
        characterId: String(row.characterId),
        sessionId: String(row.lastSessionId),
        dialogId: String(row.chatMatchDialogId || ''),
        query: String(state.chatSearchQuery || ''),
        anchor: String(row.chatMatchAnchor || row.chatMatchSnippet || ''),
        createdAt: Date.now()
      }));
    } catch (_) {}
    pageWindow.location.assign(sessionUrl(row));
  }

  function matchingChatElement(target) {
    const needles = [target.anchor, target.query]
      .map(value => String(value || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('zh-CN'))
      .filter(value => value.length >= 2);
    if (!needles.length) return null;
    let best = null;
    let bestLength = Infinity;
    document.querySelectorAll('body *').forEach(element => {
      if (element.closest('#mufy-recovery-panel,#mufy-recovery-toggle,#mufy-recovery-next,script,style')) return;
      if (!element.getClientRects().length) return;
      const text = String(element.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text || text.length > 200000) return;
      const lower = text.toLocaleLowerCase('zh-CN');
      if (!needles.some(needle => lower.includes(needle))) return;
      if (text.length < bestLength) {
        best = element;
        bestLength = text.length;
      }
    });
    return best;
  }

  function likelyChatScrollContainer() {
    const candidates = [...document.querySelectorAll('body *')].filter(element => {
      if (element.closest('#mufy-recovery-panel,#mufy-recovery-toggle,#mufy-recovery-next')) return false;
      if (element.clientHeight < 220 || element.scrollHeight <= element.clientHeight + 80) return false;
      const overflow = getComputedStyle(element).overflowY;
      return overflow === 'auto' || overflow === 'scroll';
    });
    return candidates.sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0] || null;
  }

  async function locatePendingChatJump() {
    let target = null;
    try { target = JSON.parse(localStorage.getItem(CHAT_JUMP_KEY) || 'null'); } catch (_) {}
    if (!target || Date.now() - Number(target.createdAt || 0) > 10 * 60 * 1000) {
      try { localStorage.removeItem(CHAT_JUMP_KEY); } catch (_) {}
      return;
    }
    const context = currentRoleContext();
    if (context.characterId !== String(target.characterId) || context.sessionId !== String(target.sessionId)) return;
    state.status = '已打开匹配会话，正在自动加载并定位目标消息……';
    render();
    let unchanged = 0;
    let previousHeight = -1;
    for (let attempt = 0; attempt < 180; attempt += 1) {
      const match = matchingChatElement(target);
      if (match) {
        const highlight = match.closest('[data-dialog-id],[data-message-id],[class*="message"],[class*="dialog"]') || match;
        highlight.classList.add('mufy-recovery-chat-target');
        highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        try { localStorage.removeItem(CHAT_JUMP_KEY); } catch (_) {}
        state.status = '已定位到匹配的聊天内容，并用紫色边框标记。';
        render();
        setTimeout(() => highlight.classList.remove('mufy-recovery-chat-target'), 20000);
        return;
      }
      const container = likelyChatScrollContainer();
      if (!container) {
        await wait(600);
        continue;
      }
      const height = container.scrollHeight;
      unchanged = height === previousHeight && container.scrollTop <= 1 ? unchanged + 1 : 0;
      previousHeight = height;
      container.scrollTop = 0;
      container.dispatchEvent(new pageWindow.Event('scroll', { bubbles: true }));
      if (unchanged >= 12) break;
      await wait(700);
    }
    try { localStorage.removeItem(CHAT_JUMP_KEY); } catch (_) {}
    state.status = '已打开匹配会话，但页面未能自动加载到目标消息；可以在当前会话中继续向上滚动查找标记文字。';
    render();
  }

  function safeDialogHtml(row) {
    const pieces = Array.isArray(row?.content) ? row.content : [row?.content];
    const holder = document.createElement('div');
    holder.innerHTML = pieces.filter(item => item != null).map(item => {
      if (typeof item === 'string') return item;
      if (item?.text != null) return String(item.text);
      return `<pre>${esc(JSON.stringify(item, null, 2))}</pre>`;
    }).join('\n');
    holder.querySelectorAll('script,iframe,frame,object,embed,link,meta,base,form,input,button,textarea,select').forEach(node => node.remove());
    holder.querySelectorAll('*').forEach(node => {
      [...node.attributes].forEach(attribute => {
        const name = attribute.name.toLowerCase();
        const value = String(attribute.value || '');
        if (name.startsWith('on') || ((name === 'href' || name === 'src') && /^\s*(?:javascript|data:text\/html)/i.test(value))) node.removeAttribute(attribute.name);
        if (name === 'style' && /(?:expression|url\s*\()/i.test(value)) node.removeAttribute(attribute.name);
      });
    });
    return holder.innerHTML;
  }

  function chatRoleLabel(role) {
    return role === 'user' ? '我' : role === 'assistant' ? '角色' : role === 'system' ? '系统' : (role || '未知');
  }

  function chatExportName(value) {
    return String(value || '当前聊天').replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/\s+/g, ' ').trim().slice(0, 60) || '当前聊天';
  }

  function makeChatExportFiles(result, context, characterName) {
    const exportedAt = new Date().toISOString();
    const warning = result.complete
      ? '完整性校验通过：已到达分页末尾，去重后的消息数与服务器 total 完全一致。'
      : '警告：完整性校验未通过。页面仍保留已读取内容，但不能视为完整导出。';
    const checkText = `分页末尾：${result.reachedEnd ? '已到达' : '未确认'} · 数量一致：${result.countMatchesTotal ? '是' : '否'} · 总数稳定：${result.totals.length === 1 ? '是' : '否'} · 去重：${result.duplicates} 条`;
    const text = [
      `角色：${characterName}`,
      `导出时间：${new Date(exportedAt).toLocaleString('zh-CN')}`,
      `消息：${result.rows.length}/${result.expectedTotal ?? '未知'}`,
      warning,
      checkText,
      '',
      ...result.rows.flatMap(row => [`[${row.createdTime || row.updatedTime || ''}] ${chatRoleLabel(row.role)}`, plainDialogContent(row), ''])
    ].join('\n');
    const articles = result.rows.map(row => `<article class="message ${esc(row.role || '')}"><header><b>${esc(chatRoleLabel(row.role))}</b><time>${esc(row.createdTime || row.updatedTime || '')}</time></header><div class="content">${safeDialogHtml(row)}</div></article>`).join('\n');
    const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(characterName)} - Mufy 聊天导出</title><style>body{max-width:960px;margin:auto;padding:24px;background:#17171b;color:#eee;font:15px/1.65 system-ui}h1{font-size:22px}.summary,.message{padding:14px 16px;margin:12px 0;border:1px solid #444;border-radius:10px;background:#23232a}.summary.ok{border-color:#398b5d}.summary.warn{border-color:#b88435}.checks{margin-top:8px;color:#aaa;font-size:12px}.message header{display:flex;justify-content:space-between;gap:12px;color:#bdb8ef}.message.user{border-left:4px solid #6d9df7}.message.assistant{border-left:4px solid #a879e8}.content{overflow-wrap:anywhere}.content img{max-width:100%;height:auto}time{font-size:12px;color:#999}pre{white-space:pre-wrap}@media(max-width:600px){body{padding:10px}.message{padding:11px 12px}}</style></head><body><h1>${esc(characterName)}</h1><section class="summary ${result.complete ? 'ok' : 'warn'}"><b>${esc(warning)}</b><div>消息：${result.rows.length}/${result.expectedTotal ?? '未知'} · 导出：${esc(new Date(exportedAt).toLocaleString('zh-CN'))}</div><div class="checks">${esc(checkText)}</div></section>${articles}</body></html>`;
    return [
      { name: '聊天记录.html', content: html },
      { name: '聊天记录.txt', content: text }
    ];
  }

  async function exportCurrentChat() {
    if (state.chatExportLoading) {
      state.chatExportStopRequested = true;
      state.chatExportAbortController?.abort();
      state.status = '正在停止当前聊天导出……';
      render();
      return;
    }
    const context = currentRoleContext();
    if (pageWindow.location.pathname !== '/chat' || !context.characterId || !context.sessionId) {
      state.status = '请先进入一段已经产生 sessionId 的具体角色聊天，再导出当前聊天。';
      render();
      return;
    }
    state.chatExportLoading = true;
    state.chatExportStopRequested = false;
    state.chatExportAbortController = new AbortController();
    render();
    try {
      scanStoredAuthorization();
      let result = await readCompleteDialogHistory(context, CHAT_EXPORT_FAST_PAGE_SIZE);
      if (!result.complete && !state.chatExportStopRequested) {
        state.status = '快速分页校验未通过，正在按网站原始每页 16 条重新读取核对……';
        render();
        result = await readCompleteDialogHistory(context, CHAT_EXPORT_SAFE_PAGE_SIZE);
      }
      if (state.chatExportStopRequested) throw new DOMException('聊天导出已停止', 'AbortError');
      const known = [...state.chatted, ...state.favoriteOnly, ...state.roleHistory, ...state.siteSearchRows]
        .find(row => String(row?.characterId || '') === context.characterId);
      const characterName = known?.name || document.querySelector('h1,h2')?.textContent?.trim() || '当前角色';
      const files = makeChatExportFiles(result, context, characterName);
      const date = new Date().toISOString().slice(0, 10);
      downloadBlob(`mufy-chat-${chatExportName(characterName)}-${date}.zip`, storedZip(files));
      state.status = result.complete
        ? `当前聊天已完整导出：${result.rows.length}/${result.expectedTotal} 条，分页末尾和服务器总数校验均通过。`
        : `聊天导出完成但校验未通过：读取 ${result.rows.length}/${result.expectedTotal ?? '未知'} 条；HTML 和 TXT 顶部均已标明不完整。`;
      appendRunLog(result.complete ? 'info' : 'warn', state.status);
    } catch (error) {
      if (error?.name === 'AbortError' || state.chatExportStopRequested) state.status = '已停止聊天导出，未生成不完整文件。';
      else {
        state.status = `导出当前聊天失败：${explainFailure(error)}`;
        appendRunLog('error', '导出当前聊天失败', error);
      }
    } finally {
      state.chatExportLoading = false;
      state.chatExportStopRequested = false;
      state.chatExportAbortController = null;
      render();
    }
  }

  function downloadBlob(name, blob) {
    // Userscript 管理器可能把脚本放在隔离世界中；Blob URL 与页面 DOM 必须来自同一页面上下文，
    // 否则页面里的 <a> 可能无法解析脚本沙盒创建的 URL，表现为点击后毫无反应。
    const pageDoc = pageWindow.document || document;
    const pageURL = pageWindow.URL || URL;
    const PageBlob = pageWindow.Blob || Blob;
    if (!pageURL?.createObjectURL || !pageDoc?.createElement) {
      throw new Error('当前脚本环境不支持文件下载，请更新脚本管理器后重试');
    }
    const pageBlob = blob instanceof PageBlob ? blob : new PageBlob([blob], { type: blob?.type || 'application/octet-stream' });
    const href = pageURL.createObjectURL(pageBlob);
    const link = pageDoc.createElement('a');
    link.href = href;
    link.download = name;
    link.style.cssText = 'position:fixed;left:-10000px;top:0;';
    (pageDoc.body || pageDoc.documentElement).appendChild(link);
    try {
      link.click();
    } catch (error) {
      // 某些页面封装会屏蔽 HTMLAnchorElement.click；退回派发页面原生点击事件。
      const MouseEventCtor = pageWindow.MouseEvent || MouseEvent;
      link.dispatchEvent(new MouseEventCtor('click', { bubbles: true, cancelable: true, view: pageWindow }));
      if (!link.isConnected) throw error;
    }
    setTimeout(() => link.remove(), 1500);
    setTimeout(() => pageURL.revokeObjectURL(href), 30000);
  }

  function download(name, content, type) {
    downloadBlob(name, new (pageWindow.Blob || Blob)([content], { type }));
  }

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function storedZip(files) {
    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;
    const now = new Date();
    const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
    const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    files.forEach(file => {
      const nameBytes = encoder.encode(file.name);
      const data = typeof file.content === 'string' ? encoder.encode(file.content) : file.content;
      const crc = crc32(data);
      const local = new Uint8Array(30 + nameBytes.length);
      const localView = new DataView(local.buffer);
      localView.setUint32(0, 0x04034b50, true); localView.setUint16(4, 20, true); localView.setUint16(6, 0x800, true);
      localView.setUint16(8, 0, true); localView.setUint16(10, dosTime, true); localView.setUint16(12, dosDate, true);
      localView.setUint32(14, crc, true); localView.setUint32(18, data.length, true); localView.setUint32(22, data.length, true);
      localView.setUint16(26, nameBytes.length, true); localView.setUint16(28, 0, true); local.set(nameBytes, 30);
      localParts.push(local, data);
      const central = new Uint8Array(46 + nameBytes.length);
      const centralView = new DataView(central.buffer);
      centralView.setUint32(0, 0x02014b50, true); centralView.setUint16(4, 20, true); centralView.setUint16(6, 20, true);
      centralView.setUint16(8, 0x800, true); centralView.setUint16(10, 0, true); centralView.setUint16(12, dosTime, true); centralView.setUint16(14, dosDate, true);
      centralView.setUint32(16, crc, true); centralView.setUint32(20, data.length, true); centralView.setUint32(24, data.length, true);
      centralView.setUint16(28, nameBytes.length, true); centralView.setUint16(30, 0, true); centralView.setUint16(32, 0, true);
      centralView.setUint16(34, 0, true); centralView.setUint16(36, 0, true); centralView.setUint32(38, 0, true); centralView.setUint32(42, offset, true); central.set(nameBytes, 46);
      centralParts.push(central);
      offset += local.length + data.length;
    });
    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true); endView.setUint16(8, files.length, true); endView.setUint16(10, files.length, true);
    endView.setUint32(12, centralSize, true); endView.setUint32(16, offset, true);
    return new Blob([...localParts, ...centralParts, end], { type: 'application/zip' });
  }

  function csvCell(value) {
    return '"' + String(value ?? '').replace(/[\r\n]+/g, ' ').replaceAll('"', '""') + '"';
  }

  function roleCsvHead() {
    return ['名称', '角色ID', '会话ID', '作者', '作者ID', '可见性', '可用状态', '最后互动时间', '会话链接', '角色主页链接', '分享链接'];
  }

  function roleCsvContent(rows) {
    const lines = rows.map(row => [
      row.name, row.characterId, row.lastSessionId,
      authorLabel(row), row.authorId, row.visibility, row.availability, row.lastInteracted, row.url, row.roleUrl, row.shareUrl
    ].map(csvCell).join(','));
    return String.fromCharCode(0xfeff) + roleCsvHead().map(csvCell).join(',') + '\n' + lines.join('\n');
  }

  function splitRoleExportBatches(rows) {
    const batches = [];
    for (let start = 0; start < rows.length; start += ROLE_EXPORT_BATCH_SIZE) batches.push(rows.slice(start, start + ROLE_EXPORT_BATCH_SIZE));
    return batches;
  }

  async function exportBatchedRows(rows, format, makeContent) {
    const batches = splitRoleExportBatches(rows);
    if (batches.length <= 1) {
      download('mufy-role-links.' + format, makeContent(rows), format === 'csv' ? 'text/csv' : 'application/json');
      return false;
    }
    state.status = '角色较多，正在按每 ' + ROLE_EXPORT_BATCH_SIZE + ' 条分批导出 ' + format.toUpperCase() + '，稍等会下载一个 ZIP 压缩包……';
    render();
    await wait(0);
    const files = batches.map((batch, index) => ({
      name: 'mufy-role-links-part-' + (index + 1) + '-of-' + batches.length + '.' + format,
      content: makeContent(batch)
    }));
    downloadBlob('mufy-role-links-' + format + '-parts.zip', storedZip(files));
    state.status = '已按每 ' + ROLE_EXPORT_BATCH_SIZE + ' 条分批导出 ' + rows.length + ' 条角色链接，共 ' + batches.length + ' 个文件，已打包为 ZIP。';
    return true;
  }

  async function exportRolesJson() {
    const rows = exportRoleRows();
    const zipped = await exportBatchedRows(rows, 'json', batch => JSON.stringify(batch, null, 2));
    if (!zipped) state.status = '已导出 ' + rows.length + ' 条角色链接 JSON。';
    render();
  }

  async function exportRolesCsv() {
    const rows = exportRoleRows();
    const zipped = await exportBatchedRows(rows, 'csv', roleCsvContent);
    if (!zipped) state.status = '已导出 ' + rows.length + ' 条角色链接 CSV。';
    render();
  }

  function exportSavedShareLinks() {
    scanStoredAuthorization();
    if (!maskAccountScope) throw new Error('暂时无法识别当前账号，请先打开任意角色聊天页后重试');
    const roleById = new Map();
    [...state.chatted, ...state.favoriteOnly, ...state.archived, ...state.siteSearchRows].forEach(row => {
      const id = String(row?.characterId || '');
      if (id && !roleById.has(id)) roleById.set(id, row);
    });
    const rows = [...shareCodeCache.entries()].map(([characterId, shareCode]) => ({
      name: roleById.get(String(characterId))?.name || '未记录名称',
      characterId: String(characterId),
      shareUrl: shareUrlFromCode(shareCode)
    })).sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    if (!rows.length) {
      state.status = '当前账号还没有保存过任何角色分享链接。';
      render();
      return;
    }
    const lines = [
      'Mufy 角色分享链接备份',
      `账号分区：${maskAccountScope}`,
      `导出时间：${new Date().toLocaleString('zh-CN')}`,
      `数量：${rows.length}`,
      '',
      ...rows.flatMap((row, index) => [
        `${index + 1}. ${row.name}`,
        `角色 ID：${row.characterId}`,
        `分享链接：${row.shareUrl}`,
        ''
      ])
    ];
    download(`mufy-share-links-${maskAccountScope.slice(-7)}.txt`, `\uFEFF${lines.join('\n')}`, 'text/plain;charset=utf-8');
    state.status = `已导出当前账号保存的 ${rows.length} 条角色分享链接。`;
    render();
  }
  function exportMasksJson(includeBindings = true) {
    const masks = exportMaskRows();
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      masks
    };
    if (includeBindings) payload.bindings = cloneValue(state.maskBindings);
    download('mufy-masks.json', JSON.stringify(payload, null, 2), 'application/json');
    const bindingText = includeBindings ? `，同时包含 ${state.maskBindings.length} 条角色绑定` : '，未包含角色绑定';
    state.status = `已导出 ${masks.length} 个面具 JSON（面具库 ${state.library.length} 条）${bindingText}。`;
    render();
  }

  function exportMasksCsv() {
    const head = ['面具ID', '备注', '名称', '性别', '描述', '喜好', '指令', '创建时间'];
    const lines = exportMaskRows().map(row => [
      row.maskId || row.sourceMaskId, row.remark || row.name, row.maskName, row.gender,
      row.description, row.favorite, row.command, row.createdAt
    ].map(csvCell).join(','));
    download('mufy-masks.csv', `\uFEFF${head.map(csvCell).join(',')}\n${lines.join('\n')}`, 'text/csv');
    state.status = `已导出 ${lines.length} 个面具 CSV（面具库 ${state.library.length} 条）。`;
    render();
  }

  function importedMaskValue(row, keys) {
    for (const key of keys) {
      const value = row?.[key];
      if (value === undefined || value === null) continue;
      if (typeof value === 'string' && !value.trim()) continue;
      return value;
    }
    return '';
  }

  function looksLikeImportedMask(row) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) return false;
    return [
      'maskId', 'sourceMaskId', 'mask_id', 'maskID', 'id', 'ID',
      'maskName', 'mask_name', 'remark', 'name', 'title',
      'description', 'desc', 'command', 'prompt', 'systemPrompt',
      'system_prompt', 'content', 'text'
    ].some(key => row[key] !== undefined && row[key] !== null);
  }

  function extractImportedMaskRows(parsed) {
    if (Array.isArray(parsed)) return parsed;
    const containers = [
      parsed?.masks,
      parsed?.maskList,
      parsed?.mask_list,
      parsed?.rows,
      parsed?.list,
      parsed?.items,
      parsed?.records,
      parsed?.data
    ];
    for (const container of containers) {
      if (Array.isArray(container)) return container;
      if (!container || typeof container !== 'object') continue;
      if (looksLikeImportedMask(container)) return [container];
      for (const key of ['masks', 'maskList', 'mask_list', 'rows', 'list', 'items', 'records']) {
        if (Array.isArray(container[key])) return container[key];
      }
    }
    return looksLikeImportedMask(parsed) ? [parsed] : [];
  }

  // 兼容其他组件常见的字段命名；转换后仍使用本脚本原有的去重和绑定逻辑。
  function normalizeImportedMaskRow(row) {
    if (!row || typeof row !== 'object') return null;
    const nested = row.mask && typeof row.mask === 'object' && !Array.isArray(row.mask) ? row.mask : null;
    const get = keys => {
      const value = importedMaskValue(row, keys);
      return value !== '' ? value : importedMaskValue(nested, keys);
    };
    const command = get(['command', 'prompt', 'systemPrompt', 'system_prompt', 'instruction', 'instructions', 'maskContent', 'mask_content', 'content', 'text']);
    const maskName = get(['maskName', 'mask_name', 'maskTitle', 'mask_title']);
    const remark = get(['remark', 'remarkText', 'displayName', 'title', 'label', 'name']);
    const sourceMaskId = get(['maskId', 'sourceMaskId', 'mask_id', 'maskID', 'id', 'ID']);
    return {
      ...row,
      maskId: String(sourceMaskId ?? ''),
      sourceMaskId: String(sourceMaskId ?? ''),
      name: String(get(['name', 'remark', 'remarkText', 'displayName', 'title', 'label', 'maskName', 'mask_name']) || remark || maskName || '未命名面具'),
      maskName: String(maskName ?? ''),
      remark: String(remark ?? ''),
      gender: String(get(['gender', 'sex']) ?? ''),
      createdAt: String(get(['createdAt', 'createTime', 'created_at', 'created', 'time']) ?? ''),
      description: String(get(['description', 'desc', 'intro', 'details']) ?? ''),
      favorite: cloneValue(get(['favorite', 'favourite', 'favorites', 'likes'])),
      command: cloneValue(command)
    };
  }

  async function importMasks(file) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const rows = extractImportedMaskRows(parsed);
      if (!rows.length) throw new Error('文件中没有可识别的面具列表');
      const exportedBindings = Array.isArray(parsed) ? [] : (
        Array.isArray(parsed?.bindings) ? parsed.bindings
          : (Array.isArray(parsed?.maskBindings) ? parsed.maskBindings
            : (Array.isArray(parsed?.characterBindings) ? parsed.characterBindings : []))
      );
      const imported = rows
        .map(normalizeImportedMaskRow)
        .filter(row => row && (row.maskId || row.sourceMaskId || row.maskName || row.description || row.command))
        .map(row => maskSnapshot(row, {
          libraryId: row.libraryId || makeLibraryId(),
          name: row.name || row.remark || row.maskName,
          storedAt: row.storedAt || new Date().toISOString()
        }));
      if (!imported.length) throw new Error('文件中没有可导入的有效面具');

      const ask = pageWindow.confirm || window.confirm;
      const clearExisting = typeof ask === 'function'
        ? ask.call(pageWindow,
          `导入前是否清空当前面具库及其本地绑定？

确定：清空旧数据后导入这份文件（适合把另一浏览器的数据作为新数据）
取消：保留旧数据并合并导入（沿用原有去重规则）`)
        : false;
      const shouldImportBindings = exportedBindings.length && typeof ask === 'function'
        ? ask.call(pageWindow, `这个文件包含 ${exportedBindings.length} 条角色绑定信息。
是否同时恢复这些绑定？`)
        : false;

      // 导入前保存完整快照，清空模式也可以通过“撤回上次操作”恢复。
      saveUndo(clearExisting ? '清空旧面具库并导入' : '导入面具');
      if (clearExisting) {
        state.library = [];
        state.maskBindings = [];
      }

      const keys = new Set(state.library.map(maskContentIdentity));
      const usedLibraryIds = new Set(state.library.map(row => String(row.libraryId)));
      const importedLibraryIdMap = new Map();
      const additions = [];
      imported.forEach(row => {
        const originalLibraryId = String(row.libraryId || '');
        const key = maskContentIdentity(row);
        const existing = state.library.find(item => maskContentIdentity(item) === key) || additions.find(item => maskContentIdentity(item) === key);
        if (existing) {
          if (originalLibraryId) importedLibraryIdMap.set(originalLibraryId, existing.libraryId);
          return;
        }
        if (usedLibraryIds.has(String(row.libraryId))) row.libraryId = makeLibraryId();
        keys.add(key);
        usedLibraryIds.add(String(row.libraryId));
        if (originalLibraryId) importedLibraryIdMap.set(originalLibraryId, row.libraryId);
        additions.push(row);
      });
      state.library.push(...additions);
      persistMaskLibrary();

      let importedBindingCount = 0;
      let skippedBindingCount = 0;
      if (shouldImportBindings) {
        const currentByCharacter = new Map(state.maskBindings.map(binding => [String(binding.characterId), binding]));
        exportedBindings.forEach(binding => {
          if (!binding || !binding.characterId) { skippedBindingCount += 1; return; }
          const next = cloneValue(binding);
          if (next.libraryId) {
            const mappedId = importedLibraryIdMap.get(String(next.libraryId));
            if (mappedId) next.libraryId = mappedId;
            else if (!state.library.some(item => String(item.libraryId) === String(next.libraryId))) {
              // 绑定带快照时可以脱离原浏览器的 libraryId 恢复；没有快照才跳过。
              if (next.snapshot && typeof next.snapshot === 'object') delete next.libraryId;
              else { skippedBindingCount += 1; return; }
            }
          }
          currentByCharacter.set(String(next.characterId), next);
          importedBindingCount += 1;
        });
        state.maskBindings = [...currentByCharacter.values()];
        persistMaskBindings();
      } else if (clearExisting) {
        // 选择清空旧数据但不恢复文件中的绑定时，也要把清空结果写回本地。
        persistMaskBindings();
      }
      state.active = 'library';
      const bindingText = exportedBindings.length
        ? (importedBindingCount ? `，恢复绑定 ${importedBindingCount} 条${skippedBindingCount ? `，跳过 ${skippedBindingCount} 条` : ''}` : '，未恢复角色绑定')
        : '';
      const modeText = clearExisting ? '，已清空旧面具库后导入' : '，已与原面具库合并';
      const summary = `导入完成：读取 ${imported.length} 个面具，新增 ${additions.length} 个${modeText}；已有相同备份未重复写入${bindingText}。`;
      state.status = '';
      appendRunLog('info', summary);
      const noticeKey = accountStorageKey('mufy-recovery-mask-first-import-notice-v1');
      try {
        if (!localStorage.getItem(noticeKey)) {
          localStorage.setItem(noticeKey, '1');
          showRecoveryNotice(`已导入面具 · 新增 ${additions.length} 个`);
        }
      } catch (_) {}
    } catch (error) {
      state.status = `面具导入失败：${explainFailure(error)}`;
      appendRunLog('error', '面具导入失败', error);
    }
    render();
  }
  function matchesRole(row, query) {
    const rawQuery = String(query || '').trim().toLocaleLowerCase('zh-CN');
    if (!rawQuery) return true;
    const tags = normalizeRoleTags(row?.tags).map(tag => tag.toLocaleLowerCase('zh-CN'));
    const tokens = rawQuery.split(/\s+/).filter(Boolean);
    const requiredTags = tokens.filter(token => token.startsWith('#')).map(token => token.slice(1)).filter(Boolean);
    const excludedTags = tokens.filter(token => token.startsWith('-#')).map(token => token.slice(2)).filter(Boolean);
    if (requiredTags.some(token => !tags.some(tag => tag.includes(token)))) return false;
    if (excludedTags.some(token => tags.some(tag => tag.includes(token)))) return false;
    const textQuery = tokens.filter(token => !token.startsWith('#') && !token.startsWith('-#')).join(' ');
    if (!textQuery) return true;
    return `${row.name || ''} ${row.characterId || ''} ${row.lastSessionId || ''} ${row.authorName || ''} ${row.authorId || ''} ${tags.join(' ')} ${row.chatMatchSnippet || ''} ${row.metadataError || ''} ${visibilityLabel(row)}`
      .toLocaleLowerCase('zh-CN').includes(textQuery);
  }

  function roleTagButtons(row, limit = 10) {
    const tags = normalizeRoleTags(row?.tags);
    if (!tags.length) return '';
    const visible = tags.slice(0, limit);
    const more = tags.length > visible.length ? `<span class="mufy-recovery-tag-more">+${tags.length - visible.length}</span>` : '';
    const interactive = state.active !== 'siteSearch' && state.active !== 'siteAuthors';
    return `<div class="mufy-recovery-role-tags">${visible.map(tag => interactive
      ? `<button type="button" data-role-tag="${esc(tag)}" title="筛选标签：${esc(tag)}">#${esc(tag)}</button>`
      : `<span class="mufy-recovery-role-tag">#${esc(tag)}</span>`).join('')}${more}</div>`;
  }

  function authorGroups(rows, query) {
    const groups = new Map();
    rows.filter(row => row.authorId || row.authorName || row.availability !== '角色已删除').forEach(row => {
      const key = authorKey(row);
      if (!groups.has(key)) groups.set(key, { key, name: authorLabel(row), authorId: row.authorId || '', rows: [] });
      groups.get(key).rows.push(row);
    });
    return [...groups.values()]
      .map(group => {
        const authorMatches = matchesRole({ name: group.name, authorName: group.name, authorId: group.key }, query);
        return { ...group, rows: query && !authorMatches ? group.rows.filter(row => matchesRole(row, query)) : group.rows };
      })
      .filter(group => group.rows.length)
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  }

  function visibilityBadge(row) {
    const visibility = visibilityLabel(row);
    const className = visibility === '公开' ? 'public'
      : visibility === '仅链接' ? 'link'
        : visibility === '私密' ? 'private'
      : visibility === '分享已失效' || visibility === '角色已删除' ? 'expired'
            : 'unknown';
    const errorCode = visibility === '未知' && row.metadataErrorCode ? `（HTTP ${row.metadataErrorCode}）` : '';
    return `<span class="mufy-recovery-visibility ${className}">${esc(visibility + errorCode)}</span>`;
  }

  function isLinkOnly(row) {
    return visibilityFrom(row) === '仅链接';
  }

  function markedChatSnippet(text, query) {
    const source = String(text || '');
    const needle = String(query || '');
    const index = source.toLocaleLowerCase('zh-CN').indexOf(needle.toLocaleLowerCase('zh-CN'));
    if (!needle || index < 0) return esc(source);
    return `${esc(source.slice(0, index))}<mark>${esc(source.slice(index, index + needle.length))}</mark>${esc(source.slice(index + needle.length))}`;
  }

  function roleCard(row, index) {
    const old = isOlderThanTwoMonths(row.lastInteracted);
    const binding = `<span class="mufy-recovery-mask-binding-info">${esc(characterMaskLabel(row))}</span>`;
    const hasLocalBinding = Boolean(localBindingForCharacter(row.characterId));
    const manualDoneButton = state.active === 'manualFavoriteChats' ? `<button data-action="manual-chat-done" data-character-id="${esc(row.characterId)}">已完成</button>` : '';
    const roleActions = `${manualDoneButton}<button data-action="bind-role-mask" data-index="${index}" data-character-id="${esc(row.characterId)}">${hasLocalBinding ? '更换自动面具' : '绑定自动面具'}</button>${hasLocalBinding ? `<button data-action="unbind-role-mask" data-index="${index}" data-character-id="${esc(row.characterId)}">取消自动绑定</button>` : ''}`;
    const favoritePending = state.favoritePendingIds.has(String(row.characterId));
    const favoriteUnknown = row.favoriteKnown !== true;
    const favoriteAction = favoritePending ? 'favorite-pending' : favoriteUnknown ? 'favorite-unknown' : (row.isFavorite ? 'unfavorite-role' : 'favorite-role');
    const favoriteTitle = favoritePending ? '收藏处理中…' : favoriteUnknown ? '当前页面没有返回收藏状态，请刷新后重试' : (row.isFavorite ? '取消收藏' : '收藏角色');
    const favoriteIcon = favoritePending ? '…' : favoriteUnknown ? '—' : (row.isFavorite ? '★' : '☆');
    const archiveRows = state.archived.filter(item => String(item.characterId) === String(row.characterId));
    const archiveOpen = state.archiveOpenCharacterIds.has(String(row.characterId));
    const archiveButton = row.archive ? '' : `<button class="mufy-recovery-archive-button" data-action="archive-role" data-character-id="${esc(row.characterId)}" title="查询这个角色的归档旧档" ${state.archiveLoading ? 'disabled' : ''}>旧档${archiveRows.length ? ` (${archiveRows.length})` : ''}</button>`;
    const favoriteButton = `<button class="mufy-recovery-favorite-button ${row.isFavorite ? 'is-favorite' : ''}${favoritePending ? ' is-pending' : ''}" data-action="${favoriteAction}" data-index="${index}" data-character-id="${esc(row.characterId)}" title="${favoriteTitle}" aria-label="${favoriteTitle}" ${state.favoriteRunning || state.shareRecoveryLoading || favoritePending || favoriteUnknown ? 'disabled' : ''}>${favoriteIcon}</button>`;
    const rowTools = `<span class="mufy-recovery-role-tools">${archiveButton}${favoriteButton}</span>`;
    const archiveList = archiveOpen && !row.archive
      ? `<div class="mufy-recovery-archives">${archiveRows.map((item, archiveIndex) => `<a href="${esc(sessionUrl(item))}" target="_blank" rel="noreferrer">旧档 ${archiveIndex + 1}${item.archiveRemark ? ` · ${esc(item.archiveRemark)}` : ''}${item.archiveUpdatedAt || item.archiveCreatedAt ? ` · ${esc(new Date(item.archiveUpdatedAt || item.archiveCreatedAt).toLocaleString('zh-CN'))}` : ''}</a>`).join('') || '<span>没有找到归档旧档</span>'}</div>`
      : '';
    const matchSnippet = row.chatMatchSnippet ? `<div class="mufy-recovery-chat-match"><b>${esc(chatRoleLabel(row.chatMatchRole))}${row.chatMatchTime ? ` · ${esc(new Date(row.chatMatchTime).toLocaleString('zh-CN'))}` : ''}</b><span>${markedChatSnippet(row.chatMatchSnippet, state.chatSearchQuery)}</span></div>` : '';
    const openLabel = state.active === 'chatted' || state.active === 'chattedNotFavorite' || state.active === 'chatMatches' ? '打开匹配会话' : '打开角色';
    const openLink = state.active === 'chatMatches'
      ? `<button class="mufy-recovery-chat-jump" data-action="jump-chat-match" data-index="${index}">${openLabel}</button>`
      : `<a href="${esc(sessionUrl(row))}" rel="noreferrer">${openLabel}</a>`;
    return `<div class="mufy-recovery-row">
      ${row.avatarUrl ? `<img src="${esc(row.avatarUrl)}" alt="">` : ''}
      <div class="mufy-recovery-info">
        <div class="mufy-recovery-row-title"><b>${index + 1}. ${esc(row.name)}</b>${old ? '<span class="mufy-recovery-old">旧记录</span>' : ''}${rowTools}</div>
        <div class="mufy-recovery-muted">作者：${esc(authorLabel(row))} ${visibilityBadge(row)}</div>
        ${state.section === 'roles'
          ? `<details class="mufy-role-record"><summary>记录详情</summary><div>${esc(row.lastInteracted || '时间未知')} · ${esc(row.characterId)}</div></details>`
          : `<div class="mufy-recovery-muted">${esc(row.lastInteracted || '时间未知')} · ${esc(row.characterId)}</div>`}
        ${roleTagButtons(row)}
        ${matchSnippet}
        ${archiveList}
        <div class="mufy-recovery-row-actions">${openLink}${binding}${roleActions}</div>
      </div>
    </div>`;
  }

  function roleHistoryCard(row, index) {
    const shareCode = shareCodeCache.get(String(row.characterId)) || '';
    return `<div class="mufy-recovery-row"><div class="mufy-recovery-info">
      <div class="mufy-recovery-row-title"><b>${index + 1}. ${esc(row.name || '未命名角色')}</b></div>
      <div class="mufy-recovery-muted">${esc(row.authorName || '作者未知')} · ${esc(row.characterId)}</div>
      <div class="mufy-recovery-muted">最后记录：${esc(row.lastInteracted || row.lastSeenAt || '时间未知')}</div>
      ${roleTagButtons(row)}
      <div class="mufy-recovery-row-actions"><a href="${esc(roleUrl(row.characterId))}" rel="noreferrer">打开角色</a>${row.lastSessionId ? `<a href="${esc(sessionUrl(row))}" rel="noreferrer">打开记录的会话</a>` : ''}${shareCode ? `<a href="${esc(shareUrlFromCode(shareCode))}" rel="noreferrer">打开分享链接</a>` : ''}</div>
    </div></div>`;
  }

  function siteRoleCard(row, index) {
    const id = String(row.characterId || '');
    const selected = state.selectedSiteCharacterIds.has(id);
    const selectable = row.favoriteKnown === true || row.favoriteNeedsDetail;
    const selectTitle = row.favoriteNeedsDetail
      ? '勾选后会先请求角色详情，确认未收藏再执行'
      : row.favoriteKnown === true
        ? '勾选后可批量收藏'
        : '当前页面没有返回收藏状态，不能安全批量操作';
    const selectBox = `<label class="mufy-recovery-site-select" title="${selectTitle}"><input type="checkbox" data-action="toggle-site-select" data-character-id="${esc(id)}" ${selected ? 'checked' : ''} ${selectable ? '' : 'disabled'}><span>选中</span></label>`;
    let card = roleCard(row, index).replace(
      '<div class="mufy-recovery-row">',
      `<div class="mufy-recovery-row mufy-recovery-site-role-row ${selected ? 'selected' : ''}" data-character-id="${esc(id)}">`
    );
    const archiveButtonPattern = /<button class="mufy-recovery-archive-button"[\s\S]*?<\/button>/;
    if (archiveButtonPattern.test(card)) card = card.replace(archiveButtonPattern, selectBox);
    else card = card.replace('<span class="mufy-recovery-role-tools">', `<span class="mufy-recovery-role-tools">${selectBox}`);
    return card.replace(/<div class="mufy-recovery-archives">[\s\S]*?<\/div>/, '');
  }

  function safeSiteRoleCard(row, index) {
    try {
      return siteRoleCard(row, index);
    } catch (error) {
      return `<div class="mufy-recovery-row mufy-recovery-site-role-row" data-character-id="${esc(row?.characterId || '')}"><div class="mufy-recovery-info"><b>${esc(row?.name || '未命名角色')}</b><div class="mufy-recovery-muted">网站角色读取异常：${esc(error?.message || error)}</div></div></div>`;
    }
  }

  let lastQuoteSelection = null;
  let quoteDraftContext = null;
  let messageQuoteObserver = null;
  let quoteStageOpen = false;
  let quotePreviewFlipped = false;
  let quoteOpenDeckId = '';
  let quoteInlineEditing = false;
  let quoteToolsOpen = false;
  let quoteStyleOpen = false;

  function messageContainerFromAction(actionBox) {
    let node = actionBox;
    for (let depth = 0; node && depth < 9; depth += 1, node = node.parentElement) {
      if (node.querySelector?.('.react-markdown') && node.querySelector?.('[id="mufy_message_actions_box"]')) return node;
    }
    return null;
  }

  function rememberQuoteSelection() {
    const selection = pageWindow.getSelection?.();
    const text = String(selection?.toString() || '').trim();
    if (!selection || !selection.rangeCount || !text) return;
    const common = selection.getRangeAt(0).commonAncestorContainer;
    const element = common.nodeType === 1 ? common : common.parentElement;
    const markdown = element?.closest?.('.react-markdown');
    if (!markdown) return;
    let container = markdown;
    for (let depth = 0; container && depth < 9; depth += 1, container = container.parentElement) {
      if (container.querySelector?.('[id="mufy_message_actions_box"]')) {
        lastQuoteSelection = { text, container, savedAt: Date.now() };
        return;
      }
    }
  }

  function currentQuoteCharacter() {
    const context = currentRoleContext();
    const known = [...state.chatted, ...state.roleHistory, ...state.siteSearchRows]
      .find(row => String(row?.characterId || '') === context.characterId);
    return {
      ...context,
      name: String(known?.name || document.querySelector('h1,h2')?.textContent?.trim() || '当前角色'),
      avatarUrl: String(known?.avatarUrl || '')
    };
  }

  function openQuoteEditor(container) {
    if (!container || !panel) return;
    rememberQuoteSelection();
    const markdown = container.querySelector('.react-markdown');
    const fullText = String(markdown?.innerText || markdown?.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
    const selected = lastQuoteSelection && lastQuoteSelection.container === container && Date.now() - lastQuoteSelection.savedAt < 120000
      ? lastQuoteSelection.text : '';
    const character = currentQuoteCharacter();
    if (!character.characterId || !character.sessionId) {
      state.status = '当前页面没有可识别的角色或会话 ID，暂时不能收藏摘录。';
      render();
      return;
    }
    quoteDraftContext = { ...character, sourceText: fullText, anchor: selected || fullText.slice(0, 120) };
    const modal = panel.querySelector('#mufy-recovery-quote-editor-modal');
    modal.querySelector('#mufy-recovery-quote-editor-text').value = selected || fullText;
    modal.querySelector('#mufy-recovery-quote-editor-role').textContent = `收藏到“${character.name}”的摘录牌组`;
    modal.hidden = false;
    panel.style.display = 'flex';
    setTimeout(() => modal.querySelector('#mufy-recovery-quote-editor-text').focus(), 0);
  }

  function saveQuoteDraft() {
    if (!quoteDraftContext) return;
    const textarea = panel?.querySelector('#mufy-recovery-quote-editor-text');
    const text = String(textarea?.value || '').trim();
    if (!text) {
      state.status = '摘录内容为空，没有保存。';
      render();
      return;
    }
    const id = pageWindow.crypto?.randomUUID?.() || `quote-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const row = {
      id,
      characterId: quoteDraftContext.characterId,
      sessionId: quoteDraftContext.sessionId,
      characterName: quoteDraftContext.name,
      avatarUrl: quoteDraftContext.avatarUrl,
      text,
      anchor: String(quoteDraftContext.anchor || text.slice(0, 120)),
      savedAt: new Date().toISOString()
    };
    state.quoteCards.unshift(row);
    state.quoteSelectedId = id;
    saveQuoteCards();
    panel.querySelector('#mufy-recovery-quote-editor-modal').hidden = true;
    quoteDraftContext = null;
    lastQuoteSelection = null;
    state.status = `已收藏一张“${row.characterName}”摘录卡。`;
    renderQuoteLibraryModal();
    render();
  }

  function injectMessageQuoteButtons(root = document) {
    const boxes = [];
    if (root?.matches?.('[id="mufy_message_actions_box"]')) boxes.push(root);
    root.querySelectorAll?.('[id="mufy_message_actions_box"]').forEach(box => boxes.push(box));
    boxes.forEach(actionBox => {
      if (actionBox.querySelector('[data-mufy-quote-save]')) return;
      const copy = actionBox.querySelector('[id="mufy_message_actions_copy"]');
      if (!copy || !copy.parentElement) return;
      const separator = document.createElement('div');
      separator.setAttribute('role', 'separator');
      separator.className = 'mufy-quote-action-separator';
      const button = document.createElement('div');
      button.dataset.mufyQuoteSave = '1';
      button.className = 'mufy-quote-action-button';
      button.textContent = '摘录';
      button.title = '有选中文字时收藏选中片段；没有选区时编辑整条回复';
      button.onpointerdown = () => rememberQuoteSelection();
      button.onclick = event => {
        event.preventDefault();
        event.stopPropagation();
        openQuoteEditor(messageContainerFromAction(actionBox));
      };
      copy.after(separator, button);
    });
  }

  function installMessageQuoteButtons() {
    injectMessageQuoteButtons();
    messageQuoteObserver?.disconnect();
    messageQuoteObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        const targetBox = mutation.target?.closest?.('[id="mufy_message_actions_box"]');
        if (targetBox) injectMessageQuoteButtons(targetBox);
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE) continue;
          if (node.nodeType !== 1) continue;
          const addedBox = node.matches?.('[id="mufy_message_actions_box"]') ? node : node.closest?.('[id="mufy_message_actions_box"]');
          if (addedBox) injectMessageQuoteButtons(addedBox);
          else if (node.querySelector?.('[id="mufy_message_actions_box"]')) injectMessageQuoteButtons(node);
        }
      }
    });
    messageQuoteObserver.observe(document.body, { childList: true, subtree: true });
  }

  function quoteCardGroups() {
    const groups = new Map();
    state.quoteCards.forEach(row => {
      const key = String(row.characterId);
      if (!groups.has(key)) groups.set(key, { characterId: key, name: row.characterName || '未命名角色', avatarUrl: row.avatarUrl || '', rows: [] });
      groups.get(key).rows.push(row);
    });
    return [...groups.values()];
  }

  function selectedQuoteCard() {
    return state.quoteCards.find(row => row.id === state.quoteSelectedId) || state.quoteCards[0] || null;
  }

  function renderQuoteLibraryModal() {
    const modal = panel?.querySelector('#mufy-recovery-quote-library-modal');
    if (!modal) return;
    const list = modal.querySelector('#mufy-recovery-quote-list');
    const groups = quoteCardGroups();
    const openGroup = groups.find(group => group.characterId === quoteOpenDeckId);
    if (!openGroup) quoteOpenDeckId = '';
    if (!quoteOpenDeckId) {
      list.innerHTML = groups.length ? `<div class="mufy-quote-deck-grid">${groups.map(group => `<button class="mufy-quote-stack" data-quote-deck="${esc(group.characterId)}"><span class="mufy-quote-stack-layers"></span><span class="mufy-quote-stack-cover">${group.avatarUrl ? `<img src="${esc(group.avatarUrl)}" alt="${esc(group.name)}">` : '<i>✦</i>'}<span><b>${esc(group.name)}</b><small>${group.rows.length} 张摘录</small></span></span></button>`).join('')}</div>` : '<div class="mufy-recovery-empty">还没有摘录。请在角色回复中选中文字，再从省略号菜单点击“摘录”。</div>';
    } else {
      const group = openGroup;
      const cards = group.rows.map((row, index) => {
        const progress = group.rows.length <= 1 ? 0 : index / (group.rows.length - 1) - 0.5;
        const spread = Math.min(260, 70 + Math.max(0, group.rows.length - 2) * 24);
        const offsetX = progress * spread;
        const angle = progress * Math.min(42, 18 + group.rows.length * 2.5);
        const active = row.id === state.quoteSelectedId;
        return `<button class="mufy-quote-deck-card ${active ? 'active' : ''}" data-quote-id="${esc(row.id)}" style="--fan-x:${offsetX}px;--fan-angle:${angle}deg;z-index:${active ? 60 : index + 1}" title="${esc(row.text.slice(0, 100))}">${row.avatarUrl ? `<img src="${esc(row.avatarUrl)}" alt="${esc(row.characterName)}">` : '<span class="mufy-quote-deck-fallback">✦</span>'}<i></i></button>`;
      }).join('');
      list.innerHTML = `<section class="mufy-quote-deck is-open"><div class="mufy-quote-deck-head"><button id="mufy-recovery-quote-deck-back">‹ 返回牌组</button>${group.avatarUrl ? `<img src="${esc(group.avatarUrl)}" alt="">` : ''}<div><b>${esc(group.name)}</b><small>${group.rows.length} 张摘录牌</small></div><span>选择一张放大</span></div><div class="mufy-quote-fan-scroll"><div class="mufy-quote-fan">${cards}</div></div></section>`;
    }
    const card = selectedQuoteCard();
    if (card && !state.quoteSelectedId) state.quoteSelectedId = card.id;
    const hasCard = quoteStageOpen && Boolean(card);
    const managing = hasCard && quoteToolsOpen;
    const styling = managing && quoteStyleOpen;
    const editing = managing && quoteInlineEditing;
    const viewing = hasCard && !managing;
    list.hidden = hasCard;
    modal.querySelector('#mufy-recovery-quote-stage').hidden = !viewing;
    modal.querySelector('#mufy-recovery-quote-tools-toggle').hidden = !viewing;
    modal.querySelector('#mufy-recovery-quote-stage-close').hidden = !hasCard;
    modal.querySelector('#mufy-recovery-quote-management').hidden = !managing || styling;
    modal.querySelector('#mufy-recovery-quote-stage-edit-actions').hidden = editing;
    modal.querySelector('#mufy-recovery-quote-text-form').hidden = !editing;
    modal.querySelector('#mufy-recovery-quote-style-modal').hidden = !styling;
    modal.querySelector('#mufy-recovery-quote-stage-title').textContent = styling ? '牌面样式'
      : editing ? '编辑摘录' : managing ? '管理摘录'
        : viewing ? (quotePreviewFlipped ? '摘录面' : '角色图面') : '角色摘录牌组';
    modal.querySelector('#mufy-recovery-quote-view-caption').textContent = hasCard ? card.characterName : '按角色浏览摘录';
    const preview = modal.querySelector('#mufy-recovery-quote-preview');
    const style = effectiveQuoteStyle();
    const book = style.theme === 'book';
    preview.className = `mufy-quote-preview theme-${esc(style.theme)} ${quotePreviewFlipped ? 'is-flipped' : ''}`;
    preview.style.setProperty('--quote-bg', style.background);
    preview.style.setProperty('--quote-color', style.textColor);
    preview.style.setProperty('--quote-accent', style.accent);
    preview.style.setProperty('--quote-size', `${style.fontSize}px`);
    preview.style.setProperty('--quote-font', style.fontFamily === 'sans' ? 'system-ui,sans-serif' : style.fontFamily === 'mono' ? 'ui-monospace,monospace' : 'Georgia,"Noto Serif SC",serif');
    preview.style.setProperty('--quote-align', style.align);
    const quoteBack = book && card
      ? `<div class="mufy-quote-book-kicker">摘录</div><div class="mufy-quote-preview-text">${bookQuoteParagraphs(card.text).map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</div>${style.showRole ? `<div class="mufy-quote-book-byline">${esc(card.characterName)}</div>` : ''}`
      : card ? `${style.showRole ? `<div class="mufy-quote-preview-role">${card.avatarUrl ? `<img src="${esc(card.avatarUrl)}" alt="">` : ''}<span>${esc(card.characterName)}</span></div>` : ''}<div class="mufy-quote-preview-text">${esc(card.text)}</div><div class="mufy-quote-preview-mark">MUFY · 摘录</div>` : '';
    preview.innerHTML = card ? `<div class="mufy-quote-card-inner"><div class="mufy-quote-card-face mufy-quote-card-image">${card.avatarUrl ? `<img src="${esc(card.avatarUrl)}" alt="${esc(card.characterName)}">` : '<div class="mufy-quote-card-image-fallback">✦</div>'}<div class="mufy-quote-card-image-shade"></div><strong>${esc(card.characterName)}</strong><small>点击翻转查看摘录</small></div><div class="mufy-quote-card-face mufy-quote-card-content">${quoteBack}</div></div>` : '';
    preview.setAttribute('aria-label', quotePreviewFlipped ? '翻到角色图面' : '翻到摘录面');
    modal.querySelectorAll('[data-quote-style]').forEach(control => {
      const key = control.dataset.quoteStyle;
      control.disabled = book && ['background', 'textColor', 'accent', 'fontFamily', 'align'].includes(key);
      control.closest('label').hidden = control.disabled;
      if (control.type === 'checkbox') control.checked = Boolean(style[key]);
      else control.value = String(style[key] ?? '');
    });
    modal.querySelector('#mufy-recovery-quote-delete').disabled = !card;
    modal.querySelector('#mufy-recovery-quote-source').disabled = !card;
    modal.querySelector('#mufy-recovery-quote-export').disabled = !card;
    modal.querySelector('#mufy-recovery-quote-update').disabled = !card;
    modal.querySelector('#mufy-recovery-quote-deck-back')?.addEventListener('click', () => {
      quoteOpenDeckId = '';
      quoteStageOpen = false;
      quoteInlineEditing = false;
      quoteToolsOpen = false;
      renderQuoteLibraryModal();
    });
  }

  function openQuoteLibraryModal() {
    const modal = panel?.querySelector('#mufy-recovery-quote-library-modal');
    if (!modal) return;
    quoteStageOpen = false;
    quotePreviewFlipped = false;
    quoteOpenDeckId = '';
    quoteInlineEditing = false;
    quoteToolsOpen = false;
    quoteStyleOpen = false;
    renderQuoteLibraryModal();
    modal.hidden = false;
  }

  function deleteSelectedQuote() {
    const card = selectedQuoteCard();
    if (!card || !pageWindow.confirm(`确定删除这张“${card.characterName}”摘录卡吗？`)) return;
    state.quoteCards = state.quoteCards.filter(row => row.id !== card.id);
    state.quoteSelectedId = state.quoteCards[0]?.id || '';
    saveQuoteCards();
    quoteStageOpen = false;
    quoteInlineEditing = false;
    quoteToolsOpen = false;
    state.status = '已删除摘录卡。';
    renderQuoteLibraryModal();
    render();
  }

  function openSelectedQuoteSource() {
    const card = selectedQuoteCard();
    if (!card) return;
    openChatMatchAndLocate({ characterId: card.characterId, lastSessionId: card.sessionId, chatMatchSnippet: card.text, chatMatchAnchor: card.anchor });
  }

  function updateSelectedQuoteText() {
    const card = selectedQuoteCard();
    if (!card) return;
    const editor = panel.querySelector('#mufy-recovery-quote-inline-editor');
    const text = editor.value.trim();
    if (!text) {
      showRecoveryNotice('摘录内容不能为空。');
      return;
    }
    card.text = text;
    card.anchor = card.anchor || text.slice(0, 120);
    saveQuoteCards();
    quoteInlineEditing = false;
    quoteToolsOpen = false;
    quotePreviewFlipped = true;
    state.status = '摘录文字已保存。';
    renderQuoteLibraryModal();
    render();
  }

  function loadCanvasImage(url) {
    return new Promise(resolve => {
      if (!url) return resolve(null);
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = url;
    });
  }

  function canvasQuoteLines(ctx, text, maxWidth) {
    const lines = [];
    String(text || '').split(/\n/).forEach((paragraph, paragraphIndex, paragraphs) => {
      let line = '';
      for (const char of paragraph) {
        const next = line + char;
        if (line && ctx.measureText(next).width > maxWidth) { lines.push(line); line = char; }
        else line = next;
      }
      if (line) lines.push(line);
      if (paragraphIndex < paragraphs.length - 1) lines.push('');
    });
    return lines;
  }

  async function exportSelectedQuoteImage() {
    const card = selectedQuoteCard();
    if (!card) return;
    const mode = panel.querySelector('#mufy-recovery-quote-export-side').value;
    const sides = mode === 'both' ? [false, true] : [mode === 'back' || (mode === 'current' && quotePreviewFlipped)];
    const style = effectiveQuoteStyle();
    try {
      for (const back of sides) await downloadQuoteFace(card, style, back);
    } catch (error) {
      showRecoveryNotice(`导出摘录失败：${explainFailure(error)}`, 'error');
    }
  }

  async function downloadQuoteFace(card, style, back) {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');
    const book = back && style.theme === 'book';
    const bookFont = Math.max(30, Number(style.fontSize || 18) * 2.4);
    const bookTypeface = '"Noto Serif SC", "Songti SC", SimSun, serif';
    let bookLines = [];
    if (book) {
      ctx.font = `${bookFont}px ${bookTypeface}`;
      bookLines = bookQuoteParagraphs(card.text).flatMap((paragraph, index) =>
        [...(index ? [''] : []), ...canvasQuoteLines(ctx, `　　${paragraph}`, 700)]);
    }
    const pageLineCount = Math.floor(1050 / (bookFont * 1.7));
    const pageCount = book ? Math.max(1, Math.ceil(bookLines.length / pageLineCount)) : 1;
    const safeName = String(card.characterName || '角色').replace(/[\\/:*?"<>|]+/g, '_');
    for (let page = 0; page < pageCount; page += 1) {
      ctx.fillStyle = style.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (!back) {
        const image = await loadCanvasImage(card.avatarUrl);
        if (image) {
          const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
          const width = image.naturalWidth * scale;
          const height = image.naturalHeight * scale;
          ctx.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
        }
        const gradient = ctx.createLinearGradient(0, 650, 0, 1400);
        gradient.addColorStop(0, 'rgba(0,0,0,0)'); gradient.addColorStop(1, 'rgba(0,0,0,.82)');
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, 900, 1400);
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = '700 66px Georgia,serif';
        ctx.fillText(card.characterName, 450, 1240);
        ctx.font = '30px system-ui'; ctx.fillStyle = '#ffffffcc'; ctx.fillText('MUFY · 角色摘录牌', 450, 1305);
      } else if (book) {
        ctx.textAlign = 'left';
        ctx.fillStyle = style.accent;
        ctx.font = `30px ${bookTypeface}`;
        ctx.fillText(pageCount === 1 ? '摘录' : `摘录 · ${page + 1}/${pageCount}`, 100, 125);
        ctx.fillStyle = style.textColor;
        ctx.font = `${bookFont}px ${bookTypeface}`;
        bookLines.slice(page * pageLineCount, (page + 1) * pageLineCount)
          .forEach((line, index) => ctx.fillText(line, 100, 235 + index * bookFont * 1.7));
        ctx.fillRect(100, 1290, 700, 1);
        if (style.showRole) {
          ctx.textAlign = 'right';
          ctx.font = `32px ${bookTypeface}`;
          ctx.fillText(card.characterName, 800, 1350);
        }
      } else {
        ctx.strokeStyle = style.accent; ctx.lineWidth = 10; ctx.strokeRect(28, 28, 844, 1344);
        ctx.lineWidth = 2; ctx.strokeRect(52, 52, 796, 1296);
        let fontSize = Math.max(30, Number(style.fontSize || 18) * 2.4);
        let lines = [];
        do {
          ctx.font = `${fontSize}px ${style.fontFamily === 'mono' ? 'monospace' : style.fontFamily === 'sans' ? 'sans-serif' : 'serif'}`;
          lines = canvasQuoteLines(ctx, card.text, 700);
          if (lines.length * fontSize * 1.65 <= 1030) break;
          fontSize -= 2;
        } while (fontSize > 24);
        ctx.fillStyle = style.textColor;
        ctx.textAlign = style.align === 'center' ? 'center' : style.align === 'right' ? 'right' : 'left';
        const x = style.align === 'center' ? 450 : style.align === 'right' ? 800 : 100;
        const lineHeight = fontSize * 1.65;
        let y = Math.max(190, (1400 - lines.length * lineHeight) / 2);
        lines.forEach(line => { ctx.fillText(line, x, y); y += lineHeight; });
        if (style.showRole) { ctx.textAlign = 'center'; ctx.fillStyle = style.accent; ctx.font = '700 36px serif'; ctx.fillText(card.characterName, 450, 115); }
        ctx.textAlign = 'right'; ctx.font = '22px system-ui'; ctx.fillStyle = style.accent; ctx.fillText('MUFY · 摘录', 810, 1325);
      }
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('无法生成 PNG');
      const pageSuffix = pageCount === 1 ? '' : `-${page + 1}`;
      downloadBlob(`${safeName}-摘录-${back ? '文字' : '角色图'}${pageSuffix}.png`, blob);
    }
  }

  function modelMonitorStatusClass(status) {
    const text = String(status || '未知');
    if (/中断|停用|不可用|故障|异常/i.test(text)) return 'red';
    if (/拥堵|繁忙|缓慢|波动/i.test(text)) return 'yellow';
    if (/流畅|正常|可用/i.test(text)) return 'green';
    return 'gray';
  }

  function modelMonitorSeverity(status) {
    const statusClass = modelMonitorStatusClass(status);
    return statusClass === 'red' ? 2 : statusClass === 'yellow' ? 1 : 0;
  }

  function notifyModelMonitorChanges(previousRows, nextRows) {
    if (!state.modelMonitorNotify || pageWindow.Notification?.permission !== 'granted') return;
    const previous = new Map((previousRows || []).map(row => [String(row.id), row]));
    const changed = (nextRows || []).filter(row => {
      if (!state.modelMonitorSelectedIds.has(String(row.id))) return false;
      const before = previous.get(String(row.id));
      return before && modelMonitorSeverity(row.status) > modelMonitorSeverity(before.status);
    });
    if (!changed.length) return;
    const body = changed.slice(0, 4).map(row => `${row.name}：${row.status}`).join('\n')
      + (changed.length > 4 ? `\n另有 ${changed.length - 4} 个模型状态变差` : '');
    try {
      const notification = new pageWindow.Notification('Mufy 模型状态提醒', { body, tag: 'mufy-model-monitor-alert' });
      notification.onclick = () => { try { pageWindow.focus(); } catch (_) {} };
    } catch (error) {
      appendRunLog('warn', '模型状态通知发送失败', error);
    }
  }

  async function setModelMonitorNotify(enabled) {
    if (!enabled) {
      state.modelMonitorNotify = false;
      saveModelMonitorNotify(false);
      renderModelMonitorModal();
      return;
    }
    if (!pageWindow.Notification) {
      state.status = '当前浏览器不支持系统通知，模型监控仍会继续显示颜色状态。';
      state.modelMonitorNotify = false;
      saveModelMonitorNotify(false);
      render();
      return;
    }
    let permission = pageWindow.Notification.permission;
    if (permission === 'default') {
      try { permission = await pageWindow.Notification.requestPermission(); }
      catch (_) { permission = 'denied'; }
    }
    state.modelMonitorNotify = permission === 'granted';
    saveModelMonitorNotify(state.modelMonitorNotify);
    state.status = state.modelMonitorNotify
      ? '模型异常通知已开启；只在已选模型状态变差时提醒，不会每 5 分钟重复弹出。'
      : '浏览器没有授予通知权限；模型监控仍会继续显示颜色状态。';
    render();
    renderModelMonitorModal();
  }

  function flattenModelMonitorRows(tree) {
    const rows = [];
    (Array.isArray(tree) ? tree : []).forEach(model => {
      const templates = Array.isArray(model?.templates) ? model.templates : [];
      if (!templates.length) {
        rows.push({ id: `model:${model.modelId}`, modelId: String(model.modelId || ''), name: String(model.displayName || '未命名模型').trim(), group: model.isOfficial ? '官方模型' : '非官方模型', status: String(model.stabilityStatus || '未知'), responseTime: Number(model.firstCharTimeAvg), successRate: Number(model.recentSuccessRate) });
        return;
      }
      templates.forEach(template => rows.push({
        id: `template:${template.modelTemplateId}`,
        modelId: String(model.modelId || ''),
        templateId: String(template.modelTemplateId || ''),
        name: String(template.displayName || model.displayName || '未命名模型').trim(),
        group: String(model.displayName || (model.isOfficial ? '官方模型' : '非官方模型')).trim(),
        status: String(template.stabilityStatus || model.stabilityStatus || '未知'),
        responseTime: Number(template.firstCharTimeAvg ?? model.firstCharTimeAvg),
        successRate: Number(template.recentSuccessRate ?? model.recentSuccessRate)
      }));
    });
    return rows.filter(row => row.id && row.name);
  }

  function updateModelMonitorDots() {
    const holder = document.getElementById('mufy-recovery-model-dots');
    if (!holder) return;
    const selected = state.modelMonitorRows.filter(row => state.modelMonitorSelectedIds.has(row.id));
    holder.hidden = !state.modelMonitorSelectedIds.size;
    const visible = selected.slice(0, 6);
    holder.innerHTML = visible.map(row => `<i class="is-${modelMonitorStatusClass(row.status)}" title="${esc(`${row.name}：${row.status}`)}"></i>`).join('')
      + (state.modelMonitorSelectedIds.size > 6 ? `<b>+${state.modelMonitorSelectedIds.size - 6}</b>` : '')
      + (!selected.length && state.modelMonitorSelectedIds.size ? '<i class="is-gray" title="等待首次检测"></i>' : '');
    holder.title = selected.length
      ? selected.map(row => `${row.name}：${row.status}`).join('\n')
      : '等待模型状态首次检测';
  }

  function renderModelMonitorModal() {
    const modal = panel?.querySelector('#mufy-recovery-model-modal');
    if (!modal) { updateModelMonitorDots(); return; }
    const query = String(modal.querySelector('#mufy-recovery-model-search')?.value || '').trim().toLocaleLowerCase('zh-CN');
    const rows = state.modelMonitorRows
      .filter(row => !query || `${row.name} ${row.group}`.toLocaleLowerCase('zh-CN').includes(query))
      .sort((a, b) => Number(state.modelMonitorSelectedIds.has(b.id)) - Number(state.modelMonitorSelectedIds.has(a.id)) || a.name.localeCompare(b.name, 'zh-CN'));
    modal.querySelector('#mufy-recovery-model-list').innerHTML = rows.map(row => {
      const statusClass = modelMonitorStatusClass(row.status);
      const response = Number.isFinite(row.responseTime) ? `${row.responseTime.toFixed(2)}s` : '—';
      const success = Number.isFinite(row.successRate) ? `${row.successRate.toFixed(2)}%` : '—';
      return `<label class="mufy-model-monitor-row"><input type="checkbox" data-model-monitor-id="${esc(row.id)}" ${state.modelMonitorSelectedIds.has(row.id) ? 'checked' : ''}><span class="mufy-model-monitor-dot is-${statusClass}"></span><span class="mufy-model-monitor-info"><b>${esc(row.name)}</b><small>${esc(row.group)} · 响应 ${esc(response)} · 成功率 ${esc(success)}</small></span><em class="is-${statusClass}">${esc(row.status)}</em></label>`;
    }).join('') || `<div class="mufy-recovery-empty">${state.modelMonitorLoading ? '正在读取模型状态…' : state.modelMonitorError ? esc(state.modelMonitorError) : '没有匹配的模型'}</div>`;
    const checkedAt = state.modelMonitorLastChecked ? new Date(state.modelMonitorLastChecked).toLocaleString('zh-CN') : '尚未检测';
    modal.querySelector('#mufy-recovery-model-summary').textContent = `${state.modelMonitorSelectedIds.size} 个监控模型 · 每 5 分钟检测 · ${checkedAt}${state.modelMonitorError ? ` · ${state.modelMonitorError}` : ''}`;
    const refresh = modal.querySelector('#mufy-recovery-model-refresh');
    refresh.disabled = state.modelMonitorLoading;
    refresh.textContent = state.modelMonitorLoading ? '检测中…' : '立即检测';
    const notify = modal.querySelector('#mufy-recovery-model-notify');
    if (notify) notify.checked = state.modelMonitorNotify;
    const notifyText = modal.querySelector('#mufy-recovery-model-notify-text');
    if (notifyText) notifyText.textContent = state.modelMonitorNotify ? '异常通知已开启' : '异常通知（可选）';
    updateModelMonitorDots();
  }

  async function checkModelMonitor(force = false) {
    if (state.modelMonitorLoading || (!force && !state.modelMonitorSelectedIds.size)) return;
    state.modelMonitorLoading = true;
    state.modelMonitorError = '';
    renderModelMonitorModal();
    try {
      scanStoredAuthorization();
      const headers = { Accept: 'application/json' };
      if (authorization) headers.Authorization = authorization;
      const response = await pageWindow.fetch(new URL('/api/models/tree', location.origin).href, { method: 'GET', credentials: 'include', headers });
      if (response.status === 401 || response.status === 403) throw new Error(loginErrorMessage(response.status, '读取模型状态'));
      if (!response.ok) throw new Error(`读取模型状态失败（HTTP ${response.status}）`);
      const body = await response.json();
      if (body?.code !== 200 || !Array.isArray(body?.data)) throw new Error(body?.reason || body?.message || '模型接口返回异常');
      const previousRows = state.modelMonitorRows;
      state.modelMonitorRows = flattenModelMonitorRows(body.data);
      state.modelMonitorLastChecked = new Date().toISOString();
      saveModelMonitorSnapshot(state.modelMonitorRows, state.modelMonitorLastChecked);
      notifyModelMonitorChanges(previousRows, state.modelMonitorRows);
    } catch (error) {
      state.modelMonitorError = explainFailure(error);
      appendRunLog('warn', '模型可用性检测失败', error);
    } finally {
      state.modelMonitorLoading = false;
      renderModelMonitorModal();
    }
  }

  let modelMonitorTimer = 0;
  function startModelMonitor() {
    if (modelMonitorTimer) clearInterval(modelMonitorTimer);
    modelMonitorTimer = setInterval(() => checkModelMonitor(false), MODEL_MONITOR_INTERVAL_MS);
    if (state.modelMonitorSelectedIds.size) setTimeout(() => checkModelMonitor(false), 1800);
    else updateModelMonitorDots();
  }

  function startScriptUpdateCheck() {
    if (scriptUpdateTimer) clearInterval(scriptUpdateTimer);
    setTimeout(() => checkForScriptUpdate(false), 2200);
    scriptUpdateTimer = setInterval(() => checkForScriptUpdate(true), UPDATE_CHECK_INTERVAL_MS);
  }

  let panel;
  const mountedGlobalListeners = [];
  function addMountedGlobalListener(target, type, listener, options) {
    target.addEventListener(type, listener, options);
    mountedGlobalListeners.push({ target, type, listener, options });
  }
  function clearMountedGlobalListeners() {
    while (mountedGlobalListeners.length) {
      const item = mountedGlobalListeners.pop();
      try { item.target.removeEventListener(item.type, item.listener, item.options); } catch (_) {}
    }
  }
  function updateSiteActionButtons() {
    if (!panel) return;
    const selectors = ['#mufy-recovery-select-unfavorite-site', '#mufy-recovery-clear-site-selection', '#mufy-recovery-clear-site-rows'];
    selectors.forEach(selector => {
      const button = panel.querySelector(selector);
      if (button) button.disabled = state.favoriteRunning || state.shareRecoveryLoading || state.siteFavoriteStateLoading || !state.siteSearchRows.length;
    });
    const refreshFavoriteStates = panel.querySelector('#mufy-recovery-refresh-favorite-states');
    if (refreshFavoriteStates) {
      refreshFavoriteStates.hidden = !isAuthorProfilePage();
      refreshFavoriteStates.disabled = state.favoriteRunning || state.shareRecoveryLoading || state.siteFavoriteStateLoading || !state.siteSearchRows.length;
      refreshFavoriteStates.textContent = state.siteFavoriteStateLoading ? '获取中…' : '获取收藏状态';
    }
    const favoriteSelected = panel.querySelector('#mufy-recovery-favorite-selected-site');
    if (favoriteSelected) {
      const selectedCount = selectedSiteRows().filter(row => row.favoriteNeedsDetail || row.favoriteKnown === true && !row.isFavorite).length;
      favoriteSelected.disabled = state.favoriteRunning || state.shareRecoveryLoading || state.siteFavoriteStateLoading || selectedCount === 0;
      favoriteSelected.textContent = state.favoriteRunning ? '收藏中…' : ('立即收藏 (' + selectedCount + ')');
    }
  }

  function render() {
    if (!panel) return;
    syncSiteCaptureScope();
    panel.querySelector('#mufy-recovery-status').textContent = state.status;
    const updateEntry = panel.querySelector('#mufy-recovery-update-entry');
    const updateText = panel.querySelector('#mufy-recovery-update-text');
    if (updateEntry && updateText) {
      updateEntry.classList.toggle('has-update', state.updateAvailable);
      updateEntry.disabled = state.updateChecking;
      updateText.textContent = state.updateChecking
        ? '正在检查测试版更新…'
        : state.updateAvailable
          ? `发现 ${state.latestScriptVersion}，点击快速更新`
          : state.updateError
            ? '检查失败，点击重试'
            : `当前 ${SCRIPT_VERSION} · 点击检查`;
    }
    const savedFavoriteJob = loadShareFavoriteJob();
    const hasSavedFavoriteJob = favoriteJobHasRemaining(savedFavoriteJob);
    const favoriteTaskControls = panel.querySelector('#mufy-recovery-favorite-task-controls');
    const favoriteTaskMain = panel.querySelector('#mufy-recovery-favorite-task-main');
    const favoriteTaskCancel = panel.querySelector('#mufy-recovery-favorite-task-cancel');
    if (favoriteTaskControls && favoriteTaskMain && favoriteTaskCancel) {
      favoriteTaskControls.hidden = !state.favoriteRunning && !hasSavedFavoriteJob;
      favoriteTaskMain.textContent = state.favoriteRunning
        ? (state.favoriteInterruptMode ? '正在停止…' : '中断收藏')
        : `继续收藏（剩余 ${Math.max(0, (savedFavoriteJob?.rows?.length || 0) - Number(savedFavoriteJob?.index || 0))}）`;
      favoriteTaskMain.disabled = Boolean(state.favoriteInterruptMode);
      favoriteTaskCancel.hidden = state.favoriteRunning;
      favoriteTaskCancel.disabled = state.favoriteRunning;
    }
    const floatingNext = document.getElementById('mufy-recovery-next');
    if (floatingNext) {
      const visible = state.manualFavoriteChats.length > 0 && !state.manualFavoriteNextDismissed && !loadManualAutoChatJob();
      floatingNext.classList.toggle('mufy-next-visible', visible);
      floatingNext.disabled = state.favoriteRunning || state.loading || state.roleLoading || Boolean(loadManualAutoChatJob());
    }
    const roleRunButton = panel.querySelector('#mufy-recovery-run');
    roleRunButton.disabled = state.metadataLoading || state.roleLoading || state.shareRecoveryLoading || (state.loading && !state.roleLoading);
    panel.querySelector('#mufy-recovery-undo').disabled = state.loading || !state.undoLibrary;
    roleRunButton.textContent = state.roleLoading ? '正在找回…' : (state.rolePaused ? '继续读取' : (state.roleReadMode === 'latest' ? '查找最新几页' : '找回角色链接'));
    const stopActionButton = panel.querySelector('#mufy-recovery-stop-action');
    if (stopActionButton) {
      const canStopRole = state.roleLoading;
      const canOrganizeFolders = !canStopRole && !state.authorFolderLoading && !state.favoriteFolderDeleteLoading;
      stopActionButton.disabled = canStopRole
        ? state.rolePauseRequested
        : !canOrganizeFolders || state.favoriteRunning || state.shareRecoveryLoading || state.loading || state.metadataLoading;
      stopActionButton.textContent = canStopRole
        ? (state.rolePauseRequested ? '正在停止…' : '停止找回')
        : state.authorFolderLoading ? '整理中…' : '收藏夹';
      stopActionButton.title = canStopRole
        ? '停止正在进行的角色读取'
        : '打开收藏夹功能：按作者整理，或管理并删除收藏夹';
    }
    const autoAddFavoriteFolder = panel.querySelector('#mufy-recovery-auto-add-favorite-folder');
    if (autoAddFavoriteFolder) {
      autoAddFavoriteFolder.checked = state.autoAddFavoriteFolder;
      autoAddFavoriteFolder.disabled = state.favoriteRunning || state.authorFolderLoading;
    }
    const readMode = panel.querySelector('#mufy-recovery-role-read-mode');
    const latestPages = panel.querySelector('#mufy-recovery-role-latest-pages');
    readMode.value = state.roleReadMode;
    readMode.disabled = state.roleLoading || state.rolePaused || state.metadataLoading;
    latestPages.value = String(state.roleLatestPages);
    latestPages.disabled = state.roleLoading || state.rolePaused || state.metadataLoading || state.roleReadMode !== 'latest';
    const refreshStatuses = panel.querySelector('#mufy-recovery-refresh-status');
    if (refreshStatuses) {
      const updatingStatuses = state.metadataTask === 'status';
      refreshStatuses.disabled = state.roleLoading || state.maskLoading || state.shareRecoveryLoading
        || (state.metadataLoading && !updatingStatuses) || state.metadataStopRequested;
      refreshStatuses.textContent = updatingStatuses
        ? (state.metadataStopRequested ? '正在停止…' : '停止更新')
        : '更新状态';
      refreshStatuses.title = updatingStatuses ? '停止状态更新并保存已经完成的结果' : '更新最近一次链接读取到的角色状态和作者名称';
    }
    updateSiteActionButtons();
    const siteActions = panel.querySelector('#mufy-recovery-site-actions');
    if (siteActions) siteActions.hidden = !(state.section === 'favorites' && (state.active === 'siteSearch' || state.active === 'siteAuthors'));
    const manualAutoActions = panel.querySelector('#mufy-recovery-manual-auto-actions');
    const manualAutoMessage = panel.querySelector('#mufy-recovery-manual-auto-message');
    const manualAutoDelayMin = panel.querySelector('#mufy-recovery-manual-auto-delay-min');
    const manualAutoDelayMax = panel.querySelector('#mufy-recovery-manual-auto-delay-max');
    const manualAutoStart = panel.querySelector('#mufy-recovery-manual-auto-start');
    const manualAutoCancel = panel.querySelector('#mufy-recovery-manual-auto-cancel');
    const manualAutoJob = loadManualAutoChatJob();
    if (manualAutoActions) manualAutoActions.hidden = !(state.section === 'favorites' && state.active === 'manualFavoriteChats');
    if (manualAutoMessage) {
      if (document.activeElement !== manualAutoMessage) manualAutoMessage.value = state.manualAutoChatMessage;
      manualAutoMessage.disabled = Boolean(manualAutoJob && !manualAutoJob.paused);
    }
    if (manualAutoDelayMin) {
      if (document.activeElement !== manualAutoDelayMin) manualAutoDelayMin.value = String(state.manualAutoChatDelayMin);
      manualAutoDelayMin.disabled = Boolean(manualAutoJob && !manualAutoJob.paused);
    }
    if (manualAutoDelayMax) {
      if (document.activeElement !== manualAutoDelayMax) manualAutoDelayMax.value = String(state.manualAutoChatDelayMax);
      manualAutoDelayMax.disabled = Boolean(manualAutoJob && !manualAutoJob.paused);
    }
    if (manualAutoStart) {
      manualAutoStart.disabled = !manualAutoJob && !state.manualFavoriteChats.length;
      manualAutoStart.textContent = manualAutoJob
        ? (manualAutoJob.paused ? `继续一键扣数（${Number(manualAutoJob.completed || 0)}/${Number(manualAutoJob.total || 0)}）` : '停止一键扣数')
        : `一键扣数（${state.manualFavoriteChats.length}）`;
    }
    if (manualAutoCancel) {
      manualAutoCancel.hidden = !manualAutoJob;
      manualAutoCancel.disabled = false;
    }
    const favoriteVisible = panel.querySelector('#mufy-recovery-favorite-visible');
    if (favoriteVisible) {
      favoriteVisible.hidden = state.active !== 'chattedNotFavorite';
      favoriteVisible.disabled = state.favoriteRunning || state.shareRecoveryLoading || state.loading || state.metadataLoading;
      favoriteVisible.textContent = state.favoriteRunning ? '收藏中…' : '收藏当前列表';
    }
    const shareRecoveryControls = panel.querySelector('#mufy-recovery-share-recovery-controls');
    const shareRecoveryOne = panel.querySelector('#mufy-recovery-share-recovery-one');
    const shareRecoveryCancel = panel.querySelector('#mufy-recovery-share-recovery-cancel');
    if (shareRecoveryControls && shareRecoveryOne && shareRecoveryCancel) {
      const recoveryTask = loadFavoriteShareRecoveryJob();
      const remaining = favoriteShareRecoveryRemaining(recoveryTask);
      const uncachedCount = state.favoriteOnly.filter(row => row?.characterId && !shareCodeCache.has(String(row.characterId))).length;
      shareRecoveryControls.hidden = state.active !== 'favoriteOnly' && !recoveryTask;
      shareRecoveryCancel.hidden = !recoveryTask;
      shareRecoveryCancel.textContent = recoveryTask?.cancelRequested ? '正在取消…' : '取消任务';
      shareRecoveryOne.textContent = state.shareRecoveryLoading
        ? (recoveryTask?.pauseRequested ? '正在中断…' : `中断检测（${Math.min((recoveryTask?.index || 0) + 1, recoveryTask?.rows?.length || 0)}/${recoveryTask?.rows?.length || 0}）`)
        : recoveryTask
          ? `继续检测（剩余 ${remaining}）`
          : (uncachedCount ? `检测未记录角色（${uncachedCount}）` : `本账号均已有链接记录`);
      shareRecoveryOne.disabled = state.favoriteRunning || state.loading || state.metadataLoading
        || Boolean(recoveryTask?.pauseRequested) || Boolean(recoveryTask?.cancelRequested)
        || (!recoveryTask && !uncachedCount);
      shareRecoveryCancel.disabled = Boolean(recoveryTask?.cancelRequested);
    }
    const autoSwitchToggle = panel.querySelector('#mufy-recovery-auto-switch');
    autoSwitchToggle.checked = state.autoSwitch;
    autoSwitchToggle.disabled = state.loading || !maskStorageReady;
    const isMaskView = state.section === 'masks' || state.active === 'masks' || state.active === 'library';
    const isWebView = state.active === 'siteSearch' || state.active === 'siteAuthors';
    const roleSection = panel.querySelector('#mufy-recovery-role-section');
    const favoriteSection = panel.querySelector('#mufy-recovery-favorite-section');
    const chatSection = panel.querySelector('#mufy-recovery-chat-section');
    const beautySection = panel.querySelector('#mufy-recovery-beauty-section');
    const accountSection = panel.querySelector('#mufy-recovery-account-section');
    const materialSection = panel.querySelector('#mufy-recovery-material-section');
    const maskSection = panel.querySelector('#mufy-recovery-mask-section');
    const sectionHome = panel.querySelector('#mufy-recovery-section-home');
    const sectionNav = panel.querySelector('#mufy-recovery-section-nav');
    const sectionTitle = panel.querySelector('#mufy-recovery-section-title');
    const isRoleHistoryView = state.section === 'roles' && state.active === 'roleHistory';
    const sectionNames = { roles: '角色', favorites: '收藏', chats: '聊天记录', beauty: '摘录/美化', accounts: '账号切换', materials: '素材库', masks: '面具' };
    if (sectionHome) sectionHome.hidden = state.section !== 'home';
    if (sectionNav) sectionNav.hidden = state.section === 'home';
    panel.querySelector('#mufy-recovery-brand').hidden = state.section !== 'home';
    panel.dataset.section = state.section;
    if (sectionTitle) sectionTitle.textContent = isRoleHistoryView
      ? '历史索引'
      : state.section === 'materials'
        ? (state.materialKind === 'extra' ? '番外库' : '指令库')
        : (sectionNames[state.section] || '');
    const controls = panel.querySelector('#mufy-recovery-controls');
    if (controls) {
      controls.classList.toggle('is-section-home', state.section === 'home');
      controls.classList.toggle('is-standalone-section', ['beauty', 'accounts', 'materials'].includes(state.section));
    }
    const statusBox = panel.querySelector('#mufy-recovery-status');
    if (statusBox) statusBox.hidden = state.section === 'home' || isRoleHistoryView;
    if (favoriteTaskControls && state.section === 'home') favoriteTaskControls.hidden = true;
    if (roleSection) roleSection.hidden = state.section !== 'roles' || isRoleHistoryView;
    if (favoriteSection) favoriteSection.hidden = state.section !== 'favorites';
    if (chatSection) chatSection.hidden = state.section !== 'chats';
    if (beautySection) beautySection.hidden = state.section !== 'beauty';
    if (accountSection) accountSection.hidden = state.section !== 'accounts';
    if (materialSection) materialSection.hidden = state.section !== 'materials';
    if (maskSection) maskSection.hidden = state.section !== 'masks';
    const resultList = panel.querySelector('#mufy-recovery-list');
    if (resultList) resultList.hidden = ['home', 'beauty', 'accounts', 'materials'].includes(state.section);
    if (state.section === 'materials') renderMaterialSection();
    if (state.section === 'accounts') renderAccountSection();
    const roleFilterRow = panel.querySelector('#mufy-recovery-role-filter-row');
    const maskSearch = panel.querySelector('#mufy-recovery-mask-search');
    if (roleFilterRow) roleFilterRow.hidden = state.section !== 'roles' || isRoleHistoryView;
    if (maskSearch) maskSearch.hidden = !isMaskView;
    const statusFilter = panel.querySelector('#mufy-recovery-status-filter');
    if (statusFilter) {
      statusFilter.disabled = state.active === 'roleHistory';
      const allRows = allRoleRows();
      const statusCounts = roleStatusCounts(allRows);
      const statusOptions = [
        ['all', '全部状态', allRows.length],
        ['public', '公开', statusCounts.public],
        ['link', '仅链接', statusCounts.link],
        ['private', '私密', statusCounts.private],
        ['expired', '分享已失效', statusCounts.expired],
        ['deleted', '角色已删除', statusCounts.deleted]
      ];
      statusFilter.innerHTML = statusOptions.map(([value, label, count]) => `<option value="${value}">${label}（${count}）</option>`).join('');
      statusFilter.value = state.statusFilter;
    }
    const query = isMaskView ? state.maskQuery : (state.section === 'roles' ? state.roleQuery : '');
    const libraryRows = visibleLibraryRows();
    const roleRows = allRoleRows();
    const source = state.active === 'allRoles' ? roleRows
      : state.active === 'chatted' ? state.chatted
        : state.active === 'chattedNotFavorite' ? state.chattedNotFavorite
          : state.active === 'favoriteOnly' ? state.favoriteOnly
            : state.active === 'chatMatches' ? state.chatSearchResults
            : state.active === 'roleHistory' ? state.roleHistory
            : state.active === 'manualFavoriteChats' ? state.manualFavoriteChats
              : state.active === 'authors' ? roleRows
              : state.active === 'siteSearch' || state.active === 'siteAuthors' ? state.siteSearchRows
                : state.active === 'masks' ? state.masks : libraryRows;
    const statusSource = isMaskView || isWebView || state.active === 'roleHistory' ? source : source.filter(row => matchesStatus(row, state.statusFilter));
    const rows = state.active === 'authors'
      ? []
      : statusSource.filter(row => isMaskView
        ? !query || `${row.name} ${row.characterId || ''} ${row.lastSessionId || ''} ${row.maskId || ''} ${row.maskName || ''} ${row.remark || ''}`.toLowerCase().includes(query)
        : matchesRole(row, query));
    const groups = state.active === 'authors' || state.active === 'siteAuthors' ? authorGroups(statusSource, query) : [];
    panel.querySelector('#mufy-recovery-count').textContent = state.section === 'home'
      ? '选择功能'
      : state.section === 'beauty' ? '摘录/美化'
        : state.section === 'accounts' ? `${state.accountSwitchProfiles.length} 个账号`
        : state.section === 'materials' ? `${activeMaterialRows().length} 条${state.materialKind === 'extra' ? '番外' : '指令'}`
          : state.active === 'authors' || state.active === 'siteAuthors'
            ? `${groups.length} 位作者`
            : `${rows.length}/${statusSource.length}`;
    panel.querySelector('#mufy-recovery-history-entry').classList.toggle('active', state.section === 'roles' && state.active === 'roleHistory');
    const chatSearchButton = panel.querySelector('#mufy-recovery-chat-search');
    if (chatSearchButton) {
      chatSearchButton.textContent = state.chatSearchLoading ? '停止搜索' : '搜聊天';
      chatSearchButton.disabled = state.roleLoading || state.loading || state.metadataLoading;
    }
    const exportChatButton = panel.querySelector('#mufy-recovery-export-chat');
    if (exportChatButton) {
      const context = currentRoleContext();
      exportChatButton.disabled = !state.chatExportLoading && (!context.characterId || !context.sessionId || pageWindow.location.pathname !== '/chat');
      exportChatButton.textContent = state.chatExportLoading ? '停止导出' : '导出聊天';
      exportChatButton.title = exportChatButton.disabled ? '进入一段具体聊天后可完整导出当前会话' : '完整分页导出当前聊天';
    }
    const manualChatNextButton = panel.querySelector('#mufy-recovery-manual-chat-next');
    if (manualChatNextButton) {
      manualChatNextButton.hidden = state.active !== 'manualFavoriteChats';
      manualChatNextButton.disabled = Boolean(loadManualAutoChatJob());
    }
    panel.querySelectorAll('[data-category]').forEach(button => {
      button.classList.toggle('active', button.dataset.category === state.active);
      const count = button.dataset.category === 'allRoles' ? roleRows.length
        : button.dataset.category === 'chatted' ? state.chatted.length
          : button.dataset.category === 'chattedNotFavorite' ? state.chattedNotFavorite.length
          : button.dataset.category === 'favoriteOnly' ? state.favoriteOnly.length
            : button.dataset.category === 'chatMatches' ? state.chatSearchResults.length
            : button.dataset.category === 'manualFavoriteChats' ? state.manualFavoriteChats.length
                : button.dataset.category === 'authors' ? authorGroups(roleRows, '').length
                : button.dataset.category === 'siteSearch' ? state.siteSearchRows.length
                  : button.dataset.category === 'siteAuthors' ? authorGroups(state.siteSearchRows, '').length
                    : button.dataset.category === 'masks' ? state.masks.length : libraryRows.length;
      const label = button.dataset.category === 'allRoles' ? '全部'
        : button.dataset.category === 'chatted' ? '聊过'
          : button.dataset.category === 'chattedNotFavorite' ? '未收藏'
            : button.dataset.category === 'favoriteOnly' ? '收藏未聊'
              : button.dataset.category === 'chatMatches' ? '搜索结果'
              : button.dataset.category === 'manualFavoriteChats' ? '普通待聊'
                : button.dataset.category === 'authors' ? '作者'
                : button.dataset.category === 'siteSearch' ? '网站角色'
                  : button.dataset.category === 'siteAuthors' ? '网站作者'
                    : button.dataset.category === 'masks' ? '面具' : '面具库';
      button.textContent = `${label} (${count})`;
    });
    const saveAllMasksButton = panel.querySelector('#mufy-recovery-save-all');
    if (saveAllMasksButton) {
      saveAllMasksButton.hidden = false;
      saveAllMasksButton.disabled = state.loading || !maskStorageReady || !state.masks.length;
    }
    const importMasksButton = panel.querySelector('#mufy-recovery-import-masks');
    const exportMasksButton = panel.querySelector('#mufy-recovery-export-masks');
    const undoMasksButton = panel.querySelector('#mufy-recovery-undo');
    if (importMasksButton) importMasksButton.disabled = state.loading || !maskStorageReady;
    // 存储故障时必须保留导出能力，方便抢救当前内存中的面具。
    if (exportMasksButton) exportMasksButton.disabled = maskStorageMode === 'initializing';
    if (undoMasksButton) undoMasksButton.disabled = state.loading || !maskStorageReady || !state.undoLibrary;
    if (state.active === 'authors' || state.active === 'siteAuthors') {
      state.visibleAuthors = groups;
      state.visibleRows = groups.flatMap(group => group.rows);
      panel.querySelector('#mufy-recovery-list').innerHTML = groups.map((group, groupIndex) => `
        <div class="mufy-recovery-author">
          <div class="mufy-recovery-author-head"><button class="mufy-recovery-author-toggle" data-author-index="${groupIndex}">${state.openAuthors.has(group.key) ? '收起' : '展开'} ${esc(group.name)}（${group.rows.length} 个作品）</button><button class="mufy-recovery-author-favorite" data-action="favorite-author" data-author-favorite-index="${groupIndex}" ${state.favoriteRunning ? 'disabled' : ''}>收藏作者</button></div>
          ${state.openAuthors.has(group.key) ? `<div class="mufy-recovery-author-works">${group.rows.map(row => state.active === 'siteAuthors' ? safeSiteRoleCard(row, state.visibleRows.indexOf(row)) : roleCard(row, state.visibleRows.indexOf(row))).join('')}</div>` : ''}
        </div>`).join('') || '<div class="mufy-recovery-empty">暂无作者</div>';
      return;
    }
    state.visibleRows = rows;
    if (state.active === 'roleHistory') {
      const displayed = rows.slice(0, 200);
      panel.querySelector('#mufy-recovery-list').innerHTML = `${rows.length > displayed.length ? `<div class="mufy-recovery-muted">共找到 ${rows.length} 个角色，先显示 200 个；输入名称或角色 ID 可搜索全部记录。</div>` : ''}${displayed.map(roleHistoryCard).join('') || '<div class="mufy-recovery-empty">当前账号尚无本地历史记录。请先读取角色链接。</div>'}`;
      return;
    }
    panel.querySelector('#mufy-recovery-list').innerHTML = rows.map((row, index) => {
      if (state.active === 'masks') {
        const isCurrentSiteMask = state.siteMaskIds.includes(row.maskId);
        const editButton = isCurrentSiteMask ? `<button data-action="edit-site-mask" data-index="${index}">编辑面具</button>` : '';
        const boundNames = boundCharacterNames(row);
        return `<div class="mufy-recovery-row">
        <div class="mufy-recovery-info">
          <div class="mufy-recovery-row-title"><b>${index + 1}. ${esc(row.name)}</b><button class="mufy-recovery-mask-copy" data-action="copy-mask" data-index="${index}" title="复制面具信息" aria-label="复制面具信息"><span aria-hidden="true">⧉</span></button></div>
          <div class="mufy-recovery-muted">面具 ID：${esc(row.maskId)}${row.gender ? ` · ${esc(row.gender)}` : ''}${row.createdAt ? ` · ${esc(row.createdAt)}` : ''}</div>
          ${row.maskName ? `<div>名称：${esc(row.maskName)}</div>` : ''}
          ${boundNames ? `<div class="mufy-recovery-muted">已绑定角色：${esc(boundNames)}</div>` : ''}
          ${row.description ? `<details><summary>查看面具描述</summary><div class="mufy-recovery-detail">${esc(row.description)}</div></details>` : ''}
          <div class="mufy-recovery-row-actions">${editButton}<button data-action="save-mask" data-index="${index}">存入面具库</button><button data-action="bind-mask" data-index="${index}">绑定自动面具</button></div>
        </div>
      </div>`;
      }
      if (state.active === 'library') {
        const slots = siteSlotNumbers(row);
        const slotBadge = slots.length ? `<span class="mufy-recovery-site-slot" title="当前网站面具槽位">${esc(slots.join('、'))}</span>` : '';
        const boundNames = boundCharacterNames(row);
        const bindButton = `<button data-action="bind-mask" data-index="${index}">绑定自动面具</button>`;
        return `<div class="mufy-recovery-row">
        <div class="mufy-recovery-info">
          <div class="mufy-recovery-row-title"><b>${index + 1}. ${esc(row.name)}</b><span class="mufy-recovery-mask-title-tools">${slotBadge}<button class="mufy-recovery-mask-copy" data-action="copy-mask" data-index="${index}" title="复制面具信息" aria-label="复制面具信息"><span aria-hidden="true">⧉</span></button></span></div>
          <div class="mufy-recovery-muted">来源面具 ID：${esc(row.sourceMaskId || '未知')} · 保存于 ${esc(row.storedAt || '未知时间')}</div>
          ${row.maskName ? `<div>名称：${esc(row.maskName)}</div>` : ''}
          ${boundNames ? `<div class="mufy-recovery-muted">已绑定角色：${esc(boundNames)}</div>` : ''}
          ${row.description ? `<details><summary>查看面具描述</summary><div class="mufy-recovery-detail">${esc(row.description)}</div></details>` : ''}
          <div class="mufy-recovery-row-actions"><button data-action="edit-library-mask" data-index="${index}">编辑面具</button><button data-action="swap-mask" data-index="${index}">写入网站面具</button>${bindButton}<button data-action="remove-library" data-index="${index}">移出面具库</button></div>
        </div>
      </div>`;
      }
      return state.active === 'siteSearch' ? safeSiteRoleCard(row, index) : roleCard(row, index);
    }).join('') || '<div class="mufy-recovery-empty">暂无结果</div>';
    if (isMaskView && !maskStorageReady) {
      panel.querySelectorAll('#mufy-recovery-list button:not([data-action="copy-mask"])').forEach(button => { button.disabled = true; });
    }
  }

  function mount() {
    const existingPanel = document.getElementById('mufy-recovery-panel');
    const existingToggle = document.getElementById('mufy-recovery-toggle');
    const existingNext = document.getElementById('mufy-recovery-next');
    if (existingPanel && existingToggle && existingNext && pageWindow.__mufyRecoveryPanelVersion === SCRIPT_VERSION) return;
    clearMountedGlobalListeners();
    messageQuoteObserver?.disconnect();
    messageQuoteObserver = null;
    if (existingPanel) existingPanel.remove();
    existingToggle?.remove();
    existingNext?.remove();
    document.querySelectorAll('style[data-mufy-recovery-style="mufy-recovery"]').forEach(item => item.remove());
    const style = document.createElement('style');
    style.dataset.mufyRecoveryStyle = 'mufy-recovery';
    style.textContent = `
      #mufy-recovery-toggle{position:fixed;z-index:2147483646;width:46px;height:46px;padding:0;border:1px solid #ffffff38;border-radius:50%;background:#17171dcc;color:#ffffffb8;font:700 20px/1 system-ui;box-shadow:0 5px 16px #0004;cursor:pointer;touch-action:none;user-select:none;opacity:.38;transition:opacity .18s,transform .18s,background .18s,border-color .18s,box-shadow .18s}
      #mufy-recovery-toggle:hover,#mufy-recovery-toggle.mufy-dragging{opacity:.92;background:#303038e8;border-color:#ffffff70;transform:none}
      #mufy-recovery-toggle.mufy-docked-right{right:-23px;bottom:96px;transform:none}
      #mufy-recovery-toggle.mufy-docked-left{left:-23px;bottom:96px;transform:none}
      #mufy-recovery-toggle.mufy-toggle-onboarding{opacity:1;background:#1677ff;border-color:#b9e2ff;color:#fff;box-shadow:0 0 0 5px #3d9cff55,0 0 28px #2d8cff,0 5px 16px #0006;animation:mufy-recovery-toggle-pulse 1.25s ease-in-out infinite}
      @keyframes mufy-recovery-toggle-pulse{0%,100%{box-shadow:0 0 0 4px #3d9cff44,0 0 20px #2d8cff,0 5px 16px #0006}50%{box-shadow:0 0 0 9px #3d9cff22,0 0 34px #64b5ff,0 5px 16px #0006}}
      #mufy-recovery-next{position:fixed;z-index:2147483646;width:52px;height:34px;padding:0;border:1px solid #d9b85b;border-radius:17px;background:#2d2719e8;color:#ffe7a0;font:700 12px/1 system-ui;box-shadow:0 5px 16px #0004;cursor:pointer;touch-action:manipulation;user-select:none;display:none;opacity:.92;overflow:visible}
      #mufy-recovery-next.mufy-next-visible{display:block}
      #mufy-recovery-next:disabled{opacity:.5;cursor:default}
      #mufy-recovery-next .mufy-recovery-next-label{display:block;padding-right:2px}
      #mufy-recovery-next .mufy-recovery-next-close{position:absolute;top:-7px;right:-7px;width:16px;height:16px;padding:0;border:1px solid #d9b85b;border-radius:50%;background:#211d16;color:#ffe7a0;font:700 12px/14px system-ui;cursor:pointer;box-shadow:0 2px 6px #0006}
      #mufy-recovery-next .mufy-recovery-next-close:hover{background:#5a4320;color:#fff4c7}
      #mufy-recovery-auto-chat-toast{position:fixed;z-index:2147483647;left:50%;top:14px;max-width:min(86vw,420px);box-sizing:border-box;padding:9px 13px;border:1px solid #8172b5;border-radius:999px;background:#24212eea;color:#f3efff;font:600 12px/1.4 system-ui;box-shadow:0 8px 24px #0008;opacity:0;transform:translate(-50%,-14px);pointer-events:none;transition:opacity .18s ease,transform .18s ease;text-align:center}
      #mufy-recovery-auto-chat-toast.show{opacity:1;transform:translate(-50%,0)}
      #mufy-recovery-auto-chat-toast[data-tone="success"]{border-color:#4d9e78;background:#173528ef;color:#caffdf}
      #mufy-recovery-auto-chat-toast[data-tone="error"]{border-color:#b45f69;background:#421f25ef;color:#ffd1d6}
      #mufy-recovery-panel{position:fixed;right:16px;bottom:62px;z-index:2147483647;width:480px;max-width:calc(100vw - 32px);height:min(72vh,720px);min-height:300px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;background:#222228;color:#eee;border:1px solid #555;border-radius:8px;box-shadow:0 12px 35px #0008;font:13px system-ui}
      #mufy-recovery-head{display:flex;align-items:center;justify-content:flex-start;gap:4px;padding:9px 9px 6px;background:#303038;border-radius:8px 8px 0 0;font-weight:700;flex:none}
      #mufy-recovery-title{display:flex;align-items:center;gap:6px;min-width:0}
      #mufy-recovery-title>span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #mufy-recovery-head button{background:none;border:0;color:#bbb;font-size:20px;cursor:pointer}
      #mufy-recovery-head #mufy-recovery-model-entry,#mufy-recovery-head #mufy-recovery-log-entry,#mufy-recovery-head #mufy-recovery-history-entry{flex:none;padding:4px 7px!important;border:1px solid #666!important;border-radius:6px!important;background:#3a3a44!important;color:#ddd!important;font:600 10px/1.2 system-ui!important;white-space:nowrap}
      #mufy-recovery-export-chat:disabled{opacity:.45;cursor:not-allowed!important}
      #mufy-recovery-quote-entry{margin-left:6px;border-color:#766bb1!important;background:#443c67!important;color:#eeeaff!important}
      #mufy-recovery-head #mufy-recovery-model-entry{margin-left:6px}
      #mufy-recovery-log-entry{margin-left:0}
      #mufy-recovery-history-entry{margin-left:0;margin-right:0}
      #mufy-recovery-title{margin-right:auto}#mufy-recovery-close{margin-left:2px}
      #mufy-recovery-history-entry.active{background:#786bd4!important;border-color:#8f84dd!important;color:#fff!important}
      #mufy-recovery-close{flex:none;width:27px;height:27px;padding:0!important;line-height:23px!important}
      #mufy-recovery-help{width:19px;height:19px;padding:0!important;border:1px solid #777!important;border-radius:50%!important;background:#3a3a43!important;color:#eee!important;font-size:12px!important;line-height:17px!important;font-weight:700}
      .mufy-recovery-version{color:#f3c969;font-size:10px;font-weight:600}
      #mufy-recovery-help-modal{position:absolute;inset:48px 10px 10px;z-index:4;display:flex;flex-direction:column;overflow:hidden;background:#292930;border:1px solid #666;border-radius:7px;box-shadow:0 8px 24px #0008}
      #mufy-recovery-help-head{display:flex;align-items:center;justify-content:space-between;padding:9px 11px;background:#35353e;border-bottom:1px solid #4b4b55}
      #mufy-recovery-help-head button{padding:1px 6px!important}
      #mufy-recovery-help-body{overflow:auto;padding:10px 13px;color:#e3e3e8;line-height:1.65}
      #mufy-recovery-help-body strong{color:#f3c969;font-weight:700}
      #mufy-recovery-help-body ol{margin:0;padding-left:20px}
      #mufy-recovery-help-body li{margin:0 0 9px}
      #mufy-recovery-export-modal{position:absolute;inset:48px 10px 10px;z-index:3;display:flex;flex-direction:column;overflow:hidden;background:#292930;border:1px solid #666;border-radius:7px;box-shadow:0 8px 24px #0008}
      #mufy-recovery-export-modal[hidden]{display:none}
      #mufy-recovery-chat-search-modal{position:absolute;inset:48px 10px auto;z-index:7;display:flex;flex-direction:column;overflow:hidden;background:#292930;border:1px solid #6d629c;border-radius:9px;box-shadow:0 12px 30px #000b}
      #mufy-recovery-chat-search-modal[hidden]{display:none}
      #mufy-recovery-chat-search-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#35353e;border-bottom:1px solid #4b4b55}
      #mufy-recovery-chat-search-head button{padding:1px 7px!important}
      #mufy-recovery-chat-search-fields{display:grid;gap:8px;padding:12px}
      #mufy-recovery-chat-search-fields label{display:grid;gap:4px;color:#bbb;font-size:11px}
      #mufy-recovery-chat-search-fields input,#mufy-recovery-chat-search-fields select{box-sizing:border-box;width:100%;min-width:0;border:1px solid #555;border-radius:6px;background:#18181c;color:#fff;padding:8px 9px;font:inherit}
      #mufy-recovery-chat-search-actions{display:flex;justify-content:flex-end;gap:7px;padding:0 12px 12px}
      #mufy-recovery-chat-search-start{background:#62539a!important;border-color:#8878c5!important;font-weight:700}
      #mufy-recovery-author-favorite-modal{position:absolute;inset:48px 10px 10px;z-index:4;display:flex;flex-direction:column;overflow:hidden;background:#292930;border:1px solid #666;border-radius:7px;box-shadow:0 8px 24px #0008}
      #mufy-recovery-author-favorite-modal[hidden]{display:none}
      #mufy-recovery-folder-menu-modal{position:absolute;inset:48px 10px auto;z-index:6;display:flex;flex-direction:column;overflow:hidden;background:#292930;border:1px solid #666;border-radius:9px;box-shadow:0 12px 30px #000b}
      #mufy-recovery-folder-menu-modal[hidden]{display:none}
      #mufy-recovery-folder-menu-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#35353e;border-bottom:1px solid #4b4b55}
      #mufy-recovery-folder-menu-head button{padding:1px 7px!important}
      #mufy-recovery-folder-menu-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px}
      #mufy-recovery-folder-menu-actions button{white-space:normal;line-height:1.4}
      #mufy-recovery-folder-delete-modal{position:absolute;inset:48px 10px 10px;z-index:6;display:flex;flex-direction:column;overflow:hidden;background:#292930;border:1px solid #76545a;border-radius:9px;box-shadow:0 12px 30px #000b}
      #mufy-recovery-folder-delete-modal[hidden]{display:none}
      #mufy-recovery-folder-delete-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;background:#35353e;border-bottom:1px solid #4b4b55}
      #mufy-recovery-folder-delete-head button{padding:1px 7px!important}
      #mufy-recovery-folder-delete-summary{padding:9px 12px 4px;color:#c9c9d0;font-size:11px;line-height:1.5}
      #mufy-recovery-folder-delete-filter{display:flex;align-items:center;gap:7px;padding:4px 12px 9px;color:#ddd;font-size:11px;border-bottom:1px solid #414149}
      #mufy-recovery-folder-delete-filter input{accent-color:#bf6675}
      #mufy-recovery-folder-delete-list{flex:1;min-height:0;overflow:auto;padding:8px;display:grid;align-content:start;gap:6px;background:#1c1c21}
      .mufy-recovery-folder-delete-item{display:flex;align-items:flex-start;gap:9px;padding:9px 10px;border:1px solid #454550;border-radius:7px;background:#28282f;color:#eee;cursor:pointer}
      .mufy-recovery-folder-delete-item:has(input:checked){border-color:#9a6570;background:#382a2e}
      .mufy-recovery-folder-delete-item input{flex:none;margin-top:3px;accent-color:#bf6675}
      .mufy-recovery-folder-delete-item span{min-width:0;display:grid;gap:3px;word-break:break-word}
      .mufy-recovery-folder-delete-item small{color:#999;font-size:10px}
      .mufy-recovery-folder-delete-empty{padding:26px 12px;text-align:center;color:#888}
      #mufy-recovery-folder-delete-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:10px 11px;border-top:1px solid #444;background:#292930}
      #mufy-recovery-folder-delete-empty,#mufy-recovery-folder-delete-confirm{background:#672e33!important;border-color:#a95159!important;color:#ffc0c5!important;font-weight:700}
      #mufy-recovery-favorite-interrupt-modal{position:absolute;inset:48px 10px auto;z-index:8;display:flex;flex-direction:column;overflow:hidden;background:#292930;border:1px solid #766f8c;border-radius:9px;box-shadow:0 12px 30px #000b}
      #mufy-recovery-favorite-interrupt-modal[hidden]{display:none}
      #mufy-recovery-favorite-interrupt-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#35353e;border-bottom:1px solid #4b4b55}
      #mufy-recovery-favorite-interrupt-head button{padding:1px 6px!important}
      #mufy-recovery-favorite-interrupt-body{padding:11px 12px;color:#ccc;line-height:1.55}
      #mufy-recovery-favorite-interrupt-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 12px 12px}
      #mufy-recovery-favorite-pause{background:#55491f!important;border-color:#aa8b32!important;color:#ffe59b!important}
      #mufy-recovery-favorite-cancel-now{background:#672e33!important;border-color:#a95159!important;color:#ffc0c5!important}
      #mufy-recovery-log-modal{position:absolute;inset:48px 10px 10px;z-index:5;display:flex;flex-direction:column;overflow:hidden;background:#292930;border:1px solid #666;border-radius:7px;box-shadow:0 8px 24px #0008}
      #mufy-recovery-log-modal[hidden]{display:none}
      #mufy-recovery-log-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 11px;background:#35353e;border-bottom:1px solid #4b4b55}
      #mufy-recovery-log-head > span{display:flex;align-items:center;gap:6px;min-width:0}
      #mufy-recovery-log-head button{padding:4px 7px;font-size:11px}
      #mufy-recovery-log-output{flex:1;overflow:auto;margin:0;padding:10px;display:grid;align-content:start;gap:9px;background:#18181d;color:#ddd}
      .mufy-recovery-log-entry{padding:9px 10px;border:1px solid #454550;border-left-width:4px;border-radius:7px;background:#24242b;word-break:break-word}
      .mufy-recovery-log-entry.is-info{border-left-color:#6da9ff}.mufy-recovery-log-entry.is-warn{border-left-color:#e6ad45;background:#2c281f}.mufy-recovery-log-entry.is-error{border-left-color:#f06464;background:#302122}
      .mufy-recovery-log-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:5px;color:#999;font-size:10px}
      .mufy-recovery-log-level{padding:2px 6px;border-radius:9px;background:#334967;color:#bcd8ff;font-weight:750}.is-warn .mufy-recovery-log-level{background:#644b20;color:#ffd98b}.is-error .mufy-recovery-log-level{background:#682d30;color:#ffb7b7}
      .mufy-recovery-log-message{color:#f1f1f4;font-size:12px;font-weight:700;line-height:1.45}.is-warn .mufy-recovery-log-message{color:#ffe0a0}.is-error .mufy-recovery-log-message{color:#ffbaba}
      .mufy-recovery-log-summary{margin-top:5px;color:#ccc;font:11px/1.5 system-ui}
      .mufy-recovery-log-detail{margin-top:7px;color:#9e9ea8;font-size:11px}.mufy-recovery-log-detail summary{cursor:pointer;color:#aaa1ff}.mufy-recovery-log-detail pre{max-height:230px;overflow:auto;margin:6px 0 0;padding:8px;border-radius:5px;background:#111116;color:#aaa;white-space:pre-wrap;font:10px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace}
      .mufy-recovery-log-empty{padding:24px;text-align:center;color:#888}
      #mufy-recovery-mask-editor{position:absolute;inset:8px;z-index:7;display:flex;flex-direction:column;overflow:hidden;background:#242429;border:1px solid #6c6c76;border-radius:10px;box-shadow:0 12px 36px #000b}
      #mufy-recovery-mask-editor[hidden]{display:none}
      #mufy-recovery-mask-editor-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 13px;background:#303038;border-bottom:1px solid #4b4b55}
      #mufy-recovery-mask-editor-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px}
      #mufy-recovery-mask-editor-close{padding:1px 7px!important;border:0!important;background:transparent!important;font-size:22px!important;color:#bbb!important}
      #mufy-recovery-mask-editor-body{flex:1;min-height:0;overflow:auto;display:grid;grid-template-columns:1fr 1fr;gap:11px;padding:13px}
      .mufy-recovery-mask-editor-field{display:grid;gap:5px;align-content:start;color:#d8d8de;font-size:12px;font-weight:650}
      .mufy-recovery-mask-editor-field.is-wide{grid-column:1/-1}
      .mufy-recovery-mask-editor-label{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:25px}
      .mufy-recovery-mask-field-copy{flex:none;width:25px!important;height:25px!important;padding:0!important;display:inline-flex!important;align-items:center;justify-content:center;border:0!important;border-radius:6px!important;background:transparent!important;color:#bdbdc7!important;font:700 17px/1 system-ui!important}
      .mufy-recovery-mask-field-copy:hover,.mufy-recovery-mask-field-copy:active{background:#ffffff14!important;color:#fff!important}
      .mufy-recovery-mask-editor-field input,.mufy-recovery-mask-editor-field textarea{box-sizing:border-box;width:100%;min-width:0;border:1px solid #5b5b65;border-radius:8px;background:#111116;color:#fff;padding:9px 10px;font:13px/1.5 system-ui;resize:vertical;outline:none}
      .mufy-recovery-mask-editor-field input:focus,.mufy-recovery-mask-editor-field textarea:focus{border-color:#8f84dd;box-shadow:0 0 0 2px #786bd433}
      .mufy-recovery-mask-editor-field textarea{min-height:112px}
      .mufy-recovery-mask-editor-field textarea[name="command"]{min-height:150px}
      #mufy-recovery-mask-editor-hint{grid-column:1/-1;color:#aaa;font-size:11px;line-height:1.45}
      #mufy-recovery-mask-editor-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:11px 13px;border-top:1px solid #444;background:#292930}
      #mufy-recovery-mask-editor-save-as{background:#3c3c45!important}
      #mufy-recovery-mask-editor-replace{background:#786bd4!important;border-color:#958ae5!important;font-weight:700}
      .mufy-recovery-export-head{display:flex;align-items:center;justify-content:space-between;padding:9px 11px;background:#35353e;border-bottom:1px solid #4b4b55}
      .mufy-recovery-export-options{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px}
      .mufy-recovery-export-options button{flex:1}
      #mufy-recovery-export-share-links{grid-column:1/-1}
      .mufy-recovery-export-binding-option{display:flex;align-items:flex-start;gap:7px;padding:0 12px 4px;color:#eee;font-size:12px;line-height:1.45}
      .mufy-recovery-export-binding-option input{margin-top:3px;accent-color:#f1c75b}
      .mufy-recovery-export-binding-hint{padding:0 12px 10px;color:#aaa;font-size:11px}
      #mufy-recovery-author-favorite-head{display:flex;align-items:center;justify-content:space-between;padding:9px 11px;background:#35353e;border-bottom:1px solid #4b4b55}
      #mufy-recovery-author-favorite-head button{padding:1px 6px!important}
      #mufy-recovery-author-favorite-options{display:grid;gap:8px;padding:12px}
      #mufy-recovery-author-favorite-options button{text-align:left;white-space:normal}
      #mufy-recovery-tab-action{background:#453d69;border-color:#8578c8}
      #mufy-recovery-resize-handle,#mufy-recovery-resize-handle-bottom{position:absolute;left:50%;z-index:9;width:96px;height:18px;display:flex;align-items:center;justify-content:center;cursor:ns-resize;touch-action:none;transform:translateX(-50%);background:transparent;border:0;user-select:none}
      #mufy-recovery-resize-handle{top:0}
      #mufy-recovery-resize-handle-bottom{bottom:0}
      #mufy-recovery-resize-handle::after,#mufy-recovery-resize-handle-bottom::after{content:'';width:48px;height:4px;border-radius:3px;background:#777;box-shadow:0 1px 2px #0007}
      #mufy-recovery-panel.is-resizing{user-select:none}
      #mufy-recovery-controls{display:grid;gap:7px;padding:9px 10px;flex:none;overflow:auto;max-height:55%}
      #mufy-recovery-controls.is-section-home,#mufy-recovery-controls.is-standalone-section{flex:1;min-height:0;max-height:none;align-content:start}
      #mufy-recovery-role-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;align-items:stretch}
      #mufy-recovery-favorite-actions{display:grid;grid-template-columns:1fr;gap:6px;align-items:stretch}
      #mufy-recovery-auto-folder-label{display:flex;align-items:flex-start;gap:8px;margin-top:7px;padding:9px 10px;border:1px solid #4d4962;border-radius:8px;background:#292733;color:#ddd;cursor:pointer;user-select:none}
      #mufy-recovery-auto-folder-label input{flex:none;margin-top:2px;accent-color:#786bd4}
      #mufy-recovery-auto-folder-label span{display:grid;gap:2px;line-height:1.35}
      #mufy-recovery-auto-folder-label small{color:#999;font-size:10px;font-weight:400}
      #mufy-recovery-chat-tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;align-items:stretch}
      #mufy-recovery-mask-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
      #mufy-recovery-role-actions > button,#mufy-recovery-mask-actions > button{min-width:0;white-space:normal;line-height:1.25}
      #mufy-recovery-favorite-visible{width:100%}
      #mufy-recovery-share-recovery-controls{display:grid;grid-template-columns:1fr auto;gap:6px}
      #mufy-recovery-share-recovery-controls[hidden]{display:none}
      #mufy-recovery-share-recovery-one{min-width:0;background:#453d69!important;border-color:#8578c8!important;color:#f4efff!important}
      #mufy-recovery-share-recovery-cancel{white-space:nowrap}
      #mufy-recovery-role-read-options{display:flex;align-items:center;gap:6px;flex-wrap:wrap;color:#bbb;font-size:11px}
      #mufy-recovery-role-read-options select,#mufy-recovery-role-read-options input{border:1px solid #555;border-radius:6px;background:#18181c;color:#fff;padding:5px 6px;font:inherit}
      #mufy-recovery-role-latest-pages{width:52px}
      .mufy-recovery-export-group{display:flex;gap:6px}
      #mufy-recovery-mask-actions .mufy-recovery-export-group{display:contents}
      #mufy-recovery-panel button{border:1px solid #666;border-radius:6px;background:#35353c;color:#eee;padding:6px 9px;cursor:pointer}
      #mufy-recovery-panel button:disabled{opacity:.5;cursor:wait}
      #mufy-recovery-run{background:#786bd4!important;border-color:#8f84dd!important}
      #mufy-recovery-role-filter-row{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:6px;min-width:0}
      #mufy-recovery-role-filter-row > *,#mufy-recovery-mask-search{box-sizing:border-box;min-width:0;width:100%;border:1px solid #555;border-radius:6px;background:#18181c;color:#fff;padding:7px 9px;font:inherit}
      #mufy-recovery-chat-search{width:auto!important;white-space:nowrap;background:#3a355d!important;border-color:#7569bd!important}
      #mufy-recovery-site-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:6px}
      #mufy-recovery-site-actions button{min-width:0;padding:7px 6px;font-size:12px}
      #mufy-recovery-manual-auto-actions{display:grid;grid-template-columns:minmax(0,1fr) auto auto auto;gap:6px;margin-top:6px;padding:7px;border:1px solid #5d5575;border-radius:7px;background:#24222c}
      #mufy-recovery-manual-auto-message{box-sizing:border-box;min-width:0;width:100%;border:1px solid #555;border-radius:6px;background:#18181c;color:#fff;padding:7px 9px;font:inherit}
      .mufy-recovery-auto-delay{display:flex;align-items:center;gap:4px;white-space:nowrap;color:#ccc;font-size:12px}.mufy-recovery-auto-delay input{box-sizing:border-box;width:58px;border:1px solid #555;border-radius:6px;background:#18181c;color:#fff;padding:7px 5px;font:inherit;text-align:center}
      #mufy-recovery-manual-auto-start{background:#5e4f91!important;border-color:#8373bb!important;color:#fff!important;font-weight:700}
      #mufy-recovery-manual-auto-cancel{background:#572b30!important;border-color:#945059!important;color:#ffc6cb!important}
      .mufy-recovery-site-select{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-width:72px;min-height:32px;margin:0;padding:5px 9px;border:1px solid #8b7440;border-radius:7px;background:#302a1d;color:#f8f0cb;white-space:nowrap;font-size:12px;font-weight:700;cursor:pointer;user-select:none}
      .mufy-recovery-site-select:hover{border-color:#d8a94a;background:#40351f}
      .mufy-recovery-site-select input{width:17px;height:17px;margin:0;flex:none;accent-color:#d8a94a;cursor:pointer}
      .mufy-recovery-site-role-row.selected .mufy-recovery-site-select{border-color:#ffd06f;background:#5b4217;color:#fff3c2;box-shadow:0 0 0 2px rgba(216,169,74,.18)}
      .mufy-recovery-site-role-row.selected{outline:2px solid rgba(255,208,111,.95);outline-offset:-2px;box-shadow:0 0 0 3px rgba(216,169,74,.18) inset;background:rgba(216,169,74,.10)}
      .mufy-recovery-site-role-row.longpressing{outline:2px dashed rgba(255,208,111,.9);outline-offset:-2px;background:rgba(216,169,74,.06)}
      #mufy-recovery-panel [hidden]{display:none!important}
      #mufy-recovery-auto-switch-label{display:flex;align-items:center;gap:6px;color:#bbb;font-size:11px;user-select:none}
      #mufy-recovery-auto-switch-label input{accent-color:#786bd4}
      #mufy-recovery-status{color:#b9b4e9;line-height:1.45}
      #mufy-recovery-favorite-task-controls{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:6px;padding:7px;border:1px solid #665d35;border-radius:7px;background:#2c281d}
      #mufy-recovery-favorite-task-main{background:#735f22!important;border-color:#b69637!important;color:#fff0b0!important;font-weight:700}
      #mufy-recovery-favorite-task-cancel{background:#572b30!important;border-color:#945059!important;color:#ffc6cb!important}
      #mufy-recovery-section-home{display:grid;gap:10px;padding:4px 1px 6px}
      #mufy-recovery-section-home-head{display:grid;gap:3px;padding:2px 3px;color:#eee}#mufy-recovery-section-home-head small{color:#999;font-size:11px;font-weight:400}
      #mufy-recovery-section-cards{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .mufy-recovery-section-card{min-height:74px!important;display:grid!important;align-content:center;justify-items:start;gap:5px;padding:11px 12px!important;text-align:left;background:#292934!important;border-color:#555566!important}
      .mufy-recovery-section-card strong{font-size:14px;color:#f4f1ff}.mufy-recovery-section-card small{font-size:10px;line-height:1.35;color:#aaa;font-weight:400}
      .mufy-recovery-section-card:first-child{border-color:#8275ca!important;background:#38324f!important}
      #mufy-recovery-section-nav{display:flex;align-items:center;gap:9px;padding-bottom:2px;border-bottom:1px solid #414149}
      #mufy-recovery-section-back{flex:none;background:#292934!important;border-color:#625b7e!important;color:#dcd6ff!important}
      #mufy-recovery-section-title{font-size:14px;color:#f1efff}
      #mufy-recovery-tabs,#mufy-recovery-chat-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px}
      #mufy-recovery-favorite-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
      #mufy-recovery-mask-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
      #mufy-recovery-tabs button.active,#mufy-recovery-favorite-tabs button.active,#mufy-recovery-chat-tabs button.active,#mufy-recovery-mask-tabs button.active{background:#786bd4;border-color:#8f84dd;color:#fff}
      #mufy-recovery-tabs .mufy-recovery-tab-action,#mufy-recovery-mask-tabs .mufy-recovery-tab-action{background:#453d69;border-color:#8578c8;color:#f4efff}
      #mufy-recovery-role-section,#mufy-recovery-favorite-section,#mufy-recovery-chat-section,#mufy-recovery-beauty-section,#mufy-recovery-account-section,#mufy-recovery-material-section,#mufy-recovery-mask-section{display:flex;flex-direction:column;gap:8px}
      #mufy-recovery-beauty-launchers{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mufy-beauty-launch{min-height:112px!important;display:flex!important;flex-direction:column;align-items:flex-start!important;justify-content:center!important;gap:7px;padding:15px!important;text-align:left!important;background:linear-gradient(145deg,#40375c,#252431)!important}.mufy-beauty-launch strong{font-size:15px;color:#fff}.mufy-beauty-launch small{color:#b7b1c5;font-size:10px;line-height:1.55;font-weight:400}
      #mufy-recovery-account-current{display:grid;gap:3px;padding:12px;border:1px solid #766bb155;border-radius:12px;background:linear-gradient(145deg,#4c407055,#24232d)}#mufy-recovery-account-current strong{font-size:11px;color:#aaa3c6}#mufy-recovery-account-current span{font-size:15px;color:#f5f2ff;font-weight:700}#mufy-recovery-account-current small{color:#aaa;overflow-wrap:anywhere}#mufy-recovery-account-tools{display:grid;grid-template-columns:1fr;gap:6px}#mufy-recovery-account-save{background:#6654a4!important;border-color:#927fd3!important;font-weight:700}#mufy-recovery-account-list{display:grid;align-content:start;gap:7px;overflow:auto;padding-bottom:12px}.mufy-account-card{display:flex;align-items:center;justify-content:space-between;gap:9px;padding:10px 11px;border:1px solid #494653;border-radius:11px;background:#272630}.mufy-account-card.is-current{border-color:#68ba8a88;box-shadow:inset 3px 0 #59b17f}.mufy-account-card>div{display:grid;min-width:0;gap:3px}.mufy-account-card strong{color:#f0edff}.mufy-account-card small{color:#aaa;overflow-wrap:anywhere}.mufy-account-card em{width:max-content;padding:2px 6px;border-radius:9px;background:#24553a;color:#a8e7bd;font-size:9px;font-style:normal}.mufy-account-card>span{display:flex;flex:none;gap:4px;flex-wrap:wrap;justify-content:flex-end}.mufy-account-card button{padding:4px 7px!important;font-size:10px!important}.mufy-recovery-account-hint{display:block;color:#8f8a9c;line-height:1.55}
      #mufy-recovery-material-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px}#mufy-recovery-material-tabs button.active{background:#786bd4;border-color:#8f84dd;color:#fff}#mufy-recovery-material-tools{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}#mufy-recovery-material-add{background:#5e4f91!important;border-color:#8373bb!important;font-weight:700}
      #mufy-recovery-material-list{display:grid;align-content:start;gap:7px;overflow:auto;padding-bottom:20px}.mufy-material-card{display:flex;align-items:flex-start;justify-content:space-between;gap:9px;padding:10px 11px;border:1px solid #4c485d;border-radius:10px;background:#272630;cursor:pointer}.mufy-material-card:hover{border-color:#8c7bd1;background:#302d40}.mufy-material-card>div{min-width:0;display:grid;gap:4px}.mufy-material-card strong{color:#f0edff}.mufy-material-card small{display:-webkit-box;overflow:hidden;color:#aaa;font-size:10px;line-height:1.5;-webkit-line-clamp:4;-webkit-box-orient:vertical;white-space:pre-wrap;overflow-wrap:anywhere}.mufy-material-card>span{display:flex;flex:none;gap:5px}.mufy-material-card>span button{padding:4px 7px!important;font-size:10px!important}
      #mufy-recovery-material-editor{position:absolute;inset:48px 10px 10px;z-index:14;display:flex;flex-direction:column;overflow:hidden;border:1px solid #766bb1;border-radius:12px;background:#292930;box-shadow:0 16px 45px #000c}#mufy-recovery-material-editor[hidden]{display:none}#mufy-recovery-material-editor-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #4b4b55;background:#35353e}#mufy-recovery-material-editor-head button{padding:1px 7px!important;font-size:20px!important}#mufy-recovery-material-editor-body{flex:1;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px;padding:12px}#mufy-recovery-material-editor-body label{display:grid;grid-template-rows:auto auto;align-content:start;min-height:0;gap:5px;color:#bbb;font-size:11px}#mufy-recovery-material-editor-body label:last-child{grid-template-rows:auto minmax(180px,1fr)}#mufy-recovery-material-editor-body input,#mufy-recovery-material-editor-body textarea{box-sizing:border-box;width:100%;border:1px solid #555;border-radius:8px;background:#18181c;color:#fff;padding:9px;font:13px/1.55 system-ui;outline:none}#mufy-recovery-material-editor-body textarea{height:100%;min-height:180px;resize:none}#mufy-recovery-material-editor-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 12px 12px}#mufy-recovery-material-editor-save{background:#62539a!important;border-color:#8878c5!important}
      .mufy-recovery-section-note{display:grid;gap:4px;padding:10px 11px;border:1px solid #4d4962;border-radius:8px;background:#292733}.mufy-recovery-section-note span{color:#aaa;font-size:11px;line-height:1.5}
      #mufy-recovery-list{flex:1 1 auto;min-height:0;overflow:auto;border-top:1px solid #444;padding:0 10px 16px}
      .mufy-recovery-row{display:flex;gap:8px;padding:7px 2px;border-bottom:1px solid #3e3e45}
      .mufy-recovery-row img{width:40px;height:40px;flex:none;border-radius:10px;object-fit:cover}
      .mufy-recovery-info{flex:1;min-width:0;word-break:break-all}.mufy-recovery-info a{color:#aaa1ff}
      .mufy-recovery-row-title{display:flex;align-items:center;justify-content:space-between;gap:8px}
      .mufy-recovery-mask-title-tools{margin-left:auto;display:inline-flex;align-items:center;gap:4px;flex:none}
      .mufy-recovery-mask-copy{flex:none;width:25px!important;height:25px!important;padding:0!important;display:inline-flex!important;align-items:center;justify-content:center;border:0!important;border-radius:6px!important;background:transparent!important;color:#bdbdc7!important;font:700 18px/1 system-ui!important}
      .mufy-recovery-mask-copy:hover,.mufy-recovery-mask-copy:active{background:#ffffff14!important;color:#fff!important}
      .mufy-recovery-role-tools{margin-left:auto;display:flex;align-items:center;gap:2px;flex:none}
      .mufy-recovery-archive-button{padding:3px 6px!important;font-size:11px!important;color:#c5c0ef!important}
      .mufy-recovery-archives{display:grid;gap:4px;margin-top:7px;padding:7px;border-left:2px solid #786bd4;background:#19191e;color:#999}
      .mufy-recovery-archives a{display:block;word-break:break-word}
      .mufy-recovery-favorite-button{flex:none;border:0!important;background:transparent!important;color:#ffd75e!important;font-size:20px!important;line-height:1;padding:1px 5px!important}
      .mufy-recovery-favorite-button:hover{background:#ffffff12!important}
      .mufy-recovery-favorite-button.is-favorite{color:#ffd75e!important}
      .mufy-recovery-favorite-button.is-pending{color:#f3c969!important;animation:mufy-recovery-favorite-pending 1s ease-in-out infinite}
      @keyframes mufy-recovery-favorite-pending{0%,100%{opacity:.55}50%{opacity:1}}
      .mufy-recovery-visibility{display:inline-block;margin-left:4px;padding:1px 5px;border-radius:8px;font-size:10px;line-height:1.3}
      .mufy-recovery-visibility.public{color:#a9e6bd;background:#1c5b36}
      .mufy-recovery-visibility.link{color:#f3d38b;background:#60491f}
      .mufy-recovery-visibility.private{color:#d6c5ff;background:#49366b}
      .mufy-recovery-visibility.expired{color:#ffb0b0;background:#6a2929}
      .mufy-recovery-visibility.unknown{color:#bbb;background:#45454d}
      .mufy-recovery-author{border-bottom:1px solid #3e3e45;padding:8px 2px}
      .mufy-recovery-author-head{display:flex;align-items:center;gap:6px;min-width:0}
      .mufy-recovery-author-toggle{flex:1;min-width:0;text-align:left;background:#2b2b32!important}
      .mufy-recovery-author-favorite{flex:none;white-space:nowrap;padding:6px 7px!important;font-size:11px!important;color:#f3c969!important}
      .mufy-recovery-author-works{padding-left:8px}
      .mufy-recovery-site-slot{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 5px;border:1px solid #8888;border-radius:10px;background:#ffffff18;color:#ddd;font-size:11px;line-height:1}
      .mufy-recovery-muted{color:#999;font-size:11px;margin:2px 0 3px}
      .mufy-recovery-role-tags{display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin:3px 0}
      .mufy-recovery-role-tags button{border:1px solid #5f5874!important;border-radius:12px!important;background:#302c3c!important;color:#c9bfff!important;padding:2px 7px!important;font-size:10px!important;line-height:1.35!important;cursor:pointer}
      .mufy-recovery-role-tags button:hover{border-color:#9185bd!important;background:#433c57!important;color:#fff!important}
      .mufy-recovery-role-tag{border:1px solid #4e4a5b;border-radius:12px;background:#292631;color:#aaa2c2;padding:2px 7px;font-size:10px;line-height:1.35}
      .mufy-recovery-tag-more{color:#999;font-size:10px}
      .mufy-recovery-chat-match{display:grid;gap:3px;margin:6px 0;padding:7px 8px;border-left:3px solid #8b79db;border-radius:4px;background:#2c2939;color:#ddd;line-height:1.45}
      .mufy-recovery-chat-match b{color:#c9c0ff;font-size:10px}.mufy-recovery-chat-match span{word-break:break-word}
      .mufy-recovery-chat-match mark{padding:0 2px;border-radius:2px;background:#ffe16b;color:#201b00}
      .mufy-recovery-chat-jump{padding:4px 8px!important;background:#493f70!important;border-color:#7e70b5!important;color:#eee!important;font-size:11px!important}
      .mufy-recovery-chat-target{outline:3px solid #a78bfa!important;outline-offset:4px!important;background-color:rgba(139,92,246,.16)!important;animation:mufy-chat-target-pulse 1.1s ease-in-out 4}
      @keyframes mufy-chat-target-pulse{0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,.15)}50%{box-shadow:0 0 0 8px rgba(167,139,250,.3)}}
      .mufy-recovery-detail{margin-top:5px;white-space:pre-wrap;color:#ccc;line-height:1.45}
      .mufy-recovery-row-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:4px}
      .mufy-recovery-row-actions button{padding:4px 7px!important;font-size:11px}
      .mufy-recovery-mask-binding-info{color:#898995;font-size:10px;white-space:nowrap}
      .mufy-recovery-share-select{flex:none;border:0!important;background:transparent!important;color:#aaa1ff!important;font-size:18px!important;line-height:1;padding:2px 5px!important}
      .mufy-recovery-share-select.is-selected{color:#cabfff!important}
      .mufy-recovery-old{display:inline-block;margin-left:7px;border-radius:10px;background:#614d30;color:#ffd99a;padding:1px 6px;font-size:10px}
      .mufy-recovery-empty{padding:22px;text-align:center;color:#999}
      .mufy-quote-action-separator{height:14px;width:1px;flex:none;border-radius:999px;background:#ffffff33}
      .mufy-quote-action-button{display:flex;align-items:center;gap:4px;padding-right:16px;color:#e9c77f;font-size:14px;line-height:1;cursor:pointer;white-space:nowrap;user-select:none}
      .mufy-quote-action-button:hover{opacity:.72}.mufy-quote-action-button:active{transform:translateY(1px)}
      #mufy-recovery-model-dots{position:absolute;left:50%;bottom:52px;box-sizing:border-box;min-width:34px;max-width:96px;min-height:28px;display:flex;align-items:center;justify-content:center;gap:5px;flex-wrap:wrap;padding:6px 8px;border:1px solid #ffffff48;border-radius:14px;background:#17171df2;box-shadow:0 4px 14px #0009;transform:translateX(-50%);pointer-events:auto;cursor:pointer}#mufy-recovery-model-dots[hidden]{display:none}#mufy-recovery-toggle.mufy-docked-right #mufy-recovery-model-dots{left:auto;right:22px;transform:none}#mufy-recovery-toggle.mufy-docked-left #mufy-recovery-model-dots{left:22px;right:auto;transform:none}#mufy-recovery-model-dots i,.mufy-model-monitor-dot{display:block;flex:none;width:10px;height:10px;border-radius:50%;box-shadow:0 0 0 1px #0008,0 0 6px currentColor}.is-green{background:#24ba7a!important;color:#62dca8!important}.is-yellow{background:#e7cf58!important;color:#f1df82!important}.is-red{background:#e94f46!important;color:#ff8c85!important}.is-gray{background:#7b7b85!important;color:#aaa!important}#mufy-recovery-model-dots b{color:#ddd;font-size:9px}
      #mufy-recovery-model-modal{position:absolute;inset:48px 10px 10px;z-index:11;display:flex;flex-direction:column;overflow:hidden;background:#292930;border:1px solid #666;border-radius:9px;box-shadow:0 12px 32px #000b}#mufy-recovery-model-modal[hidden]{display:none}
      #mufy-recovery-panel-beauty-modal{position:absolute;inset:48px 10px 10px;z-index:15;display:flex;flex-direction:column;overflow:hidden;border:1px solid #766bb1;border-radius:14px;background:#25252cf5;box-shadow:0 18px 48px #000c}#mufy-recovery-panel-beauty-modal[hidden]{display:none}#mufy-recovery-panel-beauty-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:11px 13px;border-bottom:1px solid #4b4b55;background:#35353e}#mufy-recovery-panel-beauty-head>span{display:grid;gap:3px}#mufy-recovery-panel-beauty-head small{color:#aaa;font-size:10px;font-weight:400}#mufy-recovery-panel-beauty-head button{padding:1px 7px!important;font-size:20px!important}#mufy-recovery-panel-beauty-fields{flex:1;min-height:0;overflow:auto;display:grid;grid-template-columns:1fr 1fr;align-content:start;gap:11px;padding:14px}#mufy-recovery-panel-beauty-fields label{display:grid;gap:6px;color:#c6c1d1;font-size:11px}#mufy-recovery-panel-beauty-fields select,#mufy-recovery-panel-beauty-fields input{box-sizing:border-box;width:100%}#mufy-recovery-panel-beauty-fields input[type="color"]{height:42px;padding:3px;border:1px solid #ffffff24;border-radius:10px;background:#111}#mufy-recovery-panel-beauty-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 14px 14px}#mufy-recovery-panel-beauty-done{background:var(--mufy-panel-accent,#786bd4)!important;color:#fff!important}
      #mufy-recovery-model-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 11px;background:#35353e;border-bottom:1px solid #4b4b55}#mufy-recovery-model-head>span{display:grid;gap:2px}#mufy-recovery-model-summary{color:#aaa;font-size:10px;font-weight:400}#mufy-recovery-model-head button{padding:1px 7px!important;font-size:20px!important}
      #mufy-recovery-model-tools{display:grid;grid-template-columns:1fr auto;gap:7px;padding:9px 10px;border-bottom:1px solid #414149}#mufy-recovery-model-search{box-sizing:border-box;min-width:0;width:100%;border:1px solid #555;border-radius:6px;background:#18181c;color:#fff;padding:7px 9px;font:inherit}#mufy-recovery-model-refresh{background:#51477b!important;border-color:#7e70b5!important}#mufy-recovery-model-notify-label{grid-column:1/-1;display:flex;align-items:center;gap:7px;color:#cfcfd7;font-size:11px;cursor:pointer}#mufy-recovery-model-notify{accent-color:#786bd4}
      #mufy-recovery-model-list{flex:1;min-height:0;overflow:auto;padding:8px;display:grid;align-content:start;gap:6px;background:#1c1c21}.mufy-model-monitor-row{display:flex;align-items:center;gap:8px;padding:9px;border:1px solid #454550;border-radius:8px;background:#28282f;cursor:pointer}.mufy-model-monitor-row:has(input:checked){border-color:#796bb1;background:#332e46}.mufy-model-monitor-row input{flex:none;accent-color:#786bd4}.mufy-model-monitor-info{min-width:0;display:grid;gap:3px;flex:1}.mufy-model-monitor-info b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}.mufy-model-monitor-info small{color:#999;font-size:9px;line-height:1.4}.mufy-model-monitor-row em{flex:none;padding:2px 6px;border-radius:9px;background:#444;font-size:9px;font-style:normal;color:#ddd}
      #mufy-recovery-quote-editor-modal,#mufy-recovery-quote-library-modal{position:absolute;inset:8px;z-index:12;display:flex;flex-direction:column;overflow:hidden;border:1px solid #766bb1;border-radius:10px;background:#25252c;box-shadow:0 14px 42px #000c}
      #mufy-recovery-quote-editor-modal[hidden],#mufy-recovery-quote-library-modal[hidden]{display:none}
      .mufy-quote-modal-head{display:flex;align-items:center;justify-content:space-between;gap:9px;padding:10px 12px;background:#34333e;border-bottom:1px solid #4c4a5c}
      .mufy-quote-modal-head span{min-width:0;display:grid;gap:2px}.mufy-quote-modal-head small{color:#aaa;font-size:10px;font-weight:400}
      .mufy-quote-modal-head button{padding:1px 7px!important;border:0!important;background:transparent!important;font-size:21px!important}
      #mufy-recovery-quote-editor-body{flex:1;min-height:0;display:grid;grid-template-rows:auto 1fr;gap:8px;padding:12px}
      #mufy-recovery-quote-editor-role{color:#d5cdfc;font-size:12px}
      #mufy-recovery-quote-editor-text{box-sizing:border-box;width:100%;min-height:180px;resize:none;border:1px solid #5c5870;border-radius:9px;background:#15151a;color:#f3f3f6;padding:12px;font:14px/1.65 system-ui;outline:none}
      #mufy-recovery-quote-editor-text:focus{border-color:#9585e2;box-shadow:0 0 0 2px #786bd433}
      #mufy-recovery-quote-editor-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 12px 12px}
      #mufy-recovery-quote-editor-save{background:#786bd4!important;border-color:#9c91e7!important;font-weight:700}
      .mufy-quote-preview-role{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:8px;color:var(--quote-accent);font-size:.82em;font-weight:700;letter-spacing:.08em}.mufy-quote-preview-role img{width:34px;height:34px;border:1px solid var(--quote-accent);border-radius:50%;object-fit:cover}
      .mufy-quote-preview-text{position:relative;z-index:1;white-space:pre-wrap;overflow-wrap:anywhere}.mufy-quote-preview-mark{position:absolute;right:19px;bottom:14px;color:var(--quote-accent);font:9px/1 system-ui;letter-spacing:.12em;opacity:.75}
      #mufy-recovery-quote-style{display:grid;grid-template-columns:1fr 1fr;gap:7px}.mufy-quote-style-field{display:grid;gap:4px;color:#bbb;font-size:10px}.mufy-quote-style-field select,.mufy-quote-style-field input[type="range"]{box-sizing:border-box;width:100%;min-width:0;border:1px solid #555;border-radius:6px;background:#18181c;color:#fff;padding:5px;font:inherit}.mufy-quote-style-field input[type="color"]{box-sizing:border-box;width:100%;height:30px;border:1px solid #555;border-radius:6px;background:#18181c;padding:2px}.mufy-quote-style-check{grid-column:1/-1;display:flex;align-items:center;gap:6px;color:#ccc;font-size:11px}.mufy-quote-style-check input{accent-color:#786bd4}
      #mufy-recovery-quote-library-body{position:relative;display:block;flex:1;min-height:0;overflow:hidden;background:radial-gradient(circle at 50% 0,#39324e 0,#211f29 42%,#18181d 100%)}
      #mufy-recovery-quote-list{box-sizing:border-box;height:100%;overflow:auto;padding:14px 12px 38px;border:0;background:transparent}
      .mufy-quote-deck-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px 12px;padding:8px 4px 28px}
      .mufy-quote-stack{position:relative;min-width:0;height:190px;padding:0!important;border:0!important;background:transparent!important;overflow:visible;filter:drop-shadow(0 9px 10px #0008);transition:transform .2s,filter .2s}.mufy-quote-stack:hover{transform:translateY(-7px);filter:drop-shadow(0 12px 15px #8d73df66)}
      .mufy-quote-stack-layers,.mufy-quote-stack-layers:before,.mufy-quote-stack-layers:after{position:absolute;inset:8px 7px 7px;display:block;border:2px solid #8f7cc7;border-radius:11px;background:#302943;content:''}.mufy-quote-stack-layers{transform:rotate(-3.5deg) translate(-4px,1px)}.mufy-quote-stack-layers:before{inset:-3px;transform:rotate(6deg) translate(7px,-2px);background:#413657}.mufy-quote-stack-layers:after{inset:-2px;transform:rotate(2deg) translate(4px,-1px);background:#282136}
      .mufy-quote-stack-cover{position:absolute;inset:7px;z-index:3;display:block;overflow:hidden;border:2px solid #b29be7;border-radius:11px;background:#282139;color:#fff}.mufy-quote-stack-cover>img{width:100%;height:100%;object-fit:cover}.mufy-quote-stack-cover>i{display:flex;height:100%;align-items:center;justify-content:center;color:#cdbdff;font-size:40px}.mufy-quote-stack-cover:after{content:'';position:absolute;inset:0;background:linear-gradient(transparent 48%,#000e)}.mufy-quote-stack-cover>span{position:absolute;z-index:2;left:8px;right:8px;bottom:10px;display:grid;gap:3px;text-align:center;text-shadow:0 2px 5px #000}.mufy-quote-stack-cover b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:700 13px/1.2 Georgia,"Noto Serif SC",serif}.mufy-quote-stack-cover small{color:#ffffffb8;font-size:9px}
      .mufy-quote-deck{min-height:205px;margin-bottom:18px;padding:11px 12px 18px;border:1px solid #ffffff1c;border-radius:13px;background:linear-gradient(145deg,#ffffff0e,#00000022);box-shadow:0 10px 24px #0005}
      .mufy-quote-deck-head{display:flex;align-items:center;gap:8px;margin-bottom:9px}.mufy-quote-deck-head>img{width:34px;height:34px;border:1px solid #a895e7;border-radius:50%;object-fit:cover}.mufy-quote-deck-head>div{min-width:0;display:grid}.mufy-quote-deck-head b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#f2efff}.mufy-quote-deck-head small{color:#999;font-size:10px}.mufy-quote-deck-head>span{margin-left:auto;color:#a99fc8;font-size:10px;white-space:nowrap}
      .mufy-quote-fan-scroll{overflow-x:auto;overflow-y:visible;padding:9px 13px 12px}.mufy-quote-fan{position:relative;min-width:360px;height:235px;padding:0}
      .mufy-quote-deck-card{position:absolute;top:8px;left:50%;width:112px;height:172px;margin:0!important;padding:0!important;overflow:hidden;border:2px solid #b29be7!important;border-radius:10px!important;background:#272139!important;box-shadow:0 9px 18px #0009;transform:translateX(calc(-50% + var(--fan-x))) rotate(var(--fan-angle));transform-origin:50% 115%;transition:transform .22s,filter .18s,box-shadow .18s}.mufy-quote-deck-card:hover,.mufy-quote-deck-card.active{filter:brightness(1.14);box-shadow:0 8px 26px #a88df088;transform:translateX(-50%) translateY(-18px) rotate(0)!important;z-index:99!important}.mufy-quote-deck-card img{width:100%;height:100%;object-fit:cover}.mufy-quote-deck-card i{position:absolute;inset:0;border:5px double #ffffff60;border-radius:7px;pointer-events:none}.mufy-quote-deck-fallback{display:flex;height:100%;align-items:center;justify-content:center;color:#c9b6ff;font-size:30px}
      #mufy-recovery-quote-stage{box-sizing:border-box;height:100%;display:grid;place-items:center;padding:18px;container-type:size}
      #mufy-recovery-quote-library-modal{inset:0;border:0;border-radius:inherit;box-shadow:none}
      #mufy-recovery-quote-library-head{flex:none;gap:8px;padding:10px 16px}
      #mufy-recovery-quote-library-head>span{flex:1;min-width:0}
      #mufy-recovery-quote-library-head small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      #mufy-recovery-panel #mufy-recovery-quote-library-head button{flex:none;display:grid;place-items:center;width:32px;height:32px;padding:0!important;font-size:20px!important;line-height:1}
      #mufy-recovery-quote-management,#mufy-recovery-quote-style-modal{box-sizing:border-box;height:100%;overflow:auto}
      #mufy-recovery-quote-management{padding:clamp(14px,4vw,24px)}
      #mufy-recovery-quote-library-body #mufy-recovery-quote-style{width:min(100%,440px);box-sizing:border-box;margin:0 auto;gap:16px;padding:clamp(14px,4vw,24px)}
      #mufy-recovery-quote-text-form,#mufy-recovery-quote-stage-edit-actions{display:grid;gap:10px;width:min(100%,440px);margin:0 auto}
      #mufy-recovery-quote-text-form{height:100%;grid-template-rows:auto minmax(100px,1fr) auto}
      #mufy-recovery-quote-text-form>button{justify-self:end}
      #mufy-recovery-panel #mufy-recovery-quote-stage-edit-actions>button{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:44px;padding:10px 14px;text-align:left;background:var(--mufy-panel-surface)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important;box-shadow:none}
      #mufy-recovery-panel #mufy-recovery-quote-stage-edit-actions>button:hover{background:var(--mufy-panel-accent-soft)!important}
      #mufy-recovery-panel #mufy-recovery-quote-stage-edit-actions>#mufy-recovery-quote-delete{margin-top:8px;color:#ffc0c5!important;border-color:#8b4b52!important}
      #mufy-recovery-panel[data-panel-tone="light"] #mufy-recovery-quote-stage-edit-actions>#mufy-recovery-quote-delete{color:#962c43!important;border-color:#e0b1bc!important}
      #mufy-recovery-panel #mufy-recovery-quote-save-text{background:var(--mufy-panel-accent-button);border-color:var(--mufy-panel-border)}
      #mufy-recovery-quote-preview:focus-visible{outline:2px solid var(--mufy-panel-accent);outline-offset:5px}
      #mufy-recovery-panel .mufy-quote-card-image strong,#mufy-recovery-panel .mufy-quote-card-image small,#mufy-recovery-panel .mufy-quote-stack-cover small{color:#fff!important}
      #mufy-recovery-quote-preview{width:min(100%,300px);width:min(100%,380px,64cqh);aspect-ratio:9/14;cursor:pointer;perspective:1200px}
      @media (prefers-reduced-motion:reduce){#mufy-recovery-quote-preview .mufy-quote-card-inner{transition:none}}
      .mufy-quote-card-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .65s cubic-bezier(.2,.75,.2,1)}#mufy-recovery-quote-preview.is-flipped .mufy-quote-card-inner{transform:rotateY(180deg)}
      .mufy-quote-card-face{position:absolute;inset:0;box-sizing:border-box;overflow:hidden;border:2px solid var(--quote-accent);border-radius:17px;backface-visibility:hidden;box-shadow:inset 0 0 0 6px color-mix(in srgb,var(--quote-accent) 24%,transparent),0 9px 24px #0004}
      .mufy-quote-card-image{background:var(--quote-bg)}.mufy-quote-card-image>img{width:100%;height:100%;object-fit:cover}.mufy-quote-card-image-fallback{display:flex;height:100%;align-items:center;justify-content:center;color:var(--quote-accent);font-size:64px}.mufy-quote-card-image-shade{position:absolute;inset:0;background:linear-gradient(transparent 52%,#000d)}.mufy-quote-card-image strong{position:absolute;left:20px;right:20px;bottom:45px;text-align:center;color:#fff;font:700 22px/1.2 Georgia,"Noto Serif SC",serif;text-shadow:0 2px 6px #000}.mufy-quote-card-image small{position:absolute;left:15px;right:15px;bottom:23px;text-align:center;color:#ffffffb8;font-size:10px}
      .mufy-quote-card-content{display:flex;flex-direction:column;justify-content:center;gap:14px;padding:25px 21px;background:var(--quote-bg);color:var(--quote-color);font-family:var(--quote-font);font-size:var(--quote-size);text-align:var(--quote-align);line-height:1.6;transform:rotateY(180deg)}.mufy-quote-card-content:before{content:'✦';position:absolute;inset:9px;border:1px solid color-mix(in srgb,var(--quote-accent) 55%,transparent);border-radius:11px;color:var(--quote-accent);padding:4px;font-size:12px;pointer-events:none}.mufy-quote-card-content .mufy-quote-preview-text{position:relative;z-index:1;flex:1;min-height:0;overflow-y:auto;white-space:pre-wrap}.mufy-quote-card-content .mufy-quote-preview-mark{right:18px;bottom:14px}
      #mufy-recovery-quote-preview.theme-dark .mufy-quote-card-content:before{content:'';border-style:dashed;opacity:.55}
      #mufy-recovery-quote-preview.theme-paper .mufy-quote-card-content{background:linear-gradient(#ffffff14 1px,transparent 1px),var(--quote-bg);background-size:100% 28px}
      #mufy-recovery-quote-preview.theme-paper .mufy-quote-card-content:before{content:'';border-radius:3px}
      #mufy-recovery-quote-preview.theme-rose .mufy-quote-card-content{background:radial-gradient(circle at 15% 15%,color-mix(in srgb,var(--quote-accent) 32%,transparent),transparent 36%),radial-gradient(circle at 85% 85%,color-mix(in srgb,var(--quote-accent) 20%,transparent),transparent 35%),var(--quote-bg)}
      #mufy-recovery-quote-inline-editor{box-sizing:border-box;width:100%;min-height:0;resize:none;padding:12px;font:inherit;line-height:1.65}
      /* 3.0 premium visual layer */
      #mufy-recovery-panel{background:var(--mufy-panel-bg,#17151f);border-color:var(--mufy-panel-border,#ffffff24);border-radius:18px;box-shadow:0 24px 70px #0008,inset 0 1px #ffffff14;backdrop-filter:blur(22px) saturate(1.08)}
      #mufy-recovery-head{min-height:38px;padding:10px 13px 8px;background:linear-gradient(90deg,#ffffff0d,#8f7bff12,#ffffff08);border-bottom:1px solid #ffffff12;border-radius:18px 18px 0 0}#mufy-recovery-title>span{font-size:14px;letter-spacing:.01em}.mufy-recovery-version{color:#d9c7ff}
      #mufy-recovery-head #mufy-recovery-log-entry,#mufy-recovery-head #mufy-recovery-history-entry{border-color:#ffffff24!important;border-radius:999px!important;background:#ffffff0a!important;color:#d9d6e7!important;box-shadow:inset 0 1px #ffffff12}
      #mufy-recovery-controls{gap:10px;padding:12px 13px;background:linear-gradient(180deg,#ffffff03,transparent)}
      #mufy-recovery-panel button{border-color:var(--mufy-panel-border);border-radius:10px;background:var(--mufy-panel-surface);color:#eeedf6;box-shadow:0 1px 3px #0001;transition:transform .16s ease,border-color .16s ease,background .16s ease,box-shadow .16s ease}#mufy-recovery-panel button:hover{border-color:var(--mufy-panel-accent);background:var(--mufy-panel-accent-soft)}#mufy-recovery-panel button:active{transform:translateY(1px) scale(.99)}
      #mufy-recovery-panel button.active,#mufy-recovery-panel .mufy-recovery-section-card:first-child{background:var(--mufy-panel-accent-soft)!important;border-color:color-mix(in srgb,var(--mufy-panel-accent,#8f7be8) 72%,transparent)!important}#mufy-recovery-panel #mufy-recovery-head{border-bottom-color:color-mix(in srgb,var(--mufy-panel-accent,#8f7be8) 24%,transparent)}
      #mufy-recovery-panel #mufy-recovery-title>span,#mufy-recovery-panel #mufy-recovery-section-title,#mufy-recovery-panel .mufy-recovery-row>div>strong,#mufy-recovery-panel .mufy-recovery-section-note strong,#mufy-recovery-panel .mufy-beauty-launch strong{color:var(--mufy-panel-text,#f2efff)!important}
      #mufy-recovery-section-home{gap:13px;padding:6px 2px 10px}#mufy-recovery-section-home-head{padding:4px 5px 1px}#mufy-recovery-section-home-head strong{font-size:17px;letter-spacing:.02em}#mufy-recovery-section-home-head small{color:#8e8a9e}
      #mufy-recovery-section-cards{gap:10px}.mufy-recovery-section-card{position:relative;min-height:86px!important;overflow:hidden;border-color:var(--mufy-panel-border)!important;border-radius:15px!important;background:var(--mufy-panel-surface)!important;box-shadow:inset 0 1px #ffffff12,0 10px 24px #0002!important}.mufy-recovery-section-card:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 12% 0,var(--mufy-panel-accent-soft),transparent 48%);pointer-events:none}.mufy-recovery-section-card:hover{transform:translateY(-2px);border-color:var(--mufy-panel-accent)!important}.mufy-recovery-section-card strong{position:relative;font-size:14px}.mufy-recovery-section-card small{position:relative;color:var(--mufy-panel-muted)}.mufy-recovery-section-card:first-child{background:var(--mufy-panel-accent-soft)!important;border-color:var(--mufy-panel-accent)!important}
      #mufy-recovery-update-entry.has-update{border-color:#61c99588!important;background:linear-gradient(145deg,#225a4166,#242c3250)!important;box-shadow:inset 0 1px #baffd022,0 0 22px #42c78322!important}#mufy-recovery-update-entry.has-update strong{color:#bfffd8}#mufy-recovery-update-entry.has-update small{color:#8de8b2}
      #mufy-recovery-section-nav{padding:1px 0 9px;border-color:#ffffff12}#mufy-recovery-section-back{border-radius:999px!important;background:#ffffff09!important}#mufy-recovery-section-title{font-size:16px;letter-spacing:.04em}
      .mufy-recovery-section-note{padding:12px 13px;border-color:#a995ff2e;border-radius:14px;background:linear-gradient(135deg,#8d73df18,#ffffff06);box-shadow:inset 0 1px #ffffff0d}.mufy-recovery-section-note strong{color:#f1edff;font-size:13px}.mufy-recovery-section-note span{color:#9d98ad}
      #mufy-recovery-panel input:not([type="checkbox"]):not([type="range"]):not([type="color"]),#mufy-recovery-panel select,#mufy-recovery-panel textarea{border-color:var(--mufy-panel-border)!important;border-radius:11px!important;background:var(--mufy-panel-input)!important;color:var(--mufy-panel-text)!important;box-shadow:inset 0 1px 4px #0002!important;outline:none}#mufy-recovery-panel input:focus,#mufy-recovery-panel select:focus,#mufy-recovery-panel textarea:focus{border-color:var(--mufy-panel-accent)!important;box-shadow:0 0 0 3px var(--mufy-panel-accent-soft)!important}
      #mufy-recovery-status{border-radius:11px;color:#c6bfdc}#mufy-recovery-list{border-color:#ffffff12}.mufy-recovery-row{margin:5px 0;padding:10px 9px;border:1px solid #ffffff0d;border-radius:13px;background:#ffffff05}.mufy-recovery-row:hover{border-color:#a995ff28;background:#ffffff08}.mufy-recovery-row img{border-radius:12px;box-shadow:0 5px 13px #0007}
      #mufy-recovery-model-modal,#mufy-recovery-log-modal,#mufy-recovery-export-modal,#mufy-recovery-chat-search-modal{border-color:#ffffff24;border-radius:16px;background:linear-gradient(155deg,#292936f5,#17171ff8);box-shadow:0 22px 60px #000c}.mufy-model-monitor-row{border-color:#ffffff14;border-radius:12px;background:#ffffff07}.mufy-model-monitor-row:has(input:checked){border-color:#9f8bea55;background:#8d73df18}
      /* Selected theme owns every panel surface; no legacy purple/black mixing. */
      #mufy-recovery-panel #mufy-recovery-head,#mufy-recovery-panel .mufy-recovery-section-note,#mufy-recovery-panel .mufy-recovery-section-card,#mufy-recovery-panel .mufy-beauty-launch,#mufy-recovery-panel .mufy-account-card,#mufy-recovery-panel .mufy-material-card,#mufy-recovery-panel .mufy-recovery-row,#mufy-recovery-panel .mufy-model-monitor-row{background:var(--mufy-panel-surface)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important}
      #mufy-recovery-panel #mufy-recovery-head,#mufy-recovery-panel #mufy-recovery-panel-beauty-head,#mufy-recovery-panel .mufy-quote-modal-head,#mufy-recovery-panel #mufy-recovery-material-editor-head,#mufy-recovery-panel #mufy-recovery-model-head{background:var(--mufy-panel-surface-strong)!important;border-color:var(--mufy-panel-border)!important}
      #mufy-recovery-panel #mufy-recovery-panel-beauty-modal,#mufy-recovery-panel #mufy-recovery-model-modal,#mufy-recovery-panel #mufy-recovery-log-modal,#mufy-recovery-panel #mufy-recovery-export-modal,#mufy-recovery-panel #mufy-recovery-chat-search-modal,#mufy-recovery-panel #mufy-recovery-material-editor,#mufy-recovery-panel #mufy-recovery-quote-editor-modal,#mufy-recovery-panel #mufy-recovery-quote-library-modal,#mufy-recovery-panel #mufy-recovery-quote-style-modal{background:var(--mufy-panel-bg)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important}
      #mufy-recovery-panel button{color:var(--mufy-panel-text)}#mufy-recovery-panel button.active,#mufy-recovery-panel .mufy-recovery-section-card:first-child{background:var(--mufy-panel-accent-soft)!important;border-color:var(--mufy-panel-accent)!important}
      #mufy-recovery-panel small,#mufy-recovery-panel .mufy-recovery-muted,#mufy-recovery-panel .mufy-recovery-section-card small,#mufy-recovery-panel .mufy-recovery-section-note span,#mufy-recovery-panel .mufy-beauty-launch small,#mufy-recovery-panel-beauty-fields label{color:var(--mufy-panel-muted)!important}
      #mufy-recovery-panel[data-panel-tone="light"]{box-shadow:0 24px 60px #26313a24,inset 0 1px #fff}#mufy-recovery-panel[data-panel-tone="light"] button{box-shadow:inset 0 1px #fff8,0 3px 10px #26313a10}#mufy-recovery-panel[data-panel-tone="light"] #mufy-recovery-title,#mufy-recovery-panel[data-panel-tone="light"] strong{color:var(--mufy-panel-text)}
      #mufy-recovery-panel #mufy-recovery-log-entry,#mufy-recovery-panel #mufy-recovery-history-entry,#mufy-recovery-panel #mufy-recovery-section-back{background:var(--mufy-panel-surface)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important}
      #mufy-recovery-panel #mufy-recovery-status,#mufy-recovery-panel #mufy-recovery-role-read-options,#mufy-recovery-panel #mufy-recovery-auto-switch-label,#mufy-recovery-panel .mufy-recovery-auto-delay{color:var(--mufy-panel-muted)!important}
      #mufy-recovery-panel #mufy-recovery-auto-folder-label,#mufy-recovery-panel #mufy-recovery-manual-auto-actions,#mufy-recovery-panel #mufy-recovery-favorite-task-controls{background:var(--mufy-panel-surface-strong)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important}
      #mufy-recovery-panel #mufy-recovery-tabs button.active,#mufy-recovery-panel #mufy-recovery-favorite-tabs button.active,#mufy-recovery-panel #mufy-recovery-chat-tabs button.active,#mufy-recovery-panel #mufy-recovery-mask-tabs button.active,#mufy-recovery-panel #mufy-recovery-material-tabs button.active,#mufy-recovery-panel .mufy-recovery-tab-action,#mufy-recovery-panel #mufy-recovery-run,#mufy-recovery-panel #mufy-recovery-manual-auto-start,#mufy-recovery-panel #mufy-recovery-chat-search{background:var(--mufy-panel-accent-button)!important;border-color:var(--mufy-panel-accent)!important;color:var(--mufy-panel-accent-text)!important}
      #mufy-recovery-panel .mufy-recovery-role-tags button,#mufy-recovery-panel .mufy-recovery-role-tag{background:var(--mufy-panel-accent-soft)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important}
      #mufy-recovery-panel[data-panel-tone="light"] #mufy-recovery-controls,#mufy-recovery-panel[data-panel-tone="light"] #mufy-recovery-list,#mufy-recovery-panel[data-panel-tone="light"] .mufy-recovery-info,#mufy-recovery-panel[data-panel-tone="light"] .mufy-recovery-detail{color:var(--mufy-panel-text)!important}
      #mufy-recovery-panel #mufy-recovery-model-list{background:var(--mufy-panel-bg)!important}#mufy-recovery-panel .mufy-model-monitor-row,#mufy-recovery-panel .mufy-model-monitor-row:has(input:checked){background:var(--mufy-panel-surface-strong)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important}#mufy-recovery-panel .mufy-model-monitor-row:has(input:checked){border-color:var(--mufy-panel-accent)!important;box-shadow:0 0 0 2px var(--mufy-panel-accent-soft)}
      #mufy-recovery-panel #mufy-recovery-quote-library-body{background:var(--mufy-panel-bg)!important}#mufy-recovery-panel .mufy-quote-stack-layers,#mufy-recovery-panel .mufy-quote-stack-layers:before,#mufy-recovery-panel .mufy-quote-stack-layers:after{background:var(--mufy-panel-surface-strong)!important;border-color:var(--mufy-panel-accent)!important}#mufy-recovery-panel .mufy-quote-stack-cover{border-color:var(--mufy-panel-accent)!important}#mufy-recovery-panel .mufy-quote-stack-cover>i{color:var(--mufy-panel-accent)!important}
      #mufy-recovery-panel #mufy-recovery-material-add,#mufy-recovery-panel #mufy-recovery-export-chat,#mufy-recovery-panel #mufy-recovery-model-refresh{background:var(--mufy-panel-accent-button)!important;border-color:var(--mufy-panel-accent)!important;color:var(--mufy-panel-accent-text)!important}
      /* Theme every remaining legacy overlay instead of allowing its old dark canvas to leak through. */
      #mufy-recovery-panel [id$="-modal"],#mufy-recovery-panel #mufy-recovery-mask-editor{background:var(--mufy-panel-bg)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important}
      #mufy-recovery-panel [id$="-modal"] [id$="-head"],#mufy-recovery-panel #mufy-recovery-mask-editor-head,#mufy-recovery-panel #mufy-recovery-mask-editor-actions{background:var(--mufy-panel-surface-strong)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important}
      #mufy-recovery-panel [id$="-modal"] [id$="-body"],#mufy-recovery-panel [id$="-modal"] [id$="-list"],#mufy-recovery-panel #mufy-recovery-log-output,#mufy-recovery-panel #mufy-recovery-mask-editor-body{background:var(--mufy-panel-bg)!important;color:var(--mufy-panel-text)!important}
      #mufy-recovery-panel #mufy-recovery-folder-menu-actions,#mufy-recovery-panel #mufy-recovery-folder-delete-actions,#mufy-recovery-panel #mufy-recovery-favorite-interrupt-actions{background:var(--mufy-panel-bg)!important;border-color:var(--mufy-panel-border)!important}
      #mufy-recovery-panel .mufy-recovery-author-toggle,#mufy-recovery-panel .mufy-recovery-folder-delete-item,#mufy-recovery-panel .mufy-recovery-site-select{background:var(--mufy-panel-surface-strong)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important}
      #mufy-recovery-panel .mufy-recovery-folder-delete-item:has(input:checked),#mufy-recovery-panel .mufy-recovery-site-role-row.selected .mufy-recovery-site-select{background:var(--mufy-panel-accent-button)!important;border-color:var(--mufy-panel-accent)!important;color:var(--mufy-panel-accent-text)!important}
      #mufy-recovery-panel .mufy-recovery-mask-editor-field,#mufy-recovery-panel #mufy-recovery-mask-editor-title,#mufy-recovery-panel #mufy-recovery-mask-editor-close{color:var(--mufy-panel-text)!important}#mufy-recovery-panel #mufy-recovery-mask-editor-hint{color:var(--mufy-panel-muted)!important}#mufy-recovery-panel #mufy-recovery-mask-editor-save-as{background:var(--mufy-panel-surface)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important}#mufy-recovery-panel #mufy-recovery-mask-editor-replace{background:var(--mufy-panel-accent-button)!important;border-color:var(--mufy-panel-accent)!important;color:var(--mufy-panel-accent-text)!important}
      #mufy-recovery-panel .mufy-recovery-log-entry{background:var(--mufy-panel-surface-strong)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important}#mufy-recovery-panel .mufy-recovery-log-entry.is-info{border-left-color:#4b91dc!important}#mufy-recovery-panel .mufy-recovery-log-entry.is-warn{background:color-mix(in srgb,#e6ad45 12%,var(--mufy-panel-bg))!important;border-left-color:#c98a19!important}#mufy-recovery-panel .mufy-recovery-log-entry.is-error{background:color-mix(in srgb,#e75d66 11%,var(--mufy-panel-bg))!important;border-left-color:#d94c57!important}
      #mufy-recovery-panel .mufy-recovery-log-message,#mufy-recovery-panel .mufy-recovery-log-summary{color:var(--mufy-panel-text)!important}#mufy-recovery-panel .mufy-recovery-log-meta,#mufy-recovery-panel .mufy-recovery-log-detail{color:var(--mufy-panel-muted)!important}#mufy-recovery-panel .mufy-recovery-log-detail pre{background:var(--mufy-panel-input)!important;color:var(--mufy-panel-text)!important;border:1px solid var(--mufy-panel-border)}#mufy-recovery-panel[data-panel-tone="light"] .is-warn .mufy-recovery-log-message{color:#754d05!important}#mufy-recovery-panel[data-panel-tone="light"] .is-error .mufy-recovery-log-message{color:#9f2834!important}
      #mufy-recovery-panel #mufy-recovery-chat-search-start,#mufy-recovery-panel #mufy-recovery-share-recovery-one,#mufy-recovery-panel #mufy-recovery-material-editor-save,#mufy-recovery-panel #mufy-recovery-quote-editor-save,#mufy-recovery-panel #mufy-recovery-quote-update,#mufy-recovery-panel #mufy-recovery-quote-style-entry,#mufy-recovery-panel #mufy-recovery-panel-beauty-done{background:var(--mufy-panel-accent-button)!important;border-color:var(--mufy-panel-accent)!important;color:var(--mufy-panel-accent-text)!important}
      #mufy-recovery-panel .mufy-recovery-export-head,#mufy-recovery-panel #mufy-recovery-help-head{background:var(--mufy-panel-surface-strong)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important}#mufy-recovery-panel #mufy-recovery-help-body,#mufy-recovery-panel .mufy-recovery-export-binding-option{color:var(--mufy-panel-text)!important}#mufy-recovery-panel .mufy-recovery-export-binding-hint{color:var(--mufy-panel-muted)!important}
      #mufy-recovery-panel #mufy-recovery-help{background:var(--mufy-panel-surface)!important;border-color:var(--mufy-panel-border)!important;color:var(--mufy-panel-text)!important}
      #mufy-recovery-head #mufy-recovery-section-nav{gap:7px;padding:0;border:0}
      #mufy-recovery-head #mufy-recovery-section-back{display:grid;place-items:center;width:27px;height:27px;padding:0!important;font-size:20px;line-height:1}
      #mufy-recovery-head #mufy-recovery-section-title{font-size:14px;letter-spacing:0;white-space:nowrap}
      #mufy-recovery-status:empty{display:none}
      #mufy-recovery-panel[data-section="roles"] #mufy-recovery-controls{padding:9px 13px}
      #mufy-recovery-panel #mufy-recovery-role-filter-row{grid-template-columns:minmax(0,1fr) minmax(0,34%)}
      #mufy-recovery-panel #mufy-recovery-tabs{display:flex;gap:4px;overflow-x:auto;padding:0 0 3px;border-bottom:1px solid var(--mufy-panel-border)}
      #mufy-recovery-panel #mufy-recovery-tabs button{flex:none;white-space:nowrap;background:none!important;border:0!important;border-bottom:2px solid transparent!important;border-radius:0;box-shadow:none}
      #mufy-recovery-panel #mufy-recovery-tabs button.active{border-bottom-color:var(--mufy-panel-accent)!important;color:var(--mufy-panel-text)!important}
      #mufy-recovery-role-section #mufy-recovery-role-actions{display:flex;flex-wrap:wrap;align-items:start}
      #mufy-recovery-role-actions>button{flex:1;min-width:max-content}
      #mufy-recovery-role-more{min-width:54px}
      #mufy-recovery-role-more>summary{cursor:pointer;padding:6px 9px;border:1px solid var(--mufy-panel-border);border-radius:9px}
      #mufy-recovery-role-more[open]{flex:1 0 100%}
      #mufy-recovery-role-more[open]>summary{width:max-content;margin-left:auto}
      #mufy-recovery-role-more>div{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 0 0}
      #mufy-recovery-panel[data-section="roles"] .mufy-recovery-row{margin:0;border-width:0 0 1px;border-radius:0;background:none!important}
      .mufy-role-record{font-size:11px;color:var(--mufy-panel-muted);overflow-wrap:anywhere}
      .mufy-role-record summary{cursor:pointer;width:max-content}
      #mufy-recovery-panel .theme-book .mufy-quote-card-content{border:1px solid color-mix(in srgb,var(--quote-accent) 28%,transparent);box-shadow:0 6px 18px #0002;gap:10px;text-align:left;font-family:"Noto Serif SC","Songti SC",SimSun,serif;line-height:1.7}
      .theme-book .mufy-quote-card-content::before{display:none}
      .mufy-quote-book-kicker,.mufy-quote-book-byline{font-size:.75em;color:var(--quote-accent)}
      .mufy-quote-book-byline{border-top:1px solid currentColor;padding-top:7px;text-align:right}
      .theme-book .mufy-quote-preview-text p{margin:0 0 .75em;text-indent:2em}
      .mufy-quote-export-options,.mufy-quote-export-options label{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
      .mufy-quote-export-options{justify-content:space-between;padding:8px 12px;border:1px solid var(--mufy-panel-border);border-radius:10px}
      #mufy-recovery-panel ::-webkit-scrollbar{width:7px;height:7px}#mufy-recovery-panel ::-webkit-scrollbar-track{background:transparent}#mufy-recovery-panel ::-webkit-scrollbar-thumb{border:2px solid transparent;border-radius:999px;background:#82769c;background-clip:padding-box}#mufy-recovery-panel ::-webkit-scrollbar-thumb:hover{background:#a594cb;background-clip:padding-box}
      #mufy-recovery-panel ::-webkit-scrollbar-thumb{background:var(--mufy-panel-accent)!important;background-clip:padding-box!important}#mufy-recovery-panel ::-webkit-scrollbar-thumb:hover{background:var(--mufy-panel-accent-text)!important;background-clip:padding-box!important}
      @media (max-width:520px){
        #mufy-recovery-panel{right:8px;bottom:58px;width:calc(100vw - 16px);max-width:calc(100vw - 16px)}
        #mufy-recovery-role-actions button,#mufy-recovery-mask-actions button{font-size:11px;padding:6px 5px}
        #mufy-recovery-section-cards{grid-template-columns:1fr 1fr;gap:6px}.mufy-recovery-section-card{min-height:68px!important;padding:9px 10px!important}
        #mufy-recovery-beauty-launchers{grid-template-columns:1fr}.mufy-beauty-launch{min-height:88px!important}
        #mufy-recovery-panel-beauty-fields{grid-template-columns:1fr;gap:8px;padding:11px}
        #mufy-recovery-tabs,#mufy-recovery-chat-tabs{grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}#mufy-recovery-favorite-tabs{grid-template-columns:repeat(3,minmax(0,1fr))}
        #mufy-recovery-mask-tabs{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
        #mufy-recovery-mask-actions{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
        #mufy-recovery-site-actions{grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}
        #mufy-recovery-manual-auto-actions{grid-template-columns:1fr 1fr}
        #mufy-recovery-manual-auto-message{grid-column:1/-1}
        #mufy-recovery-tabs button,#mufy-recovery-favorite-tabs button,#mufy-recovery-chat-tabs button,#mufy-recovery-mask-tabs button{padding:6px 4px;font-size:11px}
        #mufy-recovery-export-options{gap:6px;padding:10px}
        #mufy-recovery-role-read-options{gap:5px;font-size:10px}
        #mufy-recovery-status{font-size:12px}
        #mufy-recovery-mask-editor{inset:4px}
        #mufy-recovery-mask-editor-body{grid-template-columns:1fr;gap:10px;padding:11px}
        .mufy-recovery-mask-editor-field.is-wide{grid-column:auto}
        #mufy-recovery-mask-editor-hint{grid-column:auto}
        .mufy-recovery-mask-editor-field textarea{min-height:128px}
        #mufy-recovery-mask-editor-actions{padding:10px 11px}
        #mufy-recovery-head{gap:3px;padding:8px 6px 5px}#mufy-recovery-head #mufy-recovery-model-entry,#mufy-recovery-head #mufy-recovery-log-entry,#mufy-recovery-head #mufy-recovery-history-entry{padding:4px 5px!important;font-size:9px!important}
        #mufy-recovery-quote-list{padding:10px 8px 30px}.mufy-quote-deck-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 14px;padding-left:12px;padding-right:12px}.mufy-quote-stack{height:205px}.mufy-quote-deck{min-height:195px;padding-left:8px;padding-right:8px}.mufy-quote-deck-card{width:86px;height:132px;margin-left:-48px!important}#mufy-recovery-quote-stage{padding:12px}.mufy-quote-card-content{padding:23px 18px}
      }`;
    document.documentElement.appendChild(style);

    const toggle = document.createElement('button');
    toggle.id = 'mufy-recovery-toggle';
    toggle.innerHTML = '<span aria-hidden="true">⌕</span><span id="mufy-recovery-model-dots" hidden></span>';
    toggle.title = '打开 Mufy 数据助手';
    document.body.appendChild(toggle);

    const nextButton = document.createElement('button');
    nextButton.id = 'mufy-recovery-next';
    nextButton.type = 'button';
    nextButton.innerHTML = '<span class="mufy-recovery-next-label">下一个</span><span class="mufy-recovery-next-close" data-close-next="1" role="button" tabindex="0" aria-label="永久关闭悬浮按钮">×</span>';
    nextButton.title = '处理完当前普通待聊角色后，打开下一个角色';
    nextButton.setAttribute('aria-label', nextButton.title);
    document.body.appendChild(nextButton);

    const autoChatToast = document.createElement('div');
    autoChatToast.id = 'mufy-recovery-auto-chat-toast';
    autoChatToast.setAttribute('role', 'status');
    autoChatToast.setAttribute('aria-live', 'polite');
    document.body.appendChild(autoChatToast);

    function clampToggleTop(value) {
      const maxTop = Math.max(8, window.innerHeight - 54);
      return Math.max(8, Math.min(maxTop, Number(value) || 8));
    }

    function applyTogglePosition(position) {
      const side = position?.side === 'left' ? 'left' : position?.side === 'center' ? 'center' : 'right';
      toggle.classList.toggle('mufy-docked-left', side === 'left');
      toggle.classList.toggle('mufy-docked-right', side === 'right');
      const top = clampToggleTop(position?.top ?? (window.innerHeight / 2 - 23));
      toggle.style.top = `${top}px`;
      toggle.style.bottom = 'auto';
      nextButton.style.top = `${Math.max(8, Math.min(window.innerHeight - 42, top + 6))}px`;
      nextButton.style.bottom = 'auto';
      if (side === 'center') {
        toggle.style.left = '50%';
        toggle.style.right = 'auto';
        toggle.style.transform = 'translateX(-50%)';
        nextButton.style.left = 'calc(50% + 31px)';
        nextButton.style.right = 'auto';
      } else {
        toggle.style.left = '';
        toggle.style.right = '';
        toggle.style.transform = 'none';
        nextButton.style.left = side === 'left' ? '30px' : 'auto';
        nextButton.style.right = side === 'right' ? '30px' : 'auto';
      }
    }

    let savedPosition = null;
    let toggleHintSeen = false;
    try {
      savedPosition = JSON.parse(localStorage.getItem(TOGGLE_POSITION_KEY) || 'null');
      toggleHintSeen = localStorage.getItem(TOGGLE_HINT_KEY) === '1';
    } catch (_) {}
    const savedTogglePosition = savedPosition && (savedPosition.side === 'left' || savedPosition.side === 'right')
      ? savedPosition
      : null;
    const initialTogglePosition = savedTogglePosition
      || { side: 'right', top: Math.max(8, window.innerHeight - 150) };
    applyTogglePosition(initialTogglePosition);
    if (!toggleHintSeen) toggle.classList.add('mufy-toggle-onboarding');

    let drag = null;
    toggle.addEventListener('pointerdown', event => {
      drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false };
      toggle.setPointerCapture?.(event.pointerId);
      toggle.classList.add('mufy-dragging');
    });
    toggle.addEventListener('pointermove', event => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.abs(dx) + Math.abs(dy) < 4) return;
      drag.moved = true;
      toggle.style.left = `${Math.max(8, Math.min(window.innerWidth - 54, event.clientX - 23))}px`;
      toggle.style.top = `${Math.max(8, Math.min(window.innerHeight - 54, event.clientY - 23))}px`;
      toggle.style.right = 'auto';
      toggle.style.bottom = 'auto';
      toggle.classList.remove('mufy-docked-left', 'mufy-docked-right');
    });
    const finishToggleDrag = event => {
      if (!drag || (event && event.pointerId != null && drag.pointerId !== event.pointerId)) return;
      const wasDragged = drag.moved;
      drag = null;
      toggle.classList.remove('mufy-dragging');
      if (!wasDragged) return;
      toggle.classList.add('mufy-just-dragged');
      const rect = toggle.getBoundingClientRect();
      const side = rect.left + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right';
      const top = clampToggleTop(rect.top);
      applyTogglePosition({ side, top });
      try { localStorage.setItem(TOGGLE_POSITION_KEY, JSON.stringify({ side, top })); } catch (_) {}
    };
    toggle.addEventListener('pointerup', finishToggleDrag);
    toggle.addEventListener('pointercancel', finishToggleDrag);
    toggle.addEventListener('lostpointercapture', finishToggleDrag);
    nextButton.onclick = event => {
      const close = event.target.closest?.('[data-close-next]');
      if (close) {
        event.preventDefault();
        event.stopPropagation();
        dismissManualFavoriteNext();
        return;
      }
      goToNextManualFavoriteChat();
    };
    nextButton.querySelector('[data-close-next]')?.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.stopPropagation();
      dismissManualFavoriteNext();
    });

    panel = document.createElement('div');
    panel.id = 'mufy-recovery-panel';
    panel.innerHTML = `<div id="mufy-recovery-resize-handle" title="上下拖动调整面板高度" aria-label="上下拖动调整面板高度"></div>
      <div id="mufy-recovery-head"><span id="mufy-recovery-title"><span id="mufy-recovery-section-nav" hidden><button id="mufy-recovery-section-back" aria-label="返回功能分区" title="返回功能分区">‹</button><strong id="mufy-recovery-section-title"></strong></span><span><span id="mufy-recovery-brand">Mufy 数据助手 <small class="mufy-recovery-version">v${DISPLAY_VERSION}</small></span> <small id="mufy-recovery-count">0/0</small></span><button id="mufy-recovery-help" title="使用说明" aria-label="使用说明">?</button></span><button id="mufy-recovery-log-entry" title="查看运行日志">日志</button><button id="mufy-recovery-history-entry" title="查看本账号历史角色索引">索引</button><button id="mufy-recovery-close">×</button></div>
      <div id="mufy-recovery-help-modal" hidden><div id="mufy-recovery-help-head"><strong>使用说明</strong><button id="mufy-recovery-help-close" title="关闭说明">×</button></div><div id="mufy-recovery-help-body"><ol>
<li><strong>找回聊过的角色：</strong>打开“角色”面板，点击“找回角色链接”。可以选择完整读取或查找最新几页；读取过程中可以点击“停止找回”，之后再继续读取，已读取的数据会保留。</li>
<li><strong>收藏趋势榜角色：</strong>打开 Mufy 趋势榜页面，再打开脚本面板。趋势榜返回的数据已经包含可靠的收藏状态，不需要点击“获取收藏状态”；直接在网页角色列表中多选要收藏的角色，点击“立即收藏”即可。收藏完成后回到“角色”区域点击“更新状态”，可核对这些角色的收藏和公开状态。</li>
<li><strong>收藏作者的全部角色：</strong>有两种方式，按需要选择一种即可：<ol><li>在“角色”→“作者合集”中找到对应作者，点击右侧收藏角色可选择收藏。</li><li>在 Mufy 网页搜索作者并进入作者主页，打开脚本面板；切到“网页”，让页面翻页自动获取角色。作者主页返回的收藏状态不准确，需要先点击“获取收藏状态”，等待逐个查询完成，再点击“全选未收藏”和“立即收藏”。</li></ol></li>
<li><strong>整理或删除收藏夹：</strong>进入“收藏”区域点击“收藏夹”，可以按作者创建或复用收藏夹并整理角色，也可以进入管理界面核对角色数量、筛选空收藏夹或批量删除。删除收藏夹不会取消角色收藏，且不能由脚本撤回。</li>
<li><strong>普通收藏：</strong>角色卡片右侧的星星可以收藏或取消收藏。收藏时会优先使用并保存当前账号的分享链接；没有分享链接时会提示并改用普通收藏。批量收藏结束会弹窗显示分享链接收藏数和普通收藏数。</li>
<li><strong>普通角色一键扣数：</strong>进入“收藏”→“普通待聊”，可以修改默认发送内容并启动“一键扣数”。脚本会逐个打开角色、发送一次消息，并等待回复生成结束且 URL 出现 sessionId 后再进入下一个；任务可以停止、继续或取消。</li>
<li><strong>完整导出当前聊天：</strong>进入一段已有 sessionId 的具体聊天，再到“聊天记录”点击“导出当前聊天”。脚本会直接分页读取服务器记录，按消息 ID 去重，并用服务器 total 与分页末尾双重校验；最终下载一个 ZIP，内含适合手机浏览器阅读的 HTML 和纯文字 TXT，不包含 JSON。再次点击可停止导出。</li>
<li><strong>根据聊天内容找角色：</strong>进入“聊天记录”点击“搜索聊天记录”，可选择搜索所有角色或指定单个角色。单角色允许搜索 1 个字，所有角色至少需要 2 个字。结果会标记关键词；点击“打开并定位”后进入原会话，自动向上加载并尝试滚动到对应消息。</li>
<li><strong>角色回复摘录：</strong>在角色回复里选中文字，展开该消息的省略号操作栏并点击“摘录”；不选文字时会把整条回复放进编辑框。摘录按角色组成牌组，进入“摘录/美化”选择“打开摘录”即可查看、编辑或导出；牌面样式从具体摘录牌内的“牌面样式”进入。</li>
<li><strong>面板美化：</strong>进入“摘录/美化”选择“打开美化”，可独立调整整个助手面板的主题、背景色、强调色、文字色、透明度、字号和圆角，不会修改摘录牌样式。</li>
<li><strong>账号快速切换：</strong>进入“账号切换”保存当前账号的邮箱与备注。切换时脚本会退出当前登录、打开 Mufy 官方登录窗口并填入目标邮箱；不会保存密码、Cookie 或登录令牌。</li>
<li><strong>模型可用性监控：</strong>在功能首页底部点击“模型监控”，勾选需要监控的模型。脚本每 5 分钟读取一次网站模型状态；悬浮按钮上方用绿、黄、红、灰色圆点分别表示流畅、拥堵、中断和暂时未知。点击状态点可查看响应时长、成功率和最后检测时间。</li>
<li><strong>导出分享链接：</strong>点击“导出角色”，再选择“仅分享链接 TXT”。角色 JSON/CSV 也会附带已保存的分享链接；独立 TXT 会导出当前账号缓存中的全部分享链接，包括当前角色列表里已经找不到但本地仍有记录的角色。</li>
<li><strong>收藏未聊转为链接收藏：</strong>进入“角色”→“收藏未聊”，点击“检测未记录角色”。分享链接记录按账号隔离，本账号已有记录的角色会直接跳过；其余角色严格一次处理一个：先保存分享链接，再取消原收藏，从分享链接进入并重新收藏。任务可以中断、继续或彻底取消。</li>
<li><strong>中断收藏：</strong>收藏任务运行时可点击“中断收藏”，选择保留剩余队列或彻底取消。脚本开关、浏览器关闭等原因留下的未完成任务不会自行恢复，必须手动选择“继续收藏”，也可以直接“取消任务”。</li>
<li><strong>面具保存：</strong>先直接在 Mufy 网站编写或保存面具。完成后打开脚本面板，点击顶部“面具”加载网站当前面具，然后点击“全部存入面具库”保存到本地；相同面具会自动去重。</li>
<li><strong>编辑和复制面具：</strong>“面具”和“面具库”列表都可以点击“编辑面具”，在大编辑板中一次修改全部字段。面具卡片右上角的 ⧉ 会复制完整信息；编辑板每个字段旁边的 ⧉ 只复制该项当前内容，包括尚未保存的修改。从网站面具进入时，“另存”会新增本地副本，“替换本地原面具”会更新对应副本；从面具库进入时，“保存修改”会直接更新当前面具并保留角色绑定，“另存”则新增一份。</li>
<li><strong>绑定面具：</strong>切到“面具库”，在需要使用的面具上点击“绑定角色”，选择角色即可。</li>
<li><strong>账号分区：</strong>面具库和角色绑定仍保存在当前浏览器本地，但会按 Mufy 账号分别保存。同一浏览器切换账号后会自动换到该账号自己的库；旧版公共库只迁移给升级时第一个识别到的账号。面板显示“未识别账号”时，请先打开任意角色聊天页让网站发出登录请求。</li>
<li><strong>面具导出/导入：</strong>面具库保存在浏览器本地，不会自动同步到其他浏览器，也不会自动复制到另一个 Mufy 账号。更换浏览器、账号或清除浏览器缓存前，请先点击“导出面具”保存文件；导出 JSON 时可选择是否同时复制角色绑定信息；导入时可选择清空旧面具库后导入，或保留旧数据合并导入，含绑定信息的文件还会询问是否恢复绑定；之后用“导入面具”恢复，防止本地面具数据丢失。</li>
<li><strong>更新作者和状态：</strong>点击“更新状态”会同时更新最近一次读取到的角色状态和作者名称；如果中途停止或部分失败，稍后再次点击同一个按钮即可继续补充。</li>
<li><strong>标签搜索：</strong>搜索框可直接输入标签文字，也可以使用 <code>#标签</code> 精确按标签筛选；多个标签用空格分隔且需要同时满足，使用 <code>-#标签</code> 可排除标签。角色卡片上的标签可以直接点击筛选。</li>
</ol></div></div>
      <div id="mufy-recovery-mask-editor" hidden>
        <div id="mufy-recovery-mask-editor-head"><strong id="mufy-recovery-mask-editor-title">编辑面具</strong><button id="mufy-recovery-mask-editor-close" title="关闭编辑">×</button></div>
        <div id="mufy-recovery-mask-editor-body">
          <label class="mufy-recovery-mask-editor-field"><span class="mufy-recovery-mask-editor-label"><span>备注</span><button type="button" class="mufy-recovery-mask-field-copy" data-copy-mask-field="remark" data-copy-mask-label="备注" title="复制备注" aria-label="复制备注">⧉</button></span><input name="remark" autocomplete="off"></label>
          <label class="mufy-recovery-mask-editor-field"><span class="mufy-recovery-mask-editor-label"><span>名称</span><button type="button" class="mufy-recovery-mask-field-copy" data-copy-mask-field="maskName" data-copy-mask-label="名称" title="复制名称" aria-label="复制名称">⧉</button></span><input name="maskName" autocomplete="off"></label>
          <label class="mufy-recovery-mask-editor-field is-wide"><span class="mufy-recovery-mask-editor-label"><span>性别</span><button type="button" class="mufy-recovery-mask-field-copy" data-copy-mask-field="gender" data-copy-mask-label="性别" title="复制性别" aria-label="复制性别">⧉</button></span><input name="gender" autocomplete="off"></label>
          <label class="mufy-recovery-mask-editor-field is-wide"><span class="mufy-recovery-mask-editor-label"><span>我的描述</span><button type="button" class="mufy-recovery-mask-field-copy" data-copy-mask-field="description" data-copy-mask-label="我的描述" title="复制我的描述" aria-label="复制我的描述">⧉</button></span><textarea name="description"></textarea></label>
          <label class="mufy-recovery-mask-editor-field is-wide"><span class="mufy-recovery-mask-editor-label"><span>我的喜好</span><button type="button" class="mufy-recovery-mask-field-copy" data-copy-mask-field="favorite" data-copy-mask-label="我的喜好" title="复制我的喜好" aria-label="复制我的喜好">⧉</button></span><textarea name="favorite"></textarea></label>
          <label class="mufy-recovery-mask-editor-field is-wide"><span class="mufy-recovery-mask-editor-label"><span>指令</span><button type="button" class="mufy-recovery-mask-field-copy" data-copy-mask-field="command" data-copy-mask-label="指令" title="复制指令" aria-label="复制指令">⧉</button></span><textarea name="command"></textarea></label>
          <div id="mufy-recovery-mask-editor-hint">编辑的是上方选中的网站面具，但保存只写入浏览器本地面具库。另存会新增一份；替换会删除面具库中的旧副本再写入当前内容，网站原面具不受影响。</div>
        </div>
        <div id="mufy-recovery-mask-editor-actions"><button id="mufy-recovery-mask-editor-save-as">另存为新面具</button><button id="mufy-recovery-mask-editor-replace">替换本地原面具</button></div>
      </div>
      <div id="mufy-recovery-favorite-interrupt-modal" hidden>
        <div id="mufy-recovery-favorite-interrupt-head"><strong>中断收藏任务</strong><button id="mufy-recovery-favorite-interrupt-close" title="继续当前任务">×</button></div>
        <div id="mufy-recovery-favorite-interrupt-body">请选择停止方式。已完成的收藏不会撤销；当前已经发出的请求可能完成，但选择后不会再开始下一个。</div>
        <div id="mufy-recovery-favorite-interrupt-actions"><button id="mufy-recovery-favorite-pause">停止并保留队列</button><button id="mufy-recovery-favorite-cancel-now">强制停止并清除任务</button></div>
      </div>
      <div id="mufy-recovery-quote-editor-modal" hidden>
        <div class="mufy-quote-modal-head"><span><strong>收藏摘录</strong><small>可以继续删减或修改选中的片段</small></span><button id="mufy-recovery-quote-editor-close" title="关闭">×</button></div>
        <div id="mufy-recovery-quote-editor-body"><div id="mufy-recovery-quote-editor-role"></div><textarea id="mufy-recovery-quote-editor-text" maxlength="20000" placeholder="输入要收藏的内容"></textarea></div>
        <div id="mufy-recovery-quote-editor-actions"><button id="mufy-recovery-quote-editor-cancel">取消</button><button id="mufy-recovery-quote-editor-save">收藏到牌组</button></div>
      </div>
      <div id="mufy-recovery-quote-library-modal" hidden>
        <div class="mufy-quote-modal-head" id="mufy-recovery-quote-library-head">
          <button id="mufy-recovery-quote-stage-close" title="返回" aria-label="返回" hidden>‹</button>
          <span><strong id="mufy-recovery-quote-stage-title">角色摘录牌组</strong><small id="mufy-recovery-quote-view-caption">按角色浏览摘录</small></span>
          <button id="mufy-recovery-quote-tools-toggle" title="管理摘录" aria-label="管理摘录" hidden>✎</button>
          <button id="mufy-recovery-quote-library-close" title="关闭" aria-label="关闭">×</button>
        </div>
        <div id="mufy-recovery-quote-library-body">
          <div id="mufy-recovery-quote-list"></div>
          <div id="mufy-recovery-quote-stage" hidden>
            <div id="mufy-recovery-quote-preview" role="button" tabindex="0"></div>
          </div>
          <div id="mufy-recovery-quote-management" hidden>
            <div id="mufy-recovery-quote-stage-edit-actions">
              <button id="mufy-recovery-quote-update">修改摘录文字 <span aria-hidden="true">›</span></button>
              <button id="mufy-recovery-quote-style-entry">调整牌面样式 <span aria-hidden="true">›</span></button>
              <div class="mufy-quote-export-options"><label>导出范围 <select id="mufy-recovery-quote-export-side"><option value="current">当前一面</option><option value="front">仅卡面</option><option value="back">仅卡背</option><option value="both">正反两面</option></select></label><button id="mufy-recovery-quote-export">导出 PNG</button></div>
              <button id="mufy-recovery-quote-source">打开来源 <span aria-hidden="true">↗</span></button>
              <button id="mufy-recovery-quote-delete">删除这张摘录</button>
            </div>
            <div id="mufy-recovery-quote-text-form" hidden>
              <label for="mufy-recovery-quote-inline-editor">摘录正文</label>
              <textarea id="mufy-recovery-quote-inline-editor" maxlength="20000"></textarea>
              <button id="mufy-recovery-quote-save-text">保存修改</button>
            </div>
          </div>
          <div id="mufy-recovery-quote-style-modal" hidden><div id="mufy-recovery-quote-style">
          <label class="mufy-quote-style-field">样式<select data-quote-style="theme"><option value="tarot">塔罗</option><option value="dark">简约深色</option><option value="paper">纸张</option><option value="rose">柔和花色</option><option value="book">书页 · 首行缩进</option></select></label>
          <label class="mufy-quote-style-field">字体<select data-quote-style="fontFamily"><option value="serif">衬线</option><option value="sans">简洁</option><option value="mono">等宽</option></select></label>
          <label class="mufy-quote-style-field">背景色<input data-quote-style="background" type="color"></label><label class="mufy-quote-style-field">文字色<input data-quote-style="textColor" type="color"></label>
          <label class="mufy-quote-style-field">装饰色<input data-quote-style="accent" type="color"></label><label class="mufy-quote-style-field">字号<input data-quote-style="fontSize" type="range" min="12" max="28" step="1"></label>
          <label class="mufy-quote-style-field">对齐<select data-quote-style="align"><option value="left">左对齐</option><option value="center">居中</option><option value="right">右对齐</option></select></label><label class="mufy-quote-style-check"><input data-quote-style="showRole" type="checkbox">显示角色名称</label>
        </div></div></div>
      </div>
      <div id="mufy-recovery-panel-beauty-modal" hidden><div id="mufy-recovery-panel-beauty-head"><span><strong>面板美化</strong><small id="mufy-recovery-panel-beauty-summary">选择已经完整适配的成套主题</small></span><button id="mufy-recovery-panel-beauty-close" title="关闭">×</button></div><div id="mufy-recovery-panel-beauty-fields"><label>成套主题<select data-panel-theme="preset"><option value="midnight">深夜紫灰</option><option value="rose">奶油粉</option><option value="mist">浅雾蓝</option><option value="sage">清浅绿</option><option value="black">纯黑</option></select></label><label>卡片层次<input data-panel-theme="opacity" type="range" min="72" max="100" step="1"></label><label>整体字号<input data-panel-theme="fontSize" type="range" min="11" max="17" step="1"></label><label>面板圆角<input data-panel-theme="radius" type="range" min="0" max="28" step="1"></label></div><div id="mufy-recovery-panel-beauty-actions"><button id="mufy-recovery-panel-beauty-reset">恢复默认</button><button id="mufy-recovery-panel-beauty-done">完成</button></div></div>
      <div id="mufy-recovery-model-modal" hidden><div id="mufy-recovery-model-head"><span><strong>模型可用性监控</strong><small id="mufy-recovery-model-summary">每 5 分钟检测一次</small></span><button id="mufy-recovery-model-close" title="关闭">×</button></div><div id="mufy-recovery-model-tools"><input id="mufy-recovery-model-search" placeholder="搜索模型名称"><button id="mufy-recovery-model-refresh">立即检测</button><label id="mufy-recovery-model-notify-label"><input id="mufy-recovery-model-notify" type="checkbox"><span id="mufy-recovery-model-notify-text">异常通知（可选）</span><small>仅在已选模型由正常变为拥堵或中断时提醒</small></label></div><div id="mufy-recovery-model-list"><div class="mufy-recovery-empty">正在读取模型状态…</div></div></div>
      <div id="mufy-recovery-material-editor" hidden><div id="mufy-recovery-material-editor-head"><strong id="mufy-recovery-material-editor-title">新增指令</strong><button id="mufy-recovery-material-editor-close" title="关闭">×</button></div><div id="mufy-recovery-material-editor-body"><label>标题<input id="mufy-recovery-material-title" maxlength="120" placeholder="例如：总结当前剧情"></label><label>内容<textarea id="mufy-recovery-material-content" maxlength="50000" placeholder="输入要填入聊天框的完整内容"></textarea></label></div><div id="mufy-recovery-material-editor-actions"><button id="mufy-recovery-material-editor-cancel">取消</button><button id="mufy-recovery-material-editor-save">保存</button></div></div>
      <div id="mufy-recovery-controls">
        <div id="mufy-recovery-section-home"><div id="mufy-recovery-section-home-head"><strong>选择功能分区</strong><small>进入后可通过返回按钮切换到其他分区</small></div><div id="mufy-recovery-section-cards"><button class="mufy-recovery-section-card" data-section="roles"><strong>角色</strong><small>找回、状态、收藏未聊、作者与标签</small></button><button class="mufy-recovery-section-card" data-section="favorites"><strong>收藏</strong><small>网页角色、普通待聊、一键扣数与收藏夹</small></button><button class="mufy-recovery-section-card" data-section="chats"><strong>聊天记录</strong><small>内容搜索与完整导出</small></button><button class="mufy-recovery-section-card" data-section="beauty"><strong>摘录/美化</strong><small>摘录牌与整体面板美化</small></button><button class="mufy-recovery-section-card" data-section="masks"><strong>面具</strong><small>面具库、编辑、绑定与导入导出</small></button><button class="mufy-recovery-section-card" data-section="accounts"><strong>账号切换</strong><small>一次登录一个账号，快速退出并填入另一个账号邮箱</small></button><button class="mufy-recovery-section-card" data-section="materials" data-material-home-kind="prompt"><strong>指令库</strong><small>保存常用指令，点击填入聊天输入框</small></button><button class="mufy-recovery-section-card" data-section="materials" data-material-home-kind="extra"><strong>番外库</strong><small>保存番外模板或内容，点击快速填入</small></button><button id="mufy-recovery-model-entry" class="mufy-recovery-section-card" title="选择并监控模型状态"><strong>模型监控</strong><small>选择模型并查看可用性、响应时间和成功率</small></button><button id="mufy-recovery-update-entry" class="mufy-recovery-section-card" title="检查并安装测试版更新"><strong>检查更新</strong><small id="mufy-recovery-update-text">当前 ${esc(SCRIPT_VERSION)} · 点击检查</small></button></div></div>
        <div id="mufy-recovery-status"></div>
        <div id="mufy-recovery-favorite-task-controls" hidden><button id="mufy-recovery-favorite-task-main">中断收藏</button><button id="mufy-recovery-favorite-task-cancel">取消任务</button></div>
        <div id="mufy-recovery-export-modal" hidden><div class="mufy-recovery-export-head"><strong>选择导出格式</strong><button id="mufy-recovery-export-close" title="关闭">×</button></div><label id="mufy-recovery-export-binding-option" class="mufy-recovery-export-binding-option" hidden><input id="mufy-recovery-export-bindings" type="checkbox" checked><span>同时导出角色的面具绑定信息</span></label><div id="mufy-recovery-export-binding-hint" class="mufy-recovery-export-binding-hint" hidden>绑定信息只支持 JSON；导入时会再询问是否恢复。</div><div class="mufy-recovery-export-options"><button data-export-format="csv">导出 CSV</button><button data-export-format="json">导出 JSON</button><button id="mufy-recovery-export-share-links" data-export-format="share-links">仅分享链接 TXT</button></div></div>
        <div id="mufy-recovery-chat-search-modal" hidden><div id="mufy-recovery-chat-search-head"><strong>根据聊天内容找角色</strong><button id="mufy-recovery-chat-search-close" title="关闭">×</button></div><div id="mufy-recovery-chat-search-fields"><label>要查找的聊天文字<input id="mufy-recovery-chat-search-query" type="text" maxlength="500" placeholder="单角色可搜 1 字；所有角色至少 2 字"></label><label>搜索范围<select id="mufy-recovery-chat-search-scope"><option value="all">所有角色</option><option value="one">指定单个角色</option></select></label><label id="mufy-recovery-chat-search-role-label" hidden>选择角色<select id="mufy-recovery-chat-search-role"></select></label></div><div id="mufy-recovery-chat-search-actions"><button id="mufy-recovery-chat-search-start">开始搜索</button></div></div>
        <div id="mufy-recovery-author-favorite-modal" hidden><div id="mufy-recovery-author-favorite-head"><strong>选择收藏范围</strong><button id="mufy-recovery-author-favorite-close" title="关闭">×</button></div><div id="mufy-recovery-author-favorite-options"><button data-author-favorite-mode="all">收藏该作者所有作品</button><button data-author-favorite-mode="panel">仅收藏面板记录的这些</button></div></div>
        <div id="mufy-recovery-folder-menu-modal" hidden><div id="mufy-recovery-folder-menu-head"><strong>收藏夹功能</strong><button id="mufy-recovery-folder-menu-close" title="关闭">×</button></div><div id="mufy-recovery-folder-menu-actions"><button id="mufy-recovery-folder-menu-organize">按作者整理收藏夹</button><button id="mufy-recovery-folder-menu-manage">管理 / 删除收藏夹</button></div></div>
        <div id="mufy-recovery-folder-delete-modal" hidden><div id="mufy-recovery-folder-delete-head"><strong>管理 / 批量删除收藏夹</strong><button id="mufy-recovery-folder-delete-close" title="关闭">×</button></div><div id="mufy-recovery-folder-delete-summary">读取收藏夹后显示准确的角色数量。</div><label id="mufy-recovery-folder-delete-filter"><input id="mufy-recovery-folder-delete-empty-only" type="checkbox" checked>只看空收藏夹</label><div id="mufy-recovery-folder-delete-list"><div class="mufy-recovery-folder-delete-empty">尚未读取收藏夹</div></div><div id="mufy-recovery-folder-delete-actions"><button id="mufy-recovery-folder-delete-select-all">全选当前</button><button id="mufy-recovery-folder-delete-clear">清空选择</button><button id="mufy-recovery-folder-delete-empty">一键删除空夹 (0)</button><button id="mufy-recovery-folder-delete-confirm">删除已选 (0)</button></div></div>
        <div id="mufy-recovery-log-modal" hidden><div id="mufy-recovery-log-head"><span><strong>运行日志</strong><button id="mufy-recovery-copy-error-logs">复制反馈日志</button><button id="mufy-recovery-clear-logs">清除日志</button></span><button id="mufy-recovery-log-close" title="关闭">×</button></div><div id="mufy-recovery-log-output"><div class="mufy-recovery-log-empty">暂无运行日志</div></div></div>
        <div id="mufy-recovery-role-section">
          <div id="mufy-recovery-role-filter-row"><input id="mufy-recovery-role-search" placeholder="搜索角色名、作者、ID或标签"><select id="mufy-recovery-status-filter" aria-label="按角色状态筛选"></select></div>
          <div id="mufy-recovery-tabs"><button class="active" data-category="allRoles">全部角色 (0)</button><button data-category="chatted">聊过的 (0)</button><button data-category="chattedNotFavorite">聊过未收藏 (0)</button><button data-category="favoriteOnly">收藏未聊 (0)</button><button data-category="authors">作者合集 (0)</button></div>
          <div id="mufy-recovery-role-actions"><button id="mufy-recovery-run">找回角色链接</button><button id="mufy-recovery-refresh-status" title="更新最近一次链接读取到的角色状态和作者名称">更新状态</button><details id="mufy-recovery-role-more"><summary>更多</summary><div><div id="mufy-recovery-role-read-options"><span>读取方式</span><select id="mufy-recovery-role-read-mode" aria-label="角色读取方式"><option value="full">完整读取</option><option value="latest">查找最新几页</option></select><label>页数 <input id="mufy-recovery-role-latest-pages" type="number" min="1" max="500" value="2" aria-label="读取页数"></label><span>每页 20 个</span></div><button id="mufy-recovery-export-roles" class="mufy-recovery-tab-action">导出角色</button></div></details></div>
          <button id="mufy-recovery-favorite-visible" hidden>收藏当前列表</button><div id="mufy-recovery-share-recovery-controls" hidden><button id="mufy-recovery-share-recovery-one">检测全部收藏未聊</button><button id="mufy-recovery-share-recovery-cancel" hidden>取消任务</button></div>
        </div>
        <div id="mufy-recovery-favorite-section" hidden>
          <div id="mufy-recovery-favorite-tabs"><button data-category="manualFavoriteChats">普通待聊 (0)</button><button data-category="siteSearch">网站角色 (0)</button><button data-category="siteAuthors">网站作者 (0)</button></div>
          <div id="mufy-recovery-favorite-actions"><button id="mufy-recovery-stop-action" title="整理或管理收藏夹">收藏夹</button></div>
          <label id="mufy-recovery-auto-folder-label"><input id="mufy-recovery-auto-add-favorite-folder" type="checkbox"><span>收藏后自动放入收藏夹<small>关闭后仍会正常收藏角色，只是不再自动按作者归入收藏夹；手动整理功能不受影响。</small></span></label>
          <div id="mufy-recovery-site-actions"><button id="mufy-recovery-refresh-favorite-states">获取收藏状态</button><button id="mufy-recovery-select-unfavorite-site">全选未收藏</button><button id="mufy-recovery-favorite-selected-site">立即收藏 (0)</button><button id="mufy-recovery-clear-site-selection">清空勾选</button><button id="mufy-recovery-refresh-site-rows" title="刷新当前网站页面并重新捕获，之后翻页会继续自动获取">重新获取</button><button id="mufy-recovery-clear-site-rows">清空结果</button></div>
          <div id="mufy-recovery-manual-auto-actions" hidden><input id="mufy-recovery-manual-auto-message" type="text" maxlength="500" value="${esc(state.manualAutoChatMessage)}" aria-label="一键扣数发送内容"><label class="mufy-recovery-auto-delay">间隔 <input id="mufy-recovery-manual-auto-delay-min" type="number" min="0" max="300" step="1" value="${esc(state.manualAutoChatDelayMin)}" aria-label="随机冷却最短秒数">～<input id="mufy-recovery-manual-auto-delay-max" type="number" min="0" max="300" step="1" value="${esc(state.manualAutoChatDelayMax)}" aria-label="随机冷却最长秒数"> 秒</label><button id="mufy-recovery-manual-auto-start">一键扣数</button><button id="mufy-recovery-manual-auto-cancel" hidden>取消任务</button><button id="mufy-recovery-manual-chat-next" title="按普通待聊列表顺序打开角色；再次点击视为当前角色已处理并前往下一个">下一个</button></div>
        </div>
        <div id="mufy-recovery-chat-section" hidden>
          <div id="mufy-recovery-chat-tabs"><button data-category="chatMatches">搜索结果 (0)</button></div>
          <div id="mufy-recovery-chat-tools"><button id="mufy-recovery-chat-search" title="根据聊天内容查找角色">搜索聊天记录</button><button id="mufy-recovery-export-chat" title="进入一段具体聊天后可完整导出当前会话">导出当前聊天</button></div>
        </div>
        <div id="mufy-recovery-beauty-section" hidden><div class="mufy-recovery-section-note"><strong>摘录 / 面板美化</strong><span>两个功能相互独立：摘录管理角色卡片，面板美化调整整个助手界面。</span></div><div id="mufy-recovery-beauty-launchers"><button id="mufy-recovery-quote-entry" class="mufy-beauty-launch"><strong>打开摘录</strong><small>查看、编辑和导出角色摘录牌；牌面样式从摘录内部进入</small></button><button id="mufy-recovery-panel-beauty-entry" class="mufy-beauty-launch"><strong>打开美化</strong><small>调整整个助手面板的主题、颜色、透明度、字号和圆角</small></button></div></div>
        <div id="mufy-recovery-account-section" hidden><div class="mufy-recovery-section-note"><strong>账号快速切换</strong><span>一次只登录一个账号。脚本仅在本机保存邮箱与备注，不保存密码、Cookie 或登录令牌。</span></div><div id="mufy-recovery-account-current"></div><div id="mufy-recovery-account-tools"><button id="mufy-recovery-account-save">保存当前账号</button></div><div id="mufy-recovery-account-list"></div><small class="mufy-recovery-account-hint">点击“切换”后会退出当前登录、打开 Mufy 官方登录窗口并填入目标邮箱；密码仍由 Edge 自动填充或由你手动输入。</small></div>
        <div id="mufy-recovery-material-section" hidden><div id="mufy-recovery-material-tabs"><button data-material-kind="prompt">指令库</button><button data-material-kind="extra">番外库</button></div><div id="mufy-recovery-material-tools"><button id="mufy-recovery-material-add">新增指令</button><button id="mufy-recovery-material-import">导入 JSON</button><button id="mufy-recovery-material-export">导出 JSON</button><input id="mufy-recovery-material-file" type="file" accept=".json,application/json" hidden></div><div id="mufy-recovery-material-list"></div></div>
        <div id="mufy-recovery-mask-section" hidden>
          <div id="mufy-recovery-mask-tabs"><button data-category="masks">面具 (0)</button><button data-category="library">面具库 (0)</button><button id="mufy-recovery-save-all" class="mufy-recovery-tab-action">全部存入面具库</button></div>
          <input id="mufy-recovery-mask-search" placeholder="搜索面具名或面具 ID" hidden>
          <label id="mufy-recovery-auto-switch-label"><input id="mufy-recovery-auto-switch" type="checkbox"> 自动切换绑定面具</label>
          <div id="mufy-recovery-mask-actions"><button id="mufy-recovery-import-masks">导入面具</button><button id="mufy-recovery-export-masks">导出面具</button><button id="mufy-recovery-undo" class="mufy-recovery-tab-action" disabled>撤回上次操作</button><input id="mufy-recovery-mask-file" type="file" accept=".json,application/json" hidden></div>
        </div>
      </div><div id="mufy-recovery-list"></div><div id="mufy-recovery-resize-handle-bottom" title="上下拖动调整面板高度" aria-label="上下拖动调整面板高度"></div>`;
    panel.style.display = 'none';
    document.body.appendChild(panel);
    pageWindow.__mufyRecoveryPanelVersion = SCRIPT_VERSION;
    applyPanelTheme();

    const resizeHandle = panel.querySelector('#mufy-recovery-resize-handle');
    const resizeHandleBottom = panel.querySelector('#mufy-recovery-resize-handle-bottom');
    const minPanelHeight = 300;
    const maxPanelHeight = () => Math.max(minPanelHeight, Math.floor(window.innerHeight * 0.9));
    const clampPanelHeight = value => Math.max(minPanelHeight, Math.min(maxPanelHeight(), Number(value) || minPanelHeight));
    const clampPanelBottom = value => Math.max(8, Math.min(Math.max(8, window.innerHeight - minPanelHeight), Number(value) || 62));
    let savedPanelSize = null;
    try { savedPanelSize = JSON.parse(localStorage.getItem(PANEL_HEIGHT_KEY) || 'null'); } catch (_) {}
    const initialHeight = clampPanelHeight(savedPanelSize?.height || Math.min(Math.max(Math.floor(window.innerHeight * 0.72), 360), maxPanelHeight()));
    panel.style.height = `${initialHeight}px`;
    if (Number.isFinite(Number(savedPanelSize?.bottom))) panel.style.bottom = `${clampPanelBottom(savedPanelSize.bottom)}px`;

    let panelResize = null;
    const finishPanelResize = event => {
      if (!panelResize || (event && event.pointerId !== panelResize.pointerId)) return;
      const height = clampPanelHeight(panel.getBoundingClientRect().height);
      const bottom = clampPanelBottom(parseFloat(getComputedStyle(panel).bottom));
      panel.style.height = `${height}px`;
      panel.style.bottom = `${bottom}px`;
      try { localStorage.setItem(PANEL_HEIGHT_KEY, JSON.stringify({ height, bottom })); } catch (_) {}
      panel.classList.remove('is-resizing');
      panelResize = null;
    };
    const startPanelResize = (handle, edge, event) => {
      panelResize = { pointerId: event.pointerId, edge, startY: event.clientY, startHeight: panel.getBoundingClientRect().height, startBottom: clampPanelBottom(parseFloat(getComputedStyle(panel).bottom)) };
      handle.setPointerCapture?.(event.pointerId);
      panel.classList.add('is-resizing');
      event.preventDefault();
    };
    const movePanelResize = event => {
      if (!panelResize || event.pointerId !== panelResize.pointerId) return;
      const pointerDelta = panelResize.edge === 'top'
        ? panelResize.startY - event.clientY
        : event.clientY - panelResize.startY;
      const nextHeight = clampPanelHeight(panelResize.startHeight + pointerDelta);
      panel.style.height = `${nextHeight}px`;
      if (panelResize.edge === 'bottom') {
        const appliedDelta = nextHeight - panelResize.startHeight;
        panel.style.bottom = `${clampPanelBottom(panelResize.startBottom - appliedDelta)}px`;
      }
      event.preventDefault();
    };
    resizeHandle.addEventListener('pointerdown', startPanelResize.bind(null, resizeHandle, 'top'));
    resizeHandleBottom.addEventListener('pointerdown', startPanelResize.bind(null, resizeHandleBottom, 'bottom'));
    resizeHandle.addEventListener('pointermove', movePanelResize);
    resizeHandleBottom.addEventListener('pointermove', movePanelResize);
    resizeHandle.addEventListener('pointerup', finishPanelResize);
    resizeHandleBottom.addEventListener('pointerup', finishPanelResize);
    resizeHandle.addEventListener('pointercancel', finishPanelResize);
    resizeHandleBottom.addEventListener('pointercancel', finishPanelResize);
    addMountedGlobalListener(window, 'resize', () => {
      if (!panelResize) {
        panel.style.height = `${clampPanelHeight(panel.getBoundingClientRect().height)}px`;
        panel.style.bottom = `${clampPanelBottom(parseFloat(getComputedStyle(panel).bottom))}px`;
      }
      if (toggle.classList.contains('mufy-toggle-onboarding')) {
        applyTogglePosition({ side: 'center', top: window.innerHeight / 2 - 23 });
      } else {
        const rect = toggle.getBoundingClientRect();
        const side = rect.left + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right';
        applyTogglePosition({ side, top: rect.top });
      }
    });

    toggle.onclick = () => {
      if (toggle.classList.contains('mufy-just-dragged')) {
        toggle.classList.remove('mufy-just-dragged');
        return;
      }
      if (toggle.classList.contains('mufy-toggle-onboarding')) {
        toggle.classList.remove('mufy-toggle-onboarding');
        try { localStorage.setItem(TOGGLE_HINT_KEY, '1'); } catch (_) {}
      }
      const opening = panel.style.display === 'none';
      if (opening) {
        state.section = 'home';
        render();
      }
      panel.style.display = opening ? 'flex' : 'none';
    };
    panel.querySelector('#mufy-recovery-close').onclick = () => { panel.style.display = 'none'; };
    panel.querySelector('#mufy-recovery-export-chat').onclick = exportCurrentChat;
    panel.querySelector('#mufy-recovery-quote-entry').onclick = openQuoteLibraryModal;
    const panelBeautyModal = panel.querySelector('#mufy-recovery-panel-beauty-modal');
    const closePanelBeauty = () => { panelBeautyModal.hidden = true; };
    panel.querySelector('#mufy-recovery-panel-beauty-entry').onclick = () => {
      renderPanelBeautyControls();
      panelBeautyModal.hidden = false;
    };
    panel.querySelector('#mufy-recovery-panel-beauty-close').onclick = closePanelBeauty;
    panel.querySelector('#mufy-recovery-panel-beauty-done').onclick = closePanelBeauty;
    panel.querySelector('#mufy-recovery-panel-beauty-reset').onclick = () => {
      state.panelTheme = defaultPanelTheme();
      savePanelTheme();
      applyPanelTheme();
      renderPanelBeautyControls();
      showRecoveryNotice('已恢复默认面板样式。');
    };
    panel.querySelectorAll('[data-panel-theme]').forEach(control => {
      const updatePanelTheme = () => {
        const key = String(control.dataset.panelTheme || '');
        if (key === 'preset') {
          const requestedPreset = String(control.value || 'midnight');
          const presetName = Object.prototype.hasOwnProperty.call(PANEL_THEME_PRESETS, requestedPreset) ? requestedPreset : 'midnight';
          state.panelTheme = normalizePanelTheme({ ...state.panelTheme, ...PANEL_THEME_PRESETS[presetName], preset: presetName });
        } else {
          const value = control.type === 'range' ? Number(control.value) : control.value;
          state.panelTheme = normalizePanelTheme({ ...state.panelTheme, [key]: value });
        }
        savePanelTheme();
        applyPanelTheme();
        renderPanelBeautyControls();
      };
      control.addEventListener(control.type === 'range' || control.type === 'color' ? 'input' : 'change', updatePanelTheme);
    });
    const quoteEditorModal = panel.querySelector('#mufy-recovery-quote-editor-modal');
    const closeQuoteEditor = () => {
      quoteEditorModal.hidden = true;
      quoteDraftContext = null;
    };
    panel.querySelector('#mufy-recovery-quote-editor-close').onclick = closeQuoteEditor;
    panel.querySelector('#mufy-recovery-quote-editor-cancel').onclick = closeQuoteEditor;
    panel.querySelector('#mufy-recovery-quote-editor-save').onclick = saveQuoteDraft;
    const quoteLibraryModal = panel.querySelector('#mufy-recovery-quote-library-modal');
    panel.querySelector('#mufy-recovery-quote-library-close').onclick = () => {
      quoteLibraryModal.hidden = true;
    };
    panel.querySelector('#mufy-recovery-quote-style-entry').onclick = () => {
      quoteStyleOpen = true;
      renderQuoteLibraryModal();
    };
    panel.querySelector('#mufy-recovery-quote-list').onclick = event => {
      const deck = event.target.closest?.('[data-quote-deck]');
      if (deck) {
        quoteOpenDeckId = String(deck.dataset.quoteDeck || '');
        state.quoteSelectedId = '';
        quoteStageOpen = false;
        quotePreviewFlipped = false;
        quoteInlineEditing = false;
        quoteToolsOpen = false;
        renderQuoteLibraryModal();
        return;
      }
      const item = event.target.closest?.('[data-quote-id]');
      if (!item) return;
      state.quoteSelectedId = String(item.dataset.quoteId || '');
      quoteStageOpen = true;
      quotePreviewFlipped = false;
      quoteInlineEditing = false;
      quoteToolsOpen = false;
      renderQuoteLibraryModal();
    };
    panel.querySelector('#mufy-recovery-quote-stage-close').onclick = () => {
      if (quoteStyleOpen) quoteStyleOpen = false;
      else if (quoteInlineEditing) quoteInlineEditing = false;
      else if (quoteToolsOpen) quoteToolsOpen = false;
      else quoteStageOpen = false;
      renderQuoteLibraryModal();
    };
    panel.querySelector('#mufy-recovery-quote-tools-toggle').onclick = () => {
      quoteToolsOpen = true;
      renderQuoteLibraryModal();
    };
    const quotePreview = panel.querySelector('#mufy-recovery-quote-preview');
    quotePreview.onclick = () => {
      quotePreviewFlipped = !quotePreviewFlipped;
      renderQuoteLibraryModal();
    };
    quotePreview.onkeydown = event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      quotePreview.click();
    };
    panel.querySelectorAll('[data-quote-style]').forEach(control => {
      const updateQuoteStyle = () => {
        const key = control.dataset.quoteStyle;
        const value = control.type === 'checkbox' ? control.checked : control.type === 'range' ? Number(control.value) : control.value;
        state.quoteStyle = { ...state.quoteStyle, [key]: value };
        saveQuoteStyle();
        renderQuoteLibraryModal();
      };
      control.addEventListener(control.type === 'range' || control.type === 'color' ? 'input' : 'change', updateQuoteStyle);
    });
    panel.querySelector('#mufy-recovery-quote-delete').onclick = deleteSelectedQuote;
    panel.querySelector('#mufy-recovery-quote-source').onclick = openSelectedQuoteSource;
    panel.querySelector('#mufy-recovery-quote-update').onclick = () => {
      const editor = panel.querySelector('#mufy-recovery-quote-inline-editor');
      editor.value = selectedQuoteCard()?.text || '';
      quoteInlineEditing = true;
      renderQuoteLibraryModal();
      editor.focus();
    };
    panel.querySelector('#mufy-recovery-quote-save-text').onclick = updateSelectedQuoteText;
    panel.querySelector('#mufy-recovery-quote-export').onclick = exportSelectedQuoteImage;
    panel.querySelectorAll('[data-material-kind]').forEach(button => {
      button.onclick = () => {
        state.materialKind = button.dataset.materialKind === 'extra' ? 'extra' : 'prompt';
        state.materialEditingId = '';
        renderMaterialSection();
      };
    });
    panel.querySelector('#mufy-recovery-material-add').onclick = () => openMaterialEditor();
    panel.querySelector('#mufy-recovery-material-export').onclick = exportMaterialLibrary;
    panel.querySelector('#mufy-recovery-material-import').onclick = () => panel.querySelector('#mufy-recovery-material-file').click();
    panel.querySelector('#mufy-recovery-material-file').onchange = event => {
      importMaterialLibrary(event.target.files?.[0]);
      event.target.value = '';
    };
    const materialEditor = panel.querySelector('#mufy-recovery-material-editor');
    const closeMaterialEditor = () => { materialEditor.hidden = true; state.materialEditingId = ''; };
    panel.querySelector('#mufy-recovery-material-editor-close').onclick = closeMaterialEditor;
    panel.querySelector('#mufy-recovery-material-editor-cancel').onclick = closeMaterialEditor;
    panel.querySelector('#mufy-recovery-material-editor-save').onclick = saveMaterialEditor;
    panel.querySelector('#mufy-recovery-material-list').onclick = event => {
      const edit = event.target.closest?.('[data-material-edit]');
      if (edit) { openMaterialEditor(String(edit.dataset.materialEdit || '')); return; }
      const remove = event.target.closest?.('[data-material-delete]');
      if (remove) {
        const id = String(remove.dataset.materialDelete || '');
        const rows = activeMaterialRows();
        const row = rows.find(item => item.id === id);
        if (!row || !pageWindow.confirm(`确定删除“${row.title}”吗？`)) return;
        rows.splice(rows.indexOf(row), 1);
        saveMaterialLibraries();
        state.status = `已删除“${row.title}”。`;
        showRecoveryNotice(state.status);
        renderMaterialSection();
        return;
      }
      const card = event.target.closest?.('[data-material-fill]');
      if (card) fillMaterialIntoComposer(String(card.dataset.materialFill || ''));
    };
    panel.querySelector('#mufy-recovery-account-save').onclick = saveCurrentAccountShortcut;
    panel.querySelector('#mufy-recovery-account-list').onclick = event => {
      const markButton = event.target.closest?.('[data-account-mark-current]');
      if (markButton) { markSavedAccountCurrent(String(markButton.dataset.accountMarkCurrent || '')); return; }
      const switchButton = event.target.closest?.('[data-account-switch]');
      if (switchButton) { switchToSavedAccount(String(switchButton.dataset.accountSwitch || '')); return; }
      const editButton = event.target.closest?.('[data-account-edit]');
      if (editButton) { editSavedAccount(String(editButton.dataset.accountEdit || '')); return; }
      const deleteButton = event.target.closest?.('[data-account-delete]');
      if (deleteButton) deleteSavedAccount(String(deleteButton.dataset.accountDelete || ''));
    };
    const modelModal = panel.querySelector('#mufy-recovery-model-modal');
    const openModelMonitor = () => {
      panel.style.display = 'flex';
      modelModal.hidden = false;
      renderModelMonitorModal();
      if (!state.modelMonitorRows.length) checkModelMonitor(true);
    };
    panel.querySelector('#mufy-recovery-model-entry').onclick = openModelMonitor;
    panel.querySelector('#mufy-recovery-update-entry').onclick = handleScriptUpdateEntry;
    panel.querySelector('#mufy-recovery-model-close').onclick = () => { modelModal.hidden = true; };
    panel.querySelector('#mufy-recovery-model-refresh').onclick = () => checkModelMonitor(true);
    panel.querySelector('#mufy-recovery-model-notify').onchange = event => setModelMonitorNotify(event.target.checked);
    panel.querySelector('#mufy-recovery-model-search').oninput = renderModelMonitorModal;
    panel.querySelector('#mufy-recovery-model-list').onchange = event => {
      const checkbox = event.target.closest?.('[data-model-monitor-id]');
      if (!checkbox) return;
      const id = String(checkbox.dataset.modelMonitorId || '');
      if (checkbox.checked) state.modelMonitorSelectedIds.add(id);
      else state.modelMonitorSelectedIds.delete(id);
      saveModelMonitorSelection();
      renderModelMonitorModal();
    };
    toggle.querySelector('#mufy-recovery-model-dots').onclick = event => {
      event.preventDefault();
      event.stopPropagation();
      openModelMonitor();
    };
    panel.querySelector('#mufy-recovery-history-entry').onclick = () => {
      state.section = 'roles';
      state.active = 'roleHistory';
      state.roleQuery = '';
      render();
    };
    const helpModal = panel.querySelector('#mufy-recovery-help-modal');
    panel.querySelector('#mufy-recovery-help').onclick = () => { helpModal.hidden = false; };
    panel.querySelector('#mufy-recovery-help-close').onclick = () => { helpModal.hidden = true; };
    const authorFavoriteModal = panel.querySelector('#mufy-recovery-author-favorite-modal');
    panel.querySelector('#mufy-recovery-author-favorite-close').onclick = () => { authorFavoriteModal.hidden = true; state.authorFavoriteGroup = null; };
    const folderMenuModal = panel.querySelector('#mufy-recovery-folder-menu-modal');
    panel.querySelector('#mufy-recovery-folder-menu-close').onclick = () => { folderMenuModal.hidden = true; };
    panel.querySelector('#mufy-recovery-folder-menu-organize').onclick = () => {
      folderMenuModal.hidden = true;
      organizeAuthorFoldersNow();
    };
    panel.querySelector('#mufy-recovery-folder-menu-manage').onclick = () => {
      folderMenuModal.hidden = true;
      openFavoriteFolderDeleteModal();
    };
    const folderDeleteModal = panel.querySelector('#mufy-recovery-folder-delete-modal');
    panel.querySelector('#mufy-recovery-folder-delete-close').onclick = () => {
      if (!state.favoriteFolderDeleteLoading) folderDeleteModal.hidden = true;
    };
    panel.querySelector('#mufy-recovery-folder-delete-select-all').onclick = () => {
      state.favoriteFolderDeleteRows
        .filter(folder => !state.favoriteFolderDeleteEmptyOnly || (folder?._countVerified === true && favoriteFolderCount(folder) === 0))
        .forEach(folder => state.selectedFavoriteFolderIds.add(favoriteFolderId(folder)));
      renderFavoriteFolderDeleteModal();
    };
    panel.querySelector('#mufy-recovery-folder-delete-clear').onclick = () => {
      state.selectedFavoriteFolderIds.clear();
      renderFavoriteFolderDeleteModal();
    };
    panel.querySelector('#mufy-recovery-folder-delete-empty-only').onchange = event => {
      state.favoriteFolderDeleteEmptyOnly = Boolean(event.target.checked);
      renderFavoriteFolderDeleteModal();
    };
    panel.querySelector('#mufy-recovery-folder-delete-empty').onclick = deleteEmptyFavoriteFolders;
    panel.querySelector('#mufy-recovery-folder-delete-confirm').onclick = deleteSelectedFavoriteFolders;
    panel.querySelector('#mufy-recovery-folder-delete-list').onchange = event => {
      const checkbox = event.target.closest?.('[data-folder-delete-id]');
      if (!checkbox) return;
      const id = String(checkbox.dataset.folderDeleteId || '');
      if (checkbox.checked) state.selectedFavoriteFolderIds.add(id);
      else state.selectedFavoriteFolderIds.delete(id);
      renderFavoriteFolderDeleteModal();
    };
    const logModal = panel.querySelector('#mufy-recovery-log-modal');
    panel.querySelector('#mufy-recovery-log-entry').onclick = openRunLogModal;
    panel.querySelector('#mufy-recovery-log-close').onclick = () => { logModal.hidden = true; };
    panel.querySelector('#mufy-recovery-clear-logs').onclick = clearRunLogs;
    panel.querySelector('#mufy-recovery-copy-error-logs').onclick = copyErrorLogs;
    panel.querySelector('#mufy-recovery-mask-editor-close').onclick = closeMaskEditor;
    panel.querySelector('#mufy-recovery-mask-editor-save-as').onclick = () => saveMaskEditor('save-as');
    panel.querySelector('#mufy-recovery-mask-editor-replace').onclick = () => saveMaskEditor('replace');
    panel.querySelectorAll('[data-copy-mask-field]').forEach(button => {
      button.onclick = event => {
        event.preventDefault();
        event.stopPropagation();
        copyMaskEditorField(button.dataset.copyMaskField, button.dataset.copyMaskLabel || '当前字段');
      };
    });
    const favoriteInterruptModal = panel.querySelector('#mufy-recovery-favorite-interrupt-modal');
    panel.querySelector('#mufy-recovery-favorite-interrupt-close').onclick = () => { favoriteInterruptModal.hidden = true; };
    panel.querySelector('#mufy-recovery-favorite-pause').onclick = () => requestFavoriteInterruption('pause');
    panel.querySelector('#mufy-recovery-favorite-cancel-now').onclick = () => requestFavoriteInterruption('cancel');
    panel.querySelector('#mufy-recovery-favorite-task-main').onclick = () => {
      if (state.favoriteRunning) favoriteInterruptModal.hidden = false;
      else resumeFavoriteJob();
    };
    panel.querySelector('#mufy-recovery-favorite-task-cancel').onclick = cancelPausedFavoriteJob;
    panel.querySelectorAll('[data-author-favorite-mode]').forEach(button => {
      button.onclick = () => chooseAuthorFavoriteMode(button.dataset.authorFavoriteMode);
    });
    panel.querySelector('#mufy-recovery-run').onclick = () => recoverRoles();
    panel.querySelector('#mufy-recovery-refresh-status').onclick = () => {
      if (state.metadataTask === 'status') requestMetadataStop();
      else refreshRoleStatuses();
    };
    panel.querySelector('#mufy-recovery-stop-action').onclick = () => {
      if (state.roleLoading) pauseRoleReading();
      else folderMenuModal.hidden = false;
    };
    panel.querySelector('#mufy-recovery-auto-add-favorite-folder').onchange = event => setAutoAddFavoriteFolderSetting(event.target.checked);
    panel.querySelector('#mufy-recovery-favorite-visible').onclick = () => favoriteRows(state.visibleRows, '当前列表');
    panel.querySelector('#mufy-recovery-share-recovery-one').onclick = async () => {
      const recoveryTask = loadFavoriteShareRecoveryJob();
      if (state.shareRecoveryLoading && recoveryTask) requestFavoriteShareRecoveryPause();
      else await startFavoriteShareRecoveryJob();
    };
    panel.querySelector('#mufy-recovery-share-recovery-cancel').onclick = () => cancelFavoriteShareRecoveryJob();
    panel.querySelector('#mufy-recovery-undo').onclick = undoLastLibraryChange;
    panel.querySelector('#mufy-recovery-save-all').onclick = addAllMasksToLibrary;
    const exportModal = panel.querySelector('#mufy-recovery-export-modal');
    const exportBindingOption = panel.querySelector('#mufy-recovery-export-binding-option');
    const exportBindingHint = panel.querySelector('#mufy-recovery-export-binding-hint');
    const exportBindingsCheckbox = panel.querySelector('#mufy-recovery-export-bindings');
    const exportShareLinksButton = panel.querySelector('#mufy-recovery-export-share-links');
    let exportModalTarget = 'roles';
    const openExportModal = target => {
      exportModalTarget = target;
      const isMasks = target === 'masks';
      exportBindingOption.hidden = !isMasks;
      exportBindingHint.hidden = !isMasks;
      exportShareLinksButton.hidden = isMasks;
      exportModal.hidden = false;
    };
    panel.querySelector('#mufy-recovery-export-roles').onclick = () => openExportModal('roles');
    panel.querySelector('#mufy-recovery-export-masks').onclick = () => openExportModal('masks');
    panel.querySelector('#mufy-recovery-export-close').onclick = () => { exportModal.hidden = true; };
    panel.querySelectorAll('[data-export-format]').forEach(button => {
      button.onclick = async () => {
        exportModal.hidden = true;
        try {
          if (exportModalTarget === 'masks') {
            if (button.dataset.exportFormat === 'csv') {
              exportMasksCsv();
              if (exportBindingsCheckbox.checked && state.maskBindings.length) {
                state.status += ' CSV 不包含绑定信息；如需保留绑定，请选择 JSON。';
                render();
              }
            } else {
              exportMasksJson(exportBindingsCheckbox.checked);
            }
          } else if (button.dataset.exportFormat === 'share-links') exportSavedShareLinks();
          else if (button.dataset.exportFormat === 'csv') await exportRolesCsv();
          else await exportRolesJson();
        } catch (error) {
          console.error('[Mufy recovery] export failed:', error);
          appendRunLog('error', '导出失败', error);
          state.status = `导出失败：${explainFailure(error)}`;
          render();
        }
      };
    });
    panel.querySelector('#mufy-recovery-import-masks').onclick = () => panel.querySelector('#mufy-recovery-mask-file').click();
    panel.querySelector('#mufy-recovery-mask-file').onchange = event => importMasks(event.target.files?.[0]);
    panel.querySelector('#mufy-recovery-role-search').oninput = event => { state.roleQuery = event.target.value.trim().toLowerCase(); render(); };
    panel.querySelector('#mufy-recovery-chat-search').onclick = handleChatSearchButton;
    const chatSearchModal = panel.querySelector('#mufy-recovery-chat-search-modal');
    panel.querySelector('#mufy-recovery-chat-search-close').onclick = () => { chatSearchModal.hidden = true; };
    panel.querySelector('#mufy-recovery-chat-search-scope').onchange = refreshChatSearchDialogRoles;
    panel.querySelector('#mufy-recovery-chat-search-start').onclick = searchRolesByChatRecord;
    panel.querySelector('#mufy-recovery-chat-search-query').onkeydown = event => {
      if (event.key === 'Enter') searchRolesByChatRecord();
    };
    panel.querySelector('#mufy-recovery-refresh-favorite-states').onclick = refreshCapturedFavoriteStates;
    panel.querySelector('#mufy-recovery-select-unfavorite-site').onclick = selectUnfavoriteSiteRows;
    panel.querySelector('#mufy-recovery-favorite-selected-site').onclick = favoriteSelectedSiteRows;
    panel.querySelector('#mufy-recovery-clear-site-selection').onclick = clearSiteSelection;
    panel.querySelector('#mufy-recovery-refresh-site-rows').onclick = refreshSiteRows;
    panel.querySelector('#mufy-recovery-clear-site-rows').onclick = clearSiteRows;
    panel.querySelector('#mufy-recovery-mask-search').oninput = event => { state.maskQuery = event.target.value.trim().toLowerCase(); render(); };
    panel.querySelector('#mufy-recovery-status-filter').onchange = event => {
      state.statusFilter = event.target.value;
      render();
    };
    panel.querySelector('#mufy-recovery-role-read-mode').onchange = event => {
      state.roleReadMode = event.target.value === 'latest' ? 'latest' : 'full';
      render();
    };
    panel.querySelector('#mufy-recovery-role-latest-pages').oninput = event => {
      const value = Math.max(1, Math.min(500, Number(event.target.value) || 1));
      state.roleLatestPages = value;
      event.target.value = String(value);
    };
    panel.querySelector('#mufy-recovery-auto-switch').onchange = event => setAutoSwitchSetting(event.target.checked);
    panel.querySelector('#mufy-recovery-mask-search').onkeydown = event => {
      if (event.key === 'Enter' && state.section === 'masks') recoverMasks();
    };
    panel.querySelectorAll('[data-section]').forEach(button => {
      button.onclick = () => {
        const nextSection = button.dataset.section;
        state.section = ['roles', 'favorites', 'chats', 'beauty', 'accounts', 'materials', 'masks'].includes(nextSection) ? nextSection : 'roles';
        if (state.section === 'roles' && !['allRoles', 'chatted', 'chattedNotFavorite', 'favoriteOnly', 'roleHistory', 'authors'].includes(state.active)) state.active = 'allRoles';
        if (state.section === 'favorites' && !['manualFavoriteChats', 'siteSearch', 'siteAuthors'].includes(state.active)) state.active = 'manualFavoriteChats';
        if (state.section === 'chats' && state.active !== 'chatMatches') state.active = 'chatMatches';
        if (state.section === 'beauty') state.active = 'beauty';
        if (state.section === 'accounts') state.active = 'accounts';
        if (state.section === 'materials') {
          state.active = 'materials';
          state.materialKind = button.dataset.materialHomeKind === 'extra' ? 'extra' : 'prompt';
        }
        if (state.section === 'masks' && state.active !== 'masks' && state.active !== 'library') state.active = 'masks';
        render();
        if (state.section === 'masks' && state.active === 'masks') loadCurrentSiteMasks();
      };
    });
    panel.querySelector('#mufy-recovery-section-back').onclick = () => {
      state.section = 'home';
      render();
    };
    const manualChatNext = panel.querySelector('#mufy-recovery-manual-chat-next');
    if (manualChatNext) {
      manualChatNext.hidden = state.active !== 'manualFavoriteChats';
      manualChatNext.onclick = () => goToNextManualFavoriteChat();
    }
    const manualAutoMessage = panel.querySelector('#mufy-recovery-manual-auto-message');
    manualAutoMessage.oninput = event => {
      state.manualAutoChatMessage = String(event.target.value || '');
    };
    manualAutoMessage.onchange = event => {
      state.manualAutoChatMessage = saveManualAutoChatMessage(event.target.value);
      event.target.value = state.manualAutoChatMessage;
    };
    const manualAutoDelayMin = panel.querySelector('#mufy-recovery-manual-auto-delay-min');
    const manualAutoDelayMax = panel.querySelector('#mufy-recovery-manual-auto-delay-max');
    const saveDelayInputs = () => {
      const range = saveManualAutoChatDelayRange(manualAutoDelayMin.value, manualAutoDelayMax.value);
      state.manualAutoChatDelayMin = range.min;
      state.manualAutoChatDelayMax = range.max;
      manualAutoDelayMin.value = String(range.min);
      manualAutoDelayMax.value = String(range.max);
    };
    manualAutoDelayMin.oninput = event => { state.manualAutoChatDelayMin = Number(event.target.value) || 0; };
    manualAutoDelayMax.oninput = event => { state.manualAutoChatDelayMax = Number(event.target.value) || 0; };
    manualAutoDelayMin.onchange = saveDelayInputs;
    manualAutoDelayMax.onchange = saveDelayInputs;
    panel.querySelector('#mufy-recovery-manual-auto-start').onclick = startOrResumeManualAutoChat;
    panel.querySelector('#mufy-recovery-manual-auto-cancel').onclick = cancelManualAutoChatJob;
    panel.querySelectorAll('[data-category]').forEach(button => {
      button.onclick = () => {
        state.active = button.dataset.category;
        state.section = state.active === 'masks' || state.active === 'library' ? 'masks'
          : state.active === 'siteSearch' || state.active === 'siteAuthors' ? 'favorites'
            : state.active === 'manualFavoriteChats' ? 'favorites'
              : state.active === 'chatMatches' ? 'chats' : 'roles';
        render();
        if (state.active === 'masks') loadCurrentSiteMasks();
      };
    });
    panel.querySelector('#mufy-recovery-list').onclick = event => {
      if (event.target.closest('.mufy-recovery-card-longpress-consumed')) return;
      const tagButton = event.target.closest('[data-role-tag]');
      if (tagButton) {
        const tag = String(tagButton.dataset.roleTag || '').trim();
        if (!tag) return;
        state.roleQuery = `#${tag}`.toLocaleLowerCase('zh-CN');
        const searchInput = panel.querySelector('#mufy-recovery-role-search');
        if (searchInput) searchInput.value = `#${tag}`;
        render();
        return;
      }
      const selectToggle = event.target.closest('[data-action="toggle-site-select"]');
      if (selectToggle) {
        const id = String(selectToggle.dataset.characterId || '');
        if (id) {
          if (selectToggle.checked) state.selectedSiteCharacterIds.add(id);
          else state.selectedSiteCharacterIds.delete(id);
          updateSiteActionButtons();
          const card = selectToggle.closest('.mufy-recovery-site-role-row');
          if (card) card.classList.toggle('selected', selectToggle.checked);
        }
        return;
      }
      const authorFavoriteButton = event.target.closest('[data-action="favorite-author"]');
      if (authorFavoriteButton) {
        const group = state.visibleAuthors?.[Number(authorFavoriteButton.dataset.authorFavoriteIndex)];
        if (group) openAuthorFavoriteDialog(group);
        return;
      }
      const authorButton = event.target.closest('[data-author-index]');
      if (authorButton) {
        const group = state.visibleAuthors?.[Number(authorButton.dataset.authorIndex)];
        if (!group) return;
        if (state.openAuthors.has(group.key)) state.openAuthors.delete(group.key);
        else state.openAuthors.add(group.key);
        render();
        return;
      }
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const row = button.dataset.characterId
        ? [...state.visibleRows, ...allRoleRows(), ...state.siteSearchRows].find(item => item.characterId === button.dataset.characterId)
        : state.visibleRows[Number(button.dataset.index)];
      if (!row) return;
      if (button.dataset.action === 'manual-chat-done') {
        state.manualFavoriteChats = state.manualFavoriteChats.filter(item => String(item.characterId) !== String(row.characterId));
        saveManualFavoriteChats(state.manualFavoriteChats);
        if (String(state.manualFavoriteChatCurrentId) === String(row.characterId)) {
          state.manualFavoriteChatCurrentId = '';
          try { localStorage.removeItem(accountStorageKey(MANUAL_FAVORITE_CHAT_CURRENT_KEY)); } catch (_) {}
        }
        render();
      }
      if (button.dataset.action === 'jump-chat-match') openChatMatchAndLocate(row);
      if (button.dataset.action === 'favorite-role') favoriteRole(row);
      if (button.dataset.action === 'unfavorite-role') unfavoriteRole(row);
      if (button.dataset.action === 'archive-role') recoverArchivesForCharacter(row);
      if (button.dataset.action === 'copy-mask') copyMaskInfo(row);
      if (button.dataset.action === 'edit-site-mask') openSiteMaskEditor(row);
      if (button.dataset.action === 'edit-library-mask') openLibraryMaskEditor(row);
      if (button.dataset.action === 'save-mask') addMaskToLibrary(row);
      if (button.dataset.action === 'swap-mask') swapLibraryMask(row);
      if (button.dataset.action === 'remove-library') removeLibraryMask(row);
      if (button.dataset.action === 'bind-mask') bindMaskToCharacter(row);
      if (button.dataset.action === 'bind-role-mask') bindRoleToMask(row);
      if (button.dataset.action === 'unbind-role-mask') unbindCharacterMask(row);
    };
    let siteLongPress = null;
    const clearSiteLongPress = (commit = false) => {
      if (!siteLongPress) return;
      const current = siteLongPress;
      siteLongPress = null;
      if (current.timer) clearTimeout(current.timer);
      current.card?.classList.remove('longpressing');
      if (commit && current.ready && current.id) {
        if (state.selectedSiteCharacterIds.has(current.id)) state.selectedSiteCharacterIds.delete(current.id);
        else state.selectedSiteCharacterIds.add(current.id);
        current.card?.classList.toggle('selected', state.selectedSiteCharacterIds.has(current.id));
        const checkbox = current.card?.querySelector('[data-action="toggle-site-select"]');
        if (checkbox) checkbox.checked = state.selectedSiteCharacterIds.has(current.id);
        updateSiteActionButtons();
        state.status = state.selectedSiteCharacterIds.has(current.id)
          ? '已选中该网站角色；点网页里的“立即收藏”开始按顺序收藏。'
          : '已取消选中该网站角色。';
        panel.querySelector('#mufy-recovery-status').textContent = state.status;
      }
    };
    panel.querySelector('#mufy-recovery-list').addEventListener('pointerdown', event => {
      if (state.section !== 'favorites' || (state.active !== 'siteSearch' && state.active !== 'siteAuthors')) return;
      if (event.target.closest('button,input,label,a')) return;
      const card = event.target.closest('.mufy-recovery-site-role-row[data-character-id]');
      const id = String(card?.dataset.characterId || '');
      if (!card || !id) return;
      const row = state.siteSearchRows.find(item => String(item?.characterId || '') === id);
      if (!row || row.favoriteKnown !== true && !row.favoriteNeedsDetail) return;
      siteLongPress = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, card, id, ready: false, timer: null };
      siteLongPress.timer = setTimeout(() => {
        if (!siteLongPress || siteLongPress.pointerId !== event.pointerId) return;
        siteLongPress.ready = true;
        card.classList.add('longpressing');
      }, 520);
    });
    panel.querySelector('#mufy-recovery-list').addEventListener('pointermove', event => {
      if (!siteLongPress || siteLongPress.pointerId !== event.pointerId) return;
      if (Math.abs(event.clientX - siteLongPress.startX) + Math.abs(event.clientY - siteLongPress.startY) > 14) clearSiteLongPress(false);
    });
    panel.querySelector('#mufy-recovery-list').addEventListener('pointerup', event => {
      if (!siteLongPress || siteLongPress.pointerId !== event.pointerId) return;
      clearSiteLongPress(true);
    });
    panel.querySelector('#mufy-recovery-list').addEventListener('pointercancel', () => clearSiteLongPress(false));
    panel.querySelector('#mufy-recovery-list').addEventListener('pointerleave', () => clearSiteLongPress(false));

    const previousFavoriteResult = takeShareFavoriteResult();
    if (previousFavoriteResult) {
      rememberSiteSearchRows(previousFavoriteResult.rows || []);
      state.favoritePendingIds.clear();
      (previousFavoriteResult.favoritedIds || []).forEach(id => applyFavoriteState(id, true));
      state.status = favoriteJobStatus(previousFavoriteResult, `${previousFavoriteResult.label || '批量收藏'}完成`);
      if (!previousFavoriteResult.completionNotified) pageWindow.alert(state.status);
    }
    installAutoMaskSwitch();
    addMountedGlobalListener(document, 'selectionchange', rememberQuoteSelection);
    installMessageQuoteButtons();
    installAccountSwitchLoginAssist();
    startModelMonitor();
    startScriptUpdateCheck();
    render();
    setTimeout(() => {
      const manualAutoJob = loadManualAutoChatJob();
      if (!manualAutoJob) return;
      state.manualAutoChatRunning = !manualAutoJob.paused;
      if (manualAutoJob.paused) {
        state.status = `检测到已暂停的一键扣数任务：已完成 ${Number(manualAutoJob.completed || 0)}/${Number(manualAutoJob.total || 0)} 个。可进入“收藏”→“普通待聊”继续或取消。`;
        render();
        return;
      }
      const current = currentRoleContext();
      if (pageWindow.location.pathname === '/chat' && String(current.characterId) === String(manualAutoJob.activeCharacterId || '')) {
        processManualAutoChatJob();
        return;
      }
      manualAutoJob.paused = true;
      manualAutoJob.pauseReason = '页面跳转到了任务之外的位置';
      saveManualAutoChatJob(manualAutoJob);
      state.manualAutoChatRunning = false;
      state.status = `一键扣数已暂停：当前页面不是待处理角色。已完成 ${Number(manualAutoJob.completed || 0)}/${Number(manualAutoJob.total || 0)} 个，可手动继续。`;
      render();
    }, 900);
    setTimeout(() => {
      const recoveryTask = loadFavoriteShareRecoveryJob();
      if (!recoveryTask) return;
      const navigationType = pageWindow.performance?.getEntriesByType?.('navigation')?.[0]?.type || '';
      const intentionalShareNavigation = Boolean(
        recoveryTask.phase === 'unfavorited'
        && navigationType === 'navigate'
        && Date.now() - Number(recoveryTask.navigationStartedAt || 0) < 120000
      );
      if (intentionalShareNavigation) {
        recoveryTask.paused = false;
        saveFavoriteShareRecoveryJob(recoveryTask);
        processFavoriteShareRecoveryJob(true);
        return;
      }
      if (!recoveryTask.paused) {
        recoveryTask.paused = true;
        recoveryTask.pauseRequested = false;
        recoveryTask.pauseReason = '页面或脚本意外中断';
        saveFavoriteShareRecoveryJob(recoveryTask);
      }
      state.status = `检测到未完成的链接收藏任务：已完成 ${Number(recoveryTask.index || 0)}/${recoveryTask.rows.length} 个。任务不会自动运行，请手动继续或取消。`;
      render();
    }, 700);
    setTimeout(async () => {
      await initializeShareFavoriteJobStorage();
      const pendingFavoriteJob = loadShareFavoriteJob();
      if (!favoriteJobHasRemaining(pendingFavoriteJob)) return;
      const navigationType = pageWindow.performance?.getEntriesByType?.('navigation')?.[0]?.type || '';
      const freshIntentionalNavigation = Boolean(
        pendingFavoriteJob.activeCharacterId
        && !pendingFavoriteJob.paused
        && navigationType === 'navigate'
        && Date.now() - Number(pendingFavoriteJob.navigationStartedAt || 0) < 120000
      );
      if (freshIntentionalNavigation) {
        processShareFavoriteJob();
        return;
      }
      pendingFavoriteJob.paused = true;
      pendingFavoriteJob.pauseReason = pendingFavoriteJob.pauseReason || 'interrupted';
      await saveShareFavoriteJob(pendingFavoriteJob);
      clearFavoritePendingState(pendingFavoriteJob);
      state.status = `检测到未完成的收藏任务：已完成 ${Number(pendingFavoriteJob.index || 0)}/${pendingFavoriteJob.rows.length} 个。任务不会自动运行，请手动选择“继续收藏”或“取消任务”。`;
      render();
    }, 1600);
    setTimeout(() => locatePendingChatJump(), 1400);
    setTimeout(() => installExactRoleFallback(), 700);
  }

  let bootTimer = 0;
  let bootInProgress = false;
  function cleanupFailedMount() {
    clearMountedGlobalListeners();
    if (modelMonitorTimer) { clearInterval(modelMonitorTimer); modelMonitorTimer = 0; }
    if (scriptUpdateTimer) { clearInterval(scriptUpdateTimer); scriptUpdateTimer = null; }
    messageQuoteObserver?.disconnect();
    messageQuoteObserver = null;
    try { document.getElementById('mufy-recovery-panel')?.remove(); } catch (_) {}
    try { document.getElementById('mufy-recovery-toggle')?.remove(); } catch (_) {}
    try { document.getElementById('mufy-recovery-next')?.remove(); } catch (_) {}
    try { document.getElementById('mufy-recovery-auto-chat-toast')?.remove(); } catch (_) {}
    try { document.querySelectorAll('style[data-mufy-recovery-style="mufy-recovery"]').forEach(item => item.remove()); } catch (_) {}
    panel = null;
    try {
      if (pageWindow.__mufyRecoveryPanelVersion === SCRIPT_VERSION) delete pageWindow.__mufyRecoveryPanelVersion;
    } catch (_) {}
  }
  function scheduleBootRetry() {
    if (bootTimer) return;
    bootTimer = setTimeout(() => {
      bootTimer = 0;
      boot();
    }, 500);
  }
  function boot() {
    if (bootInProgress) return;
    if (!document.body) {
      scheduleBootRetry();
      return;
    }
    bootInProgress = true;
    try {
      mount();
    } catch (error) {
      cleanupFailedMount();
      console.error('[Mufy 角色与面具找回助手] 面板加载失败，已清理残留并准备重试。', error);
      scheduleBootRetry();
    } finally {
      bootInProgress = false;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
    setTimeout(() => {
      if (document.body && (!document.getElementById('mufy-recovery-panel') || !document.getElementById('mufy-recovery-toggle') || !document.getElementById('mufy-recovery-next'))) boot();
    }, 0);
  } else {
    boot();
  }
  try {
    const mountGuard = new MutationObserver(() => {
      if (document.body && (!document.getElementById('mufy-recovery-panel') || !document.getElementById('mufy-recovery-toggle') || !document.getElementById('mufy-recovery-next'))) boot();
    });
    mountGuard.observe(document.documentElement, { childList: true, subtree: true });
  } catch (_) {}
})();
