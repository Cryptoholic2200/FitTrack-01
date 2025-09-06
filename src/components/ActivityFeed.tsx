import React from 'react';
import { useEffect } from 'react';
import ActivityCard from './ActivityCard';
import { useActivities } from '../hooks/useActivities';

export default function ActivityFeed() {
  const { publicActivities, loading, error } = useActivities();

  const formatActivityForCard = (activity: any) => {
    const user = activity.user_profiles;
    const displayName = user?.display_name || `${user?.first_name} ${user?.last_name}` || 'Unknown User';
    
    // Parse duration from PostgreSQL interval format (HH:MM:SS)
    const durationParts = activity.duration.split(':');
    const hours = parseInt(durationParts[0]);
    const minutes = parseInt(durationParts[1]);
    const seconds = parseInt(durationParts[2]);
    
    let formattedDuration = '';
    if (hours > 0) {
      formattedDuration = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Calculate pace if distance > 0
    let pace = 'N/A';
    if (activity.distance > 0) {
      const totalMinutes = hours * 60 + minutes + seconds / 60;
      const paceMinutes = totalMinutes / activity.distance;
      const paceMin = Math.floor(paceMinutes);
      const paceSec = Math.round((paceMinutes - paceMin) * 60);
      pace = `${paceMin}:${paceSec.toString().padStart(2, '0')}/km`;
    }

    // Format timestamp
    const createdAt = new Date(activity.created_at);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
    
    let timestamp = '';
    if (diffInHours < 1) {
      timestamp = 'Just now';
    } else if (diffInHours < 24) {
      timestamp = `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      timestamp = `${diffInDays}d ago`;
    }

    return {
      id: activity.id,
      user: {
        name: displayName,
        avatar: user?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      type: activity.type,
      title: activity.title,
      description: activity.description,
      distance: activity.distance,
      duration: formattedDuration,
      elevation: activity.elevation_gain,
      pace,
      kudos: Math.floor(Math.random() * 20) + 1, // Placeholder until we implement kudos
      comments: Math.floor(Math.random() * 10), // Placeholder until we implement comments
      timestamp,
    };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Feed</h2>
        <p className="text-gray-600">Stay connected with your fitness community</p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading activities: {error}</p>
        </div>
      ) : publicActivities.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No activities yet. Be the first to record an activity!</p>
        </div>
      ) : (
        publicActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={formatActivityForCard(activity)} />
        ))
      )}
    </div>
  );
}