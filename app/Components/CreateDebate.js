"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateDebate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [duration, setDuration] = useState("1"); 

async function handleSubmit(e) {
  e.preventDefault();

  // Simple validation
  if (!title || !description || !category) {
    toast.error("Please fill all required fields!");
    return;
  }

  const newDebate = {
    title,
    description,
    tags: tags.split(",").map((t) => t.trim()),
    category,
    image: imageUrl,
    duration: Number(duration),
  };

  try {
    const res = await fetch("/api/debates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDebate),
    });

    if (!res.ok) {
      throw new Error("Failed to create debate");
    }

    const result = await res.json();
    toast.success("Debate created successfully! 🎉");

    // Reset form
    setTitle("");
    setDescription("");
    setTags("");
    setCategory("");
    setImageUrl("");
    setDuration("1");
    console.log("Inserted ID:", result.id);
  } catch (err) {
    toast.error("Error creating debate 😢");
    console.error(err);
  }
}

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 border rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Create a New Debate</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label>
          <span className="font-semibold">Title *</span>
          <input
            type="text"
            placeholder="Enter debate title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          <span className="font-semibold">Description *</span>
          <textarea
            placeholder="Describe your debate topic"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="border p-2 rounded w-full resize-none"
          />
        </label>

        <label>
          <span className="font-semibold">Tags (comma separated)</span>
          <input
            type="text"
            placeholder="tech, ethics, science"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          <span className="font-semibold">Category *</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="border p-2 rounded w-full"
          >
            <option value="">Select a category</option>
            <option value="Tech">Tech</option>
            <option value="Ethics">Ethics</option>
            <option value="Science">Science</option>
            <option value="Politics">Politics</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          <span className="font-semibold">Image/Banner URL</span>
          <input
            type="url"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          <span className="font-semibold">Debate Duration *</span>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="border p-2 rounded w-full"
          >
            <option value="1">1 hour</option>
            <option value="12">12 hours</option>
            <option value="24">24 hours</option>
          </select>
        </label>

        <button
          type="submit"
          className="bg-purple-600 text-white py-3 rounded hover:bg-purple-700"
        >
          Create Debate
        </button>
      </form>
    </div>
  );
}
