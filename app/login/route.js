import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  const { email, password } = await request.json();

  const client = await clientPromise;
  const db = client.db("versusvoice");
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  if (user.password !== password) {
    return new Response(JSON.stringify({ message: "Invalid password" }), {
      status: 401,
    });
  }

  const { password: _, ...safeUser } = user;

  return new Response(JSON.stringify({ user: safeUser }), {
    status: 200,
  });
}
