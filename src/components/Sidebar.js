import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeSection, onSectionChange, isCollapsed, onToggle }) => {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="hamburger-btn" onClick={onToggle}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav>
        <button 
          className={`nav-btn ${activeSection === 'posts' ? 'active' : ''}`}
          onClick={() => onSectionChange('posts')}
        >
          📰 {!isCollapsed && 'Posts'}
        </button>
        <button 
          className={`nav-btn ${activeSection === 'events' ? 'active' : ''}`}
          onClick={() => onSectionChange('events')}
        >
          📅 {!isCollapsed && 'Events'}
        </button>
        <button 
          className={`nav-btn ${activeSection === 'add-events' ? 'active' : ''}`}
          onClick={() => onSectionChange('add-events')}
        >
          ➕ {!isCollapsed && 'Add Events'}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;