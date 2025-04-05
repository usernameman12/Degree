const Chat = {
  messages: [],
  isMinimized: true,
  socket: null,
  userId: null,
  bannedUsers: [],

  init: function () {
    this.chatButton = document.getElementById('chat-button');
    this.chatContainer = document.getElementById('chat-container');
    this.chatHeader = document.getElementById('chat-header');
    this.chatToggle = document.getElementById('chat-toggle');
    this.chatMessages = document.getElementById('chat-messages');
    this.chatInput = document.getElementById('chat-input');
    this.sendChatButton = document.getElementById('send-chat-button');
    this.targetUserInput = document.getElementById('chat-target-user');

    this.messages = Storage.get('chatMessages', []);
    this.bannedUsers = Storage.get('bannedUsers', []);
    this.userId = Auth.currentUser?.username || 'Anonymous_' + Math.floor(Math.random() * 1000);

    this.setupEventListeners();
    this.setupWebSocket();
    this.renderMessages();
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
        this.renderMessage(newMessage);
        this.scrollToBottom();
      }
    });
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

  sanitize: function (text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  getTargetUser: function () {
    return this.targetUserInput?.value.trim() || 'Broadcast';
  },

  isBanned: function () {
    return this.bannedUsers.includes(this.userId);
  },

  sendMessage: function () {
    if (this.isBanned()) return;

    const message = this.chatInput.value.trim();
    if (!message) return;

    const toUser = this.getTargetUser();

    const newMessage = {
      id: this.messages.length + 1,
      sender: this.userId,
      recipient: toUser,
      message: message,
      timestamp: new Date().toISOString()
    };

    this.socket.send(JSON.stringify({
      type: 'direct',
      to: toUser,
      message: message
    }));

    this.messages.push(newMessage);
    this.renderMessage(newMessage);
    this.chatInput.value = '';
    this.scrollToBottom();
  },

  banUser: function (user) {
    if (!this.bannedUsers.includes(user)) {
      this.bannedUsers.push(user);
      Storage.set('bannedUsers', this.bannedUsers);
    }
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
    } else if (message.sender === this.userId) {
      messageElement.className = 'chat-message sent';
    } else {
      messageElement.className = 'chat-message received';
    }

    if (message.sender !== 'system') {
      const senderWrapper = document.createElement('div');
      senderWrapper.style.display = 'flex';
      senderWrapper.style.justifyContent = 'space-between';
      senderWrapper.style.alignItems = 'center';

      const senderElement = document.createElement('div');
      senderElement.style.fontSize = '0.8rem';
      senderElement.style.fontWeight = 'bold';
      senderElement.textContent = message.sender;
      senderWrapper.appendChild(senderElement);

      if (this.userId === 'oreo' && message.sender !== 'oreo') {
        const dropdown = document.createElement('select');
        const defaultOption = document.createElement('option');
        defaultOption.textContent = '⋮';
        defaultOption.disabled = true;
        defaultOption.selected = true;

        const banOption = document.createElement('option');
        banOption.textContent = 'Ban';

        dropdown.appendChild(defaultOption);
        dropdown.appendChild(banOption);
        dropdown.addEventListener('change', () => {
          if (dropdown.value === 'Ban') {
            this.banUser(message.sender);
          }
        });

        dropdown.style.fontSize = '0.8rem';
        dropdown.style.marginLeft = '5px';
        senderWrapper.appendChild(dropdown);
      }

      messageElement.appendChild(senderWrapper);
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

  scrollToBottom: function () {
    requestAnimationFrame(() => {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Chat.init();
});
