import './style.css';

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('root');

  root.innerHTML = `
    <div id="browser" class="theme-orange-black">
      <div id="tab-container">
        <div class="tab active">
          <span class="tab-title">New Tab</span>
          <div class="tab-close"><i class="fas fa-times"></i></div>
        </div>
        <button id="new-tab-btn"><i class="fas fa-plus"></i></button>
      </div>
      <div id="address-bar">
        <div id="nav-buttons">
          <button class="nav-btn" id="back-btn"><i class="fas fa-arrow-left"></i></button>
          <button class="nav-btn" id="forward-btn"><i class="fas fa-arrow-right"></i></button>
          <button class="nav-btn" id="refresh-btn"><i class="fas fa-redo-alt"></i></button>
        </div>
        <input type="text" id="url-input" placeholder="Search or enter web address">
        <div id="browser-tools">
          <button class="nav-btn" id="bookmark-btn"><i class="far fa-bookmark"></i></button>
          <button class="nav-btn" id="history-btn"><i class="fas fa-history"></i></button>
          <button class="nav-btn" id="bookmarks-btn"><i class="fas fa-bookmark"></i></button>
          <button class="nav-btn" id="settings-btn"><i class="fas fa-cog"></i></button>
          <button class="nav-btn" id="chat-btn"><i class="fas fa-comment"></i></button>
          <button class="nav-btn" id="account-btn"><i class="fas fa-user"></i></button>
        </div>
      </div>
      <div id="iframe-container">
        <div class="new-tab-page">
          <div id="browser-logo">Degree</div>
          <div class="search-container">
            <i class="fas fa-search search-icon"></i>
            <input type="text" class="search-box" id="search-box" placeholder="Search the web">
          </div>
          <div class="shortcuts">
            <div class="shortcut" data-action="settings">
              <div class="shortcut-icon">
                <i class="fas fa-cog"></i>
              </div>
              <div class="shortcut-name">Settings</div>
            </div>
            <div class="shortcut" data-action="history">
              <div class="shortcut-icon">
                <i class="fas fa-history"></i>
              </div>
              <div class="shortcut-name">History</div>
            </div>
            <div class="shortcut" data-action="bookmarks">
              <div class="shortcut-icon">
                <i class="fas fa-bookmark"></i>
              </div>
              <div class="shortcut-name">Bookmarks</div>
            </div>
            <div class="shortcut" data-action="downloads">
              <div class="shortcut-icon">
                <i class="fas fa-download"></i>
              </div>
              <div class="shortcut-name">Downloads</div>
            </div>
            <div class="shortcut" data-action="extensions">
              <div class="shortcut-icon">
                <i class="fas fa-puzzle-piece"></i>
              </div>
              <div class="shortcut-name">Extensions</div>
            </div>
            <div class="shortcut" data-action="games">
              <div class="shortcut-icon">
                <i class="fas fa-gamepad"></i>
              </div>
              <div class="shortcut-name">Games</div>
            </div>
            <div class="shortcut" data-action="apps">
              <div class="shortcut-icon">
                <i class="fas fa-th-large"></i>
              </div>
              <div class="shortcut-name">Apps</div>
            </div>
          </div>
        </div>
      </div>
      <div id="settings-panel">
        <div class="settings-header">
          <span class="settings-title">Settings</span>
          <button class="close-settings"><i class="fas fa-times"></i></button>
        </div>
        <div class="settings-section">
          <div class="settings-section-title">Appearance</div>
          <div class="setting-item">
            <span class="setting-label">Theme</span>
          </div>
          <div class="theme-selector">
            <div class="theme-option theme-orange-black-option selected" data-theme="orange-black"></div>
            <div class="theme-option theme-blue-dark-option" data-theme="blue-dark"></div>
            <div class="theme-option theme-pink-light-option" data-theme="pink-light"></div>
          </div>
        </div>
        <div class="settings-section">
          <div class="settings-section-title">Privacy & Security</div>
          <div class="setting-item">
            <span class="setting-label">Block pop-ups</span>
            <label class="switch">
              <input type="checkbox" id="block-popups" checked>
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="settings-section">
          <div class="settings-section-title">Account</div>
          <div class="accounts-section" id="account-section">
            <div class="account-info" id="logged-out-view">
              <button class="account-btn" id="login-btn">Log in</button>
              <button class="account-btn secondary" id="signup-btn">Sign up</button>
            </div>
            <div class="account-info" id="logged-in-view" style="display: none;">
              <div class="account-avatar">
                <i class="fas fa-user"></i>
              </div>
              <div>
                <div class="account-name" id="account-name">User Name</div>
                <div class="account-email" id="account-email">user@example.com</div>
              </div>
            </div>
            <div class="account-actions" id="account-actions" style="display: none;">
              <button class="account-btn" id="logout-btn">Log out</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Panel -->
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
          <div class="chat-user-item">
            <div class="chat-user-avatar">J</div>
            <div class="chat-user-info">
              <div class="chat-user-name">Jane Doe</div>
              <div class="chat-user-status">
                <span class="chat-online-indicator"></span>Online
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Auth Modal -->
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

      <!-- History Panel -->
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

        <div class="panel-content" id="history-content">
          <div class="empty-state">
            <div class="empty-state-icon">
              <i class="fas fa-history"></i>
            </div>
            <div class="empty-state-text">
              No browsing history yet
            </div>
          </div>
        </div>
      </div>

      <!-- Bookmarks Panel -->
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

        <div class="panel-content" id="bookmarks-content">
          <div class="empty-state">
            <div class="empty-state-icon">
              <i class="fas fa-bookmark"></i>
            </div>
            <div class="empty-state-text">
              No bookmarks yet
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  function navigateToUrl(url) {
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        url = 'https://google.com/search?q=' + encodeURIComponent(url);
      }
    }

    const iframeContainer = document.getElementById('iframe-container');
    iframeContainer.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframeContainer.appendChild(iframe);

    document.getElementById('url-input').value = url;
  }

  document.getElementById('url-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      navigateToUrl(e.target.value);
    }
  });

  document.getElementById('search-box').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      navigateToUrl(e.target.value);
    }
  });

  document.getElementById('settings-btn').addEventListener('click', () => {
    document.getElementById('settings-panel').classList.toggle('open');
  });

  document.querySelector('.close-settings').addEventListener('click', () => {
    document.getElementById('settings-panel').classList.remove('open');
  });

  document.getElementById('chat-btn').addEventListener('click', () => {
    document.getElementById('chat-panel').classList.toggle('open');
  });

  document.getElementById('chat-close-btn').addEventListener('click', () => {
    document.getElementById('chat-panel').classList.remove('open');
  });

  document.getElementById('chat-users-btn').addEventListener('click', () => {
    document.getElementById('chat-user-list').classList.toggle('open');
  });

  document.getElementById('history-btn').addEventListener('click', () => {
    document.getElementById('history-panel').classList.add('open');
  });

  document.getElementById('history-close-btn').addEventListener('click', () => {
    document.getElementById('history-panel').classList.remove('open');
  });

  document.getElementById('bookmarks-btn').addEventListener('click', () => {
    document.getElementById('bookmarks-panel').classList.add('open');
  });

  document.getElementById('bookmarks-close-btn').addEventListener('click', () => {
    document.getElementById('bookmarks-panel').classList.remove('open');
  });

  document.getElementById('account-btn').addEventListener('click', () => {
    document.getElementById('auth-modal').classList.add('open');
  });

  document.getElementById('auth-close-btn').addEventListener('click', () => {
    document.getElementById('auth-modal').classList.remove('open');
  });

  document.getElementById('switch-to-signup').addEventListener('click', () => {
    document.getElementById('login-form-container').style.display = 'none';
    document.getElementById('signup-form-container').style.display = 'block';
    document.getElementById('auth-modal-title').textContent = 'Sign Up';
  });

  document.getElementById('switch-to-login').addEventListener('click', () => {
    document.getElementById('signup-form-container').style.display = 'none';
    document.getElementById('login-form-container').style.display = 'block';
    document.getElementById('auth-modal-title').textContent = 'Log In';
  });

  document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.dataset.theme;
      document.documentElement.className = `theme-${theme}`;

      document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.toggle('selected', opt === option);
      });
    });
  });

  document.getElementById('refresh-btn').addEventListener('click', () => {
    const iframe = document.querySelector('#iframe-container iframe');
    if (iframe) {
      iframe.contentWindow.location.reload();
    }
  });

  document.getElementById('back-btn').addEventListener('click', () => {
    const iframe = document.querySelector('#iframe-container iframe');
    if (iframe) {
      iframe.contentWindow.history.back();
    }
  });

  document.getElementById('forward-btn').addEventListener('click', () => {
    const iframe = document.querySelector('#iframe-container iframe');
    if (iframe) {
      iframe.contentWindow.history.forward();
    }
  });

  document.addEventListener('click', (e) => {
    const shortcut = e.target.closest('.shortcut');
    if (shortcut) {
      const action = shortcut.dataset.action;
      if (action === 'settings') {
        document.getElementById('settings-panel').classList.add('open');
      } else if (action === 'history') {
        document.getElementById('history-panel').classList.add('open');
      } else if (action === 'bookmarks') {
        document.getElementById('bookmarks-panel').classList.add('open');
      }
    }
  });
});