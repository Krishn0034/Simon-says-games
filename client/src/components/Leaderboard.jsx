import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/leaderboard")
      .then(res => setScores(res.data));
  }, []);

  return (
    <div className="leaderboard">
      <h3>Top Players</h3>
      {scores.map((s, i) => (
        <p key={i}>
          {s.playerId.username} ({s.playerId.regNo}) - {s.score}
        </p>
      ))}
    </div>
  );
}

