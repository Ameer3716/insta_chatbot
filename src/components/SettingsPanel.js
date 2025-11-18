import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SettingsPanel.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function SettingsPanel() {
  const [activeTab, setActiveTab] = useState('text');
  const [triggers, setTriggers] = useState([]);
  const [delaySettings, setDelaySettings] = useState({});
  
  // Form states for adding new triggers
  const [newTrigger, setNewTrigger] = useState({
    name: '',
    keywords: '',
    type: 'image',
    path: ''
  });

  useEffect(() => {
    fetchTriggers();
  }, []);

  const fetchTriggers = async () => {
    try {
      const response = await axios.get(`${API_URL}/triggers`);
      setTriggers(response.data.triggers || []);
      setDelaySettings(response.data.typing_delay || {});
    } catch (error) {
      console.error('Error fetching triggers:', error);
    }
  };

  const handleAddTrigger = async (e) => {
    e.preventDefault();
    
    const triggerData = {
      name: newTrigger.name,
      keywords: newTrigger.keywords.split(',').map(k => k.trim()),
      type: newTrigger.type,
      path: newTrigger.path
    };

    try {
      await axios.post(`${API_URL}/triggers/add`, triggerData);
      alert('Trigger added successfully!');
      setNewTrigger({ name: '', keywords: '', type: 'image', path: '' });
      fetchTriggers();
    } catch (error) {
      console.error('Error adding trigger:', error);
      alert('Failed to add trigger: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteTrigger = async (triggerName) => {
    if (!window.confirm(`Delete trigger "${triggerName}"?`)) return;

    try {
      await axios.delete(`${API_URL}/triggers/${triggerName}`);
      alert('Trigger deleted successfully!');
      fetchTriggers();
    } catch (error) {
      console.error('Error deleting trigger:', error);
      alert('Failed to delete trigger');
    }
  };

  const handleUpdateDelay = async (e) => {
    e.preventDefault();
    
    try {
      await axios.put(`${API_URL}/settings/delay`, delaySettings);
      alert('Delay settings updated successfully!');
    } catch (error) {
      console.error('Error updating delay settings:', error);
      alert('Failed to update delay settings');
    }
  };

  const imageTriggers = triggers.filter(t => t.type === 'image');
  const audioTriggers = triggers.filter(t => t.type === 'audio');

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>⚙️ Chatbot Settings</h2>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          💬 Text Responses
        </button>
        <button 
          className={`tab ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          🖼️ Image Triggers
        </button>
        <button 
          className={`tab ${activeTab === 'voice' ? 'active' : ''}`}
          onClick={() => setActiveTab('voice')}
        >
          🎵 Voice Triggers
        </button>
      </div>

      <div className="tab-content">
        {/* TEXT SECTION */}
        {activeTab === 'text' && (
          <div className="section">
            <h3>Text Response Settings</h3>
            <p className="section-description">
              Configure how the AI chatbot responds to messages. The bot uses your Instagram user data to personalize responses.
            </p>
            
            <form onSubmit={handleUpdateDelay} className="settings-form">
              <div className="form-group">
                <label>Base Delay (seconds)</label>
                <input
                  type="number"
                  step="0.1"
                  value={delaySettings.base_seconds || 1.0}
                  onChange={(e) => setDelaySettings({...delaySettings, base_seconds: e.target.value})}
                />
                <small>Minimum typing delay for all messages</small>
              </div>

              <div className="form-group">
                <label>Per Word Delay (seconds)</label>
                <input
                  type="number"
                  step="0.01"
                  value={delaySettings.per_word_seconds || 0.15}
                  onChange={(e) => setDelaySettings({...delaySettings, per_word_seconds: e.target.value})}
                />
                <small>Additional delay per word (makes longer messages take more time)</small>
              </div>

              <div className="form-group">
                <label>Maximum Delay (seconds)</label>
                <input
                  type="number"
                  step="0.5"
                  value={delaySettings.max_seconds || 5.0}
                  onChange={(e) => setDelaySettings({...delaySettings, max_seconds: e.target.value})}
                />
                <small>Maximum typing delay cap</small>
              </div>

              <button type="submit" className="btn-primary">
                Save Delay Settings
              </button>
            </form>

            <div className="info-box">
              <h4>📊 Delay Calculation</h4>
              <p>
                <strong>Formula:</strong> Base + (Words × Per Word) ± 30% randomness
              </p>
              <p>
                <strong>Example:</strong> A 10-word message = {delaySettings.base_seconds || 1.0}s + (10 × {delaySettings.per_word_seconds || 0.15}s) 
                = ~{((parseFloat(delaySettings.base_seconds) || 1.0) + (10 * (parseFloat(delaySettings.per_word_seconds) || 0.15))).toFixed(1)}s
              </p>
            </div>
          </div>
        )}

        {/* MEDIA (IMAGE) SECTION */}
        {activeTab === 'media' && (
          <div className="section">
            <h3>Image Triggers ({imageTriggers.length})</h3>
            <p className="section-description">
              When users send messages with specific keywords, the bot automatically sends an image.
            </p>

            <form onSubmit={handleAddTrigger} className="trigger-form">
              <h4>➕ Add New Image Trigger</h4>
              
              <div className="form-group">
                <label>Trigger Name *</label>
                <input
                  type="text"
                  placeholder="e.g., pricing_info"
                  value={newTrigger.name}
                  onChange={(e) => setNewTrigger({...newTrigger, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Keywords (comma-separated) *</label>
                <input
                  type="text"
                  placeholder="e.g., pricing, price, cost, how much"
                  value={newTrigger.keywords}
                  onChange={(e) => setNewTrigger({...newTrigger, keywords: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL (HTTPS) *</label>
                <input
                  type="url"
                  placeholder="https://your-domain.com/image.jpg"
                  value={newTrigger.path}
                  onChange={(e) => setNewTrigger({...newTrigger, path: e.target.value, type: 'image'})}
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Add Image Trigger
              </button>
            </form>

            <div className="triggers-list">
              <h4>Existing Image Triggers</h4>
              {imageTriggers.length === 0 ? (
                <p className="empty-state">No image triggers configured yet.</p>
              ) : (
                <table className="triggers-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Keywords</th>
                      <th>Image URL</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {imageTriggers.map((trigger, idx) => (
                      <tr key={idx}>
                        <td><strong>{trigger.name}</strong></td>
                        <td><span className="keywords">{trigger.keywords.join(', ')}</span></td>
                        <td><a href={trigger.path} target="_blank" rel="noopener noreferrer">View Image</a></td>
                        <td>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteTrigger(trigger.name)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* VOICE (AUDIO) SECTION */}
        {activeTab === 'voice' && (
          <div className="section">
            <h3>Voice Note Triggers ({audioTriggers.length})</h3>
            <p className="section-description">
              When users send messages with specific keywords, the bot automatically sends a voice note.
            </p>

            <form onSubmit={handleAddTrigger} className="trigger-form">
              <h4>➕ Add New Voice Trigger</h4>
              
              <div className="form-group">
                <label>Trigger Name *</label>
                <input
                  type="text"
                  placeholder="e.g., welcome_audio"
                  value={newTrigger.name}
                  onChange={(e) => setNewTrigger({...newTrigger, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Keywords (comma-separated) *</label>
                <input
                  type="text"
                  placeholder="e.g., hello, hi, hey, greetings"
                  value={newTrigger.keywords}
                  onChange={(e) => setNewTrigger({...newTrigger, keywords: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Audio URL (HTTPS, MP3/M4A) *</label>
                <input
                  type="url"
                  placeholder="https://your-domain.com/audio.mp3"
                  value={newTrigger.path}
                  onChange={(e) => setNewTrigger({...newTrigger, path: e.target.value, type: 'audio'})}
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Add Voice Trigger
              </button>
            </form>

            <div className="triggers-list">
              <h4>Existing Voice Triggers</h4>
              {audioTriggers.length === 0 ? (
                <p className="empty-state">No voice triggers configured yet.</p>
              ) : (
                <table className="triggers-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Keywords</th>
                      <th>Audio URL</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audioTriggers.map((trigger, idx) => (
                      <tr key={idx}>
                        <td><strong>{trigger.name}</strong></td>
                        <td><span className="keywords">{trigger.keywords.join(', ')}</span></td>
                        <td><a href={trigger.path} target="_blank" rel="noopener noreferrer">Play Audio</a></td>
                        <td>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteTrigger(trigger.name)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPanel;
