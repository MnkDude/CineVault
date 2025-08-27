import React, { useState } from 'react';
import { Clock, Calendar, Trophy, TrendingUp, Filter } from 'lucide-react';
import type { Movie, User } from '../App';

interface StatsDashboardProps {
  watchlist: Movie[];
  user: User | null;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ watchlist, user }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedGenre, setSelectedGenre] = useState('all');

  // Calculate stats
  const completedMovies = watchlist.filter(movie => movie.status === 'completed');
  const totalWatchTime = completedMovies.reduce((total, movie) => total + movie.runtime, 0);
  const totalMovies = completedMovies.length;

  // Genre breakdown
  const genreStats = completedMovies.reduce((acc, movie) => {
    movie.genre.forEach(genre => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topGenres = Object.entries(genreStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Generate mock heatmap data
  const generateHeatmapData = () => {
    const data = [];
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const watchCount = Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0;
      data.push({
        date: dateStr,
        count: watchCount
      });
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  // Pie Chart Component
  const PieChart: React.FC<{ data: [string, number][] }> = ({ data }) => {
    const total = data.reduce((sum, [, count]) => sum + count, 0);
    let currentAngle = 0;
    const colors = ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#3B82F6'];
    
    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="none"
            stroke="#374151"
            strokeWidth="2"
            className="opacity-20"
          />
          {data.map(([genre, count], index) => {
            const percentage = (count / total) * 100;
            const angle = (count / total) * 360;
            const largeArcFlag = angle > 180 ? 1 : 0;
            const x1 = 96 + 80 * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = 96 + 80 * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = 96 + 80 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = 96 + 80 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            
            const pathData = [
              `M 96 96`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={genre}
                d={pathData}
                fill={colors[index]}
                className="hover:brightness-110 transition-all"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-sm text-gray-400">Movies</div>
          </div>
        </div>
      </div>
    );
  };

  // Heatmap Component
  const Heatmap: React.FC<{ data: { date: string; count: number }[] }> = ({ data }) => {
    const getIntensity = (count: number) => {
      if (count === 0) return 'bg-gray-800';
      if (count === 1) return 'bg-purple-900';
      if (count === 2) return 'bg-purple-600';
      return 'bg-purple-400';
    };

    const weeks = [];
    let currentWeek = [];
    
    data.forEach((day, index) => {
      currentWeek.push(day);
      if ((index + 1) % 7 === 0 || index === data.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    return (
      <div className="overflow-x-auto">
        <div className="inline-flex space-x-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col space-y-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`w-3 h-3 rounded-sm ${getIntensity(day.count)} transition-colors hover:ring-2 hover:ring-purple-400`}
                  title={`${day.date}: ${day.count} movies`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Your Movie Stats
        </h1>
        <p className="text-gray-400">Track your cinematic journey</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-purple-400" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            {[2024, 2023, 2022, 2021].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-purple-400" />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Genres</option>
            {Object.keys(genreStats).map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Clock className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Watch Time</p>
              <p className="text-2xl font-bold text-white">
                {Math.floor(totalWatchTime / 60)}h {totalWatchTime % 60}m
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Trophy className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Movies Completed</p>
              <p className="text-2xl font-bold text-white">{totalMovies}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <TrendingUp className="text-orange-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Average Rating</p>
              <p className="text-2xl font-bold text-white">
                {completedMovies.filter(m => m.userRating).length > 0
                  ? (completedMovies.reduce((sum, m) => sum + (m.userRating || 0), 0) / 
                     completedMovies.filter(m => m.userRating).length).toFixed(1)
                  : '0'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre Breakdown */}
        <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Genre Breakdown</h3>
          {topGenres.length > 0 ? (
            <div className="space-y-6">
              <PieChart data={topGenres} />
              <div className="space-y-2">
                {topGenres.map(([genre, count], index) => (
                  <div key={genre} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#3B82F6'][index] }}
                      />
                      <span className="text-gray-300">{genre}</span>
                    </div>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400 py-12">No data available</p>
          )}
        </div>

        {/* Top Rated Movies */}
        <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Top Rated Movies</h3>
          <div className="space-y-4">
            {completedMovies
              .filter(movie => movie.userRating)
              .sort((a, b) => (b.userRating || 0) - (a.userRating || 0))
              .slice(0, 5)
              .map((movie, index) => (
                <div key={movie.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{movie.title}</h4>
                    <p className="text-sm text-gray-400">{movie.year}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="text-yellow-500">★</div>
                    <span className="text-white font-medium">{movie.userRating}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Yearly Heatmap */}
      <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          {selectedYear} Watch Activity
        </h3>
        <div className="space-y-4">
          <Heatmap data={heatmapData} />
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-800 rounded-sm" />
              <div className="w-3 h-3 bg-purple-900 rounded-sm" />
              <div className="w-3 h-3 bg-purple-600 rounded-sm" />
              <div className="w-3 h-3 bg-purple-400 rounded-sm" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;