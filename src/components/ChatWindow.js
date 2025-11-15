import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import './ChatWindow.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function ChatWindow({ conversation, onStatsUpdate }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [testRecipientId, setTestRecipientId] = useState('test_user_123');
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showAudioInput, setShowAudioInput] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Fetch stats periodically
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_URL}/stats`);
        onStatsUpdate({
          activeSessions: response.data.active_sessions,
          totalConversations: response.data.total_conversations
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [onStatsUpdate]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Send message to standalone chat endpoint (bypasses Instagram)
      const response = await axios.post(`${API_URL}/chat`, {
        user_id: testRecipientId,
        message: messageText
      });

      // Simulate human-like typing delay
      const typingDelayMs = (response.data.typing_delay || 2) * 1000;
      await new Promise(resolve => setTimeout(resolve, typingDelayMs));

      setIsTyping(false);

      // Add bot's text response
      const botMessage = {
        id: Date.now() + 2,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: '❌ Error: ' + (error.response?.data?.detail || error.message),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendImage = async () => {
    if (!imageUrl.trim()) return;

    const imageMessage = {
      id: Date.now(),
      type: 'image',
      url: imageUrl,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, imageMessage]);
    setImageUrl('');
    setShowImageInput(false);
    setShowMediaMenu(false);

    // In production, this would send via Instagram API
    console.log('Sending image:', imageUrl, 'to user:', testRecipientId);
  };

  const handleSendAudio = async () => {
    if (!audioUrl.trim()) return;

    const audioMessage = {
      id: Date.now(),
      type: 'audio',
      url: audioUrl,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, audioMessage]);
    setAudioUrl('');
    setShowAudioInput(false);
    setShowMediaMenu(false);

    // In production, this would send via Instagram API
    console.log('Sending audio:', audioUrl, 'to user:', testRecipientId);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="header-info">
          <div className="header-avatar">
            <span>🤖</span>
          </div>
          <div className="header-text">
            <h2>Instagram Chatbot Preview</h2>
            <p className="status">
              <span className="status-dot"></span>
              Active & Monitoring
            </p>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h3>👋 Welcome to Instagram Chatbot MVP</h3>
            <p><strong>✨ Test the core features:</strong></p>
            <ul style={{ textAlign: 'left', display: 'inline-block' }}>
              <li>🧠 <strong>NLP Responses</strong> - Powered by OpenAI (human-like conversation)</li>
              <li>⏱️ <strong>Typing Delays</strong> - Natural delays based on message length</li>
              <li>🖼️ <strong>Image Triggers</strong> - Try keywords: "pricing", "catalog", "products"</li>
              <li>🎵 <strong>Audio Triggers</strong> - Try keywords: "hello", "hi", "hey"</li>
            </ul>
            <p style={{ marginTop: '15px', fontSize: '14px', opacity: '0.8' }}>
              💡 Type anything to start chatting! The bot will respond like a human.
            </p>
          </div>
        )}
        
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <div className="test-id-input">
          <label>Test User ID:</label>
          <input
            type="text"
            value={testRecipientId}
            onChange={(e) => setTestRecipientId(e.target.value)}
            placeholder="Enter test user ID"
          />
        </div>

        {/* Media Input Sections */}
        {showImageInput && (
          <div className="media-input-section">
            <label>🖼️ Image URL:</label>
            <div className="media-input-wrapper">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL (https://...)"
                className="media-url-input"
              />
              <button className="media-send-btn" onClick={handleSendImage}>
                Send Image
              </button>
              <button className="media-cancel-btn" onClick={() => setShowImageInput(false)}>
                ✕
              </button>
            </div>
          </div>
        )}

        {showAudioInput && (
          <div className="media-input-section">
            <label>🎵 Audio URL:</label>
            <div className="media-input-wrapper">
              <input
                type="text"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="Enter audio URL (https://...)"
                className="media-url-input"
              />
              <button className="media-send-btn" onClick={handleSendAudio}>
                Send Audio
              </button>
              <button className="media-cancel-btn" onClick={() => setShowAudioInput(false)}>
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="message-input-wrapper">
          <button 
            className="media-button"
            onClick={() => setShowMediaMenu(!showMediaMenu)}
            title="Send Media"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </button>

          {showMediaMenu && (
            <div className="media-menu">
              <button onClick={() => { setShowImageInput(true); setShowMediaMenu(false); }}>
                🖼️ Send Image
              </button>
              <button onClick={() => { setShowAudioInput(true); setShowMediaMenu(false); }}>
                🎵 Send Audio
              </button>
            </div>
          )}

          <textarea
            className="message-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a test message..."
            rows="1"
          />
          <button 
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
