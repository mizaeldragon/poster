import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "alpha06",
  database: "poster",
});

app.get("/posts", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM posts");
    const rows = result[0];
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao obter posts" });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const result = await db.query(
      "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
      [title, content, userId]
    );
    res.json({ id: result[0].insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar post" });
  }
});

app.put("/posts/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;
    await db.query("UPDATE posts SET title = ?, content = ? WHERE id = ?", [
      title,
      content,
      id,
    ]);
    res.json({ status: "Post atualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar post" });
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM posts WHERE id = ?", [id]);
    res.json({ status: "Post deletado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar post" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
