import React, { useState, useEffect } from 'react';
import { User, Film, BarChart3, Search, Star, Calendar, TrendingUp } from 'lucide-react';
import Header from './components/Header';
import Home from './components/Home';
import StatsDashboard from './components/StatsDashboard';
import WatchlistManagement from './components/WatchlistManagement';
import UserProfile from './components/UserProfile';
import AuthModal from './components/AuthModal';
import MovieDetail from './components/MovieDetail';

export interface Movie {
  id: number;
  title: string;
  poster: string;
  year: number;
  genre: string[];
  runtime: number;
  rating: number;
  description: string;
  status?: 'watching' | 'plan-to-watch' | 'completed' | 'dropped' | 'on-hold';
  userRating?: number;
  userReview?: string;
  userNotes?: string;
  progress?: {
    currentEpisode: number;
    totalEpisodes: number;
  };
  dateWatched?: string;
  type: 'movie' | 'series';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  favoriteGenres: string[];
  totalWatchTime: number;
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  // Mock data for demonstration
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: "The Dark Knight",
      poster: "https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=300",
      year: 2008,
      genre: ["Action", "Crime", "Drama"],
      runtime: 152,
      rating: 9.0,
      description: "When a menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
      type: 'movie',
      status: 'completed',
      userRating: 9,
      dateWatched: '2024-01-15'
    },
    {
      id: 2,
      title: "Breaking Bad",
      poster: "https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=300",
      year: 2008,
      genre: ["Crime", "Drama", "Thriller"],
      runtime: 47,
      rating: 9.5,
      description: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
      type: 'series',
      status: 'watching',
      progress: { currentEpisode: 45, totalEpisodes: 62 },
      userRating: 10
    },
    {
      id: 3,
      title: "Inception",
      poster: "https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg?auto=compress&cs=tinysrgb&w=300",
      year: 2010,
      genre: ["Action", "Sci-Fi", "Thriller"],
      runtime: 148,
      rating: 8.8,
      description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
      type: 'movie',
      status: 'plan-to-watch'
    }
  ];

  useEffect(() => {
    setWatchlist(mockMovies);
    // Mock user login
    setUser({
      id: '1',
      name: 'Movie Enthusiast',
      email: 'user@cinevault.com',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
      favoriteGenres: ['Action', 'Drama', 'Sci-Fi'],
      totalWatchTime: 2847
    });
  }, []);

  const tabs = [
    { id: 'home', label: 'Home', icon: Search },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'watchlist', label: 'Watchlist', icon: Film },
  ];

  const updateMovieInWatchlist = (updatedMovie: Movie) => {
    setWatchlist(prev => prev.map(movie => 
      movie.id === updatedMovie.id ? updatedMovie : movie
    ));
  };

  const addToWatchlist = (movie: Movie) => {
    setWatchlist(prev => [...prev, movie]);
  };

  const renderContent = () => {
    if (selectedMovie) {
      return (
        <MovieDetail
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onUpdate={updateMovieInWatchlist}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <Home
            watchlist={watchlist}
            onMovieSelect={setSelectedMovie}
            onAddToWatchlist={addToWatchlist}
          />
        );
      case 'stats':
        return <StatsDashboard watchlist={watchlist} user={user} />;
      case 'watchlist':
        return (
          <WatchlistManagement
            watchlist={watchlist}
            onMovieSelect={setSelectedMovie}
            onUpdate={updateMovieInWatchlist}
          />
        );
      default:
        return <Home watchlist={watchlist} onMovieSelect={setSelectedMovie} onAddToWatchlist={addToWatchlist} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onProfileClick={() => setActiveTab('profile')}
      />

      {/* Tab Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-gray-400 hover:text-purple-300 hover:border-purple-300'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && user ? (
          <UserProfile 
            user={user} 
            onUpdate={setUser}
            onBack={() => setActiveTab('home')}
          />
        ) : (
          renderContent()
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={(userData) => {
            setUser(userData);
            setShowAuthModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;