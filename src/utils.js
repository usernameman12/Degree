export function formatUrl(url) {
    if (!url) return '';
  
    let formatted = url.replace(/^(https?:\/\/)/, '');
  
    formatted = formatted.replace(/\/$/, '');
  
    return formatted;
  }
  
  export function validateUrl(input) {
    if (!input) return '';
  
    const isUrl = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/.test(input);
  
    if (isUrl) {
      if (!input.startsWith('http://') && !input.startsWith('https://')) {
        return `https://${input}`;
      }
      return input;
    }
  
    return `https://google.com/search?q=${encodeURIComponent(input)}`;
  }
  
  export function extractDomain(url) {
    if (!url) return '';
  
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im);
      return match ? match[1] : '';
    }
  }
  
  
  export function getFaviconUrl(url) {
    if (!url) return '';
  
    const domain = extractDomain(url);
    if (!domain) return '';
  
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  }
  
  export function formatDate(dateString) {
    if (!dateString) return '';
  
    const date = new Date(dateString);
    return date.toLocaleString();
  }
  

  export function downloadFile(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
  
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  
    URL.revokeObjectURL(a.href);
  }
  
  
  export function exportBrowserData(data, fileName) {
    const jsonData = JSON.stringify(data, null, 2);
    downloadFile(jsonData, fileName, 'application/json');
  }
  
  
  export function importBrowserData(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to parse imported data:', error);
      return null;
    }
  }
  
  
  export function isSearchQuery(url) {
    return url.includes('google.com/search?') ||
           url.includes('bing.com/search?') ||
           url.includes('search.yahoo.com/search');
  }
  
  
  export function extractSearchQuery(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('q') || '';
    } catch (e) {
      return '';
    }
  }
  
  
  export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  
  
  export function isPrivateMode() {
    return new Promise(resolve => {
      const on = () => resolve(true);
      const off = () => resolve(false);
  
      function detectChromeIncognito() {
        const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
        if (!fs) return off();
  
        fs(window.TEMPORARY, 100, off, on);
      }
  
      function detectFirefoxIncognito() {
        const db = indexedDB.open('test');
        db.onerror = on;
        db.onsuccess = off;
      }
  
    
      const ua = navigator.userAgent;
      if (ua.indexOf('Chrome') > -1) {
        detectChromeIncognito();
      } else if (ua.indexOf('Firefox') > -1) {
        detectFirefoxIncognito();
      } else {
        if (navigator.storage && navigator.storage.estimate) {
          navigator.storage.estimate().then(data => {
            resolve(data.quota < 120000000);
          });
        } else {
          off();
        }
      }
    });
  }
  