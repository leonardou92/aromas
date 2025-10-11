const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

function validarPago(body) {
  if (!body.pedido_venta_id || isNaN(Number(body.pedido_venta_id))) return 'ID de pedido de venta requerido';
  if (!body.forma_pago_id || isNaN(Number(body.forma_pago_id))) return 'ID de forma de pago requerido';
  if (!body.banco_id || isNaN(Number(body.banco_id))) return 'ID de banco requerido';
  if (!body.monto || isNaN(Number(body.monto))) return 'Monto requerido';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM pagos`;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const error = validarPago(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { pedido_venta_id, forma_pago_id, banco_id, monto } = req.body;
    const result = await sql`INSERT INTO pagos (pedido_venta_id, forma_pago_id, banco_id, monto, fecha) VALUES (${pedido_venta_id}, ${forma_pago_id}, ${banco_id}, ${monto}, NOW()) RETURNING *`;
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
