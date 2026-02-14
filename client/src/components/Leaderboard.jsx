import { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardAPI.getLeaderboard();
      setScores(response.data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        <span className="text-violet-400">Top 10</span> Leaderboard
      </h1>

      {scores.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No scores yet. Be the first to play!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scores.map((entry, index) => (
            <div
              key={entry.rank}
              className={`
                flex items-center gap-4 p-4 rounded-xl border
                ${index === 0 
                  ? 'bg-yellow-500/10 border-yellow-500/30' 
                  : index === 1 
                  ? 'bg-slate-400/10 border-slate-400/30'
                  : index === 2
                  ? 'bg-amber-700/10 border-amber-700/30'
                  : 'bg-slate-800/30 border-slate-700'
                }
                animate-fade-in
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Rank */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                ${index === 0 
                  ? 'bg-yellow-500 text-yellow-900' 
                  : index === 1 
                  ? 'bg-slate-400 text-slate-900'
                  : index === 2
                  ? 'bg-amber-700 text-amber-100'
                  : 'bg-slate-700 text-slate-300'
                }
              `}>
                {entry.rank}
              </div>

              {/* Username */}
              <div className="flex-1">
                <p className="font-semibold text-white">{entry.username}</p>
                <p className="text-slate-400 text-sm">Level {entry.level}</p>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className={`
                  text-2xl font-bold
                  ${index === 0 ? 'text-yellow-400' : 'text-cyan-400'}
                `}>
                  {entry.score}
                </p>
                <p className="text-slate-500 text-xs">{formatDate(entry.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={fetchLeaderboard}
          className="text-slate-400 hover:text-white text-sm transition-colors"
        >
          Refresh Leaderboard
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;

