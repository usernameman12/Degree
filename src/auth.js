import { io } from 'socket.io-client';

let socket = null;

export const auth = {

  currentUser: null,
  users: [
    {
      id: 'user1',
      username: 'johndoe',
      displayName: 'John Doe',
      email: 'john@example.com',
      password: 'password123', 
      avatar: '',
      createdAt: new Date('2023-01-10').toISOString(),
      preferences: {
        theme: 'orange-black',
        notifications: true
      }
    },
    {
      id: 'user2',
      username: 'janedoe',
      displayName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password456',
      avatar: '',
      createdAt: new Date('2023-02-15').toISOString(),
      preferences: {
        theme: 'blue-dark',
        notifications: true
      }
    }
  ],

  isAuthenticated() {
    return this.currentUser !== null;
  },

  init() {

    try {
      const savedAuth = localStorage.getItem('degree-auth');
      if (savedAuth) {
        const { userId, authToken } = JSON.parse(savedAuth);
        this.validateToken(userId, authToken);
      }
    } catch (error) {
      console.error('Failed to restore authentication:', error);
      this.logout();
    }

    if (this.isAuthenticated()) {
      this.setupSocket();
    }
  },

  login(usernameOrEmail, password) {

    const user = this.users.find(u =>
      (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
      u.password === password
    );

    if (user) {

      const token = this.generateToken();

      this.currentUser = {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        authToken: token
      };

      this.saveAuth();

      this.setupSocket();

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          email: user.email,
          avatar: user.avatar
        }
      };
    }

    return {
      success: false,
      error: 'Invalid username or password'
    };
  },

  register(userData) {

    const usernameExists = this.users.some(u => u.username === userData.username);
    if (usernameExists) {
      return {
        success: false,
        error: 'Username already taken'
      };
    }

    const emailExists = this.users.some(u => u.email === userData.email);
    if (emailExists) {
      return {
        success: false,
        error: 'Email already registered'
      };
    }

    const newUser = {
      id: `user${this.users.length + 1}`,
      username: userData.username,
      displayName: userData.displayName || userData.username,
      email: userData.email,
      password: userData.password,
      avatar: userData.avatar || '',
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'orange-black',
        notifications: true
      }
    };

    this.users.push(newUser);

    return this.login(userData.username, userData.password);
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('degree-auth');

    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  updateProfile(profileData) {
    if (!this.currentUser) return false;

    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex === -1) return false;

    if (profileData.displayName) {
      this.users[userIndex].displayName = profileData.displayName;
      this.currentUser.displayName = profileData.displayName;
    }

    if (profileData.avatar) {
      this.users[userIndex].avatar = profileData.avatar;
      this.currentUser.avatar = profileData.avatar;
    }

    this.saveAuth();

    return true;
  },

  changePassword(oldPassword, newPassword) {
    if (!this.currentUser) return false;

    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex === -1 || this.users[userIndex].password !== oldPassword) {
      return false;
    }

    this.users[userIndex].password = newPassword;
    return true;
  },

  saveAuth() {
    if (!this.currentUser) return;

    const authData = {
      userId: this.currentUser.id,
      authToken: this.currentUser.authToken
    };

    localStorage.setItem('degree-auth', JSON.stringify(authData));
  },

  validateToken(userId, token) {

    const user = this.users.find(u => u.id === userId);

    if (user) {
      this.currentUser = {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        authToken: token
      };
      return true;
    }

    return false;
  },

  generateToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  },

  updatePreference(preference, value) {
    if (!this.currentUser) return false;

    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex === -1) return false;

    this.users[userIndex].preferences[preference] = value;
    this.currentUser.preferences[preference] = value;

    this.saveAuth();

    return true;
  },

  setupSocket() {
    if (!this.currentUser || socket) return;

    socket = io.connect('https://mock-socket-server.example.com', {
      query: {
        userId: this.currentUser.id,
        authToken: this.currentUser.authToken
      },
      autoConnect: false
    });

    this.mockSocketConnection();
  },

  mockSocketConnection() {

    const events = {};

    if (socket) {

      const originalEmit = socket.emit;

      socket.connect = () => {
        setTimeout(() => {
          if (events['connect']) {
            events['connect'].forEach(callback => callback());
          }
        }, 500);
      };

      socket.disconnect = () => {
        setTimeout(() => {
          if (events['disconnect']) {
            events['disconnect'].forEach(callback => callback());
          }
        }, 300);
      };

      socket.on = (event, callback) => {
        if (!events[event]) {
          events[event] = [];
        }
        events[event].push(callback);
      };

      socket.off = (event, callback) => {
        if (events[event]) {
          if (callback) {
            events[event] = events[event].filter(cb => cb !== callback);
          } else {
            delete events[event];
          }
        }
      };

      socket.emit = (event, ...args) => {
        console.log(`Socket emit: ${event}`, args);
        if (event === 'chat message') {
          const message = args[0];
          setTimeout(() => {
            if (events['chat message']) {
              events['chat message'].forEach(callback => {
                callback({
                  id: Date.now().toString(),
                  userId: this.currentUser.id,
                  username: this.currentUser.username,
                  message: message,
                  timestamp: new Date().toISOString()
                });
              });
            }
          }, 300);
        }

        return originalEmit.apply(socket, [event, ...args]);
      };

      socket.connect();
    }
  },

  sendChatMessage(message) {
    if (!socket || !this.currentUser) return false;

    socket.emit('chat message', message);
    return true;
  },

  onChatMessage(callback) {
    if (!socket) return;

    socket.on('chat message', callback);
  },

  offChatMessage(callback) {
    if (!socket) return;

    socket.off('chat message', callback);
  }
};