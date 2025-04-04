export const history = {
    items: [],

    init() {
      this.loadHistory();
    },

    loadHistory() {
      try {
        const savedHistory = localStorage.getItem('degree-history');
        if (savedHistory) {
          this.items = JSON.parse(savedHistory);
        }
      } catch (error) {
        console.error('Failed to load history:', error);
        this.items = [];
      }
    },

    saveHistory() {
      try {
        localStorage.setItem('degree-history', JSON.stringify(this.items));
      } catch (error) {
        console.error('Failed to save history:', error);
      }
    },

    addItem(url, title, userId = null) {

      if (this.items.length > 0 && this.items[0].url === url) {

        this.items[0].lastVisited = new Date().toISOString();
        this.items[0].visitCount += 1;
      } else {

        const existingIndex = this.items.findIndex(item => item.url === url);
        if (existingIndex !== -1) {
          const existing = this.items[existingIndex];
          this.items.splice(existingIndex, 1);
          this.items.unshift({
            ...existing,
            title: title || existing.title,
            lastVisited: new Date().toISOString(),
            visitCount: existing.visitCount + 1
          });
        } else {

          this.items.unshift({
            url,
            title: title || url,
            firstVisited: new Date().toISOString(),
            lastVisited: new Date().toISOString(),
            visitCount: 1,
            userId
          });
        }
      }

      if (this.items.length > 1000) {
        this.items = this.items.slice(0, 1000);
      }

      this.saveHistory();
    },

    getByDate(date) {
      const dateStr = new Date(date).toISOString().split('T')[0];
      return this.items.filter(item => {
        const itemDate = new Date(item.lastVisited).toISOString().split('T')[0];
        return itemDate === dateStr;
      });
    },

    getGroupedByDate() {
      const grouped = {};

      this.items.forEach(item => {
        const date = new Date(item.lastVisited).toISOString().split('T')[0];
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(item);
      });

      return grouped;
    },

    search(query) {
      if (!query) return [];

      const lowerQuery = query.toLowerCase();
      return this.items.filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.url.toLowerCase().includes(lowerQuery)
      );
    },

    deleteItem(url) {
      const initialLength = this.items.length;
      this.items = this.items.filter(item => item.url !== url);

      if (this.items.length !== initialLength) {
        this.saveHistory();
        return true;
      }

      return false;
    },

    deleteItems(urls) {
      const initialLength = this.items.length;
      this.items = this.items.filter(item => !urls.includes(item.url));

      if (this.items.length !== initialLength) {
        this.saveHistory();
        return true;
      }

      return false;
    },

    deleteByDate(date) {
      const dateStr = new Date(date).toISOString().split('T')[0];
      const initialLength = this.items.length;

      this.items = this.items.filter(item => {
        const itemDate = new Date(item.lastVisited).toISOString().split('T')[0];
        return itemDate !== dateStr;
      });

      if (this.items.length !== initialLength) {
        this.saveHistory();
        return true;
      }

      return false;
    },

    clear() {
      this.items = [];
      this.saveHistory();
    },

    getFrequentSites(limit = 8) {
      return [...this.items]
        .sort((a, b) => b.visitCount - a.visitCount)
        .slice(0, limit);
    },

    getRecentSites(limit = 10) {
      return this.items.slice(0, limit);
    }
  };