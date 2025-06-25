import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import HelpHub from './components/HelpHub';
import Notification from './components/Notification';
import { useNotification } from './hooks/useNotification';
import questConfig from './config/questConfig';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notification, showNotification } = useNotification();

  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
              showNotification={showNotification}
            />
            <motion.main
              className="flex-1 overflow-y-auto p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/" element={<Dashboard showNotification={showNotification} />} />
                <Route path="/users" element={<Users showNotification={showNotification} />} />
                <Route path="/analytics" element={<Analytics showNotification={showNotification} />} />
                <Route path="/settings" element={<Settings showNotification={showNotification} />} />
                <Route path="/profile" element={<Profile showNotification={showNotification} />} />
              </Routes>
            </motion.main>
          </div>
          <HelpHub />
          <Notification 
            notification={notification} 
            onClose={() => showNotification(null)} 
          />
        </div>
      </Router>
    </QuestProvider>
  );
}

export default App;