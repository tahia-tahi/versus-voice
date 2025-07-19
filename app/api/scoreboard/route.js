import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("debateDB");

    const argumentsCollection = db.collection("arguments");

    const rawStats = await argumentsCollection.aggregate([
      {
        $group: {
          _id: "$author", // group by author name or user ID
          totalVotes: { $sum: "$votes" },
          debatesParticipated: { $addToSet: "$debateId" },
        },
      },
      {
        $project: {
          username: "$_id",
          totalVotes: 1,
          debateCount: { $size: "$debatesParticipated" },
        },
      },
      {
        $sort: { totalVotes: -1 },
      },
    ]).toArray();

    return NextResponse.json({ success: true, data: rawStats });
  } catch (error) {
    console.error("Scoreboard fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch scoreboard" }, { status: 500 });
  }
}
