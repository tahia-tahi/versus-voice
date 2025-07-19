"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DebatesList() {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/debates")
      .then((res) => res.json())
      .then((data) => {
        setDebates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load debates:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading debates...</p>;

  if (debates.length === 0) return <p>No debates found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Debates</h1>

      <ul className="space-y-6">
        {debates.map((debate) => (
          <li
            key={debate._id}
            className="border rounded p-4 hover:shadow-lg transition"
          >
            <Link href={`/debate/${debate._id}`}>
            
                <h2 className="text-xl font-semibold">{debate.title}</h2>
                <p className="text-gray-600 mt-1">{debate.description}</p>
                <p className="text-sm mt-2 text-gray-500">
                  Category: {debate.category} | Duration: {debate.duration} hrs
                </p>
          
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
