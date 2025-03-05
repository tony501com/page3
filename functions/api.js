export async function onRequest(context) {
  const url = "https://node.freeclashnode.com/uploads/2025/03/4-20250303.txt";

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const text = await response.text();
    return new Response(text, {
      headers: { "Content-Type": "text/html" }
    });

  } catch (error) {
    return new Response("Error fetching Google: " + error.message, { status: 500 });
  }
}
