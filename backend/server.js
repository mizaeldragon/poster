import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';


const app = express()
const port = 3000;

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
    res.send('ola')
})

app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
})