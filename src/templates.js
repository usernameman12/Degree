import * as utils from './utils.js';

export const authModalTemplate = `
  <div class="auth-modal" id="auth-modal">
    <div class="auth-modal-content">
      <div class="auth-modal-header">
        <h3 class="auth-modal-title" id="auth-modal-title">Log In</h3>
        <button class="auth-close-btn" id="auth-close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div id="login-form-container">
        <form class="auth-form" id="login-form">
          <div class="form-group">
            <label class="form-label" for="login-username">Username or Email</label>
            <input class="form-input" type="text" id="login-username" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="login-password">Password</label>
            <input class="form-input" type="password" id="login-password" required>
          </div>

          <button type="submit" class="form-submit">Log In</button>

          <div class="auth-error" id="login-error"></div>

          <div class="auth-switch">
            Don't have an account? <span class="auth-switch-link" id="switch-to-signup">Sign Up</span>
          </div>
        </form>
      </div>

      <div id="signup-form-container" style="display: none;">
        <form class="auth-form" id="signup-form">
          <div class="form-group">
            <label class="form-label" for="signup-username">Username</label>
            <input class="form-input" type="text" id="signup-username" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-email">Email</label>
            <input class="form-input" type="email" id="signup-email" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-display-name">Display Name</label>
            <input class="form-input" type="text" id="signup-display-name">
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-password">Password</label>
            <input class="form-input" type="password" id="signup-password" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-confirm-password">Confirm Password</label>
            <input class="form-input" type="password" id="signup-confirm-password" required>
          </div>

          <button type="submit" class="form-submit">Sign Up</button>

          <div class="auth-error" id="signup-error"></div>

          <div class="auth-switch">
            Already have an account? <span class="auth-switch-link" id="switch-to-login">Log In</span>
          </div>
        </form>
      </div>
    </div>
  </div>
`;

export const historyPanelTemplate = `
  <div class="browser-panel" id="history-panel">
    <div class="panel-header">
      <h3 class="panel-title">History</h3>
      <button class="panel-close" id="history-close-btn">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="panel-search">
      <i class="fas fa-search panel-search-icon"></i>
      <input type="text" class="panel-search-input" id="history-search" placeholder="Search history">
    </div>

    <div class="add-item-bar">
      <button class="add-item-btn" id="clear-history-btn">
        <i class="fas fa-trash"></i>
        Clear All History
      </button>
    </div>

    <div class="panel-content" id="history-content">
      <!-- History items will be added here dynamically -->
    </div>
  </div>
`;

export const bookmarksPanelTemplate = `
  <div class="browser-panel" id="bookmarks-panel">
    <div class="panel-header">
      <h3 class="panel-title">Bookmarks</h3>
      <button class="panel-close" id="bookmarks-close-btn">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="panel-search">
      <i class="fas fa-search panel-search-icon"></i>
      <input type="text" class="panel-search-input" id="bookmarks-search" placeholder="Search bookmarks">
    </div>

    <div class="add-item-bar">
      <button class="add-item-btn" id="add-bookmark-btn">
        <i class="fas fa-bookmark"></i>
        Add Bookmark
      </button>
      <button class="add-item-btn" id="add-folder-btn">
        <i class="fas fa-folder-plus"></i>
        Add Folder
      </button>
    </div>

    <div class="panel-content" id="bookmarks-content">
      <!-- Bookmark folders and items will be added here dynamically -->
    </div>
  </div>
`;

export const chatPanelTemplate = `
  <div class="chat-panel" id="chat-panel">
    <div class="chat-header">
      <span class="chat-title">Chat</span>
      <div style="display: flex; gap: 10px;">
        <button id="chat-users-btn" class="nav-btn" style="font-size: 14px;">
          <i class="fas fa-users"></i>
        </button>
        <button class="chat-close" id="chat-close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <div class="chat-messages" id="chat-messages">
      <div class="chat-message received">
        Welcome to Degree Chat! You can start a conversation with other connected users.
      </div>
    </div>

    <div class="chat-input-container">
      <input type="text" class="chat-input" id="chat-input" placeholder="Type a message...">
      <button class="chat-send" id="chat-send-btn">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>

    <div class="chat-user-list" id="chat-user-list">
      <!-- Connected users will be added here dynamically -->
    </div>
  </div>
`;

