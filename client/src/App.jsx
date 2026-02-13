import { useState } from "react";
import Login from "./components/Login";
import GameBoard from "./components/GameBoard";

function App() {
  const [player, setPlayer] = useState(null);

  return (
    <div className="app">
      {!player 
        ? <Login setPlayer={setPlayer} /> 
        : <GameBoard player={player} />}
    </div>
  );
}

export default App;
