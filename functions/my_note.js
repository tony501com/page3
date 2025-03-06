export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === "/my_note") {
      // 返回 JSON 数据
      const notes = await env.DB.prepare("SELECT * FROM my_note;").all();
      return new Response(JSON.stringify(notes.results), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 默认返回 HTML 页面
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
        <ul id="notes"></ul>
        <script>
          async function loadNotes() {
            const res = await fetch('/my_note');
            const notes = await res.json();
            document.getElementById('notes').innerHTML = notes.map(n => \`<li>\${n.note}</li>\`).join('');
          }
          loadNotes();
        </script>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: { "Content-Type": "text/html" }
    });
  }
};
