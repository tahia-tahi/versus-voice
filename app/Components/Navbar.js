"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const loggedInUser = localStorage.getItem("user");
      setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Versus Voice
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/" className="hover:underline">
          Home
        </Link>

        {user ? (
          <>
            <Link href="/debate/create" className="hover:underline">
              Create Debate
            </Link>
            <Link href="/scoreboard" className="hover:underline">
              Scoreboard
            </Link>
            <Link href="/debates" className="hover:underline">
              Join Debate
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.reload();
              }}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/signup" className="hover:underline">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
