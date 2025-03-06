export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === "POST") {
      const formData = await request.formData();
      const note = formData.get("note");
      await env.DB.prepare("INSERT INTO my_note (note) VALUES (?);").bind(note).run();
      return Response.redirect(url.origin, 303);
  }

  if (request.method === "PUT") {
      const formData = await request.formData();
      const id = formData.get("id");
      const note = formData.get("note");
      await env.DB.prepare("UPDATE my_note SET note = ? WHERE id = ?;").bind(note, id).run();
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  }

  const notes = await env.DB.prepare("SELECT * FROM my_note;").all();
  
  const html = `
    <!DOCTYPE html>
    <html lang="zh">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>笔记列表</title>
    </head>
    <body>
      <h1>笔记列表</h1>
      <form method="POST">
        <input type="text" name="note" placeholder="输入笔记" required>
        <button type="submit">添加</button>
      </form>
      <ul>
        ${notes.results.map(note => `
          <li>
            <form method="POST" action="?update" style="display:inline;">
              <input type="hidden" name="id" value="${note.id}">
              <input type="text" name="note" value="${note.note}" required>
              <button type="submit" formaction="?update">修改</button>
            </form>
          </li>
        `).join('')}
      </ul>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
}
