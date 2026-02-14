import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { scoresAPI } from '../services/api';
import GameBoard from '../components/GameBoard';
import AuthForm from '../components/AuthForm';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentScore, setCurrentScore] = useState(0);

  const handleScoreUpdate = useCallback((score) => {
    setCurrentScore(score);
  }, []);

  const handleGameOver = useCallback((score, level) => {
    console.log(`Game Over! Score: ${score}, Level: ${level}`);
  }, []);

  const saveScore = useCallback(async (score, level) => {
    try {
      await scoresAPI.saveScore(score, level);
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="text-violet-400">Simon</span>{' '}
            <span className="text-cyan-400">Says</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Test your memory! Watch the sequence and repeat it.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Game Section */}
          <div className="flex justify-center">
            <GameBoard
              onScoreUpdate={handleScoreUpdate}
              onGameOver={handleGameOver}
              isAuthenticated={isAuthenticated}
              saveScore={saveScore}
            />
          </div>

          {/* Auth Section */}
          <div className="flex flex-col items-center justify-center">
            {isAuthenticated ? (
              <div className="text-center bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Welcome, {user?.username}!
                </h2>
                <p className="text-slate-400 mb-4">
                  Your scores will be saved automatically.
                </p>
                <div className="text-sm text-slate-500">
                  Current session score: <span className="text-cyan-400 font-bold">{currentScore}</span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <AuthForm />
                <p className="text-slate-500 text-sm mt-4">
                  Play as guest or login to save scores
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <div className="text-2xl mb-2">👀</div>
            <h3 className="font-semibold text-white mb-1">Watch</h3>
            <p className="text-slate-400 text-sm">Observe the sequence of colors</p>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <div className="text-2xl mb-2">🧠</div>
            <h3 className="font-semibold text-white mb-1">Remember</h3>
            <p className="text-slate-400 text-sm">Keep the sequence in mind</p>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <div className="text-2xl mb-2">🎮</div>
            <h3 className="font-semibold text-white mb-1">Repeat</h3>
            <p className="text-slate-400 text-sm">Tap the colors in order</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

