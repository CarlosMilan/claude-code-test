const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const db = new Database(path.join(__dirname, 'kohi.db'));

const JWT_SECRET = process.env.JWT_SECRET || 'kohi-secret-dev-key';
const BCRYPT_ROUNDS = 10;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST /api/register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email y password son requeridos' });
  }

  const existing = db.prepare('SELECT id FROM waitlist WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const maxRow = db.prepare('SELECT MAX(position) AS max FROM waitlist').get();
  const position = (maxRow.max ?? 0) + 1;

  db.prepare(
    'INSERT INTO waitlist (name, email, password_hash, position) VALUES (?, ?, ?, ?)'
  ).run(name, email, passwordHash, position);

  res.status(201).json({ message: 'Registrado exitosamente', position });
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son requeridos' });
  }

  const user = db.prepare('SELECT * FROM waitlist WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Middleware JWT
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// GET /api/me
app.get('/api/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT name, email, position FROM waitlist WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const { total } = db.prepare('SELECT COUNT(*) AS total FROM waitlist').get();
  res.json({ ...user, total });
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
