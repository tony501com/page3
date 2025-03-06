export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === "POST") {
      const { note } = await request.json();
      await env.DB.prepare("INSERT INTO my_note (note) VALUES (?);").bind(note).run();
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  }

  if (request.method === "PUT") {
      const { id, note } = await request.json();
      await env.DB.prepare("UPDATE my_note SET note = ? WHERE id = ?;").bind(note, id).run();
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  }

  if (request.method === "GET") {
      const notes = await env.DB.prepare("SELECT * FROM my_note;").all();
      return new Response(JSON.stringify(notes.results), { headers: { "Content-Type": "application/json" } });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
