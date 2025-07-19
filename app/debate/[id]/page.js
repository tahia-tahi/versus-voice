"use client";

import PrivateRoute from "@/app/Components/PrivateRoute";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function DebatePage({ id }) {
  const now = new Date();

  const debate = {
    id,
    title: "Is Technology Good for Society?",
    description: "Discuss the pros and cons of technology's impact on our daily lives.",
    startTime: now,
    endTime: new Date(now.getTime() + 1 * 60 * 60 * 1000),
  };

  const [selectedSide, setSelectedSide] = useState(null);
  const [argument, setArgument] = useState("");
  const [argumentsList, setArgumentsList] = useState({ support: [], oppose: [] });
  const [votedArgumentIds, setVotedArgumentIds] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [debateEnded, setDebateEnded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const remaining = new Date(debate.endTime) - now;

      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft("00:00:00");
        setDebateEnded(true);
      } else {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        setTimeLeft(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [debate.endTime]);

  function handleJoinSide(side) {
    if (selectedSide && selectedSide !== side) {
      toast.error("You cannot join both sides in the same debate.");
      return;
    }
    setSelectedSide(side);
    toast.success(`You joined the ${side === "support" ? "Support" : "Oppose"} side`);
  }

  function handleSubmitArgument(e) {
    e.preventDefault();
    if (debateEnded) return toast.error("Debate has ended.");
    if (!selectedSide) return toast.error("Join a side first.");
    if (!argument.trim()) return toast.error("Argument cannot be empty.");

    const bannedWords = ["stupid", "idiot", "dumb", "fool"];
    const lowered = argument.toLowerCase();
    const containsBanned = bannedWords.some((word) => lowered.includes(word));
    if (containsBanned) {
      return toast.error("Your argument contains inappropriate language.");
    }

    const newArgument = {
      id: Date.now(),
      author: "Tahia", // later from auth
      text: argument,
      time: new Date(),
      votes: 0,
      debateId: id,
    };

    setArgumentsList((prev) => ({
      ...prev,
      [selectedSide]: [...prev[selectedSide], newArgument],
    }));
    toast.success("Argument posted!");
    setArgument("");
  }

  function handleVote(side, argId) {
    if (debateEnded) return toast.error("Voting is closed.");
    if (votedArgumentIds.includes(argId)) return toast.error("You already voted.");
    setArgumentsList((prev) => {
      const updated = prev[side].map((arg) =>
        arg.id === argId ? { ...arg, votes: arg.votes + 1 } : arg
      );
      return { ...prev, [side]: updated };
    });
    setVotedArgumentIds((prev) => [...prev, argId]);
    toast.success("Vote counted!");
  }

  return (

    <PrivateRoute>

    <div className="max-w-3xl mx-auto mt-12 p-6 border rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{debate.title}</h1>
      <p className="text-sm text-gray-600 mb-2">
        Time Remaining: <span className="font-semibold text-red-600">{timeLeft || "Loading..."}</span>
      </p>
      {debateEnded && (
        <p className="text-md text-green-700 font-semibold mb-4">⏱️ Debate has ended.</p>
      )}
      <p className="mb-6">{debate.description}</p>

      {/* Join Side */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => handleJoinSide("support")}
          className={`px-6 py-2 rounded ${selectedSide === "support" ? "bg-green-600 text-white" : "border"}`}
        >
          Support
        </button>
        <button
          onClick={() => handleJoinSide("oppose")}
          className={`px-6 py-2 rounded ${selectedSide === "oppose" ? "bg-red-600 text-white" : "border"}`}
        >
          Oppose
        </button>
      </div>

      {/* Argument Form */}
      {selectedSide && (
        <form onSubmit={handleSubmitArgument} className="flex flex-col gap-4">
          <textarea
            placeholder={`Write your argument for ${selectedSide} side...`}
            value={argument}
            onChange={(e) => setArgument(e.target.value)}
            className="border p-2 rounded resize-none"
            rows={5}
            required
          />
          <button
            type="submit"
            className={`py-3 rounded text-white ${selectedSide === "support" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
          >
            Post Argument
          </button>
        </form>
      )}

      {/* Show Arguments */}
      {["support", "oppose"].map((side) => (
        <div key={side} className="mt-10">
          <h2 className="text-xl font-semibold mb-2">{side === "support" ? "Support Side" : "Oppose Side"}</h2>
          <div className="space-y-4">
            {argumentsList[side].length === 0 && <p className="text-gray-500">No arguments yet.</p>}
            {argumentsList[side].map((arg) => (
              <div key={arg.id} className="border p-4 rounded shadow flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 mb-1">By {arg.author} • {new Date(arg.time).toLocaleTimeString()}</p>
                  <p>{arg.text}</p>
                </div>
                <div className="text-center text-sm ml-4 space-y-1">
                  <p className="text-blue-600 font-semibold">{arg.votes} Votes</p>
                  <button
                    onClick={() => handleVote(side, arg.id)}
                    disabled={votedArgumentIds.includes(arg.id)}
                    className={`px-2 py-1 text-xs rounded ${votedArgumentIds.includes(arg.id) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                  >
                    {votedArgumentIds.includes(arg.id) ? "Voted" : "Vote"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    </PrivateRoute>

  );
}
