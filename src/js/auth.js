const Auth = {
    currentUser: null,
  
    init: function() {
      this.loginButton = document.getElementById('login-button');
      this.signupButton = document.getElementById('signup-button');
      this.loginModal = document.getElementById('login-modal');
      this.signupModal = document.getElementById('signup-modal');
      this.loginClose = document.getElementById('login-close');
      this.signupClose = document.getElementById('signup-close');
      this.loginForm = document.getElementById('login-form');
      this.signupForm = document.getElementById('signup-form');
      this.userAvatar = document.getElementById('user-avatar');
      this.authButtons = document.getElementById('auth-buttons');
  
      this.setupEventListeners();
      this.checkLoggedInStatus();
    },
  
    setupEventListeners: function() {
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
        if (e.target === this.loginModal) {
          this.hideLoginModal();
        }
        if (e.target === this.signupModal) {
          this.hideSignupModal();
        }
      });
    },
  
    showLoginModal: function() {
      this.loginModal.classList.add('show');
    },
  
    hideLoginModal: function() {
      this.loginModal.classList.remove('show');
      this.loginForm.reset();
    },
  
    showSignupModal: function() {
      this.signupModal.classList.add('show');
    },
  
    hideSignupModal: function() {
      this.signupModal.classList.remove('show');
      this.signupForm.reset();
    },
  
    login: function() {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
  
      const users = Storage.get('users', []);
      const user = users.find(u => u.email === email && u.password === password);
  
      if (user) {
        this.currentUser = user;
        Storage.set('currentUser', user);
  
        this.updateUI();
        this.hideLoginModal();
  
        alert('Logged in successfully!');
      } else {
        alert('Invalid email or password!');
      }
    },
  
    signup: function() {
      const username = document.getElementById('signup-username').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
  
      const users = Storage.get('users', []);
  
      if (users.some(u => u.email === email)) {
        alert('Email already exists!');
        return;
      }
  
      const newUser = {
        id: users.length + 1,
        username,
        email,
        password,
        createdAt: new Date().toISOString()
      };
  
      users.push(newUser);
      Storage.set('users', users);
  
      this.currentUser = newUser;
      Storage.set('currentUser', newUser);
  
      this.updateUI();
      this.hideSignupModal();
  
      alert('Signed up successfully!');
    },
  
    logout: function() {
      this.currentUser = null;
      Storage.remove('currentUser');
      this.updateUI();
      alert('Logged out successfully!');
    },
  
    checkLoggedInStatus: function() {
      const user = Storage.get('currentUser');
      if (user) {
        this.currentUser = user;
        this.updateUI();
      }
    },
  
    updateUI: function() {
      if (this.currentUser) {
        this.authButtons.classList.add('hidden');
        this.userAvatar.classList.remove('hidden');
  
        const initials = this.currentUser.username.substring(0, 1).toUpperCase();
        this.userAvatar.querySelector('span').textContent = initials;
      } else {
        this.authButtons.classList.remove('hidden');
        this.userAvatar.classList.add('hidden');
      }
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
  });
  