import React from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

export default function Leaderboard() {
  const leaderboardData = [
    {
      rank: 1,
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      distance: 156.2,
      activities: 18,
      badge: '🥇'
    },
    {
      rank: 2,
      name: 'Alex Rodriguez',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      distance: 142.8,
      activities: 15,
      badge: '🥈'
    },
    {
      rank: 3,
      name: 'Emma Johnson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      distance: 138.5,
      activities: 16,
      badge: '🥉'
    },
    {
      rank: 4,
      name: 'Marcus Thompson',
      avatar: 'https://images.pexels.com/photos/769772/pexels-photo-769772.jpeg?auto=compress&cs=tinysrgb&w=150',
      distance: 124.3,
      activities: 12,
      badge: '🏃‍♂️'
    },
    {
      rank: 5,
      name: 'Lisa Wang',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
      distance: 119.7,
      activities: 14,
      badge: '💪'
    },
  ];

  const challenges = [
    {
      title: 'January Distance Challenge',
      description: 'Run or ride 100km this month',
      participants: 847,
      timeLeft: '12 days left',
      progress: 78,
      icon: Trophy,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'New Year, New PR',
      description: 'Set a personal record in any activity',
      participants: 432,
      timeLeft: '25 days left',
      progress: 45,
      icon: Award,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Active Challenges */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Active Challenges</h2>
          <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {challenges.map((challenge, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${challenge.color} flex items-center justify-center`}>
                  <challenge.icon className="w-6 h-6" />
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {challenge.timeLeft}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{challenge.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{challenge.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">{challenge.participants} participants</p>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Monthly Leaderboard</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>January 2025</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {leaderboardData.map((athlete, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-4 rounded-lg transition-colors hover:bg-gray-50 ${
                index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'border border-gray-100'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{athlete.badge}</div>
                <img
                  src={athlete.avatar}
                  alt={athlete.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{athlete.name}</h3>
                  <p className="text-sm text-gray-600">{athlete.activities} activities</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">{athlete.distance} km</p>
                <p className="text-sm text-gray-500">#{athlete.rank}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
            View Full Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}