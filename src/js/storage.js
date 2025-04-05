const Storage = {
    get: function(key, defaultValue = null) {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    },
  
    set: function(key, value) {
      if (typeof value === 'object') {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, value);
      }
    },
  
    remove: function(key) {
      localStorage.removeItem(key);
    },
  
    clear: function() {
      localStorage.clear();
    },
  
    init: function() {
      if (!this.get('bookmarks')) {
        this.set('bookmarks', [
          { id: 1, name: 'Poki', url: 'https://www.poki.com', icon: 'fab fa-games' },
          { id: 2, name: 'YouTube', url: 'https://www.youtube.com', icon: 'fab fa-youtube' },
        ]);
      }
  
      if (!this.get('history')) {
        this.set('history', []);
      }
  
      if (!this.get('theme')) {
        this.set('theme', 'orange-black');
      }
  
      if (!this.get('tabs')) {
        this.set('tabs', [{
          id: 'tab1',
          title: 'New Tab',
          url: '',
          active: true
        }]);
      }
  
      if (!this.get('users')) {
        this.set('users', []);
      }
  
      if (!this.get('chatMessages')) {
        this.set('chatMessages', [
          { id: 1, sender: 'system', message: 'Welcome to Hydrogen Chat! Feel free to chat with other users.', timestamp: new Date().toISOString() }
        ]);
      }
    }
  };
  
  Storage.init();
  