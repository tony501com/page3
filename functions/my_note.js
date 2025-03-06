export default {
  async fetch(request, env) {
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
        <ul>
          ${notes.results.map(note => `<li>${note.note}</li>`).join('')}
        </ul>
      </body>
      </html>
    `; 

    console.log("Fetching notes from database...");
    console.log(notes);

    return new Response(html, {
      headers: { "Content-Type": "text/html" }
    });
  }
};
