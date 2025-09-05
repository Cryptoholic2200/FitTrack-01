import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MapPin, Clock, Zap } from 'lucide-react';

interface Activity {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  type: 'run' | 'ride' | 'swim' | 'workout';
  title: string;
  description?: string;
  distance: number;
  duration: string;
  elevation: number;
  pace: string;
  kudos: number;
  comments: number;
  timestamp: string;
  route?: string;
  photos?: string[];
}

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [kudosCount, setKudosCount] = useState(activity.kudos);

  const handleKudos = () => {
    setIsLiked(!isLiked);
    setKudosCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const getActivityIcon = () => {
    switch (activity.type) {
      case 'run':
        return '🏃‍♂️';
      case 'ride':
        return '🚴‍♂️';
      case 'swim':
        return '🏊‍♂️';
      case 'workout':
        return '💪';
      default:
        return '🏃‍♂️';
    }
  };

  const getActivityColor = () => {
    switch (activity.type) {
      case 'run':
        return 'text-green-600 bg-green-100';
      case 'ride':
        return 'text-blue-600 bg-blue-100';
      case 'swim':
        return 'text-cyan-600 bg-cyan-100';
      case 'workout':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-green-600 bg-green-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={activity.user.avatar}
              alt={activity.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{activity.user.name}</h3>
              <p className="text-sm text-gray-500">{activity.timestamp}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getActivityColor()}`}>
            <span className="mr-1">{getActivityIcon()}</span>
            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{activity.title}</h2>
          {activity.description && (
            <p className="text-gray-600 text-sm">{activity.description}</p>
          )}
        </div>
      </div>

      {/* Route Map Placeholder */}
      <div className="px-6 pb-4">
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20"></div>
          <div className="text-center z-10">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Route visualization</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{activity.distance}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Distance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{activity.duration}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{activity.elevation}m</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Elevation</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{activity.pace}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Pace</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleKudos}
            className={`flex items-center space-x-2 transition-colors duration-200 ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{kudosCount}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{activity.comments}</span>
          </button>
        </div>
        <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}