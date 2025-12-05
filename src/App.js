import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('posts');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="App">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <MainContent 
        activeSection={activeSection}
        sidebarCollapsed={sidebarCollapsed}
      />
    </div>
  );
}

export default App;
