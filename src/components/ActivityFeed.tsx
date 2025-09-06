import React from 'react';
import ActivityCard from './ActivityCard';

export default function ActivityFeed() {
  const activities = [
    {
      id: '1',
      user: {
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      type: 'run' as const,
      title: 'Morning Run in Central Park',
      description: 'Perfect weather for a morning run! Feeling energized.',
      distance: 8.2,
      duration: '42:18',
      elevation: 124,
      pace: '5:09/km',
      kudos: 12,
      comments: 3,
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      user: {
        name: 'Alex Rodriguez',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      type: 'ride' as const,
      title: 'Evening Bike Commute',
      description: 'Beat the traffic and got some exercise in!',
      distance: 15.7,
      duration: '1:12:45',
      elevation: 89,
      pace: '4:38/km',
      kudos: 8,
      comments: 1,
      timestamp: '4 hours ago',
    },
    {
      id: '3',
      user: {
        name: 'Emma Johnson',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      type: 'swim' as const,
      title: 'Pool Training Session',
      description: 'Working on technique and endurance. Great session!',
      distance: 2.1,
      duration: '1:15:30',
      elevation: 0,
      pace: '36:00/km',
      kudos: 15,
      comments: 5,
      timestamp: '6 hours ago',
    },
    {
      id: '4',
      user: {
        name: 'Marcus Thompson',
        avatar: 'https://images.pexels.com/photos/769772/pexels-photo-769772.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      type: 'workout' as const,
      title: 'HIIT Training',
      description: 'Intense circuit training session. Pushed my limits today!',
      distance: 0,
      duration: '45:00',
      elevation: 0,
      pace: 'N/A',
      kudos: 20,
      comments: 7,
      timestamp: '8 hours ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Feed</h2>
        <p className="text-gray-600">Stay connected with your fitness community</p>
      </div>
      
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
}