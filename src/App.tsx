import React, { useState } from 'react';
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import ActivityFeed from './components/ActivityFeed';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import Athletes from './components/Athletes';
import Profile from './components/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <ActivityFeed />;
      case 'activities':
        return <Dashboard />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'athletes':
        return <Athletes />;
      case 'profile':
        return <Profile />;
      default:
        return <ActivityFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;