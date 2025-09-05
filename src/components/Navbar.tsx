import React from 'react';
import { Activity, Home, Trophy, Users, User, Plus } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'activities', label: 'My Activities', icon: Activity },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'athletes', label: 'Athletes', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">FitTrack</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === id
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors duration-200">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Record Activity</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 4).map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`p-3 rounded-md transition-colors duration-200 ${
                activeTab === id
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}