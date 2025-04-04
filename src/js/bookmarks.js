const Bookmarks = {
    bookmarks: [],
  
    init: function() {
      this.bookmarksButton = document.getElementById('bookmarks-button');
      this.bookmarksPanel = document.getElementById('bookmarks-panel');
      this.bookmarksList = document.getElementById('bookmarks-list');
      this.addBookmarkButton = document.getElementById('add-bookmark-button');
      this.addBookmarkModal = document.getElementById('add-bookmark-modal');
      this.addBookmarkClose = document.getElementById('add-bookmark-close');
      this.addBookmarkForm = document.getElementById('add-bookmark-form');
      this.shortcuts = document.getElementById('shortcuts');
  
      this.bookmarks = Storage.get('bookmarks', []);
  
      this.setupEventListeners();
      this.renderBookmarks();
      this.renderShortcuts();
    },
  
    setupEventListeners: function() {
      this.bookmarksButton.addEventListener('click', () => this.toggleBookmarksPanel());
      this.addBookmarkButton.addEventListener('click', () => this.showAddBookmarkModal());
      this.addBookmarkClose.addEventListener('click', () => this.hideAddBookmarkModal());
  
      this.addBookmarkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addBookmark();
      });
  
      this.bookmarksList.addEventListener('click', (e) => {
        const bookmarkItem = e.target.closest('.bookmark-item');
        if (bookmarkItem) {
          const bookmarkId = parseInt(bookmarkItem.dataset.id);
          const bookmark = this.bookmarks.find(b => b.id === bookmarkId);
          if (bookmark) {
            Tabs.navigateTo(bookmark.url);
            this.hideBookmarksPanel();
          }
        }
      });
  
      this.shortcuts.addEventListener('click', (e) => {
        const shortcut = e.target.closest('.shortcut');
        if (shortcut) {
          const bookmarkId = parseInt(shortcut.dataset.id);
          const bookmark = this.bookmarks.find(b => b.id === bookmarkId);
          if (bookmark) {
            Tabs.navigateTo(bookmark.url);
          }
        }
      });
  
      window.addEventListener('click', (e) => {
        if (e.target === this.addBookmarkModal) {
          this.hideAddBookmarkModal();
        }
      });
    },
  
    toggleBookmarksPanel: function() {
      this.bookmarksPanel.classList.toggle('hidden');
      this.hidePanels('bookmarks');
    },
  
    hideBookmarksPanel: function() {
      this.bookmarksPanel.classList.add('hidden');
    },
  
    showAddBookmarkModal: function() {
      const activeTab = Tabs.tabs.find(tab => tab.id === Tabs.currentTabId);
      if (activeTab) {
        document.getElementById('bookmark-url').value = activeTab.url;
        document.getElementById('bookmark-name').value = activeTab.title;
      }
  
      this.addBookmarkModal.classList.add('show');
    },
  
    hideAddBookmarkModal: function() {
      this.addBookmarkModal.classList.remove('show');
      this.addBookmarkForm.reset();
    },
  
    addBookmark: function() {
      const name = document.getElementById('bookmark-name').value;
      const url = document.getElementById('bookmark-url').value;
  
      if (!name || !url) return;
  
      const newBookmark = {
        id: this.bookmarks.length > 0 ? Math.max(...this.bookmarks.map(b => b.id)) + 1 : 1,
        name,
        url: Tabs.getValidUrl(url),
        icon: 'fas fa-globe'
      };
  
      this.bookmarks.push(newBookmark);
      Storage.set('bookmarks', this.bookmarks);
  
      this.renderBookmarks();
      this.renderShortcuts();
      this.hideAddBookmarkModal();
    },
  
    renderBookmarks: function() {
      this.bookmarksList.innerHTML = '';
  
      this.bookmarks.forEach(bookmark => {
        const bookmarkItem = document.createElement('div');
        bookmarkItem.className = 'bookmark-item';
        bookmarkItem.dataset.id = bookmark.id;
  
        const bookmarkIcon = document.createElement('div');
        bookmarkIcon.className = 'bookmark-icon';
        bookmarkIcon.innerHTML = `<i class="${bookmark.icon}"></i>`;
  
        const bookmarkName = document.createElement('div');
        bookmarkName.className = 'bookmark-name';
        bookmarkName.textContent = bookmark.name;
  
        bookmarkItem.appendChild(bookmarkIcon);
        bookmarkItem.appendChild(bookmarkName);
  
        this.bookmarksList.appendChild(bookmarkItem);
      });
    },
  
    renderShortcuts: function() {
      this.shortcuts.innerHTML = '';
  
      const shortcutsToDisplay = this.bookmarks.slice(0, 6);
  
      shortcutsToDisplay.forEach(bookmark => {
        const shortcut = document.createElement('div');
        shortcut.className = 'shortcut';
        shortcut.dataset.id = bookmark.id;
  
        const shortcutIcon = document.createElement('div');
        shortcutIcon.className = 'shortcut-icon';
        shortcutIcon.innerHTML = `<i class="${bookmark.icon}"></i>`;
  
        const shortcutName = document.createElement('div');
        shortcutName.className = 'shortcut-name';
        shortcutName.textContent = bookmark.name;
  
        shortcut.appendChild(shortcutIcon);
        shortcut.appendChild(shortcutName);
  
        this.shortcuts.appendChild(shortcut);
      });
    },
  
    hidePanels: function(except) {
      if (except !== 'history') {
        document.getElementById('history-panel').classList.add('hidden');
      }
      if (except !== 'settings') {
        document.getElementById('settings-panel').classList.add('hidden');
      }
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    Bookmarks.init();
  });
  