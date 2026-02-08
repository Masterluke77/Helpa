const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3020;
const SECRET = process.env.JWT_SECRET || 'secret';

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

// Database Setup
const db = new sqlite3.Database('./helpa.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        price REAL,
        image TEXT,
        userId INTEGER,
        userName TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
    )`);
});

// File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './public/uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Auth Middleware
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

// Register
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).send('Missing fields');

    try {
        const hash = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], function (err) {
            if (err) return res.status(400).json({ error: 'Email already exists' });
            res.json({ id: this.lastID, name, email });
        });
    } catch (e) {
        res.status(500).send('Server Error');
    }
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) return res.status(400).json({ error: 'User not found' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(403).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, name: user.name }, SECRET);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
});

// Get Requests
app.get('/api/requests', (req, res) => {
    db.all('SELECT * FROM requests ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

// Create Request
app.post('/api/requests', authenticate, upload.single('image'), (req, res) => {
    const { title, description, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    db.run('INSERT INTO requests (title, description, price, image, userId, userName) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, price, image, req.user.id, req.user.name],
        function (err) {
            if (err) return res.status(500).send(err.message);
            res.json({ id: this.lastID, title, description, price, image, user: req.user.name });
        }
    );
});

// Default Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
