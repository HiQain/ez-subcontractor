export async function POST(req) {
  const body = await req.json();
  return new Response(JSON.stringify({ message: "Login successful", user: body }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
