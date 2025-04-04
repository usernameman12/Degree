import { auth } from './auth.js';

export const chat = {

  conversations: {},

  connectedUsers: [

    {
      id: 'user2',
      username: 'janedoe',
      displayName: 'Jane Doe',
      status: 'online',
      lastSeen: new Date().toISOString()
    }
  ],

  callbacks: {
    onUserStatusChange: null,
    onNewMessage: null,
    onConversationUpdate: null
  },

  init() {
    this.loadConversations();

    if (auth.isAuthenticated()) {
      auth.onChatMessage(this.handleIncomingMessage.bind(this));
    }
  },

  loadConversations() {
    if (!auth.isAuthenticated()) return;

    try {
      const userId = auth.currentUser.id;
      const savedConversations = localStorage.getItem(`degree-chats-${userId}`);

      if (savedConversations) {
        this.conversations = JSON.parse(savedConversations);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      this.conversations = {};
    }
  },

  saveConversations() {
    if (!auth.isAuthenticated()) return;

    try {
      const userId = auth.currentUser.id;
      localStorage.setItem(`degree-chats-${userId}`, JSON.stringify(this.conversations));
    } catch (error) {
      console.error('Failed to save conversations:', error);
    }
  },

  sendMessage(recipientId, text) {
    if (!auth.isAuthenticated() || !text.trim()) {
      return false;
    }

    const sender = auth.currentUser;

    const message = {
      id: Date.now().toString(),
      senderId: sender.id,
      recipientId,
      text,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.addMessageToConversation(message);

    auth.sendChatMessage({
      type: 'direct',
      recipient: recipientId,
      message: text
    });

    return true;
  },

  handleIncomingMessage(data) {
    if (!auth.isAuthenticated()) return;

    if (data.type === 'direct' || !data.type) {
      const message = {
        id: data.id || Date.now().toString(),
        senderId: data.userId,
        recipientId: auth.currentUser.id,
        text: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
        read: false
      };

      this.addMessageToConversation(message);

      if (this.callbacks.onNewMessage) {
        this.callbacks.onNewMessage(message);
      }
    }

    if (data.type === 'status') {
      this.updateUserStatus(data.userId, data.status);
    }
  },

  addMessageToConversation(message) {
    const currentUserId = auth.currentUser.id;

    const otherUserId = message.senderId === currentUserId ? message.recipientId : message.senderId;
    const conversationId = [currentUserId, otherUserId].sort().join('-');

    if (!this.conversations[conversationId]) {
      this.conversations[conversationId] = {
        id: conversationId,
        participants: [currentUserId, otherUserId],
        messages: [],
        lastUpdated: message.timestamp
      };
    }

    this.conversations[conversationId].messages.push(message);
    this.conversations[conversationId].lastUpdated = message.timestamp;

    this.saveConversations();

    if (this.callbacks.onConversationUpdate) {
      this.callbacks.onConversationUpdate(conversationId);
    }
  },

  markAsRead(conversationId) {
    if (!this.conversations[conversationId]) return;

    const currentUserId = auth.currentUser.id;
    let updated = false;

    this.conversations[conversationId].messages.forEach(message => {
      if (message.recipientId === currentUserId && !message.read) {
        message.read = true;
        updated = true;
      }
    });

    if (updated) {
      this.saveConversations();

      if (this.callbacks.onConversationUpdate) {
        this.callbacks.onConversationUpdate(conversationId);
      }
    }
  },

  getConversations() {
    if (!auth.isAuthenticated()) return [];

    return Object.values(this.conversations)
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  },

  getConversation(conversationId) {
    return this.conversations[conversationId];
  },

  getMessages(conversationId) {
    if (!this.conversations[conversationId]) return [];

    return this.conversations[conversationId].messages;
  },

  getUnreadCount(conversationId = null) {
    if (!auth.isAuthenticated()) return 0;

    const currentUserId = auth.currentUser.id;

    if (conversationId) {

      if (!this.conversations[conversationId]) return 0;

      return this.conversations[conversationId].messages.filter(
        message => message.recipientId === currentUserId && !message.read
      ).length;
    }

    let count = 0;

    Object.values(this.conversations).forEach(conversation => {
      conversation.messages.forEach(message => {
        if (message.recipientId === currentUserId && !message.read) {
          count++;
        }
      });
    });

    return count;
  },

  updateUserStatus(userId, status) {
    const index = this.connectedUsers.findIndex(user => user.id === userId);

    if (index !== -1) {

      this.connectedUsers[index].status = status;
      this.connectedUsers[index].lastSeen = new Date().toISOString();
    } else {

      this.connectedUsers.push({
        id: userId,
        username: `user_${userId}`,
        displayName: `User ${userId}`,
        status,
        lastSeen: new Date().toISOString()
      });
    }

    if (this.callbacks.onUserStatusChange) {
      this.callbacks.onUserStatusChange(userId, status);
    }
  },

  getConnectedUsers() {
    return this.connectedUsers.filter(user => user.id !== auth.currentUser?.id);
  },

  getUser(userId) {
    return this.connectedUsers.find(user => user.id === userId);
  },

  deleteConversation(conversationId) {
    if (!this.conversations[conversationId]) return false;

    delete this.conversations[conversationId];
    this.saveConversations();
    return true;
  },

  deleteMessage(conversationId, messageId) {
    if (!this.conversations[conversationId]) return false;

    const initialLength = this.conversations[conversationId].messages.length;
    this.conversations[conversationId].messages = this.conversations[conversationId].messages.filter(
      message => message.id !== messageId
    );

    if (this.conversations[conversationId].messages.length !== initialLength) {

      const messages = this.conversations[conversationId].messages;
      if (messages.length > 0) {
        this.conversations[conversationId].lastUpdated = messages[messages.length - 1].timestamp;
      }

      this.saveConversations();

      if (this.callbacks.onConversationUpdate) {
        this.callbacks.onConversationUpdate(conversationId);
      }

      return true;
    }

    return false;
  },

  registerCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  },

  clearAllConversations() {
    this.conversations = {};
    this.saveConversations();
  }
};