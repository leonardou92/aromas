const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

function validarPedido(body) {
  if (!body.proveedor_id || isNaN(Number(body.proveedor_id))) return 'ID de proveedor requerido';
  if (!Array.isArray(body.productos) || body.productos.length === 0) return 'Productos requeridos';
  for (const p of body.productos) {
    if (!p.producto_id || isNaN(Number(p.producto_id))) return 'ID de producto requerido';
    if (!p.cantidad || isNaN(Number(p.cantidad))) return 'Cantidad requerida';
  }
  if (!body.estado || !['Pendiente', 'Recibido'].includes(body.estado)) return 'Estado inválido';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const pedidos = await sql`SELECT * FROM pedidos_compra`;
    for (const p of pedidos) {
      p.productos = await sql`SELECT * FROM pedido_compra_productos WHERE pedido_compra_id = ${p.id}`;
    }
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const error = validarPedido(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { proveedor_id, productos, estado } = req.body;
    const pedido = await sql`
      INSERT INTO pedidos_compra (proveedor_id, estado, fecha)
      VALUES (${proveedor_id}, ${estado}, NOW()) RETURNING *
    `;
    for (const p of productos) {
      await sql`
        INSERT INTO pedido_compra_productos (pedido_compra_id, producto_id, cantidad)
        VALUES (${pedido[0].id}, ${p.producto_id}, ${p.cantidad})
      `;
    }
    pedido[0].productos = await sql`SELECT * FROM pedido_compra_productos WHERE pedido_compra_id = ${pedido[0].id}`;
    res.status(201).json(pedido[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pedido = await sql`SELECT * FROM pedidos_compra WHERE id = ${req.params.id}`;
    if (pedido.length === 0) return res.status(404).json({ error: 'No encontrado' });
    pedido[0].productos = await sql`SELECT * FROM pedido_compra_productos WHERE pedido_compra_id = ${req.params.id}`;
    res.json(pedido[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
