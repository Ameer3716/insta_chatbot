import React from 'react';
import './Sidebar.css';

function Sidebar({ stats }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>📱 Instagram Bot</h1>
        <p className="subtitle">Admin Dashboard</p>
      </div>

      <div className="stats-section">
        <h3>📊 Statistics</h3>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-label">Active Sessions</div>
            <div className="stat-value">{stats.activeSessions || 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <div className="stat-label">Total Conversations</div>
            <div className="stat-value">{stats.totalConversations || 0}</div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h3>✨ Features</h3>
        <div className="feature-item">
          <span className="feature-icon">🧠</span>
          <span>OpenAI NLP</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">⏱️</span>
          <span>Human-like Delays</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🖼️</span>
          <span>Media Responses</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">⚡</span>
          <span>High Concurrency</span>
        </div>
      </div>

      <div className="info-section">
        <h3>ℹ️ Info</h3>
        <div className="info-item">
          <span className="info-label">Capacity:</span>
          <span className="info-value">2000-3000 users</span>
        </div>
        <div className="info-item">
          <span className="info-label">Response Type:</span>
          <span className="info-value">Natural Language</span>
        </div>
        <div className="info-item">
          <span className="info-label">Status:</span>
          <span className="info-value status-active">🟢 Active</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <p>© 2025 Instagram Chatbot</p>
      </div>
    </div>
  );
}

export default Sidebar;
