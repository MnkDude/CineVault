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

  // Use Vite environment variable for TMDB API key
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    // Only search when Enter is pressed, not on every character
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.length > 2) {
      (async () => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(searchQuery)}&page=1&include_adult=true`
          );
          const data = await res.json();
          let results = (data.results || []).filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
          // Sort by popularity descending
          results = results.sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));
          const mapped: Movie[] = results.map((item: any) => ({
            id: item.id,
            title: item.title || item.name,
            poster: item.poster_path
              ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
              : '/no-image.png',
            year: parseInt((item.release_date || item.first_air_date || '0').slice(0, 4)),
            release_date: item.release_date || item.first_air_date,
            language: item.original_language || 'N/A',
            genre: [],
            runtime: 0,
            rating: item.vote_average || 0,
            description: item.overview || '',
            type: item.media_type === 'movie' ? 'movie' : 'series',
          }));
          setSearchResults(mapped);
        } catch (e) {
          setSearchResults([]);
        }
      })();
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
      <div className="bg-cinema-card shadow-cinema border border-cinema-gold/20 rounded-xl p-6 animate-fade-in">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cinema-muted" size={20} />
          <input
            type="text"
            placeholder="Search movies and TV series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="w-full pl-10 pr-4 py-3 bg-[#181818]/60 border border-cinema-gold/20 rounded-lg text-cinema-primary placeholder-cinema-muted focus:outline-none focus:border-cinema-gold focus:ring-2 focus:ring-cinema-gold/20"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((movie, idx) => (
              <div
                key={movie.id}
                className="bg-cinema-card border border-cinema-gold/20 rounded-lg p-4 hover:bg-[#23201a]/80 transition-all cursor-pointer group transform-gpu hover:scale-105 hover:shadow-cinema duration-300 animate-fade-in"
                style={{ animationDelay: `${idx * 60}ms` }}
                onClick={() => onMovieSelect(movie)}
              >
                <div className="flex space-x-3">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-cinema-primary group-hover:text-cinema-secondary transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-cinema-muted capitalize">
                      {movie.release_date || movie.year} • {movie.language}
                    </p>
                    <p className="text-xs text-cinema-muted mt-1">
                      {movie.genre.slice(0, 2).join(', ')}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Star className="text-yellow-500" size={14} />
                      <span className="text-cinema-primary font-semibold">{movie.rating.toFixed(1)}</span>
                      <span className="text-cinema-muted text-xs">/ 10</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          searchQuery.length > 2 && (
            <div className="mt-4 text-center text-cinema-muted text-lg">
              No results found.
            </div>
          )
        )}
      </div>

      {/* Currently Watching */}
      {currentlyWatching.length > 0 && (
        <section className="animate-section-fade-in">
          <div className="flex items-center space-x-2 mb-4 relative overflow-hidden">
            <Clock className="text-cinema-secondary" size={20} />
            <h2 className="text-xl font-bold text-cinema-primary relative z-10">
              <span className="relative inline-block">
                Continue Watching
                <span className="absolute inset-0 pointer-events-none bg-gradient-to-r from-cinema-primary/30 to-cinema-primary/0 animate-light-sweep rounded blur-sm" />
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentlyWatching.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onMovieSelect(movie)}
                className="bg-cinema-card border border-cinema-gold/20 rounded-xl overflow-hidden hover:bg-[#23201a]/80 transition-all cursor-pointer group hover:scale-105 hover:shadow-cinema"
              >
                <div className="relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  {movie.progress && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="w-full bg-cinema-muted/30 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cinema-secondary to-cinema-primary h-2 rounded-full"
                          style={{
                            width: `${(movie.progress.currentEpisode / movie.progress.totalEpisodes) * 100}%`
                          }}
                        />
                      </div>
                      <p className="text-xs text-cinema-muted mt-1">
                        Episode {movie.progress.currentEpisode} of {movie.progress.totalEpisodes}
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-cinema-primary group-hover:text-cinema-secondary transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-cinema-muted">{movie.year}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Plan to Watch */}
      {planToWatch.length > 0 && (
        <section className="animate-section-fade-in">
          <div className="mb-4 relative overflow-hidden">
            <h2 className="text-xl font-bold text-cinema-primary relative z-10">
              <span className="relative inline-block">
                Plan to Watch
                <span className="absolute inset-0 pointer-events-none bg-gradient-to-r from-cinema-primary/30 to-cinema-primary/0 animate-light-sweep rounded blur-sm" />
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {planToWatch.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onMovieSelect(movie)}
                className="bg-cinema-card border border-cinema-gold/20 rounded-lg p-4 hover:bg-[#23201a]/80 transition-all cursor-pointer group"
              >
                <div className="flex space-x-3">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-cinema-primary group-hover:text-cinema-secondary transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-cinema-muted">{movie.year}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      <Star className="text-yellow-500" size={14} />
                      <span className="text-sm text-cinema-primary">{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Watched */}
      {recentlyWatched.length > 0 && (
        <section className="animate-section-fade-in">
          <div className="flex items-center space-x-2 mb-4 relative overflow-hidden">
            <TrendingUp className="text-green-500" size={20} />
            <h2 className="text-xl font-bold text-cinema-primary relative z-10">
              <span className="relative inline-block">
                Recently Watched
                <span className="absolute inset-0 pointer-events-none bg-gradient-to-r from-cinema-primary/30 to-cinema-primary/0 animate-light-sweep rounded blur-sm" />
              </span>
            </h2>
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
                        <span className="text-cinema-primary text-sm">{movie.userRating}</span>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-cinema-primary mt-2 group-hover:text-cinema-secondary transition-colors">
                  {movie.title}
                </h3>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
