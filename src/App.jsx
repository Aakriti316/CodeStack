import { useState } from "react";
import "./App.css"; // your CSS file

function App() {
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");

  const fetchStats = async () => {
    setMessage("");
    setStats(null);

    if (!username.trim()) {
      setMessage("Please enter a username!");
      return;
    }

    try {
      const response = await fetch(
        `https://leetcode-stats-api.herokuapp.com/${username}`
      );
      if (!response.ok) throw new Error("User not found");

      const data = await response.json();
      setStats(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h1>LeetCode Stats Tracker</h1>

      <div className="input-section">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter LeetCode Username"
        />
        <button onClick={fetchStats}>Fetch Stats</button>
      </div>

      {message && <div className="message">{message}</div>}

      {stats && (
        <div className="stats">
          <h2>Statistics for {username}</h2>
          <p>
            <strong>Total Problems Solved:</strong> {stats.totalSolved || 0}
          </p>
          <p>
            <strong>Easy:</strong> {stats.easySolved || 0}
          </p>
          <p>
            <strong>Medium:</strong> {stats.mediumSolved || 0}
          </p>
          <p>
            <strong>Hard:</strong> {stats.hardSolved || 0}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
