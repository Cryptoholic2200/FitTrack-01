import React from 'react';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      label: 'This Week',
      value: '24.5 km',
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Monthly Goal',
      value: '78/100 km',
      change: '78%',
      trend: 'up',
      icon: Target,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Activities',
      value: '8',
      change: 'This month',
      trend: 'neutral',
      icon: Calendar,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      label: 'Personal Best',
      value: '4:32/km',
      change: 'Last run',
      trend: 'neutral',
      icon: Award,
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Performance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-xs mt-1 ${
                stat.trend === 'up' ? 'text-green-600' : 'text-gray-500'
              }`}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Activity Heatmap</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, index) => {
            const intensity = Math.random();
            let bgColor = 'bg-gray-100';
            if (intensity > 0.7) bgColor = 'bg-green-500';
            else if (intensity > 0.5) bgColor = 'bg-green-400';
            else if (intensity > 0.3) bgColor = 'bg-green-300';
            else if (intensity > 0.1) bgColor = 'bg-green-200';
            
            return (
              <div
                key={index}
                className={`w-8 h-8 rounded-sm ${bgColor} hover:scale-110 transition-transform cursor-pointer`}
                title={`Day ${index + 1}`}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
          <span>Less</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Achievements</h3>
        <div className="space-y-4">
          {[
            { title: 'New Personal Record', description: '5K run in 22:15', date: '2 days ago', icon: '🏆' },
            { title: 'Consistency Champion', description: '7 days in a row', date: '1 week ago', icon: '🔥' },
            { title: 'Distance Milestone', description: 'Completed 100km this month', date: '2 weeks ago', icon: '🎯' },
          ].map((achievement, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
              <span className="text-xs text-gray-500">{achievement.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}