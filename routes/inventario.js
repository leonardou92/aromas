const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

function validarInventario(body) {
  if (!body.producto_id || isNaN(Number(body.producto_id))) return 'ID de producto requerido';
  if (!body.almacen_id || isNaN(Number(body.almacen_id))) return 'ID de almacén requerido';
  if (body.stock_fisico == null || isNaN(Number(body.stock_fisico))) return 'Stock físico requerido';
  if (body.stock_comprometido == null || isNaN(Number(body.stock_comprometido))) return 'Stock comprometido requerido';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const result = await sql`SELECT *, stock_fisico - stock_comprometido AS stock_disponible FROM inventario`;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const error = validarInventario(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { producto_id, almacen_id, stock_fisico, stock_comprometido } = req.body;
    const result = await sql`
      INSERT INTO inventario (producto_id, almacen_id, stock_fisico, stock_comprometido)
      VALUES (${producto_id}, ${almacen_id}, ${stock_fisico}, ${stock_comprometido}) RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await sql`SELECT *, stock_fisico - stock_comprometido AS stock_disponible FROM inventario WHERE id = ${req.params.id}`;
    if (result.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
