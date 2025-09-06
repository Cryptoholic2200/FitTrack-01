import React from 'react';
import { useEffect, useState } from 'react';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { useActivities } from '../hooks/useActivities';

export default function Dashboard() {
  const { userActivities, loading } = useActivities();
  const [stats, setStats] = useState({
    weekDistance: 0,
    monthlyActivities: 0,
    totalDistance: 0,
    personalBest: 'N/A'
  });

  useEffect(() => {
    if (userActivities.length > 0) {
      calculateStats();
    }
  }, [userActivities]);

  const calculateStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate week distance
    const weekActivities = userActivities.filter(activity => 
      new Date(activity.created_at) >= oneWeekAgo
    );
    const weekDistance = weekActivities.reduce((sum, activity) => sum + activity.distance, 0);

    // Calculate monthly activities
    const monthActivities = userActivities.filter(activity => 
      new Date(activity.created_at) >= oneMonthAgo
    );

    // Calculate total distance
    const totalDistance = userActivities.reduce((sum, activity) => sum + activity.distance, 0);

    // Find best pace (for runs only)
    const runs = userActivities.filter(activity => activity.type === 'run' && activity.distance > 0);
    let bestPace = 'N/A';
    if (runs.length > 0) {
      let bestPaceMinutes = Infinity;
      runs.forEach(run => {
        const durationParts = run.duration.split(':');
        const hours = parseInt(durationParts[0]);
        const minutes = parseInt(durationParts[1]);
        const seconds = parseInt(durationParts[2]);
        const totalMinutes = hours * 60 + minutes + seconds / 60;
        const pace = totalMinutes / run.distance;
        if (pace < bestPaceMinutes) {
          bestPaceMinutes = pace;
        }
      });
      
      if (bestPaceMinutes !== Infinity) {
        const paceMin = Math.floor(bestPaceMinutes);
        const paceSec = Math.round((bestPaceMinutes - paceMin) * 60);
        bestPace = `${paceMin}:${paceSec.toString().padStart(2, '0')}/km`;
      }
    }

    setStats({
      weekDistance: Math.round(weekDistance * 10) / 10,
      monthlyActivities: monthActivities.length,
      totalDistance: Math.round(totalDistance * 10) / 10,
      personalBest: bestPace
    });
  };

  const stats = [
    {
      label: 'This Week',
      value: `${stats.weekDistance} km`,
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Monthly Goal',
      value: `${stats.totalDistance}/100 km`,
      change: `${Math.round((stats.totalDistance / 100) * 100)}%`,
      trend: 'up',
      icon: Target,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Activities',
      value: stats.monthlyActivities.toString(),
      change: 'This month',
      trend: 'neutral',
      icon: Calendar,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      label: 'Personal Best',
      value: stats.personalBest,
      change: 'Last run',
      trend: 'neutral',
      icon: Award,
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
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
        {userActivities.length > 0 ? (
          <div className="space-y-4">
            {userActivities.slice(0, 3).map((activity, index) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">
                  {activity.type === 'run' ? '🏃‍♂️' : 
                   activity.type === 'ride' ? '🚴‍♂️' : 
                   activity.type === 'swim' ? '🏊‍♂️' : '💪'}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">
                    {activity.distance > 0 ? `${activity.distance} km` : activity.duration}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No activities yet. Record your first activity to see achievements!</p>
          </div>
        )}
      </div>
    </div>
  );
}