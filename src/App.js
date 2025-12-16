import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';

function App() {
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
      />
    </div>
  );
}

export default App;
