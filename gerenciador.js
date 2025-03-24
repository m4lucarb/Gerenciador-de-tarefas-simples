// Importação dos módulos
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// Inicializa o app Express
const app = express();
app.use(express.json());
app.use(cors());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criar tabela de tarefas se não existir
db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
)`);

// Rota para obter todas as tarefas
app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Rota para adicionar uma nova tarefa
app.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) {
        res.status(400).json({ error: 'O título é obrigatório' });
        return;
    }
    db.run('INSERT INTO tasks (title) VALUES (?)', [title], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, title });
    });
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
