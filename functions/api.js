export async function onRequest(context) {
  const url = "https://www.google.com/";

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
