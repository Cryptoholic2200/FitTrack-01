import React, { useState } from 'react';
import { UserPlus, MapPin, Activity, Users } from 'lucide-react';

export default function Athletes() {
  const [followedAthletes, setFollowedAthletes] = useState<string[]>(['2', '4']);

  const athletes = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      location: 'New York, NY',
      followers: 234,
      following: 189,
      activities: 45,
      specialty: 'Runner',
      recentActivity: 'Morning Run - 8.2km',
      timeAgo: '2h ago'
    },
    {
      id: '2',
      name: 'Alex Rodriguez',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      location: 'San Francisco, CA',
      followers: 567,
      following: 234,
      activities: 62,
      specialty: 'Cyclist',
      recentActivity: 'Evening Ride - 25.4km',
      timeAgo: '4h ago'
    },
    {
      id: '3',
      name: 'Emma Johnson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      location: 'Austin, TX',
      followers: 189,
      following: 156,
      activities: 38,
      specialty: 'Swimmer',
      recentActivity: 'Pool Training - 2.1km',
      timeAgo: '6h ago'
    },
    {
      id: '4',
      name: 'Marcus Thompson',
      avatar: 'https://images.pexels.com/photos/769772/pexels-photo-769772.jpeg?auto=compress&cs=tinysrgb&w=150',
      location: 'Miami, FL',
      followers: 423,
      following: 198,
      activities: 29,
      specialty: 'CrossFit',
      recentActivity: 'HIIT Workout - 45min',
      timeAgo: '8h ago'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
      location: 'Seattle, WA',
      followers: 298,
      following: 167,
      activities: 41,
      specialty: 'Triathlete',
      recentActivity: 'Bike + Run Brick - 1h 23m',
      timeAgo: '12h ago'
    },
    {
      id: '6',
      name: 'David Park',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      location: 'Denver, CO',
      followers: 156,
      following: 143,
      activities: 33,
      specialty: 'Trail Runner',
      recentActivity: 'Mountain Trail - 12.1km',
      timeAgo: '1d ago'
    }
  ];

  const handleFollow = (athleteId: string) => {
    setFollowedAthletes(prev => 
      prev.includes(athleteId) 
        ? prev.filter(id => id !== athleteId)
        : [...prev, athleteId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Discover Athletes</h2>
        <p className="text-gray-600">Connect with fellow athletes and get inspired by their journeys</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search athletes..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            <option>All Activities</option>
            <option>Running</option>
            <option>Cycling</option>
            <option>Swimming</option>
            <option>CrossFit</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            <option>All Locations</option>
            <option>New York</option>
            <option>San Francisco</option>
            <option>Austin</option>
            <option>Miami</option>
          </select>
        </div>
      </div>

      {/* Athletes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {athletes.map((athlete) => (
          <div key={athlete.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="p-6">
              {/* Profile Header */}
              <div className="text-center mb-4">
                <img
                  src={athlete.avatar}
                  alt={athlete.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                />
                <h3 className="text-xl font-bold text-gray-900">{athlete.name}</h3>
                <div className="flex items-center justify-center space-x-1 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{athlete.location}</span>
                </div>
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                  {athlete.specialty}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{athlete.followers}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{athlete.following}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Following</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{athlete.activities}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Activities</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Recent Activity</span>
                </div>
                <p className="text-sm text-gray-600">{athlete.recentActivity}</p>
                <p className="text-xs text-gray-500 mt-1">{athlete.timeAgo}</p>
              </div>

              {/* Follow Button */}
              <button
                onClick={() => handleFollow(athlete.id)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  followedAthletes.includes(athlete.id)
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{followedAthletes.includes(athlete.id) ? 'Following' : 'Follow'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}