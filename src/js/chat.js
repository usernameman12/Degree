const Chat = {
  messages: [],
  isMinimized: true,
  userId: null,
  socket: null,

  init: function () {
    if (!Auth.currentUser) {
      console.warn("Chat disabled: user not logged in.");
      const chatBtn = document.getElementById('chat-button');
      if (chatBtn) chatBtn.style.display = 'none';
      return;
    }

    this.chatButton = document.getElementById('chat-button');
    this.chatContainer = document.getElementById('chat-container');
    this.chatHeader = document.getElementById('chat-header');
    this.chatToggle = document.getElementById('chat-toggle');
    this.chatMessages = document.getElementById('chat-messages');
    this.chatInput = document.getElementById('chat-input');
    this.sendChatButton = document.getElementById('send-chat-button');
    this.targetUserInput = document.getElementById('chat-target-user');

    this.userId = Auth.currentUser.username;
    this.messages = Storage.get('chatMessages', []);

    this.setupEventListeners();
    this.setupWebSocket();
    this.renderMessages();
  },

  setupEventListeners: function () {
    this.chatButton.addEventListener('click', () => this.toggleChat());

    this.chatHeader.addEventListener('click', () => {
      this.isMinimized = !this.isMinimized;
      this.updateChatUI();
    });

    this.sendChatButton.addEventListener('click', () => this.sendMessage());

    this.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.sendMessage();
      }
    });
  },

  setupWebSocket: function () {
    this.socket = new WebSocket('ws://localhost:8080');

    this.socket.addEventListener('open', () => {
      this.socket.send(JSON.stringify({ type: 'register', userId: this.userId }));
    });

    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        const newMessage = {
          id: this.messages.length + 1,
          sender: data.from,
          message: data.message,
          timestamp: data.timestamp
        };

        this.messages.push(newMessage);
        Storage.set('chatMessages', this.messages);
        this.renderMessage(newMessage);
        this.scrollToBottom();
      }
    });
  },

  toggleChat: function () {
    this.chatContainer.classList.toggle('hidden');
    if (!this.chatContainer.classList.contains('hidden')) {
      this.isMinimized = false;
      this.updateChatUI();
      this.chatInput.focus();
    }
  },

  updateChatUI: function () {
    if (this.isMinimized) {
      this.chatContainer.classList.add('minimized');
      this.chatToggle.textContent = '+';
    } else {
      this.chatContainer.classList.remove('minimized');
      this.chatToggle.textContent = '−';
      this.scrollToBottom();
    }
  },

  sendMessage: function () {
    if (!Auth.currentUser) return;

    const message = this.chatInput.value.trim();
    const toUser = this.getTargetUser();
    if (!message || !toUser) return;

    const newMessage = {
      id: this.messages.length + 1,
      sender: this.userId,
      recipient: toUser,
      message: message,
      timestamp: new Date().toISOString()
    };

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'direct',
        to: toUser,
        message: message
      }));
    }

    this.messages.push(newMessage);
    Storage.set('chatMessages', this.messages);
    this.renderMessage(newMessage);
    this.chatInput.value = '';
    this.scrollToBottom();
  },

  getTargetUser: function () {
    return this.targetUserInput?.value.trim() || null;
  },

  renderMessages: function () {
    this.chatMessages.innerHTML = '';
    const recentMessages = this.messages.slice(-50);
    recentMessages.forEach(message => this.renderMessage(message));
    this.scrollToBottom();
  },

  renderMessage: function (message) {
    const messageElement = document.createElement('div');

    if (message.sender === 'system') {
      messageElement.className = 'chat-message';
      messageElement.style.alignSelf = 'center';
      messageElement.style.backgroundColor = 'rgba(255, 140, 0, 0.3)';
      messageElement.style.color = '#fff';
    } else if (Auth.currentUser && message.sender === Auth.currentUser.username) {
      messageElement.className = 'chat-message sent';
    } else {
      messageElement.className = 'chat-message received';
    }

    if (message.sender !== 'system') {
      const senderElement = document.createElement('div');
      senderElement.style.fontSize = '0.8rem';
      senderElement.style.fontWeight = 'bold';
      senderElement.textContent = message.sender;
      messageElement.appendChild(senderElement);
    }

    const contentElement = document.createElement('div');
    contentElement.innerHTML = this.sanitize(message.message);
    messageElement.appendChild(contentElement);

    const timeElement = document.createElement('div');
    timeElement.style.fontSize = '0.7rem';
    timeElement.style.opacity = '0.7';
    timeElement.style.marginTop = '3px';
    timeElement.textContent = new Date(message.timestamp).toLocaleTimeString();
    messageElement.appendChild(timeElement);

    this.chatMessages.appendChild(messageElement);
  },

  sanitize: function (text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  scrollToBottom: function () {
    requestAnimationFrame(() => {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Chat.init();
});
