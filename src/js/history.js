const History = {
    history: [],
  
    init: function() {
      this.historyButton = document.getElementById('history-button');
      this.historyPanel = document.getElementById('history-panel');
      this.historyList = document.getElementById('history-list');
      this.clearHistoryButton = document.getElementById('clear-history-button');
      this.clearDataButton = document.getElementById('clear-data-button');
  
      this.history = Storage.get('history', []);
  
      this.setupEventListeners();
      this.renderHistory();
    },
  
    setupEventListeners: function() {
      this.historyButton.addEventListener('click', () => this.toggleHistoryPanel());
      this.clearHistoryButton.addEventListener('click', () => this.clearHistory());
      this.clearDataButton.addEventListener('click', () => this.clearAllData());
  
      this.historyList.addEventListener('click', (e) => {
        const historyItem = e.target.closest('.history-item');
        if (historyItem) {
          const url = historyItem.dataset.url;
          if (url) {
            Tabs.navigateTo(url);
            this.hideHistoryPanel();
          }
        }
      });
    },
  
    toggleHistoryPanel: function() {
      this.historyPanel.classList.toggle('hidden');
      this.hidePanels('history');
    },
  
    hideHistoryPanel: function() {
      this.historyPanel.classList.add('hidden');
    },
  
    addToHistory: function(item) {
      if (!item.url) return;
  
      const newItem = {
        url: item.url,
        title: item.title || item.url,
        timestamp: item.timestamp || new Date().toISOString()
      };
  
      this.history.unshift(newItem);
  
      if (this.history.length > 100) {
        this.history = this.history.slice(0, 100);
      }
  
      Storage.set('history', this.history);
      this.renderHistory();
    },
  
    renderHistory: function() {
      this.historyList.innerHTML = '';
  
      this.history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.dataset.url = item.url;
  
        const historyIcon = document.createElement('div');
        historyIcon.className = 'history-icon';
        historyIcon.innerHTML = '<i class="fas fa-globe"></i>';
  
        const historyDetails = document.createElement('div');
        historyDetails.className = 'history-details';
  
        const historyTitle = document.createElement('div');
        historyTitle.className = 'history-title';
        historyTitle.textContent = item.title;
  
        const historyUrl = document.createElement('div');
        historyUrl.className = 'history-url';
        historyUrl.textContent = item.url;
  
        historyDetails.appendChild(historyTitle);
        historyDetails.appendChild(historyUrl);
  
        const historyTime = document.createElement('div');
        historyTime.className = 'history-time';
  
        const date = new Date(item.timestamp);
        historyTime.textContent = date.toLocaleString();
  
        historyItem.appendChild(historyIcon);
        historyItem.appendChild(historyDetails);
        historyItem.appendChild(historyTime);
  
        this.historyList.appendChild(historyItem);
      });
    },
  
    clearHistory: function() {
      if (confirm('Are you sure you want to clear browsing history?')) {
        this.history = [];
        Storage.set('history', []);
        this.renderHistory();
      }
    },
  
    clearAllData: function() {
      if (confirm('Are you sure you want to clear all browsing data? This includes history, cookies, and cache.')) {
        this.history = [];
        Storage.set('history', []);
        this.renderHistory();
  
        localStorage.clear();
  
        Storage.init();
        alert('All browsing data has been cleared!');
  
        location.reload();
      }
    },
  
    hidePanels: function(except) {
      if (except !== 'bookmarks') {
        document.getElementById('bookmarks-panel').classList.add('hidden');
      }
      if (except !== 'settings') {
        document.getElementById('settings-panel').classList.add('hidden');
      }
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    History.init();
  });
  