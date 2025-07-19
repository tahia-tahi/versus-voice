import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("versusvoice");

    const debates = await db.collection("debates").find({}).toArray();

    return new Response(JSON.stringify(debates), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("GET error:", error);
    return new Response("Failed to fetch debates", { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("versusvoice");
    const data = await request.json();

    // Basic validation
    if (!data.title || !data.description) {
      return new Response("Missing title or description", { status: 400 });
    }

    const newDebate = {
      title: data.title,
      description: data.description,
      tags: data.tags || [],
      category: data.category || "",
      image: data.image || "",
      duration: data.duration || 24, // in hours
      createdAt: new Date(),
      status: "active",
    };

    const result = await db.collection("debates").insertOne(newDebate);

    return new Response(
      JSON.stringify({ message: "Debate created", id: result.insertedId }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("POST error:", error);
    return new Response("Failed to create debate", { status: 500 });
  }
}
