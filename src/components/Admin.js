import React, { useState, useEffect } from 'react';
import EventManager from './EventManager';
import UserManager from './UserManager';
import PostManager from './PostManager';
import Settings from './Settings';
import './Admin.css';

const Admin = ({ onLogout, setActiveSection }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('https://rss-feed-backend-e6gvd8bnfugscucb.canadacentral-01.azurewebsites.net/events');
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Settings</h1>
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Session Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Post Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Event Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'account' ? (
          <div className="account-management">
            <h2>Session Management</h2>
            <div className="account-actions">
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        ) : activeTab === 'users' ? (
          <UserManager />
        ) : activeTab === 'posts' ? (
          <PostManager />
        ) : activeTab === 'events' ? (
          <EventManager 
            events={events} 
            setEvents={setEvents}
            loading={loading}
            onRefresh={fetchEvents}
          />
        ) : activeTab === 'preferences' ? (
          <Settings />
        ) : null}
      </div>
    </div>
  );
};

export default Admin;