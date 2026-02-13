import { useState } from "react";
import axios from "axios";

export default function Login({ setPlayer }) {
  const [regNo, setRegNo] = useState("");
  const [username, setUsername] = useState("");

  const handleLogin = async () => {
    const res = await axios.post("http://localhost:5000/api/player/login", {
      regNo,
      username
    });

    setPlayer(res.data);
  };

  return (
    <div className="login-card">
      <h1>Simon Says Challenge</h1>
      <input 
        placeholder="Registration Number"
        value={regNo}
        onChange={e => setRegNo(e.target.value)}
      />
      <input 
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Start Game</button>
    </div>
  );
}
