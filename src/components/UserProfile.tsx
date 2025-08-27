import React, { useState } from 'react';
import { ArrowLeft, Camera, Save, User, Mail, Heart, Clock, Trophy, Star } from 'lucide-react';
import type { User as UserType } from '../App';

interface UserProfileProps {
  user: UserType;
  onUpdate: (user: UserType) => void;
  onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    favoriteGenres: [...user.favoriteGenres]
  });

  const allGenres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
    'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
  ];

  const handleGenreToggle = (genre: string) => {
    const updatedGenres = formData.favoriteGenres.includes(genre)
      ? formData.favoriteGenres.filter(g => g !== genre)
      : [...formData.favoriteGenres, genre];
    
    setFormData({ ...formData, favoriteGenres: updatedGenres });
  };

  const handleSave = () => {
    const updatedUser: UserType = {
      ...user,
      name: formData.name,
      email: formData.email,
      favoriteGenres: formData.favoriteGenres
    };
    
    onUpdate(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      favoriteGenres: [...user.favoriteGenres]
    });
    setIsEditing(false);
  };

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-purple-500/20"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors">
                <Camera size={16} />
              </button>
            </div>

            <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-gray-400 mb-6">{user.email}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-3">
                <Clock className="text-purple-400 mx-auto mb-2" size={20} />
                <div className="text-lg font-bold text-white">{formatWatchTime(user.totalWatchTime)}</div>
                <div className="text-xs text-gray-400">Watch Time</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <Star className="text-yellow-500 mx-auto mb-2" size={20} />
                <div className="text-lg font-bold text-white">127</div>
                <div className="text-xs text-gray-400">Movies Rated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <User size={16} className="inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                ) : (
                  <p className="text-white bg-gray-700/50 px-3 py-2 rounded-lg">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                ) : (
                  <p className="text-white bg-gray-700/50 px-3 py-2 rounded-lg">{user.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Favorite Genres */}
          <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="text-pink-500" size={20} />
              <h3 className="text-xl font-bold text-white">Favorite Genres</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {allGenres.map(genre => {
                const isSelected = formData.favoriteGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => isEditing && handleGenreToggle(genre)}
                    disabled={!isEditing}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-gray-700/30 text-gray-400 border border-gray-600 hover:border-gray-500'
                    } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-gray-400 mt-4">
              Selected: {formData.favoriteGenres.length} genres
            </p>
          </div>

          {/* Account Stats */}
          <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="text-yellow-500" size={20} />
              <h3 className="text-xl font-bold text-white">Account Statistics</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">247</div>
                <div className="text-sm text-gray-400">Movies Watched</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">63</div>
                <div className="text-sm text-gray-400">Series Completed</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">8.2</div>
                <div className="text-sm text-gray-400">Avg Rating</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">15</div>
                <div className="text-sm text-gray-400">Reviews Written</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;