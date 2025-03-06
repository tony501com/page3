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
  
  // 前端代码
  const app = document.getElementById("app");
  const noteInput = document.createElement("input");
  noteInput.placeholder = "输入笔记";
  const addButton = document.createElement("button");
  addButton.textContent = "添加笔记";
  const notesList = document.createElement("ul");
  
  addButton.onclick = async () => {
    const note = noteInput.value;
    if (!note) return;
    await fetch("/", { method: "POST", body: JSON.stringify({ note }) });
    noteInput.value = "";
    loadNotes();
  };
  
  async function loadNotes() {
    const res = await fetch("/");
    const notes = await res.json();
    notesList.innerHTML = "";
    notes.forEach(({ id, note }) => {
      const li = document.createElement("li");
      const noteText = document.createElement("span");
      noteText.textContent = note;
      const editButton = document.createElement("button");
      editButton.textContent = "编辑";
      editButton.onclick = async () => {
        const newNote = prompt("修改笔记", note);
        if (newNote) {
          await fetch(`/?id=${id}`, { method: "PUT", body: JSON.stringify({ note: newNote }) });
          loadNotes();
        }
      };
      li.appendChild(noteText);
      li.appendChild(editButton);
      notesList.appendChild(li);
    });
  }
  
  app.appendChild(noteInput);
  app.appendChild(addButton);
  app.appendChild(notesList);
  loadNotes();
  