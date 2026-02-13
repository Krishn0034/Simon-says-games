import { useState, useEffect } from "react";
import axios from "axios";
import Leaderboard from "./Leaderboard";

const colors = ["red", "blue", "green", "yellow"];

export default function GameBoard({ player }) {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    nextRound();
  }, []);

  const nextRound = () => {
    const random = colors[Math.floor(Math.random() * 4)];
    setSequence(prev => [...prev, random]);
    setUserSequence([]);
    setLevel(prev => prev + 1);
  };

  const handleClick = (color) => {
    const updated = [...userSequence, color];
    setUserSequence(updated);

    if (sequence[updated.length - 1] !== color) {
      endGame();
      return;
    }

    if (updated.length === sequence.length) {
      setTimeout(nextRound, 800);
    }
  };

  const endGame = async () => {
    setGameOver(true);

    await axios.post("http://localhost:5000/api/session/save", {
      playerId: player._id,
      score: level
    });
  };

  return (
    <div>
      <h2>Level {level}</h2>
      <div className="board">
        {colors.map(color => (
          <div
            key={color}
            className={`pad ${color}`}
            onClick={() => handleClick(color)}
          />
        ))}
      </div>

      {gameOver && <Leaderboard />}
    </div>
  );
}
