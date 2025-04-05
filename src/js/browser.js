const Browser = {
  init: function() {
    this.urlInput = document.getElementById('url-input');
    this.searchInput = document.getElementById('search-input');
    this.backButton = document.getElementById('back-button');
    this.forwardButton = document.getElementById('forward-button');
    this.refreshButton = document.getElementById('refresh-button');
    this.homeButton = document.getElementById('home-button');
    this.browserIframe = document.getElementById('browser-iframe');
    this.logoButton = document.getElementById('logo');
    this.browserContent = document.getElementById('browser-content');

    this.setupEventListeners();
    this.adjustIframeSize();

    window.addEventListener('resize', () => this.adjustIframeSize());
    // listen for UV proxy stuffs
    window.addEventListener('message', (event) => this.handleUvMessages(event));
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
      this.browserIframe.src = activeTab.url;
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
    } catch (error) {
      console.log('Could not access iframe content: ', error);
    }
  },

  getActualUrl: function() {
    try {
      const iframeLocation = this.browserIframe.contentWindow.location;
      const currentUrl = iframeLocation.href;
        // UV IMPLEMENTATION TIME HOORAHHH
      if (currentUrl.includes('/uv/go/')) {
        const uvMatch = currentUrl.match(/\/uv\/go\/(.*)/);
        if (uvMatch && uvMatch[1]) {
          // Decode the UV URL so hydrogen gets the link from the /uv/go thing
          try {
            return decodeURIComponent(uvMatch[1]);
          } catch (e) {
            return atob(uvMatch[1].replace(/_/g, '/').replace(/-/g, '+'));
          }
        }
      }
      
      return currentUrl;
    } catch (error) {
      console.log('Error getting actual URL:', error);
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
    } catch (error) {
      console.log('Error handling UV message:', error);
    }
  },

  addToHistory: function(item) {
    if (typeof History !== 'undefined' && History.addToHistory) {
      History.addToHistory(item);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Browser.init();
});
