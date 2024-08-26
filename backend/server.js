import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from 'mysql2/promise';

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "alpha06",
  database: "poster",
});

app.get('/posts', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM posts');
      const rows = result[0]; // A primeira posição do array contém as linhas
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao obter posts' });
    }
  });
  
  // Rota para criar um novo post
  app.post('/posts', async (req, res) => {
    try {
      const { title, content, userId } = req.body;
      const result = await db.query(
        'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
        [title, content, userId]
      );
      res.json({ id: result[0].insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar post' });
    }
  });
  
  // Rota para atualizar um post
  app.put('/posts/:id', async (req, res) => {
    try {
      const { title, content } = req.body;
      const { id } = req.params;
      const result = await db.query(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [title, content, id]
      );
      if (result[0].affectedRows === 0) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }
      res.json({ status: 'Post atualizado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar post' });
    }
  });
  
  // Rota para deletar um post
  app.delete('/posts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await db.query('DELETE FROM posts WHERE id = ?', [id]);
      if (result[0].affectedRows === 0) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }
      res.json({ status: 'Post deletado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao deletar post' });
    }
  });

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
