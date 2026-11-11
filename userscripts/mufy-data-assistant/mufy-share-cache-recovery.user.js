// ==UserScript==
// @name         Mufy 分享链接缓存找回（只读）
// @namespace    local.mufy.share-cache-recovery
// @version      1.0.0
// @description  查看此浏览器已有的 Mufy 分享链接缓存。
// @match        https://chat.mufy.ai/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const cacheKey = 'mufy-role-links-only-share-code-cache-v1';
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
  const results = document.createElement('div');
  dialog.append(close, note, results);
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
        if (entries.length) caches.push({ key, entries });
      } catch (_) {}
    }
    return caches;
  }

  function showLinks() {
    results.replaceChildren();
    let caches;
    try {
      caches = readCaches();
    } catch (_) {
      note.textContent = '浏览器拒绝读取本页的网站数据。请在当时操作收藏的普通浏览窗口打开 Mufy。';
      dialog.showModal();
      return;
    }
    note.textContent = caches.length
      ? '这是此浏览器保存的分享链接。缓存只有角色 ID 和分享码，需要打开链接确认角色名字。'
      : '此浏览器没有可读的分享链接缓存。请确认正在使用当时操作收藏的浏览器和窗口。';
    for (const { key, entries } of caches) {
      const group = document.createElement('details');
      group.open = caches.length === 1;
      const heading = document.createElement('summary');
      heading.textContent = `${key === cacheKey ? '旧版缓存' : `账号分区 ${key.slice(-7)}`} · ${entries.length} 条`;
      const list = document.createElement('ol');
      for (const [id, code] of entries.slice().reverse()) {
        const item = document.createElement('li');
        const link = document.createElement('a');
        const url = new URL('/chat', location.origin);
        url.searchParams.set('shareCode', code);
        link.href = url.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = `打开分享链接 · 角色 ID ${id}`;
        item.append(link);
        list.append(item);
      }
      group.append(heading, list);
      results.append(group);
    }
    dialog.showModal();
  }

  button.addEventListener('click', showLinks);
})();
