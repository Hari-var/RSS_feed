import React from 'react';
import './Header.css';

const Header = ({ onToggleSidebar, activeSection }) => {
  return (
    <header className="header">
      <button className="hamburger-btn" onClick={onToggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <h1>TSC Weekly Byte - {activeSection === 'posts' ? 'Posts' : 'Events'}</h1>
    </header>
  );
};

export default Header;