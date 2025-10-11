const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

function validarClienteBanco(body) {
  if (!body.cliente_id || isNaN(Number(body.cliente_id))) return 'ID de cliente requerido';
  if (!body.banco_id || isNaN(Number(body.banco_id))) return 'ID de banco requerido';
  if (!body.cuenta_bancaria || typeof body.cuenta_bancaria !== 'string') return 'Cuenta bancaria requerida';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM cliente_bancos`;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const error = validarClienteBanco(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { cliente_id, banco_id, cuenta_bancaria } = req.body;
    const result = await sql`INSERT INTO cliente_bancos (cliente_id, banco_id, cuenta_bancaria) VALUES (${cliente_id}, ${banco_id}, ${cuenta_bancaria}) RETURNING *`;
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
