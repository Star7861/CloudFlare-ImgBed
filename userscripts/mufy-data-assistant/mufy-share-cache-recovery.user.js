// ==UserScript==
// @name         Mufy 分享链接缓存找回（只读）
// @namespace    local.mufy.share-cache-recovery
// @version      1.1.0
// @description  查看此浏览器已有的 Mufy 分享链接缓存。
// @match        https://chat.mufy.ai/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const cacheKey = 'mufy-role-links-only-share-code-cache-v1';
  const namesKey = 'mufy-share-code-names-v1';
  const roleCacheKey = 'mufy-role-links-only-role-cache-v1';
  const failuresKey = 'mufy-favorite-share-recovery-failures-v1';
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = '找回分享链接';
  button.style.cssText = 'position:fixed;right:12px;top:70px;z-index:2147483646;padding:10px;background:#fff;color:#222;border:1px solid #555;border-radius:8px';

  const dialog = document.createElement('dialog');
  dialog.style.cssText = 'box-sizing:border-box;width:min(92vw,540px);max-height:80vh;padding:16px;background:#fff;color:#222;border:1px solid #555;border-radius:10px;overflow:auto';

  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = '关闭';
  close.addEventListener('click', () => dialog.close());

  const note = document.createElement('p');
  const search = document.createElement('input');
  search.type = 'search';
  search.placeholder = '搜索角色名或 ID';
  search.setAttribute('aria-label', search.placeholder);
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    for (const group of results.children) {
      const items = Array.from(group.querySelectorAll('li'));
      for (const item of items) item.hidden = !item.dataset.search.includes(query);
      group.hidden = items.every(item => item.hidden);
      if (query && !group.hidden) group.open = true;
    }
  });
  const results = document.createElement('div');
  let viewId = 0;
  let manualCopyField = null;
  dialog.append(close, note, search, results);
  document.body.append(button, dialog);

  function readCaches() {
    const caches = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key !== cacheKey && !key?.startsWith(`${cacheKey}:account:`)) continue;
      try {
        const value = JSON.parse(localStorage.getItem(key) || '{}');
        if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
        const entries = Object.entries(value).filter(([id, code]) => id && typeof code === 'string' && code.trim());
        if (entries.length) caches.push({ key, entries, scope: key === cacheKey ? '' : key.slice(cacheKey.length + ':account:'.length) });
      } catch (_) {}
    }
    return caches;
  }

  function readLocalJson(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { return null; }
  }

  function readRoleDatabase(scopes) {
    return new Promise(resolve => {
      const records = new Map();
      const finish = () => { clearTimeout(timer); resolve(records); };
      const timer = setTimeout(finish, 1500);
      try {
        const request = indexedDB.open('mufy-recovery-mask-storage');
        request.onupgradeneeded = () => request.transaction.abort();
        request.onerror = finish;
        request.onsuccess = () => {
          const db = request.result;
          try {
            const transaction = db.transaction('account-data', 'readonly');
            transaction.oncomplete = finish;
            transaction.onabort = finish;
            const store = transaction.objectStore('account-data');
            for (const scope of scopes) {
              for (const prefix of ['role-history:', 'role-cache:']) {
                const key = prefix + scope;
                const read = store.get(key);
                read.onsuccess = () => records.set(key, read.result);
              }
            }
          } catch (_) { finish(); }
          finally { db.close(); }
        };
      } catch (_) { finish(); }
    });
  }

  function namesForCache(scope, records) {
    const suffix = scope ? `:account:${scope}` : '';
    const names = new Map();
    const add = (id, name) => {
      if (id && typeof name === 'string' && name.trim() && name !== '未命名角色') names.set(String(id), name);
    };
    const addRows = rows => {
      if (Array.isArray(rows)) for (const row of rows) add(row?.characterId, row?.name);
    };
    for (const snapshot of [readLocalJson(roleCacheKey + suffix), records.get(`role-cache:${scope}`)?.snapshot]) {
      for (const field of ['chatted', 'chattedNotFavorite', 'favoriteOnly', 'archived']) addRows(snapshot?.[field]);
    }
    addRows(records.get(`role-history:${scope}`)?.rows);
    addRows(readLocalJson(failuresKey + suffix));
    for (const [id, name] of Object.entries(readLocalJson(namesKey + suffix) || {})) add(id, name);
    return names;
  }

  async function copyLink(url, control) {
    try {
      await navigator.clipboard.writeText(url);
      control.textContent = '已复制';
      return;
    } catch (_) {}
    manualCopyField?.remove();
    const field = document.createElement('textarea');
    manualCopyField = field;
    field.value = url;
    field.readOnly = true;
    dialog.append(field);
    field.select();
    field.setSelectionRange(0, url.length);
    try {
      if (document.execCommand('copy')) {
        field.remove();
        control.textContent = '已复制';
        return;
      }
    } catch (_) {}
    control.textContent = '请手动复制选中的链接';
  }

  async function showLinks() {
    if (dialog.open) return;
    const currentView = ++viewId;
    manualCopyField?.remove();
    results.replaceChildren();
    search.value = '';
    let caches;
    try {
      caches = readCaches();
    } catch (_) {
      note.textContent = '浏览器拒绝读取本页的网站数据。请在当时操作收藏的普通浏览窗口打开 Mufy。';
      dialog.showModal();
      return;
    }
    dialog.showModal();
    note.textContent = caches.length
      ? '正在匹配本地角色名……'
      : '此浏览器没有可读的分享链接缓存。请确认正在使用当时操作收藏的浏览器和窗口。';
    if (!caches.length) return;
    const records = await readRoleDatabase(caches.map(cache => cache.scope).filter(Boolean));
    if (!dialog.open || currentView !== viewId) return;
    note.textContent = '点「复制链接」可复制对应角色的分享地址。仅显示 ID 的旧记录，可以打开链接确认名字。';
    for (const { key, entries, scope } of caches) {
      const names = namesForCache(scope, records);
      const group = document.createElement('details');
      group.open = caches.length === 1;
      const heading = document.createElement('summary');
      heading.textContent = `${key === cacheKey ? '旧版缓存' : `账号分区 ${key.slice(-7)}`} · ${entries.length} 条`;
      const list = document.createElement('ol');
      for (const [id, code] of entries.slice().reverse()) {
        const item = document.createElement('li');
        const name = names.get(id);
        item.dataset.search = `${name || ''} ${id}`.toLowerCase();
        item.style.margin = '8px 0';
        const link = document.createElement('a');
        const url = new URL('/chat', location.origin);
        url.searchParams.set('shareCode', code);
        link.href = url.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = name ? `${name} · ${id}` : `角色 ID ${id}`;
        const copy = document.createElement('button');
        copy.type = 'button';
        copy.textContent = '复制链接';
        copy.style.marginInlineStart = '8px';
        copy.addEventListener('click', () => copyLink(url.href, copy));
        item.append(link, copy);
        list.append(item);
      }
      group.append(heading, list);
      results.append(group);
    }
    search.dispatchEvent(new Event('input'));
  }

  button.addEventListener('click', showLinks);
})();
