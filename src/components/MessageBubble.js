import React from 'react';
import { format } from 'date-fns';
import './MessageBubble.css';

function MessageBubble({ message }) {
  const isUser = message.sender === 'user';
  const formattedTime = format(new Date(message.timestamp), 'HH:mm');

  const renderMessageContent = () => {
    if (message.type === 'image') {
      return (
        <div className="message-media">
          <img src={message.url} alt="Media content" className="message-image" />
        </div>
      );
    }
    
    if (message.type === 'audio') {
      return (
        <div className="message-media">
          <audio controls className="message-audio">
            <source src={message.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }
    
    return <div className="message-text">{message.text}</div>;
  };

  return (
    <div className={`message-bubble ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-content">
        {!isUser && (
          <div className="message-avatar">🤖</div>
        )}
        <div className="message-wrapper">
          {renderMessageContent()}
          <div className="message-time">
            {formattedTime}
          </div>
        </div>
        {isUser && (
          <div className="message-avatar user-avatar">👤</div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
