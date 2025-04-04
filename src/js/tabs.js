const Tabs = {
    currentTabId: 'tab1',
    tabs: [],
  
    init: function() {
      this.tabBar = document.getElementById('tab-bar');
      this.newTabButton = document.getElementById('new-tab-button');
      this.browserContent = document.getElementById('browser-content');
      this.newTabContent = document.getElementById('new-tab-content');
      this.browserIframe = document.getElementById('browser-iframe');
  
      this.tabs = Storage.get('tabs', [{
        id: 'tab1',
        title: 'New Tab',
        url: '',
        active: true
      }]);
  
      this.currentTabId = this.tabs.find(tab => tab.active)?.id || 'tab1';
  
      this.setupEventListeners();
      this.renderTabs();
      this.updateContent();
    },
  
    setupEventListeners: function() {
      this.newTabButton.addEventListener('click', () => this.createNewTab());
  
      this.tabBar.addEventListener('click', (e) => {
        const tabElement = e.target.closest('.tab');
        if (!tabElement) return;
  
        const closeButton = e.target.closest('.tab-close');
        if (closeButton) {
          this.closeTab(tabElement.dataset.tabId);
          return;
        }
  
        this.switchTab(tabElement.dataset.tabId);
      });
    },
  
    renderTabs: function() {
      const tabElements = Array.from(this.tabBar.getElementsByClassName('tab'));
      tabElements.forEach(tab => tab.remove());
  
      this.tabs.forEach(tab => {
        const tabElement = document.createElement('div');
        tabElement.className = `tab ${tab.id === this.currentTabId ? 'active' : ''}`;
        tabElement.dataset.tabId = tab.id;
  
        const tabTitle = document.createElement('span');
        tabTitle.className = 'tab-title';
        tabTitle.textContent = tab.title;
  
        const closeButton = document.createElement('span');
        closeButton.className = 'tab-close';
        closeButton.textContent = '×';
  
        tabElement.appendChild(tabTitle);
        tabElement.appendChild(closeButton);
  
        this.tabBar.insertBefore(tabElement, this.newTabButton);
      });
  
      Storage.set('tabs', this.tabs);
    },
  
    createNewTab: function() {
      const newTabId = `tab${Date.now()}`;
  
      this.tabs.forEach(tab => tab.active = false);
  
      this.tabs.push({
        id: newTabId,
        title: 'New Tab',
        url: '',
        active: true
      });
  
      this.currentTabId = newTabId;
      this.renderTabs();
      this.updateContent();
  
      Browser.addToHistory({
        url: '',
        title: 'New Tab',
        timestamp: new Date().toISOString()
      });
    },
  
    closeTab: function(tabId) {
      const tabIndex = this.tabs.findIndex(tab => tab.id === tabId);
      if (tabIndex === -1) return;
  
      const wasActive = this.tabs[tabIndex].active;
      this.tabs.splice(tabIndex, 1);
  
      if (this.tabs.length === 0) {
        this.createNewTab();
        return;
      }
  
      if (wasActive) {
        const newActiveIndex = Math.min(tabIndex, this.tabs.length - 1);
        this.tabs[newActiveIndex].active = true;
        this.currentTabId = this.tabs[newActiveIndex].id;
      }
  
      this.renderTabs();
      this.updateContent();
    },
  
    switchTab: function(tabId) {
      const tab = this.tabs.find(t => t.id === tabId);
      if (!tab) return;
  
      this.tabs.forEach(t => t.active = (t.id === tabId));
      this.currentTabId = tabId;
  
      this.renderTabs();
      this.updateContent();
    },
  
    updateContent: function() {
      const activeTab = this.tabs.find(tab => tab.id === this.currentTabId);
      if (!activeTab) return;
  
      if (!activeTab.url) {
        this.browserIframe.classList.add('hidden');
        this.newTabContent.classList.remove('hidden');
      } else {
        this.browserIframe.classList.remove('hidden');
        this.newTabContent.classList.add('hidden');
  
        if (this.browserIframe.src !== this.getValidUrl(activeTab.url)) {
          this.browserIframe.src = this.getValidUrl(activeTab.url);
        }
  
        this.resizeIframe();
      }
    },
  
    resizeIframe: function() {
      if (typeof Browser !== 'undefined' && Browser.adjustIframeSize) {
        Browser.adjustIframeSize();
      } else {
        this.browserIframe.style.height = `${this.browserContent.offsetHeight}px`;
        this.browserIframe.style.width = `${this.browserContent.offsetWidth}px`;
      }
    },
  
    navigateTo: function(url) {
      if (!url) return;
  
      const activeTab = this.tabs.find(tab => tab.id === this.currentTabId);
      if (!activeTab) return;
  
      const validUrl = this.getValidUrl(url);
  
      activeTab.url = validUrl;
      activeTab.title = url;
  
      this.renderTabs();
      this.updateContent();
  
      Browser.addToHistory({
        url: validUrl,
        title: url,
        timestamp: new Date().toISOString()
      });
    },
  
    getValidUrl: function(url) {
      if (!url) return '';
  
      if (url.match(/^https?:\/\//i)) {
        return url;
      }
  
      if (url.indexOf('.') > 0) {
        return `/static/iframe.html#https://${url}`;
      }
  
      return `/static/iframe.html#https://www.gruble.de/search?q=${encodeURIComponent(url)}`;
    },
  
    updateTabTitle: function(title) {
      const activeTab = this.tabs.find(tab => tab.id === this.currentTabId);
      if (!activeTab || !title) return;
  
      activeTab.title = title;
      this.renderTabs();
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    Tabs.init();
  });
  