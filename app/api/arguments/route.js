import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { userId, debateId, side, text } = await req.json();

    if (!userId || !debateId || !side || !text) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    // Optionally check if user has joined the debate on that side before allowing post

    const client = await clientPromise;
    const db = client.db("versusvoice");

    const result = await db.collection("arguments").insertOne({
      userId,
      debateId,
      side,
      text,
      votes: 0,
      createdAt: new Date(),
      updatedAt: null,
    });

    return new Response(
      JSON.stringify({ message: "Argument posted", id: result.insertedId }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Posting failed" }), {
      status: 500,
    });
  }
}


export async function GET(request) {
  try {
    const url = new URL(request.url);
    const debateId = url.searchParams.get("debateId");

    if (!debateId) {
      return new Response(JSON.stringify({ error: "Missing debateId" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("versusvoice");

    const argumentsList = await db
      .collection("arguments")
      .find({ debateId })
      .sort({ createdAt: 1 })
      .toArray();

    return new Response(JSON.stringify(argumentsList), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch arguments" }), {
      status: 500,
    });
  }
}


// PATCH: Edit argument (only within 5 mins)
export async function PATCH(req) {
  try {
    const { argumentId, newText } = await req.json();

    const client = await clientPromise;
    const db = client.db("versusvoice");

    const argument = await db.collection("arguments").findOne({ _id: new ObjectId(argumentId) });

    if (!argument) {
      return new Response(JSON.stringify({ error: "Argument not found" }), { status: 404 });
    }

    const timeDiff = (Date.now() - new Date(argument.createdAt).getTime()) / 1000;
    if (timeDiff > 300) {
      return new Response(JSON.stringify({ error: "Edit time expired" }), { status: 403 });
    }

    await db.collection("arguments").updateOne(
      { _id: new ObjectId(argumentId) },
      {
        $set: {
          text: newText,
          updatedAt: new Date(),
        },
      }
    );

    return new Response(JSON.stringify({ message: "Argument updated" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Edit failed" }), { status: 500 });
  }
}

// DELETE: Delete argument (only within 5 mins)
export async function DELETE(req) {
  try {
    const { argumentId } = await req.json();

    const client = await clientPromise;
    const db = client.db("versusvoice");

    const argument = await db.collection("arguments").findOne({ _id: new ObjectId(argumentId) });

    if (!argument) {
      return new Response(JSON.stringify({ error: "Argument not found" }), { status: 404 });
    }

    const timeDiff = (Date.now() - new Date(argument.createdAt).getTime()) / 1000;
    if (timeDiff > 300) {
      return new Response(JSON.stringify({ error: "Delete time expired" }), { status: 403 });
    }

    await db.collection("arguments").deleteOne({ _id: new ObjectId(argumentId) });

    return new Response(JSON.stringify({ message: "Argument deleted" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Delete failed" }), { status: 500 });
  }
}
