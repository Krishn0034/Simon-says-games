import { useState, useEffect, useCallback, useRef } from 'react';
import GameButton from './GameButton';

const COLORS = ['green', 'red', 'yellow', 'blue'];

const GameBoard = ({ 
  onScoreUpdate, 
  onGameOver, 
  isAuthenticated, 
  saveScore 
}) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const timeoutRefs = useRef([]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Notify parent of score changes
  useEffect(() => {
    onScoreUpdate?.(score);
  }, [score, onScoreUpdate]);

  const addToSequence = useCallback(() => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setSequence(prev => [...prev, randomColor]);
    return randomColor;
  }, []);

  const playSequence = useCallback(async (seq) => {
    setIsShowingSequence(true);
    
    for (let i = 0; i < seq.length; i++) {
      const delay = Math.max(200, 600 - (level * 30));
      
      const timeoutId = setTimeout(() => {
        setActiveButton(seq[i]);
      }, i * (delay + 200));
      timeoutRefs.current.push(timeoutId);
      
      const clearTimeoutId = setTimeout(() => {
        setActiveButton(null);
      }, i * (delay + 200) + delay);
      timeoutRefs.current.push(clearTimeoutId);
    }

    const totalDuration = seq.length * (Math.max(200, 600 - (level * 30)) + 200);
    
    const finishTimeout = setTimeout(() => {
      setIsShowingSequence(false);
      setPlayerSequence([]);
    }, totalDuration);
    timeoutRefs.current.push(finishTimeout);
  }, [level]);

  const startGame = useCallback(async () => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
    
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setLevel(1);
    setGameStarted(true);
    setGameOver(false);
    setIsPlaying(true);
    
    setTimeout(() => {
      const newColor = addToSequence();
      playSequence([newColor]);
    }, 500);
  }, [addToSequence, playSequence]);

  const handleButtonClick = useCallback((color) => {
    if (!isPlaying || isShowingSequence) return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    const currentIndex = newPlayerSequence.length - 1;
    
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      handleGameOver();
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + (level * 10);
      setScore(newScore);
      setIsPlaying(false);
      
      const nextLevelTimeout = setTimeout(() => {
        setLevel(prev => prev + 1);
        const nextColor = addToSequence();
        const newSeq = [...sequence, nextColor];
        setSequence(newSeq);
        playSequence(newSeq);
        setIsPlaying(true);
      }, 1000);
      timeoutRefs.current.push(nextLevelTimeout);
    }
  }, [isPlaying, isShowingSequence, playerSequence, sequence, score, level, addToSequence, playSequence]);

  const handleGameOver = useCallback(() => {
    setIsPlaying(false);
    setGameOver(true);
    setGameStarted(false);
    
    onGameOver?.(score, level);
    
    if (isAuthenticated && score > 0) {
      saveScore?.(score, level);
    }
  }, [score, level, isAuthenticated, onGameOver, saveScore]);

  const resetGame = useCallback(() => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
    
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setLevel(1);
    setGameStarted(false);
    setGameOver(false);
    setIsPlaying(false);
    setIsShowingSequence(false);
    setActiveButton(null);
  }, []);

  const getGameStatus = () => {
    if (gameOver) return 'Game Over!';
    if (isShowingSequence) return 'Watch carefully...';
    if (isPlaying) return 'Your turn!';
    if (gameStarted) return 'Get ready...';
    return 'Press Start to Play';
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-slate-800 rounded-xl p-4 px-8 text-center border border-slate-700">
        <div className="text-slate-400 text-sm mb-1">{getGameStatus()}</div>
        <div className="flex items-center justify-center gap-6">
          <div>
            <div className="text-2xl font-bold text-cyan-400">{score}</div>
            <div className="text-xs text-slate-500">Score</div>
          </div>
          <div className="w-px h-10 bg-slate-700"></div>
          <div>
            <div className="text-2xl font-bold text-violet-400">{level}</div>
            <div className="text-xs text-slate-500">Level</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
          <GameButton 
            color="green" 
            onClick={handleButtonClick}
            disabled={!isPlaying || isShowingSequence}
            active={activeButton === 'green'}
          />
          <GameButton 
            color="red" 
            onClick={handleButtonClick}
            disabled={!isPlaying || isShowingSequence}
            active={activeButton === 'red'}
          />
          <GameButton 
            color="yellow" 
            onClick={handleButtonClick}
            disabled={!isPlaying || isShowingSequence}
            active={activeButton === 'yellow'}
          />
          <GameButton 
            color="blue" 
            onClick={handleButtonClick}
            disabled={!isPlaying || isShowingSequence}
            active={activeButton === 'blue'}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            {(!gameStarted || gameOver) ? (
              <button
                onClick={gameOver ? resetGame : startGame}
                className={`
                  w-20 h-20 rounded-full flex items-center justify-center
                  text-white font-bold text-lg
                  transition-all duration-200 transform hover:scale-105
                  ${gameOver 
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50' 
                    : 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/50'
                  }
                  shadow-lg
                `}
              >
                {gameOver ? '↻' : '▶'}
              </button>
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-900/80 border-4 border-slate-700 flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full ${isShowingSequence ? 'bg-yellow-400 animate-pulse' : isPlaying ? 'bg-green-400' : 'bg-slate-500'}`}></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="text-center">
          <p className="text-slate-400 mb-3">
            Final Score: <span className="text-cyan-400 font-bold">{score}</span> | 
            Level: <span className="text-violet-400 font-bold">{level}</span>
          </p>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      {!gameStarted && !gameOver && (
        <p className="text-slate-500 text-sm">
          Click the play button to start
        </p>
      )}
    </div>
  );
};

export default GameBoard;
