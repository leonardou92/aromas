const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

function validarBanco(body) {
  if (!body.nombre || typeof body.nombre !== 'string') return 'Nombre requerido';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM bancos`;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const error = validarBanco(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { nombre } = req.body;
    const result = await sql`INSERT INTO bancos (nombre) VALUES (${nombre}) RETURNING *`;
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
