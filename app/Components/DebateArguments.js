"use client";

import { useEffect, useState } from "react";

export default function DebateArguments({ debateId }) {
  const [argumentsList, setArgumentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArguments() {
      const res = await fetch(`/api/arguments?debateId=${debateId}`);
      const data = await res.json();
      setArgumentsList(data);
      setLoading(false);
    }
    fetchArguments();
  }, [debateId]);

  if (loading) return <p>Loading arguments...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mt-6">Support</h2>
      <ul className="list-disc ml-6">
        {argumentsList
          .filter((arg) => arg.side === "Support")
          .map((arg) => (
            <li key={arg._id} className="mb-2">{arg.text}</li>
          ))}
      </ul>

      <h2 className="text-xl font-bold mt-6">Oppose</h2>
      <ul className="list-disc ml-6">
        {argumentsList
          .filter((arg) => arg.side === "Oppose")
          .map((arg) => (
            <li key={arg._id} className="mb-2">{arg.text}</li>
          ))}
      </ul>
    </div>
  );
}
