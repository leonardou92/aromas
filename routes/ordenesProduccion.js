const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

function validarOrden(body) {
  if (!body.producto_terminado_id || isNaN(Number(body.producto_terminado_id))) return 'ID de producto terminado requerido';
  if (!body.cantidad || isNaN(Number(body.cantidad))) return 'Cantidad requerida';
  if (!body.formula_id || isNaN(Number(body.formula_id))) return 'ID de fórmula requerido';
  if (!body.estado || !['Pendiente', 'Completada'].includes(body.estado)) return 'Estado inválido';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM ordenes_produccion`;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const error = validarOrden(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { producto_terminado_id, cantidad, formula_id, estado } = req.body;
    const result = await sql`
      INSERT INTO ordenes_produccion (producto_terminado_id, cantidad, formula_id, estado, fecha)
      VALUES (${producto_terminado_id}, ${cantidad}, ${formula_id}, ${estado}, NOW()) RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM ordenes_produccion WHERE id = ${req.params.id}`;
    if (result.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
