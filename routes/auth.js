const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

// Registro de usuario en tabla usuarios
router.post('/register', async (req, res) => {
  const { email, password, nombre, rol } = req.body;
  if (!email || !password || !nombre || !rol) return res.status(400).json({ error: 'Datos requeridos' });
  try {
    const existe = await sql`SELECT * FROM usuarios WHERE email = ${email}`;
    if (existe.length > 0) return res.status(400).json({ error: 'Email ya registrado' });
    const hash = await bcrypt.hash(password, 10);
    const result = await sql`
      INSERT INTO usuarios (nombre, email, password, rol)
      VALUES (${nombre}, ${email}, ${hash}, ${rol}) RETURNING *
    `;
    res.status(201).json({ mensaje: 'Usuario registrado', id: result[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login usando tabla usuarios
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Datos requeridos' });
  try {
    const usuarios = await sql`SELECT * FROM usuarios WHERE email = ${email}`;
    if (usuarios.length === 0) return res.status(400).json({ error: 'Usuario no encontrado' });
    const usuario = usuarios[0];
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
