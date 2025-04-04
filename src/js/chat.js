const Chat = {
    messages: [],
    isMinimized: true,
  
    init: function() {
      this.chatButton = document.getElementById('chat-button');
      this.chatContainer = document.getElementById('chat-container');
      this.chatHeader = document.getElementById('chat-header');
      this.chatToggle = document.getElementById('chat-toggle');
      this.chatMessages = document.getElementById('chat-messages');
      this.chatInput = document.getElementById('chat-input');
      this.sendChatButton = document.getElementById('send-chat-button');
  
      this.messages = Storage.get('chatMessages', []);
  
      this.setupEventListeners();
      this.renderMessages();
    },
  
    setupEventListeners: function() {
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
  
    toggleChat: function() {
      this.chatContainer.classList.toggle('hidden');
      if (!this.chatContainer.classList.contains('hidden')) {
        this.isMinimized = false;
        this.updateChatUI();
        this.chatInput.focus();
      }
    },
  
    updateChatUI: function() {
      if (this.isMinimized) {
        this.chatContainer.classList.add('minimized');
        this.chatToggle.textContent = '+';
      } else {
        this.chatContainer.classList.remove('minimized');
        this.chatToggle.textContent = '−';
        this.scrollToBottom();
      }
    },
  
    sendMessage: function() {
      const message = this.chatInput.value.trim();
      if (!message) return;
  
      let sender = 'Anonymous';
      if (Auth.currentUser) {
        sender = Auth.currentUser.username;
      }
  
      const newMessage = {
        id: this.messages.length + 1,
        sender: sender,
        message: message,
        timestamp: new Date().toISOString()
      };
  
      this.messages.push(newMessage);
      Storage.set('chatMessages', this.messages);
  
      this.renderMessage(newMessage);
      this.chatInput.value = '';
      this.scrollToBottom();
  
      setTimeout(() => this.simulateResponse(), 1000 + Math.random() * 2000);
    },
  
    simulateResponse: function() {
      const responses = [
        "That's interesting! Tell me more.",
        "I agree with you.",
        "That's a great point!",
        "Hello! How are you doing today?",
        "Welcome to Degree chat!",
        "Have you tried the new theme options?",
        "This browser is pretty cool, right?",
        "I like how this chat works between users.",
        "What websites do you visit the most?",
        "How are you liking the Degree experience?",
        "this is an up-and-coming ai feature. please wait",
        "i know where you live"
      ];
  
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
      const newMessage = {
        id: this.messages.length + 1,
        sender: 'Degree Bot',
        message: randomResponse,
        timestamp: new Date().toISOString()
      };
  
      this.messages.push(newMessage);
      Storage.set('chatMessages', this.messages);
  
      this.renderMessage(newMessage);
      this.scrollToBottom();
    },
  
    renderMessages: function() {
      this.chatMessages.innerHTML = '';
  
      const recentMessages = this.messages.slice(-50);
  
      recentMessages.forEach(message => this.renderMessage(message));
      this.scrollToBottom();
    },
  
    renderMessage: function(message) {
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
      contentElement.textContent = message.message;
      messageElement.appendChild(contentElement);
  
      const timeElement = document.createElement('div');
      timeElement.style.fontSize = '0.7rem';
      timeElement.style.opacity = '0.7';
      timeElement.style.marginTop = '3px';
      timeElement.textContent = new Date(message.timestamp).toLocaleTimeString();
      messageElement.appendChild(timeElement);
  
      this.chatMessages.appendChild(messageElement);
    },
  
    scrollToBottom: function() {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    Chat.init();
  });