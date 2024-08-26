import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2';

const app = express()
const port = 3000;
app.use(cors());
app.use(bodyParser.json())


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'alpha06',
    database: 'poster'
})

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao MySQL!');
});

app.get('/users', (req, res) => {
    const { name, email } = req.body
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(query, [name, email], (result) =>  {
        res.status(201).json({ id: result.insertId, name, email });
    })
})


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
})