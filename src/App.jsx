import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setMessage("Please enter a username!");
      setStats(null);
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      setMessage("");
      setStats(null);

      const response = await fetch(
        `https://leetcode-stats-api.herokuapp.com/${trimmedUsername}`
      );

      if (response.status === 404) {
        throw new Error("User not found on LeetCode");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      if (data.status === "error") {
        throw new Error("Invalid username!");
      }

      setStats(data);
    } catch (error) {
      setMessage(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchStats();
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
          onKeyDown={handleKeyPress}
          placeholder="Enter LeetCode Username"
        />

        <button onClick={fetchStats} disabled={loading}>
          {loading ? "Loading..." : "Fetch Stats"}
        </button>
      </div>

      {loading && <p>Fetching data...</p>}

      {message && <div className="message">{message}</div>}

      {stats && !loading && (
        <div className="stats">
          <h2>Statistics for {username}</h2>
          <p><strong>Total:</strong> {stats.totalSolved ?? 0}</p>
          <p><strong>Easy:</strong> {stats.easySolved ?? 0}</p>
          <p><strong>Medium:</strong> {stats.mediumSolved ?? 0}</p>
          <p><strong>Hard:</strong> {stats.hardSolved ?? 0}</p>
        </div>
      )}
    </div>
  );
}

export default App;
