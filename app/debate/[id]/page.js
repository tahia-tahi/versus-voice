"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

// Helper to allow edits within 5 minutes
function isWithinFiveMinutes(dateString) {
  const createdAt = new Date(dateString);
  const now = new Date();
  const diffInMs = now - createdAt;
  return diffInMs <= 5 * 60 * 1000;
}

export default function DebateDetailPage() {
  const { id } = useParams(); // debateId
  const [debate, setDebate] = useState(null);
  const [side, setSide] = useState("support");
  const [text, setText] = useState("");
  const [argumentsList, setArgumentsList] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // your stored user

  useEffect(() => {
    fetch(`/api/debates?id=${id}`)
      .then((res) => res.json())
      .then((data) => setDebate(data));

    fetchArguments();
  }, [id]);

  async function fetchArguments() {
    const res = await fetch(`/api/arguments?debateId=${id}`);
    const data = await res.json();
    setArgumentsList(data);
  }

  async function handleVote(argumentId) {
    if (!user) {
      toast.error("You must be logged in to vote.");
      return;
    }

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, argumentId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Voting failed");

      toast.success("Vote recorded!");
      fetchArguments();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to post.");
      return;
    }

    try {
      const res = await fetch("/api/arguments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          debateId: id,
          side,
          text,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post argument");

      toast.success("Argument posted!");
      setText("");
      fetchArguments();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleEdit(arg) {
    const newText = prompt("Edit your argument:", arg.text);
    if (!newText || newText === arg.text) return;

    try {
      const res = await fetch("/api/arguments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: arg._id, text: newText }),
      });

      if (!res.ok) throw new Error("Edit failed");

      toast.success("Argument updated!");
      fetchArguments();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete(argumentId) {
    const confirmDelete = confirm("Are you sure you want to delete this argument?");
    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/arguments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: argumentId }),
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Argument deleted!");
      fetchArguments();
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (!debate) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold">{debate.title}</h1>
      <p className="text-gray-600 mt-2">{debate.description}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <select
          value={side}
          onChange={(e) => setSide(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="support">Support</option>
          <option value="oppose">Oppose</option>
        </select>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your argument..."
          className="border p-2 rounded w-full h-28"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Post Argument
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Arguments</h2>
        {argumentsList.map((arg) => (
          <div
            key={arg._id}
            className="border p-4 mb-4 rounded bg-gray-50 shadow"
          >
            <p className="text-sm text-gray-500">{arg.side.toUpperCase()}</p>
            <p className="mt-2">{arg.text}</p>

            <button
              onClick={() => handleVote(arg._id)}
              className="mt-2 text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Vote ({arg.votes})
            </button>

            <p className="text-xs text-gray-400 mt-1">
              Posted on {new Date(arg.createdAt).toLocaleString()}
            </p>

            {arg.userId === user?._id && isWithinFiveMinutes(arg.createdAt) && (
              <div className="flex gap-2 mt-2 text-sm">
                <button
                  onClick={() => handleEdit(arg)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(arg._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
