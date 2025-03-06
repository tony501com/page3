export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      const { searchParams } = url;
      
      if (request.method === "POST") {
        const { note } = await request.json();
        await env.DB.prepare("INSERT INTO my_note (note) VALUES (?);").bind(note).run();
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
      
      if (request.method === "PUT") {
        const id = searchParams.get("id");
        const { note } = await request.json();
        await env.DB.prepare("UPDATE my_note SET note = ? WHERE id = ?;").bind(note, id).run();
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
      
      if (request.method === "GET") {
        const notes = await env.DB.prepare("SELECT * FROM my_note;").all();
        return new Response(JSON.stringify(notes.results), { status: 200 });
      }
      
      return new Response("Method Not Allowed", { status: 405 });
    }
  };
  
  