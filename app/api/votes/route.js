// app/api/votes/route.js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function POST(req) {
  try {
    const { userId, argumentId } = await req.json();

    if (!userId || !argumentId) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("versusvoice");

    // Check if user already voted on this argument
    const existing = await db.collection("votes").findOne({ userId, argumentId });
    if (existing) {
      return new Response(JSON.stringify({ error: "Already voted" }), {
        status: 409,
      });
    }

    // Add vote entry
    await db.collection("votes").insertOne({
      userId,
      argumentId,
      votedAt: new Date(),
    });

    // Increment vote count on argument
    await db
      .collection("arguments")
      .updateOne({ _id: new ObjectId(argumentId) }, { $inc: { votes: 1 } });

    return new Response(JSON.stringify({ message: "Vote recorded" }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Vote failed" }), {
      status: 500,
    });
  }
}
