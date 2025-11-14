import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [currentConversation, setCurrentConversation] = useState(null);
  const [stats, setStats] = useState({
    activeSessions: 0,
    totalConversations: 0
  });

  return (
    <div className="app">
      <Sidebar 
        stats={stats}
        onConversationSelect={setCurrentConversation}
      />
      <ChatWindow 
        conversation={currentConversation}
        onStatsUpdate={setStats}
      />
    </div>
  );
}

export default App;
