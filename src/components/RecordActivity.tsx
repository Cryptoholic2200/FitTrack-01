import React, { useState } from 'react';
import { X, Clock, MapPin, Zap, Heart, Save } from 'lucide-react';
import { useActivities } from '../hooks/useActivities';

interface RecordActivityProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecordActivity({ isOpen, onClose }: RecordActivityProps) {
  const { createActivity } = useActivities();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    type: 'run' as 'run' | 'ride' | 'swim' | 'walk' | 'hike' | 'workout' | 'yoga' | 'crossfit' | 'other',
    title: '',
    description: '',
    distance: '',
    hours: '',
    minutes: '',
    seconds: '',
    elevation_gain: '',
    calories_burned: '',
    average_heart_rate: '',
    max_heart_rate: '',
    privacy_level: 'public' as 'public' | 'private' | 'followers'
  });

  const activityTypes = [
    { value: 'run', label: 'Run', icon: '🏃‍♂️' },
    { value: 'ride', label: 'Bike Ride', icon: '🚴‍♂️' },
    { value: 'swim', label: 'Swim', icon: '🏊‍♂️' },
    { value: 'walk', label: 'Walk', icon: '🚶‍♂️' },
    { value: 'hike', label: 'Hike', icon: '🥾' },
    { value: 'workout', label: 'Workout', icon: '💪' },
    { value: 'yoga', label: 'Yoga', icon: '🧘‍♀️' },
    { value: 'crossfit', label: 'CrossFit', icon: '🏋️‍♂️' },
    { value: 'other', label: 'Other', icon: '🏃‍♂️' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDuration = (hours: string, minutes: string, seconds: string): string => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setMessage({ type: 'error', text: 'Activity title is required' });
        setSaving(false);
        return;
      }

      if (!formData.hours && !formData.minutes && !formData.seconds) {
        setMessage({ type: 'error', text: 'Duration is required' });
        setSaving(false);
        return;
      }

      const duration = formatDuration(formData.hours, formData.minutes, formData.seconds);

      const activityData = {
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        distance: formData.distance ? parseFloat(formData.distance) : 0,
        duration,
        elevation_gain: formData.elevation_gain ? parseInt(formData.elevation_gain) : 0,
        calories_burned: formData.calories_burned ? parseInt(formData.calories_burned) : null,
        average_heart_rate: formData.average_heart_rate ? parseInt(formData.average_heart_rate) : null,
        max_heart_rate: formData.max_heart_rate ? parseInt(formData.max_heart_rate) : null,
        privacy_level: formData.privacy_level
      };

      const { error } = await createActivity(activityData);

      if (error) {
        setMessage({ type: 'error', text: error });
      } else {
        setMessage({ type: 'success', text: 'Activity recorded successfully!' });
        // Reset form
        setFormData({
          type: 'run',
          title: '',
          description: '',
          distance: '',
          hours: '',
          minutes: '',
          seconds: '',
          elevation_gain: '',
          calories_burned: '',
          average_heart_rate: '',
          max_heart_rate: '',
          privacy_level: 'public'
        });
        // Close modal after a short delay
        setTimeout(() => {
          onClose();
          setMessage(null);
        }, 1500);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to record activity' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Record Activity</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-6 mt-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Activity Type *</label>
            <div className="grid grid-cols-3 gap-3">
              {activityTypes.map((type) => (
                <label key={type.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    formData.type === type.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Morning Run in Central Park"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="How did it go? Any notes about your workout..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  name="hours"
                  value={formData.hours}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  max="23"
                  className="w-16 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center"
                />
                <span className="text-sm text-gray-500">h</span>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  name="minutes"
                  value={formData.minutes}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  max="59"
                  className="w-16 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center"
                />
                <span className="text-sm text-gray-500">m</span>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  name="seconds"
                  value={formData.seconds}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  max="59"
                  className="w-16 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center"
                />
                <span className="text-sm text-gray-500">s</span>
              </div>
              <Clock className="w-5 h-5 text-gray-400 ml-2" />
            </div>
          </div>

          {/* Distance and Elevation */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  name="distance"
                  value={formData.distance}
                  onChange={handleInputChange}
                  placeholder="0.0"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Elevation Gain (m)</label>
              <div className="relative">
                <input
                  type="number"
                  name="elevation_gain"
                  value={formData.elevation_gain}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <Zap className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Calories and Heart Rate */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calories Burned</label>
              <input
                type="number"
                name="calories_burned"
                value={formData.calories_burned}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avg Heart Rate</label>
              <div className="relative">
                <input
                  type="number"
                  name="average_heart_rate"
                  value={formData.average_heart_rate}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <Heart className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Heart Rate</label>
              <div className="relative">
                <input
                  type="number"
                  name="max_heart_rate"
                  value={formData.max_heart_rate}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <Heart className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
            <select
              name="privacy_level"
              value={formData.privacy_level}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="public">Public - Everyone can see this activity</option>
              <option value="followers">Followers - Only people you follow can see this</option>
              <option value="private">Private - Only you can see this activity</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-400 transition-colors flex items-center space-x-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Recording...' : 'Record Activity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}