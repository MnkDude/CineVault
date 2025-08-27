import React, { useState } from 'react';
import { Search, Clock, Star, TrendingUp, Plus } from 'lucide-react';
import type { Movie } from '../App';

interface HomeProps {
  watchlist: Movie[];
  onMovieSelect: (movie: Movie) => void;
  onAddToWatchlist: (movie: Movie) => void;
}

const Home: React.FC<HomeProps> = ({ watchlist, onMovieSelect, onAddToWatchlist }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  // Mock search function
  const mockSearchResults: Movie[] = [
    {
      id: 101,
      title: "Dune",
      poster: "https://images.pexels.com/photos/1022927/pexels-photo-1022927.jpeg?auto=compress&cs=tinysrgb&w=300",
      year: 2021,
      genre: ["Sci-Fi", "Adventure", "Drama"],
      runtime: 155,
      rating: 8.1,
      description: "Feature adaptation of Frank Herbert's science fiction novel about the son of a noble family.",
      type: 'movie'
    },
    {
      id: 102,
      title: "Stranger Things",
      poster: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300",
      year: 2016,
      genre: ["Drama", "Fantasy", "Horror"],
      runtime: 51,
      rating: 8.7,
      description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
      type: 'series'
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // Mock search - in real app, this would be an API call
      setSearchResults(mockSearchResults.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      ));
    } else {
      setSearchResults([]);
    }
  };

  const recentlyWatched = watchlist
    .filter(movie => movie.status === 'completed' && movie.dateWatched)
    .sort((a, b) => new Date(b.dateWatched!).getTime() - new Date(a.dateWatched!).getTime())
    .slice(0, 6);

  const currentlyWatching = watchlist.filter(movie => movie.status === 'watching');
  const planToWatch = watchlist.filter(movie => movie.status === 'plan-to-watch').slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search movies and TV series..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((movie) => (
              <div
                key={movie.id}
                className="bg-black/20 border border-gray-700 rounded-lg p-4 hover:bg-black/30 transition-all cursor-pointer group"
              >
                <div className="flex space-x-3">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-gray-400">{movie.year} • {movie.type}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {movie.genre.slice(0, 2).join(', ')}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Star className="text-yellow-500" size={14} />
                      <span className="text-sm text-gray-300">{movie.rating}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddToWatchlist({ ...movie, status: 'plan-to-watch' })}
                    className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Currently Watching */}
      {currentlyWatching.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="text-orange-500" size={20} />
            <h2 className="text-xl font-bold text-white">Continue Watching</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentlyWatching.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onMovieSelect(movie)}
                className="bg-black/30 border border-gray-700 rounded-xl overflow-hidden hover:bg-black/40 transition-all cursor-pointer group hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  {movie.progress && (
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
                  <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-400">{movie.year}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Watched */}
      {recentlyWatched.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="text-green-500" size={20} />
            <h2 className="text-xl font-bold text-white">Recently Watched</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentlyWatched.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onMovieSelect(movie)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {movie.userRating && (
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-500" size={14} fill="currentColor" />
                        <span className="text-white text-sm">{movie.userRating}</span>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-white mt-2 group-hover:text-purple-400 transition-colors">
                  {movie.title}
                </h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Plan to Watch */}
      {planToWatch.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Plan to Watch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {planToWatch.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onMovieSelect(movie)}
                className="bg-black/30 border border-gray-700 rounded-lg p-4 hover:bg-black/40 transition-all cursor-pointer group"
              >
                <div className="flex space-x-3">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-gray-400">{movie.year}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      <Star className="text-yellow-500" size={14} />
                      <span className="text-sm text-gray-300">{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;