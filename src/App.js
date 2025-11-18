import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import './App.css';

function App() {
  const [currentConversation, setCurrentConversation] = useState(null);
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'settings'
  const [stats, setStats] = useState({
    activeSessions: 0,
    totalConversations: 0
  });

  return (
    <div className="app">
      <Sidebar 
        stats={stats}
        onConversationSelect={setCurrentConversation}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      {currentView === 'chat' ? (
        <ChatWindow 
          conversation={currentConversation}
          onStatsUpdate={setStats}
        />
      ) : (
        <SettingsPanel />
      )}
    </div>
  );
}

export default App;
