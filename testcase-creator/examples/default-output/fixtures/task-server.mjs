import { createServer } from "node:http";

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return entities[character];
});

const readForm = async (request) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
};

const htmlPage = (body) => `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><title>Task App</title></head>
  <body>${body}</body>
</html>`;

export const createTaskServer = () => {
  const tasks = [];

  return createServer(async (request, response) => {
    const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
    response.setHeader("content-type", "text/html; charset=utf-8");

    if (request.method === "GET" && pathname === "/favicon.ico") {
      response.writeHead(204);
      response.end();
      return;
    }

    if (request.method === "GET" && pathname === "/tasks/new") {
      response.end(htmlPage(`<main>
  <h1>New task</h1>
  <form action="/tasks" method="post">
    <label for="title">Task title</label>
    <input id="title" name="title" required>
    <button type="submit">Create task</button>
  </form>
</main>`));
      return;
    }

    if (request.method === "POST" && pathname === "/tasks") {
      const form = await readForm(request);
      tasks.push({ title: form.get("title") ?? "", status: "Open" });
      response.writeHead(303, { location: "/tasks" });
      response.end();
      return;
    }

    if (request.method === "GET" && pathname === "/tasks") {
      const rows = tasks.map(({ title, status }) => `<tr><td>${escapeHtml(title)}</td><td>${status}</td></tr>`).join("");
      response.end(htmlPage(`<main>
  <h1>Tasks</h1>
  <table>
    <thead><tr><th>Title</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</main>`));
      return;
    }

    response.writeHead(404);
    response.end("Not found");
  });
};
