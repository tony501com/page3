export async function onRequest(context) {
  return new Response("Hello from Cloudflare Pages 666 Functions!", {
    headers: { "Content-Type": "text/plain" }
  });
}
