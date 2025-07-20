"use client";
import PrivateRoute from "@/app/Components/PrivateRoute";
import CreateDebate from "@/app/Components/CreateDebate";

export default function CreateDebatePage() {
  return (
    <PrivateRoute>
      <CreateDebate />
    </PrivateRoute>
  );
}
