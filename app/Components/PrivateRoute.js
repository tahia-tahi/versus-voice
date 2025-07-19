"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PrivateRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return children;
}
