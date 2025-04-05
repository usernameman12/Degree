const Auth = {
  currentUser: null,

  init: function () {
    this.loginButton = document.getElementById('login-button');
    this.signupButton = document.getElementById('signup-button');
    this.loginModal = document.getElementById('login-modal');
    this.signupModal = document.getElementById('signup-modal');
    this.loginClose = document.getElementById('login-close');
    this.signupClose = document.getElementById('signup-close');
    this.loginForm = document.getElementById('login-form');
    this.signupForm = document.getElementById('signup-form');
    this.userAvatar = document.getElementById('user-avatar');
    this.avatarImg = document.getElementById('avatar-img');
    this.authButtons = document.getElementById('auth-buttons');
    this.feedback = document.getElementById('auth-feedback');

    this.setupEventListeners();
    this.checkLoggedInStatus();
  },

  setupEventListeners: function () {
    this.loginButton.addEventListener('click', () => this.showLoginModal());
    this.signupButton.addEventListener('click', () => this.showSignupModal());
    this.loginClose.addEventListener('click', () => this.hideLoginModal());
    this.signupClose.addEventListener('click', () => this.hideSignupModal());

    this.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.login();
    });

    this.signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.signup();
    });

    this.userAvatar.addEventListener('click', () => this.logout());

    window.addEventListener('click', (e) => {
      if (e.target === this.loginModal) this.hideLoginModal();
      if (e.target === this.signupModal) this.hideSignupModal();
    });
  },

  showLoginModal: function () {
    this.loginModal.classList.add('show');
    this.clearFeedback();
  },

  hideLoginModal: function () {
    this.loginModal.classList.remove('show');
    this.loginForm.reset();
    this.clearFeedback();
  },

  showSignupModal: function () {
    this.signupModal.classList.add('show');
    this.clearFeedback();
  },

  hideSignupModal: function () {
    this.signupModal.classList.remove('show');
    this.signupForm.reset();
    this.clearFeedback();
  },

  login: function () {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = Storage.get('users', []);
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      this.currentUser = user;
      Storage.set('currentUser', user);
      this.updateUI();
      this.hideLoginModal();
      this.showFeedback('Logged in successfully!', 'success');
    } else {
      this.showFeedback('Invalid email or password!', 'error');
    }
  },

  signup: function () {
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const avatarUrl = document.getElementById('signup-avatar').value.trim();

    const users = Storage.get('users', []);

    if (!username || !email || !password) {
      this.showFeedback('Please fill in all required fields.', 'error');
      return;
    }

    if (username.toLowerCase() === 'oreo') {
      this.showFeedback('Username "Oreo" is not allowed.', 'error');
      return;
    }

    if (users.some(u => u.email === email)) {
      this.showFeedback('Email already exists!', 'error');
      return;
    }

    const newUser = {
      id: users.length + 1,
      username,
      email,
      password,
      avatarUrl,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    Storage.set('users', users);
    this.currentUser = newUser;
    Storage.set('currentUser', newUser);
    this.updateUI();
    this.hideSignupModal();
    this.showFeedback('Signed up successfully!', 'success');
  },

  logout: function () {
    this.currentUser = null;
    Storage.remove('currentUser');
    this.updateUI();
    this.showFeedback('Logged out successfully!', 'success');
  },

  checkLoggedInStatus: function () {
    const user = Storage.get('currentUser');
    if (user) {
      this.currentUser = user;
      this.updateUI();
    }
  },

  updateUI: function () {
    if (this.currentUser) {
      this.authButtons.classList.add('hidden');
      this.userAvatar.classList.remove('hidden');

      if (this.currentUser.avatarUrl) {
        this.avatarImg.src = this.currentUser.avatarUrl;
      } else {
        const initials = this.currentUser.username[0].toUpperCase();
        this.avatarImg.src = `https://ui-avatars.com/api/?name=${initials}`;
      }
    } else {
      this.authButtons.classList.remove('hidden');
      this.userAvatar.classList.add('hidden');
      this.avatarImg.src = '';
    }
  },

  showFeedback: function (message, type = 'info') {
    this.feedback.textContent = message;
    this.feedback.className = `feedback ${type}`;
  },

  clearFeedback: function () {
    this.feedback.textContent = '';
    this.feedback.className = 'feedback';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
