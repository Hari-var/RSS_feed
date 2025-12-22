import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Login from './components/Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'posts';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  const handleSectionChange = (section) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
  };

  const handleSidebarToggle = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div className="App">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
      />
      <MainContent 
        activeSection={activeSection}
        sidebarCollapsed={sidebarCollapsed}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;
