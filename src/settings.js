export const settings = {

    currentTheme: 'orange-black',

    userPreferences: {
      blockPopups: true,
      enableNotifications: true,
      autoPlayMedia: false,
      saveHistory: true,
      clearDataOnExit: false
    },

    account: {
      isLoggedIn: false,
      displayName: '',
      email: '',
      avatar: '',
      lastLogin: null
    },

    loadSettings() {
      try {
        const savedSettings = localStorage.getItem('browser-settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          this.currentTheme = parsed.currentTheme || this.currentTheme;
          this.userPreferences = { ...this.userPreferences, ...parsed.userPreferences };
          this.account = { ...this.account, ...parsed.account };
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    },

    saveSettings() {
      try {
        localStorage.setItem('browser-settings', JSON.stringify({
          currentTheme: this.currentTheme,
          userPreferences: this.userPreferences,
          account: this.account
        }));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    },

    updateTheme(themeName) {
      this.currentTheme = themeName;
      document.documentElement.className = `theme-${themeName}`;
      this.saveSettings();
    },

    updatePreference(preferenceName, value) {
      if (preferenceName in this.userPreferences) {
        this.userPreferences[preferenceName] = value;
        this.saveSettings();
        return true;
      }
      return false;
    },

    resetSettings() {
      this.currentTheme = 'orange-black';
      this.userPreferences = {
        blockPopups: true,
        enableNotifications: true,
        autoPlayMedia: false,
        saveHistory: true,
        clearDataOnExit: false
      };
      document.documentElement.className = `theme-${this.currentTheme}`;
      this.saveSettings();
    },

    login(displayName, email, avatar = '') {
      this.account.isLoggedIn = true;
      this.account.displayName = displayName;
      this.account.email = email;
      this.account.avatar = avatar;
      this.account.lastLogin = new Date().toISOString();
      this.saveSettings();
    },

    logout() {
      this.account.isLoggedIn = false;
      this.saveSettings();
    }
  };