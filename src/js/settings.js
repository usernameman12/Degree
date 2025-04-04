const Settings = {
    currentTheme: 'orange-black',
    availableThemes: {
      'orange-black': {
        primaryColor: '#ff8c00',
        primaryDark: '#e67e00',
        primaryLight: '#ffa333',
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        secondaryBg: '#2a2a2a',
        hoverColor: '#333333',
        borderColor: '#3a3a3a'
      },
      'blue-white': {
        primaryColor: '#4285f4',
        primaryDark: '#3b78e7',
        primaryLight: '#5a95f5',
        backgroundColor: '#ffffff',
        textColor: '#202124',
        secondaryBg: '#f1f3f4',
        hoverColor: '#e8eaed',
        borderColor: '#dadce0'
      },
      'green-dark': {
        primaryColor: '#34a853',
        primaryDark: '#2d9249',
        primaryLight: '#47b566',
        backgroundColor: '#202124',
        textColor: '#ffffff',
        secondaryBg: '#303134',
        hoverColor: '#383a3d',
        borderColor: '#454649'
      },
      'purple-light': {
        primaryColor: '#673ab7',
        primaryDark: '#5c33a2',
        primaryLight: '#7e57c2',
        backgroundColor: '#f5f5f5',
        textColor: '#3c4043',
        secondaryBg: '#e8eaed',
        hoverColor: '#dadce0',
        borderColor: '#dadce0'
      },
      'red-dark': {
        primaryColor: '#ea4335',
        primaryDark: '#d33426',
        primaryLight: '#ed6357',
        backgroundColor: '#202124',
        textColor: '#ffffff',
        secondaryBg: '#303134',
        hoverColor: '#383a3d',
        borderColor: '#454649'
      }
    },
  
    init: function() {
      this.settingsButton = document.getElementById('settings-button');
      this.settingsPanel = document.getElementById('settings-panel');
      this.themeSelector = document.querySelector('.theme-selector');
  
      this.currentTheme = Storage.get('theme', 'orange-black');
  
      this.setupEventListeners();
      this.applyTheme(this.currentTheme);
      this.updateThemeUI();
    },
  
    setupEventListeners: function() {
      this.settingsButton.addEventListener('click', () => this.toggleSettingsPanel());
  
      this.themeSelector.addEventListener('click', (e) => {
        const themeOption = e.target.closest('.theme-option');
        if (themeOption) {
          const theme = themeOption.dataset.theme;
          if (theme) {
            this.setTheme(theme);
          }
        }
      });
    },
  
    toggleSettingsPanel: function() {
      this.settingsPanel.classList.toggle('hidden');
      this.hidePanels('settings');
    },
  
    hideSettingsPanel: function() {
      this.settingsPanel.classList.add('hidden');
    },
  
    setTheme: function(theme) {
      if (this.availableThemes[theme]) {
        this.currentTheme = theme;
        Storage.set('theme', theme);
  
        this.applyTheme(theme);
        this.updateThemeUI();
      }
    },
  
    applyTheme: function(theme) {
      const themeConfig = this.availableThemes[theme];
      if (!themeConfig) return;
  
      const root = document.documentElement;
  
      root.style.setProperty('--primary-color', themeConfig.primaryColor);
      root.style.setProperty('--primary-dark', themeConfig.primaryDark);
      root.style.setProperty('--primary-light', themeConfig.primaryLight);
      root.style.setProperty('--background-color', themeConfig.backgroundColor);
      root.style.setProperty('--text-color', themeConfig.textColor);
      root.style.setProperty('--secondary-bg', themeConfig.secondaryBg);
      root.style.setProperty('--hover-color', themeConfig.hoverColor);
      root.style.setProperty('--border-color', themeConfig.borderColor);
    },
  
    updateThemeUI: function() {
      const themeOptions = document.querySelectorAll('.theme-option');
      themeOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.theme === this.currentTheme) {
          option.classList.add('selected');
        }
      });
    },
  
    hidePanels: function(except) {
      if (except !== 'bookmarks') {
        document.getElementById('bookmarks-panel').classList.add('hidden');
      }
      if (except !== 'history') {
        document.getElementById('history-panel').classList.add('hidden');
      }
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    Settings.init();
  });
  