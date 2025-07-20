import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { userId, debateId, side } = await req.json();

    if (!userId || !debateId || !side) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("versusvoice");

    // Check if user already joined the debate
    const existing = await db.collection("participants").findOne({
      userId,
      debateId,
    });

    if (existing) {
      return new Response(
        JSON.stringify({ error: "Already joined this debate" }),
        { status: 409 }
      );
    }

    const result = await db.collection("participants").insertOne({
      userId,
      debateId,
      side, // support or oppose
      joinedAt: new Date(),
    });

    return new Response(
      JSON.stringify({ message: "Joined debate", id: result.insertedId }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Join failed" }), {
      status: 500,
    });
  }
}
