import * as utils from './utils.js';

export const bookmarks = {
  items: [],
  folders: [
    {
      id: 'bookmarks-bar',
      name: 'Bookmarks Bar',
      parentId: null
    },
    {
      id: 'other-bookmarks',
      name: 'Other Bookmarks',
      parentId: null
    }
  ],

  init() {
    this.loadBookmarks();
  },

  loadBookmarks() {
    try {
      const savedBookmarks = localStorage.getItem('degree-bookmarks');
      const savedFolders = localStorage.getItem('degree-bookmark-folders');

      if (savedBookmarks) {
        this.items = JSON.parse(savedBookmarks);
      }

      if (savedFolders) {

        const loadedFolders = JSON.parse(savedFolders);
        const defaultFolderIds = this.folders.map(f => f.id);

        this.folders = [
          ...this.folders,
          ...loadedFolders.filter(f => !defaultFolderIds.includes(f.id))
        ];
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);

      this.items = [];
    }
  },

  saveBookmarks() {
    try {
      localStorage.setItem('degree-bookmarks', JSON.stringify(this.items));
      localStorage.setItem('degree-bookmark-folders', JSON.stringify(this.folders));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  },

  addBookmark(url, title, folderId = 'other-bookmarks', favicon = '') {

    const exists = this.items.some(
      item => item.url === url && item.folderId === folderId
    );

    if (exists) {
      return false;
    }

    if (!favicon && url) {
      favicon = utils.getFaviconUrl(url);
    }

    const bookmark = {
      id: `bookmark-${Date.now()}`,
      url,
      title: title || url,
      folderId,
      favicon,
      addedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    this.items.push(bookmark);
    this.saveBookmarks();

    return bookmark;
  },

  addFolder(name, parentId = null) {

    const exists = this.folders.some(
      folder => folder.name === name && folder.parentId === parentId
    );

    if (exists) {
      return false;
    }

    const folder = {
      id: `folder-${Date.now()}`,
      name,
      parentId,
      addedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    this.folders.push(folder);
    this.saveBookmarks();

    return folder;
  },

  updateBookmark(id, updates) {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }

    this.items[index] = {
      ...this.items[index],
      ...updates,
      lastModified: new Date().toISOString()
    };

    this.saveBookmarks();
    return true;
  },

  updateFolder(id, updates) {
    const index = this.folders.findIndex(folder => folder.id === id);
    if (index === -1) {
      return false;
    }

    if (id === 'bookmarks-bar' || id === 'other-bookmarks') {
      return false;
    }

    this.folders[index] = {
      ...this.folders[index],
      ...updates,
      lastModified: new Date().toISOString()
    };

    this.saveBookmarks();
    return true;
  },

  deleteBookmark(id) {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);

    if (this.items.length !== initialLength) {
      this.saveBookmarks();
      return true;
    }

    return false;
  },

  deleteFolder(id) {

    if (id === 'bookmarks-bar' || id === 'other-bookmarks') {
      return false;
    }

    const getAllChildFolderIds = (folderId) => {
      const directChildren = this.folders.filter(f => f.parentId === folderId).map(f => f.id);
      const allChildren = [...directChildren];

      directChildren.forEach(childId => {
        allChildren.push(...getAllChildFolderIds(childId));
      });

      return allChildren;
    };

    const childFolderIds = getAllChildFolderIds(id);
    const allFolderIds = [id, ...childFolderIds];

    this.items = this.items.filter(item => !allFolderIds.includes(item.folderId));

    const initialFoldersLength = this.folders.length;
    this.folders = this.folders.filter(folder => !allFolderIds.includes(folder.id));

    if (this.folders.length !== initialFoldersLength) {
      this.saveBookmarks();
      return true;
    }

    return false;
  },

  getBookmarksInFolder(folderId) {
    return this.items.filter(item => item.folderId === folderId);
  },

  getSubfolders(parentId) {
    return this.folders.filter(folder => folder.parentId === parentId);
  },

  getFolder(id) {
    return this.folders.find(folder => folder.id === id);
  },

  getBookmark(id) {
    return this.items.find(item => item.id === id);
  },

  isBookmarked(url) {
    return this.items.some(item => item.url === url);
  },

  search(query) {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();
    return this.items.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.url.toLowerCase().includes(lowerQuery)
    );
  },

  moveBookmark(id, targetFolderId) {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }

    const targetFolder = this.folders.find(folder => folder.id === targetFolderId);
    if (!targetFolder) {
      return false;
    }

    this.items[index].folderId = targetFolderId;
    this.items[index].lastModified = new Date().toISOString();

    this.saveBookmarks();
    return true;
  },

  moveFolder(id, targetParentId) {

    if (id === 'bookmarks-bar' || id === 'other-bookmarks') {
      return false;
    }

    const index = this.folders.findIndex(folder => folder.id === id);
    if (index === -1) {
      return false;
    }

    if (id === targetParentId) {
      return false;
    }

    const targetParent = targetParentId === null ||
      this.folders.find(folder => folder.id === targetParentId);

    if (!targetParent) {
      return false;
    }

    this.folders[index].parentId = targetParentId;
    this.folders[index].lastModified = new Date().toISOString();

    this.saveBookmarks();
    return true;
  },

  importFromJson(json) {
    try {
      const data = JSON.parse(json);

      if (data.folders && Array.isArray(data.folders)) {

        const existingFolderIds = this.folders.map(f => f.id);
        this.folders = [
          ...this.folders.filter(f => f.id === 'bookmarks-bar' || f.id === 'other-bookmarks'),
          ...data.folders.filter(f => f.id !== 'bookmarks-bar' && f.id !== 'other-bookmarks')
        ];
      }

      if (data.items && Array.isArray(data.items)) {

        this.items = data.items;
      }

      this.saveBookmarks();
      return true;
    } catch (error) {
      console.error('Failed to import bookmarks:', error);
      return false;
    }
  },

  exportToJson() {
    return JSON.stringify({
      folders: this.folders,
      items: this.items
    }, null, 2);
  }
};