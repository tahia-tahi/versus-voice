// app/api/signup/route.js
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const body = await req.json();
  const { name, email, password, image } = body;

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const existing = await db.collection("users").findOne({ email });

    if (existing) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 409,
      });
    }

    const result = await db.collection("users").insertOne({
      name,
      email,
      password, // ⚠️ In real apps, hash this!
      image,
    });

    return new Response(JSON.stringify({ message: "User registered", id: result.insertedId }), {
      status: 201,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Signup failed" }), {
      status: 500,
    });
  }
}
