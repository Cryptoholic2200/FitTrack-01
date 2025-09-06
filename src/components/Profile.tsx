import React from 'react';
import { MapPin, Calendar, Trophy, Target, Edit3, Settings } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import EditProfile from './EditProfile';

interface ProfileProps {
  editMode?: boolean;
  onEditModeChange?: (editMode: boolean) => void;
}

export default function Profile({ editMode = false, onEditModeChange }: ProfileProps) {
  const { user } = useAuth();
  const { profile, loading, error } = useProfile();

  if (editMode) {
    return <EditProfile onBack={() => onEditModeChange?.(false)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading profile: {error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-700">Profile not found</p>
      </div>
    );
  }

  const userStats = [
    { label: 'Total Distance', value: '1,247 km', period: 'All Time' },
    { label: 'Activities', value: '156', period: 'This Year' },
    { label: 'Followers', value: '342', period: '' },
    { label: 'Following', value: '198', period: '' }
  ];

  const recentActivities = [
    { date: 'Today', activity: 'Morning Run', distance: '8.2 km', time: '42:18' },
    { date: 'Yesterday', activity: 'Evening Bike Ride', distance: '24.5 km', time: '1:15:32' },
    { date: '2 days ago', activity: 'Pool Swimming', distance: '2.1 km', time: '1:08:45' },
    { date: '3 days ago', activity: 'HIIT Workout', distance: '0 km', time: '45:00' },
    { date: '4 days ago', activity: 'Long Run', distance: '15.6 km', time: '1:22:15' }
  ];

  const achievements = [
    { title: 'Marathon Finisher', description: 'Completed first marathon', date: '2024', icon: '🏃‍♂️' },
    { title: '1000km Club', description: 'Ran 1000km in a year', date: '2024', icon: '🎯' },
    { title: 'Consistency King', description: '30 day streak', date: '2024', icon: '🔥' },
    { title: 'Personal Record', description: 'New 5K best time', date: '2024', icon: '⚡' }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile.display_name || `${profile.first_name} ${profile.last_name}`}</h1>
              <div className="flex items-center space-x-4 text-white/90 mb-2">
                {profile.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              {profile.bio && (
                <p className="text-white/90">{profile.bio}</p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => onEditModeChange?.(true)}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-gray-900">{stat.label}</p>
            {stat.period && <p className="text-xs text-gray-500 mt-1">{stat.period}</p>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <h3 className="font-semibold text-gray-900">{activity.activity}</h3>
                  <p className="text-sm text-gray-600">{activity.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{activity.distance}</p>
                  <p className="text-sm text-gray-600">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-orange-600 hover:text-orange-700 font-medium">
            View All Activities
          </button>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{achievement.title}</h3>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
                <span className="text-xs text-gray-500">{achievement.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Training Volume</h2>
        <div className="h-64 bg-gradient-to-t from-gray-50 to-white rounded-lg flex items-end justify-center space-x-2 p-4">
          {Array.from({ length: 12 }).map((_, index) => {
            const height = Math.random() * 200 + 20;
            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-8 bg-gradient-to-t from-orange-500 to-red-500 rounded-t transition-all hover:scale-105"
                  style={{ height: `${height}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}