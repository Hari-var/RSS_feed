import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ onLogout }) => {
  const [settings, setSettings] = useState({
    isStructuredView: localStorage.getItem('isStructuredView') === 'true',
    emailConfig: {
      smtp_host: 'smtp.office365.com',
      smtp_port: 587,
      smtp_user: 'mvp@valuemomentum.club',
      sender_email: 'mvp@valuemomentum.club',
      receiver_emails: ['Hari.Ponnamanda@valuemomentum.com'],
      posts_cache_hours: 24,
      events_cache_hours: 5
    }
  });
  const [message, setMessage] = useState(null);
  const [previewMode, setPreviewMode] = useState(localStorage.getItem('isStructuredView') === 'true' ? 'structured' : 'overlay');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('https://rss-feed-backend-e6gvd8bnfugscucb.canadacentral-01.azurewebsites.net/config');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, emailConfig: data }));
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('https://rss-feed-backend-e6gvd8bnfugscucb.canadacentral-01.azurewebsites.net/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings.emailConfig)
      });

      if (response.ok) {
        localStorage.setItem('isStructuredView', settings.isStructuredView.toString());
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving settings' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleViewToggle = (newView) => {
    setSettings(prev => ({ ...prev, isStructuredView: newView }));
    setPreviewMode(newView ? 'structured' : 'overlay');
    localStorage.setItem('isStructuredView', newView.toString());
    window.dispatchEvent(new Event('storage'));
  };

  const addEmail = () => {
    if (newEmail && !settings.emailConfig.receiver_emails.includes(newEmail)) {
      setSettings(prev => ({
        ...prev,
        emailConfig: { ...prev.emailConfig, receiver_emails: [...prev.emailConfig.receiver_emails, newEmail] }
      }));
      setNewEmail('');
    }
  };

  const removeEmail = (emailToRemove) => {
    setSettings(prev => ({
      ...prev,
      emailConfig: { ...prev.emailConfig, receiver_emails: prev.emailConfig.receiver_emails.filter(email => email !== emailToRemove) }
    }));
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Preferences</h2>
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="settings-sections">
        <div className="settings-section">
          <h3>Display</h3>
          <div className="setting-item">
            <label>Default View Mode:</label>
            <div className="view-toggle">
              <div className="toggle-options">
                <button 
                  className={`toggle-btn ${!settings.isStructuredView ? 'active' : ''}`}
                  onClick={() => handleViewToggle(false)}
                >
                  Overlay View
                </button>
                <button 
                  className={`toggle-btn ${settings.isStructuredView ? 'active' : ''}`}
                  onClick={() => handleViewToggle(true)}
                >
                  Structured View
                </button>
              </div>
            </div>
            <div className="view-preview">
              <h4>Preview:</h4>
              <div className={`preview-container ${previewMode}`}>
                {previewMode === 'overlay' ? (
                  <div className="overlay-preview">
                    <div className="preview-card overlay-card">
                      <div className="preview-image"></div>
                      <div className="overlay-content">
                        <h5>Sample Post Title</h5>
                        <p>This is how content appears in overlay mode with text over images.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="structured-preview">
                    <div className="preview-card structured-card">
                      <div className="preview-image"></div>
                      <div className="structured-content">
                        <h5>Sample Post Title</h5>
                        <p>This is how content appears in structured mode with separate sections.</p>
                        <div className="preview-meta">Source • Date</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="preview-description">
                {previewMode === 'overlay' 
                  ? 'Overlay view displays content with text overlaid on images for a modern, compact design.'
                  : 'Structured view separates images and text into distinct sections for better readability.'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Email Configuration</h3>
          <div className="setting-item">
            <label>SMTP Host:</label>
            <input
              type="text"
              value={settings.emailConfig.smtp_host}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                emailConfig: { ...prev.emailConfig, smtp_host: e.target.value }
              }))}
              placeholder="smtp.office365.com"
            />
          </div>
          <div className="setting-item">
            <label>SMTP Port:</label>
            <input
              type="number"
              value={settings.emailConfig.smtp_port}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                emailConfig: { ...prev.emailConfig, smtp_port: parseInt(e.target.value) }
              }))}
            />
          </div>
          <div className="setting-item">
            <label>SMTP User:</label>
            <input
              type="text"
              value={settings.emailConfig.smtp_user}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                emailConfig: { ...prev.emailConfig, smtp_user: e.target.value }
              }))}
            />
          </div>
          <div className="setting-item">
            <label>Sender Email:</label>
            <input
              type="email"
              value={settings.emailConfig.sender_email}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                emailConfig: { ...prev.emailConfig, sender_email: e.target.value }
              }))}
            />
          </div>
          <div className="setting-item">
            <label>Receiver Emails:</label>
            <div className="email-list">
              {settings.emailConfig.receiver_emails.map((email, index) => (
                <div key={index} className="email-item">
                  <span>{email}</span>
                  <button className="remove-email-btn" onClick={() => removeEmail(email)}>×</button>
                </div>
              ))}
            </div>
            <div className="add-email">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address"
                onKeyPress={(e) => e.key === 'Enter' && addEmail()}
              />
              <button className="add-email-btn" onClick={addEmail} disabled={!newEmail}>Add</button>
            </div>
          </div>
          <div className="setting-item">
            <label>Posts Refresh Interval (hours):</label>
            <input
              type="number"
              value={settings.emailConfig.posts_cache_hours}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                emailConfig: { ...prev.emailConfig, posts_cache_hours: parseInt(e.target.value) }
              }))}
              min="1"
              max="168"
            />
          </div>
          <div className="setting-item">
            <label>Events Refresh Interval (hours):</label>
            <input
              type="number"
              value={settings.emailConfig.events_cache_hours}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                emailConfig: { ...prev.emailConfig, events_cache_hours: parseInt(e.target.value) }
              }))}
              min="1"
              max="168"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;