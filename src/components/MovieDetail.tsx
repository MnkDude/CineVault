import React, { useState } from 'react';
import { X, Star, Edit3, Save, Info } from 'lucide-react';
import type { Movie } from '../App';
import { playSound } from '../utils/sound';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

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
  const [showDescription, setShowDescription] = useState(false);
  const [showCastCrew, setShowCastCrew] = useState(false);
  const [castDetails, setCastDetails] = useState<any[] | null>(movie.castDetails || null);
  const [crewDetails, setCrewDetails] = useState<any[] | null>(movie.crewDetails || null);
  const [castCrewLoading, setCastCrewLoading] = useState(false);
  const [castCrewError, setCastCrewError] = useState<string | null>(null);

  const statusOptions = [
    { value: 'watching', label: 'Currently Watching', color: 'text-green-500' },
    { value: 'plan-to-watch', label: 'Plan to Watch', color: 'text-yellow-500' },
    { value: 'completed', label: 'Completed', color: 'text-blue-500' },
    { value: 'dropped', label: 'Dropped', color: 'text-red-500' },
    { value: 'on-hold', label: 'On Hold', color: 'text-gray-500' },
  ];

  const handleSave = () => {
    playSound('/mixkit-fast-double-click-on-mouse-275.wav');
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

  const formatRuntime = (minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const hoursPart = hours > 0 ? `${hours}h` : '';
    const minutesPart = remainingMinutes > 0 ? `${remainingMinutes}m` : '';
    return `${hoursPart} ${minutesPart}`.trim();
  };

  const progressPercentage = movie.type === 'series' && movie.progress
    ? (currentEpisode / movie.progress.totalEpisodes) * 100 
    : 0;

  const handleCastCrewClick = async () => {
    setShowCastCrew((v) => !v);
    if (!showCastCrew && (!castDetails || !crewDetails)) {
      setCastCrewLoading(true);
      setCastCrewError(null);
      try {
        const type = movie.type === 'series' ? 'tv' : 'movie';
        const creditsRes = await fetch(`https://api.themoviedb.org/3/${type}/${movie.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`);
        const credits = await creditsRes.json();
        setCastDetails(credits.cast ? credits.cast.slice(0, 10).map((c: any) => ({ id: c.id, name: c.name, character: c.character })) : []);
        setCrewDetails(credits.crew ? credits.crew.filter((c: any) => ['Director', 'Writer', 'Creator'].includes(c.job)).map((c: any) => ({ id: c.id, name: c.name, job: c.job })) : []);
      } catch (e) {
        setCastCrewError('Failed to load cast & crew.');
      } finally {
        setCastCrewLoading(false);
      }
    }
  };

  // Country code to name mapping (ISO 3166-1 alpha-2)
  const COUNTRY_NAMES: Record<string, string> = {
    US: 'United States',
    IN: 'India',
    GB: 'United Kingdom',
    CA: 'Canada',
    FR: 'France',
    DE: 'Germany',
    JP: 'Japan',
    KR: 'South Korea',
    CN: 'China',
    IT: 'Italy',
    ES: 'Spain',
    RU: 'Russia',
    AU: 'Australia',
    // ...add more as needed
  };

  function getCountryNames(codes: string[] | undefined, fallback: string) {
    if (!codes || codes.length === 0) return fallback;
    return codes.map(code => COUNTRY_NAMES[code] || code).join(', ');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Theatrical Screen Modal - dark background for readability */}
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl border-4 border-[#bfa16a] bg-gradient-to-b from-[#181818] via-[#23201a] to-[#181818] backdrop-blur-xl animate-modal-scale-in">
        {/* Top curve (screen effect) */}
        <div className="absolute -top-6 left-0 w-full h-8 bg-gradient-to-b from-[#bfa16a]/80 to-transparent rounded-t-[2.5rem] z-10 pointer-events-none" />
        {/* Close Button */}
        <button
          onClick={() => { playSound('/mixkit-fast-double-click-on-mouse-275.wav'); onClose(); }}
          className="absolute top-4 right-4 p-2 text-yellow-200 hover:text-white hover:bg-yellow-900/40 rounded-full transition-colors z-20 bg-black/30"
          aria-label="Close"
        >
          <X size={28} />
        </button>
        <div className="flex flex-col md:flex-row gap-8 p-8 pb-16"> {/* Extra bottom padding for cast/crew */}
          {/* Poster */}
          <div className="flex-shrink-0 w-full md:w-64 flex flex-col items-center">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-96 object-cover rounded-2xl shadow-xl border-4 border-yellow-900/30 bg-black/40"
            />
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {movie.genre.map(genre => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-yellow-900/30 text-yellow-100 rounded-full text-xs border border-yellow-900/40 font-medium shadow"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
          {/* Details */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Title & Info */}
            <div>
              <h1 className="text-3xl font-extrabold text-yellow-100 mb-2 leading-tight drop-shadow-lg">
                {movie.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-yellow-200/80 mb-2">
                <span>{movie.release_date || movie.year}</span>
                <span>• {formatRuntime(movie.runtime)}</span>
                <span>• {movie.language}</span>
                <span>• {getCountryNames(movie.origin_country, movie.country || 'N/A')}</span>
                <span className="flex items-center gap-1"><Star className="text-yellow-400" size={16} /> {movie.rating}/10</span>
              </div>
              <p className="text-gray-200/90 text-base leading-relaxed mt-2 bg-black/20 rounded-lg p-3 shadow-inner max-h-40 overflow-y-auto">
                {movie.description}
              </p>
            </div>
            {/* Status & Progress */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setStatus(option.value as Movie['status'])}
                    className={`px-4 py-2 rounded-lg border font-semibold transition-all text-xs shadow-sm ${
                      status === option.value
                        ? 'bg-yellow-900/30 border-yellow-900 text-yellow-100'
                        : 'bg-black/30 border-yellow-900/30 text-yellow-200 hover:bg-yellow-900/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {movie.type === 'series' && movie.progress && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-yellow-200 text-xs">Episode</label>
                    <input
                      type="number"
                      min="1"
                      max={movie.progress.totalEpisodes || 50}
                      value={currentEpisode}
                      onChange={(e) => setCurrentEpisode(Number(e.target.value))}
                      className="w-16 bg-black/40 border border-yellow-900/30 rounded px-2 py-1 text-yellow-100 text-center"
                      disabled={!isEditing}
                    />
                    <span className="text-yellow-200 text-xs">/ {movie.progress.totalEpisodes || 50}</span>
                  </div>
                  <div className="w-full bg-yellow-900/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-yellow-200 text-right">{progressPercentage.toFixed(1)}% Complete</p>
                </div>
              )}
            </div>
            {/* User Rating */}
            <div className="flex flex-col gap-2">
              <label className="text-yellow-200 font-semibold text-sm">Your Rating</label>
              <div className="flex space-x-1">
                {[1,2,3,4,5,6,7,8,9,10].map(star => (
                  <button
                    key={star}
                    onClick={() => isEditing && handleStarClick(star)}
                    onMouseEnter={() => isEditing && setHoveredStar(star)}
                    onMouseLeave={() => isEditing && setHoveredStar(0)}
                    disabled={!isEditing}
                    className="transition-colors"
                  >
                    <Star
                      size={22}
                      className={
                        star <= (hoveredStar || userRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-yellow-900'
                      }
                    />
                  </button>
                ))}
                {userRating > 0 && (
                  <span className="ml-2 text-yellow-100 font-semibold">{userRating}/10</span>
                )}
              </div>
            </div>
            {/* Review & Notes */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-yellow-200 font-semibold text-sm">Your Review</label>
                {isEditing ? (
                  <textarea
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    placeholder="Write your review here..."
                    className="w-full bg-black/40 border border-yellow-900/30 rounded-lg px-3 py-2 text-yellow-100 min-h-[80px] resize-vertical mt-1"
                  />
                ) : (
                  <p className="text-yellow-100/80 min-h-[60px] mt-1">{userReview || 'No review written yet.'}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="text-yellow-200 font-semibold text-sm">Personal Notes</label>
                {isEditing ? (
                  <textarea
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Add your personal notes..."
                    className="w-full bg-black/40 border border-yellow-900/30 rounded-lg px-3 py-2 text-yellow-100 min-h-[80px] resize-vertical mt-1"
                  />
                ) : (
                  <p className="text-yellow-100/80 min-h-[40px] mt-1">{userNotes || 'No notes added yet.'}</p>
                )}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => { playSound('/mixkit-fast-double-click-on-mouse-275.wav'); setIsEditing(false); }}
                    className="px-4 py-2 text-yellow-200 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-gradient-to-r from-yellow-700 to-orange-600 hover:from-yellow-800 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                  >
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { playSound('/mixkit-fast-double-click-on-mouse-275.wav'); setIsEditing(true); }}
                  className="flex items-center space-x-2 bg-yellow-900/20 hover:bg-yellow-900/30 text-yellow-200 rounded-lg px-4 py-2 transition-all"
                >
                  <Edit3 size={16} />
                  <span>Edit Details</span>
                </button>
              )}
            </div>
            {/* Cast & Crew Toggle */}
            <div className="mt-4 relative z-20"> {/* Ensure above curves */}
              <button
                className="flex items-center space-x-2 px-3 py-1 bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-200 rounded transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
                onClick={handleCastCrewClick}
                aria-label="Show Cast & Crew"
                type="button"
              >
                <Info size={18} />
                <span className="text-sm font-medium">Cast & Crew</span>
              </button>
              {showCastCrew && (
                <div className="mt-4 animate-slide-fade-in bg-[#181818]/95 rounded-lg p-4 border border-yellow-900/30 shadow-xl max-h-64 overflow-y-auto">
                  {castCrewLoading && <div className="text-yellow-200">Loading cast & crew...</div>}
                  {castCrewError && <div className="text-red-400">{castCrewError}</div>}
                  {!castCrewLoading && !castCrewError && (
                    <>
                      {castDetails && castDetails.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold text-yellow-100 mb-1">Cast</h4>
                          <div className="flex flex-wrap gap-2">
                            {castDetails.map((actor: any) => (
                              <a
                                key={actor.id}
                                href={`https://www.themoviedb.org/person/${actor.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-yellow-900/30 text-yellow-100 hover:text-white rounded text-xs hover:underline"
                                title={actor.character ? `as ${actor.character}` : undefined}
                              >
                                {actor.name}
                                {actor.character && (
                                  <span className="text-yellow-200/80"> as {actor.character}</span>
                                )}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {crewDetails && crewDetails.length > 0 && (
                        <div className="mt-2">
                          <h4 className="text-md font-semibold text-yellow-100 mb-1">Crew</h4>
                          <div className="flex flex-wrap gap-2">
                            {crewDetails.map((crew: any) => (
                              <a
                                key={crew.id}
                                href={`https://www.themoviedb.org/person/${crew.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-yellow-900/30 text-yellow-100 hover:text-white rounded text-xs hover:underline"
                              >
                                {crew.name} ({crew.job})
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {(!castDetails || castDetails.length === 0) && (!crewDetails || crewDetails.length === 0) && (
                        <div className="text-yellow-200/80">No cast or crew information available.</div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Bottom curve (screen effect) */}
        <div className="absolute -bottom-6 left-0 w-full h-8 bg-gradient-to-t from-[#bfa16a]/80 to-transparent rounded-b-[2.5rem] z-10 pointer-events-none" />
      </div>
    </div>
  );
};

export default MovieDetail;
