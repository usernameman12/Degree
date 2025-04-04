export const browser = {

  history: [],

  bookmarks: [],

  state: {
    activeTabId: null,
    tabs: [],
    nextTabId: 1
  },

  init() {
    this.loadHistory();
    this.loadBookmarks();
  },

  loadHistory() {
    try {
      const savedHistory = localStorage.getItem('browser-history');
      if (savedHistory) {
        this.history = JSON.parse(savedHistory);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      this.history = [];
    }
  },

  saveHistory() {
    try {

      if (this.history.length > 1000) {
        this.history = this.history.slice(-1000);
      }
      localStorage.setItem('browser-history', JSON.stringify(this.history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  },

  addToHistory(url, title) {
    this.history.push({
      url,
      title,
      visitTime: new Date().toISOString()
    });
    this.saveHistory();
  },

  clearHistory() {
    this.history = [];
    this.saveHistory();
  },

  loadBookmarks() {
    try {
      const savedBookmarks = localStorage.getItem('browser-bookmarks');
      if (savedBookmarks) {
        this.bookmarks = JSON.parse(savedBookmarks);
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      this.bookmarks = [];
    }
  },

  saveBookmarks() {
    try {
      localStorage.setItem('browser-bookmarks', JSON.stringify(this.bookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  },

  addBookmark(url, title, favicon = '') {

    const exists = this.bookmarks.some(bookmark => bookmark.url === url);
    if (!exists) {
      this.bookmarks.push({
        url,
        title,
        favicon,
        addedAt: new Date().toISOString()
      });
      this.saveBookmarks();
      return true;
    }
    return false;
  },

  removeBookmark(url) {
    const initialLength = this.bookmarks.length;
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.url !== url);
    if (this.bookmarks.length !== initialLength) {
      this.saveBookmarks();
      return true;
    }
    return false;
  },

  isBookmarked(url) {
    return this.bookmarks.some(bookmark => bookmark.url === url);
  },

  createTab(url = '', title = 'New Tab') {
    const tabId = this.state.nextTabId++;
    const newTab = {
      id: tabId,
      url,
      title,
      favicon: '',
      isLoading: false,
      canGoBack: false,
      canGoForward: false
    };

    this.state.tabs.push(newTab);
    this.state.activeTabId = tabId;

    return tabId;
  },

  closeTab(tabId) {
    const tabIndex = this.state.tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex !== -1) {

      this.state.tabs.splice(tabIndex, 1);

      if (this.state.activeTabId === tabId) {
        if (this.state.tabs.length > 0) {
          const newActiveIndex = Math.max(0, tabIndex - 1);
          this.state.activeTabId = this.state.tabs[newActiveIndex].id;
        } else {
          this.state.activeTabId = null;
        }
      }

      return true;
    }
    return false;
  },

  getActiveTab() {
    return this.state.tabs.find(tab => tab.id === this.state.activeTabId) || null;
  },

  switchToTab(tabId) {
    const tab = this.state.tabs.find(tab => tab.id === tabId);
    if (tab) {
      this.state.activeTabId = tabId;
      return true;
    }
    return false;
  },

  updateTab(tabId, updates) {
    const tab = this.state.tabs.find(tab => tab.id === tabId);
    if (tab) {
      Object.assign(tab, updates);
      return true;
    }
    return false;
  }
};