import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const { Pool } = pkg;

const app = express();
const port = process.env.PG_PORT || 3000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then(() => console.log("Conectado ao PostgreSQL"))
  .catch((err) => console.error("Erro ao conectar ao PostgreSQL:", err));

app.get("/api/post", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao obter posts" });
  }
});

app.post("/api/post", async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const result = await pool.query(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING id",
      [title, content, userId]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar post" });
  }
});

app.put("/api/post/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;
    await pool.query(
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3",
      [title, content, id]
    );
    res.json({ status: "Post atualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar post" });
  }
});

app.delete("/api/post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    res.json({ status: "Post deletado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar post" });
  }
});

// Rota para servir o frontend no modo de produção
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
