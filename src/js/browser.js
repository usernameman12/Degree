const Browser = {
  init: function() {
    this.urlInput = document.getElementById('url-input');
    this.searchInput = document.getElementById('search-input');
    this.backButton = document.getElementById('back-button');
    this.forwardButton = document.getElementById('forward-button');
    this.refreshButton = document.getElementById('refresh-button');
    this.homeButton = document.getElementById('home-button');
    this.logoButton = document.getElementById('logo');
    this.browserContent = document.getElementById('browser-content');
    
    this.browserIframe = document.createElement('iframe');
    this.browserIframe.id = 'browser-iframe';
    this.browserIframe.classList.add('browser-iframe');
    this.browserContent.appendChild(this.browserIframe);

    this.setupEventListeners();
    this.adjustIframeSize();

    window.addEventListener('resize', () => this.adjustIframeSize());
    window.addEventListener('message', (event) => this.handleUvMessages(event));

    this.goHome();
  },

  setupEventListeners: function() {
    this.urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const url = this.urlInput.value.trim();
        if (url) {
          Tabs.navigateTo(url);
        }
      }
    });

    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = this.searchInput.value.trim();
        if (query) {
          Tabs.navigateTo(query);
        }
      }
    });

    this.backButton.addEventListener('click', () => this.goBack());
    this.forwardButton.addEventListener('click', () => this.goForward());
    this.refreshButton.addEventListener('click', () => this.refresh());
    this.homeButton.addEventListener('click', () => this.goHome());
    this.logoButton.addEventListener('click', () => this.goHome());

    this.browserIframe.addEventListener('load', () => {
      this.updateAddressBar();
      this.adjustIframeSize();
    });
  },

  adjustIframeSize: function() {
    const activeTab = Tabs.tabs.find(tab => tab.id === Tabs.currentTabId);
    if (activeTab && activeTab.url) {
      this.browserIframe.style.height = `${this.browserContent.offsetHeight}px`;
      this.browserIframe.style.width = `${this.browserContent.offsetWidth}px`;
    }
  },

  goBack: function() {
    if (this.browserIframe.contentWindow) {
      this.browserIframe.contentWindow.history.back();
    }
  },

  goForward: function() {
    if (this.browserIframe.contentWindow) {
      this.browserIframe.contentWindow.history.forward();
    }
  },

  refresh: function() {
    const activeTab = Tabs.tabs.find(tab => tab.id === Tabs.currentTabId);
    if (activeTab && activeTab.url) {
      this.loadUvUrl(activeTab.url);
    } else {
      this.browserIframe.contentWindow.location.reload();
    }
  },

  goHome: function() {
    this.browserIframe.classList.add('hidden');
    document.getElementById('new-tab-content').classList.remove('hidden');

    const activeTab = Tabs.tabs.find(tab => tab.id === Tabs.currentTabId);
    if (activeTab) {
      activeTab.url = '';
      activeTab.title = 'New Tab';
      Tabs.renderTabs();
    }

    this.urlInput.value = '';
  },

  updateAddressBar: function() {
    try {
      const currentUrl = this.getActualUrl();
      this.urlInput.value = currentUrl;

      const title = this.browserIframe.contentDocument.title || currentUrl;
      Tabs.updateTabTitle(title);

      this.addToHistory({
        url: currentUrl,
        title: title,
        timestamp: new Date().toISOString()
      });
    } catch (error) {}
  },

  getActualUrl: function() {
    try {
      const iframeLocation = this.browserIframe.contentWindow.location;
      const currentUrl = iframeLocation.href;
      
      if (currentUrl.includes('/uv/go/')) {
        const uvMatch = currentUrl.match(/\/uv\/go\/(.*)/);
        if (uvMatch && uvMatch[1]) {
          try {
            return decodeURIComponent(uvMatch[1]);
          } catch (e) {
            return atob(uvMatch[1].replace(/_/g, '/').replace(/-/g, '+'));
          }
        }
      }
      
      return currentUrl;
    } catch (error) {
      return this.browserIframe.src;
    }
  },

  handleUvMessages: function(event) {
    try {
      const data = event.data;
      if (data && data.type === 'navigate' && data.url) {
        const activeTab = Tabs.tabs.find(tab => tab.id === Tabs.currentTabId);
        if (activeTab) {
          activeTab.url = data.url;
          this.urlInput.value = data.url;
          Tabs.updateTabTitle(data.title || data.url);
        }
      }
    } catch (error) {}
  },

  loadUvUrl: function(url) {
    if (!this.isValidUrl(url)) {
      return;
    }

    let encodedUrl;
    try {
      encodedUrl = encodeURIComponent(url);
    } catch (e) {
      encodedUrl = btoa(url).replace(/\//g, '_').replace(/\+/g, '-');
    }

    const uvProxyUrl = `../../static/uv/go/${encodedUrl}`;

    this.browserIframe.src = uvProxyUrl;
    
    this.browserIframe.classList.remove('hidden');
    const newTabContent = document.getElementById('new-tab-content');
    if (newTabContent) {
      newTabContent.classList.add('hidden');
    }
    
    const activeTab = Tabs.tabs.find(tab => tab.id === Tabs.currentTabId);
    if (activeTab) {
      activeTab.url = url;
    }
  },

  isValidUrl: function(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },

  addToHistory: function(item) {
    if (typeof History !== 'undefined' && History.addToHistory) {
      History.addToHistory(item);
    }
  },

  closeIframe: function() {
    this.browserIframe.classList.add('hidden');
    this.browserIframe.src = ''; //clear iframe shit
  }
};

if (typeof Tabs !== 'undefined') {
  const originalNavigateTo = Tabs.navigateTo;
  Tabs.navigateTo = function(input) {
    const url = this.formatUrl(input);

    const activeTab = this.tabs.find(tab => tab.id === this.currentTabId);
    if (activeTab) {
      activeTab.url = url;
      this.renderTabs();
    }

    Browser.loadUvUrl(url);
    return url;
  };
  
  if (!Tabs.formatUrl) {
    Tabs.formatUrl = function(input) {
      if (input.startsWith('http://') || input.startsWith('https://')) {
        return input;
      } else if (input.includes('.') && !input.includes(' ')) {
        return 'https://' + input;
      } else {
        return 'https://www.gruble.de/search?q=' + encodeURIComponent(input);
      }
    };
  }

  Tabs.onTabSelect = function(tabId) {
    const activeTab = Tabs.tabs.find(tab => tab.id === tabId);
    if (activeTab && activeTab.url) {
      Browser.loadUvUrl(activeTab.url);
    } else {
      Browser.closeIframe();
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  Browser.init();
});
