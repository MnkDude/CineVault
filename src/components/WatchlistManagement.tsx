import React, { useState } from 'react';
import { Play, Clock, CheckCircle, XCircle, PauseCircle, Filter, Star } from 'lucide-react';
import type { Movie } from '../App';

interface WatchlistManagementProps {
  watchlist: Movie[];
  onMovieSelect: (movie: Movie) => void;
  onUpdate: (movie: Movie) => void;
}

const WatchlistManagement: React.FC<WatchlistManagementProps> = ({ 
  watchlist, 
  onMovieSelect, 
  onUpdate 
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('title');

  const statusConfig = {
    'watching': { icon: Play, label: 'Watching', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
    'plan-to-watch': { icon: Clock, label: 'Plan to Watch', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    'completed': { icon: CheckCircle, label: 'Completed', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    'dropped': { icon: XCircle, label: 'Dropped', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
    'on-hold': { icon: PauseCircle, label: 'On Hold', color: 'text-gray-500', bg: 'bg-gray-500/10 border-gray-500/20' },
  };

  // Filter movies
  const filteredMovies = watchlist.filter(movie => {
    const statusMatch = selectedStatus === 'all' || movie.status === selectedStatus;
    const genreMatch = selectedGenre === 'all' || movie.genre.includes(selectedGenre);
    return statusMatch && genreMatch;
  });

  // Sort movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'year':
        return b.year - a.year;
      case 'rating':
        return (b.userRating || 0) - (a.userRating || 0);
      case 'dateAdded':
        return new Date(b.dateWatched || '').getTime() - new Date(a.dateWatched || '').getTime();
      default:
        return 0;
    }
  });

  // Get all unique genres
  const allGenres = Array.from(new Set(watchlist.flatMap(movie => movie.genre)));

  // Status counts
  const statusCounts = {
    all: watchlist.length,
    watching: watchlist.filter(m => m.status === 'watching').length,
    'plan-to-watch': watchlist.filter(m => m.status === 'plan-to-watch').length,
    completed: watchlist.filter(m => m.status === 'completed').length,
    dropped: watchlist.filter(m => m.status === 'dropped').length,
    'on-hold': watchlist.filter(m => m.status === 'on-hold').length,
  };

  const handleStatusChange = (movie: Movie, newStatus: Movie['status']) => {
    const updatedMovie = { ...movie, status: newStatus };
    if (newStatus === 'completed' && !movie.dateWatched) {
      updatedMovie.dateWatched = new Date().toISOString().split('T')[0];
    }
    onUpdate(updatedMovie);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          My Watchlist
        </h1>
        <p className="text-gray-400">Organize and track your movie collection</p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-black/20 rounded-xl">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedStatus === 'all'
              ? 'bg-purple-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-black/30'
          }`}
        >
          All ({statusCounts.all})
        </button>
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          const count = statusCounts[status as keyof typeof statusCounts];
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                selectedStatus === status
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-black/30'
              }`}
            >
              <Icon size={16} />
              <span>{config.label} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-purple-400" />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Genres</option>
            {allGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="title">Title</option>
            <option value="year">Year</option>
            <option value="rating">Rating</option>
            <option value="dateAdded">Date Added</option>
          </select>
        </div>
        
        <div className="ml-auto text-gray-400 text-sm">
          {sortedMovies.length} movies
        </div>
      </div>

      {/* Movies Grid */}
      {sortedMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedMovies.map((movie) => {
            const statusInfo = statusConfig[movie.status!];
            const StatusIcon = statusInfo.icon;
            
            return (
              <div
                key={movie.id}
                className="bg-black/30 border border-gray-700 rounded-xl overflow-hidden hover:bg-black/40 transition-all group hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  
                  {/* Status Badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg border backdrop-blur-sm ${statusInfo.bg}`}>
                    <div className={`flex items-center space-x-1 ${statusInfo.color}`}>
                      <StatusIcon size={12} />
                      <span className="text-xs font-medium">{statusInfo.label}</span>
                    </div>
                  </div>

                  {/* Progress Bar for Series */}
                  {movie.type === 'series' && movie.progress && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{
                            width: `${(movie.progress.currentEpisode / movie.progress.totalEpisodes) * 100}%`
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        Episode {movie.progress.currentEpisode} of {movie.progress.totalEpisodes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 
                    className="font-semibold text-white group-hover:text-purple-400 transition-colors cursor-pointer"
                    onClick={() => onMovieSelect(movie)}
                  >
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-400">{movie.year} • {movie.type}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {movie.genre.slice(0, 2).join(', ')}
                  </p>
                  
                  {/* User Rating */}
                  {movie.userRating && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Star className="text-yellow-500" size={14} fill="currentColor" />
                      <span className="text-sm text-gray-300">{movie.userRating}/10</span>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div className="mt-3">
                    <select
                      value={movie.status || ''}
                      onChange={(e) => handleStatusChange(movie, e.target.value as Movie['status'])}
                      className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      <option value="">Select Status</option>
                      {Object.entries(statusConfig).map(([status, config]) => (
                        <option key={status} value={status}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-600 mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
          <p className="text-gray-400">Try adjusting your filters or add some movies to your watchlist</p>
        </div>
      )}
    </div>
  );
};

export default WatchlistManagement;