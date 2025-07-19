"use client";

import { useEffect, useState } from "react";

export default function ScoreboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScoreboard() {
      try {
        const res = await fetch("/api/scoreboard");
        const data = await res.json();

        if (data.success) {
          setUsers(data.data);
        } else {
          console.error("Failed to fetch scoreboard");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchScoreboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 border rounded shadow bg-white">
      <h1 className="text-3xl font-bold mb-6">🏆 Debate Scoreboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">#</th>
              <th className="p-3 border">Username</th>
              <th className="p-3 border">Total Votes</th>
              <th className="p-3 border">Debates Participated</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.username} className="hover:bg-gray-50">
                <td className="p-3 border">{idx + 1}</td>
                <td className="p-3 border font-semibold">{user.username}</td>
                <td className="p-3 border text-blue-600">{user.totalVotes}</td>
                <td className="p-3 border">{user.debateCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
