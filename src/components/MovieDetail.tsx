import React, { useState } from 'react';
import { X, Star, Clock, Calendar, Edit3, Save, BookOpen, Play } from 'lucide-react';
import type { Movie } from '../App';

interface MovieDetailProps {
  movie: Movie;
  onClose: () => void;
  onUpdate: (movie: Movie) => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userRating, setUserRating] = useState(movie.userRating || 0);
  const [userReview, setUserReview] = useState(movie.userReview || '');
  const [userNotes, setUserNotes] = useState(movie.userNotes || '');
  const [status, setStatus] = useState(movie.status || 'plan-to-watch');
  const [currentEpisode, setCurrentEpisode] = useState(movie.progress?.currentEpisode || 1);
  const [hoveredStar, setHoveredStar] = useState(0);

  const statusOptions = [
    { value: 'watching', label: 'Currently Watching', color: 'text-green-500' },
    { value: 'plan-to-watch', label: 'Plan to Watch', color: 'text-yellow-500' },
    { value: 'completed', label: 'Completed', color: 'text-blue-500' },
    { value: 'dropped', label: 'Dropped', color: 'text-red-500' },
    { value: 'on-hold', label: 'On Hold', color: 'text-gray-500' },
  ];

  const handleSave = () => {
    const updatedMovie: Movie = {
      ...movie,
      userRating: userRating || undefined,
      userReview: userReview || undefined,
      userNotes: userNotes || undefined,
      status,
      progress: movie.type === 'series' ? {
        currentEpisode,
        totalEpisodes: movie.progress?.totalEpisodes || 50
      } : undefined,
      dateWatched: status === 'completed' && !movie.dateWatched 
        ? new Date().toISOString().split('T')[0] 
        : movie.dateWatched
    };
    
    onUpdate(updatedMovie);
    setIsEditing(false);
  };

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
  };

  const progressPercentage = movie.type === 'series' && movie.progress 
    ? (currentEpisode / movie.progress.totalEpisodes) * 100 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Movie Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Movie Poster & Info */}
            <div className="lg:col-span-1">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl"
              />
              
              {/* Movie Stats */}
              <div className="mt-6 space-y-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Movie Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Year:</span>
                      <span className="text-white">{movie.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Runtime:</span>
                      <span className="text-white">{movie.runtime} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white capitalize">{movie.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">IMDb Rating:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-500" size={14} fill="currentColor" />
                        <span className="text-white">{movie.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map(genre => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Description */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
                <p className="text-gray-300 leading-relaxed">{movie.description}</p>
              </div>

              {/* Status Selection */}
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Watchlist Status</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {statusOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setStatus(option.value as Movie['status'])}
                      className={`p-3 rounded-lg border transition-all ${
                        status === option.value
                          ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                          : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Tracking for Series */}
              {movie.type === 'series' && (
                <div className="bg-black/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Progress Tracking</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="text-gray-400 min-w-0 flex-shrink-0">Episode:</label>
                      <input
                        type="number"
                        min="1"
                        max={movie.progress?.totalEpisodes || 50}
                        value={currentEpisode}
                        onChange={(e) => setCurrentEpisode(Number(e.target.value))}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        disabled={!isEditing}
                      />
                      <span className="text-gray-400">of {movie.progress?.totalEpisodes || 50}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 text-center">
                      {progressPercentage.toFixed(1)}% Complete
                    </p>
                  </div>
                </div>
              )}

              {/* Personal Rating */}
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Your Rating</h3>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                    <button
                      key={star}
                      onClick={() => isEditing && handleStarClick(star)}
                      onMouseEnter={() => isEditing && setHoveredStar(star)}
                      onMouseLeave={() => isEditing && setHoveredStar(0)}
                      disabled={!isEditing}
                      className="transition-colors"
                    >
                      <Star
                        size={24}
                        className={`${
                          star <= (hoveredStar || userRating)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-600'
                        } ${isEditing ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
                      />
                    </button>
                  ))}
                  {userRating > 0 && (
                    <span className="ml-2 text-white font-semibold">
                      {userRating}/10
                    </span>
                  )}
                </div>
              </div>

              {/* Review */}
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Your Review</h3>
                {isEditing ? (
                  <textarea
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    placeholder="Write your review here..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white min-h-[100px] resize-vertical"
                  />
                ) : (
                  <p className="text-gray-300 min-h-[60px]">
                    {userReview || 'No review written yet.'}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Personal Notes</h3>
                {isEditing ? (
                  <textarea
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Add your personal notes..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white min-h-[80px] resize-vertical"
                  />
                ) : (
                  <p className="text-gray-300 min-h-[40px]">
                    {userNotes || 'No notes added yet.'}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                    >
                      <Save size={16} />
                      <span>Save Changes</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                  >
                    <Edit3 size={16} />
                    <span>Edit Details</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;