export function renderHistoryItems(historyItems) {
  if (!historyItems || historyItems.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-history"></i>
        </div>
        <div class="empty-state-text">
          No browsing history yet
        </div>
      </div>
    `;
  }

  const grouped = {};

  historyItems.forEach(item => {
    const date = new Date(item.lastVisited).toISOString().split('T')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  let html = '';

  sortedDates.forEach(date => {
    const formattedDate = formatDate(date);

    html += `
      <div class="history-date-group">
        <div class="history-date">${formattedDate}</div>
        <div class="history-items">
    `;

    grouped[date].forEach(item => {
      const favicon = item.favicon || utils.getFaviconUrl(item.url);
      const title = item.title || item.url;
      const time = formatTime(item.lastVisited);

      html += `
        <div class="history-item" data-url="${item.url}">
          <img src="${favicon}" class="history-item-favicon" onerror="this.src='https://www.google.com/favicon.ico';">
          <div class="history-item-info">
            <div class="history-item-title">${title}</div>
            <div class="history-item-url">${item.url}</div>
          </div>
          <div class="history-item-time">${time}</div>
          <div class="history-item-actions">
            <button class="history-action-btn history-delete-btn" data-url="${item.url}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  return html;
}

export function renderBookmarks(folders, bookmarks) {
  if (!folders || !bookmarks || (folders.length <= 2 && bookmarks.length === 0)) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-bookmark"></i>
        </div>
        <div class="empty-state-text">
          No bookmarks yet
        </div>
      </div>
    `;
  }

  const rootFolders = folders.filter(folder => folder.parentId === null);

  let html = '';

  rootFolders.forEach(folder => {
    html += renderBookmarkFolder(folder, folders, bookmarks);
  });

  return html;
}

function renderBookmarkFolder(folder, allFolders, allBookmarks) {
  const subfolders = allFolders.filter(f => f.parentId === folder.id);
  const bookmarksInFolder = allBookmarks.filter(b => b.folderId === folder.id);

  let html = `
    <div class="bookmarks-folder" data-folder-id="${folder.id}">
      <div class="bookmarks-folder-header">
        <i class="fas fa-folder bookmarks-folder-icon"></i>
        <div class="bookmarks-folder-name">${folder.name}</div>
        <div class="bookmarks-folder-toggle">
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>
      <div class="bookmarks-items">
  `;

  subfolders.forEach(subfolder => {
    html += renderBookmarkFolder(subfolder, allFolders, allBookmarks);
  });

  bookmarksInFolder.forEach(bookmark => {
    const favicon = bookmark.favicon || utils.getFaviconUrl(bookmark.url);

    html += `
      <div class="bookmark-item" data-bookmark-id="${bookmark.id}" data-url="${bookmark.url}">
        <img src="${favicon}" class="bookmark-item-favicon" onerror="this.src='https://www.google.com/favicon.ico';">
        <div class="bookmark-item-info">
          <div class="bookmark-item-title">${bookmark.title}</div>
          <div class="bookmark-item-url">${bookmark.url}</div>
        </div>
        <div class="bookmark-item-actions">
          <button class="bookmark-action-btn bookmark-edit-btn" data-bookmark-id="${bookmark.id}">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="bookmark-action-btn bookmark-delete-btn" data-bookmark-id="${bookmark.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  return html;
}

export function renderChatUsers(users) {
  if (!users || users.length === 0) {
    return `
      <div style="padding: 15px; text-align: center; color: #aaa;">
        No users online
      </div>
    `;
  }

  let html = '';

  users.forEach(user => {
    const isOnline = user.status === 'online';
    const statusText = isOnline ? 'Online' : 'Offline';
    const statusIndicator = isOnline
      ? '<span class="chat-online-indicator"></span>'
      : '';

    html += `
      <div class="chat-user-item" data-user-id="${user.id}">
        <div class="chat-user-avatar">
          ${user.avatar ? `<img src="${user.avatar}" alt="${user.displayName}">` : user.displayName.charAt(0).toUpperCase()}
        </div>
        <div class="chat-user-info">
          <div class="chat-user-name">${user.displayName}</div>
          <div class="chat-user-status">
            ${statusIndicator}${statusText}
          </div>
        </div>
      </div>
    `;
  });

  return html;
}

export function renderChatMessages(messages, currentUserId) {
  if (!messages || messages.length === 0) {
    return '';
  }

  let html = '';

  messages.forEach(message => {
    const isSentByMe = message.senderId === currentUserId;
    const messageClass = isSentByMe ? 'sent' : 'received';

    html += `
      <div class="chat-message ${messageClass}" data-message-id="${message.id}">
        ${message.text}
      </div>
    `;
  });

  return html;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}