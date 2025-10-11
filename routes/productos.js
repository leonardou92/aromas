const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

// Validación básica
function validarProducto(body) {
  if (!body.nombre || typeof body.nombre !== 'string') return 'Nombre requerido';
  if (!body.tipo || !['MateriaPrima', 'ProductoTerminado'].includes(body.tipo)) return 'Tipo inválido';
  if (!body.unidad || typeof body.unidad !== 'string') return 'Unidad requerida';
  if (body.stock != null && isNaN(Number(body.stock))) return 'Stock debe ser numérico';
  return null;
}

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM productos`;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear producto
router.post('/', async (req, res) => {
  const error = validarProducto(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { nombre, tipo, unidad, stock, costo, precio_venta, proveedor_id } = req.body;
    const result = await sql`
      INSERT INTO productos (nombre, tipo, unidad, stock, costo, precio_venta, proveedor_id)
      VALUES (${nombre}, ${tipo}, ${unidad}, ${stock || 0}, ${costo || 0}, ${precio_venta || 0}, ${proveedor_id || null})
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener producto por id
router.get('/:id', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM productos WHERE id = ${req.params.id}`;
    if (result.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
  const error = validarProducto(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { nombre, tipo, unidad, stock, costo, precio_venta, proveedor_id } = req.body;
    const result = await sql`
      UPDATE productos SET nombre=${nombre}, tipo=${tipo}, unidad=${unidad}, stock=${stock}, costo=${costo}, precio_venta=${precio_venta}, proveedor_id=${proveedor_id}
      WHERE id = ${req.params.id} RETURNING *
    `;
    if (result.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const result = await sql`DELETE FROM productos WHERE id = ${req.params.id} RETURNING *`;
    if (result.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ eliminado: true, producto: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
