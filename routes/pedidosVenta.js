const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

function validarPedido(body) {
  if (!body.cliente_id || isNaN(Number(body.cliente_id))) return 'ID de cliente requerido';
  if (!Array.isArray(body.productos) || body.productos.length === 0) return 'Productos requeridos';
  for (const p of body.productos) {
    if (!p.producto_id || isNaN(Number(p.producto_id))) return 'ID de producto requerido';
    if (!p.cantidad || isNaN(Number(p.cantidad))) return 'Cantidad requerida';
  }
  if (!body.estado || !['Pendiente', 'Enviado', 'Completado'].includes(body.estado)) return 'Estado inválido';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const pedidos = await sql`SELECT * FROM pedidos_venta`;
    for (const p of pedidos) {
      p.productos = await sql`SELECT * FROM pedido_venta_productos WHERE pedido_venta_id = ${p.id}`;
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
    const { cliente_id, productos, estado, nombre_cliente, telefono, cedula } = req.body;
    // Insertar incluyendo campos opcionales nombre_cliente, telefono y cedula (si están presentes)
    const pedido = await sql`
      INSERT INTO pedidos_venta (cliente_id, nombre_cliente, telefono, cedula, estado, fecha)
      VALUES (${cliente_id || null}, ${nombre_cliente || null}, ${telefono || null}, ${cedula || null}, ${estado}, NOW()) RETURNING *
    `;
    for (const p of productos) {
      await sql`
        INSERT INTO pedido_venta_productos (pedido_venta_id, producto_id, cantidad)
        VALUES (${pedido[0].id}, ${p.producto_id}, ${p.cantidad})
      `;
    }
    pedido[0].productos = await sql`SELECT * FROM pedido_venta_productos WHERE pedido_venta_id = ${pedido[0].id}`;
    res.status(201).json(pedido[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pedido = await sql`SELECT * FROM pedidos_venta WHERE id = ${req.params.id}`;
    if (pedido.length === 0) return res.status(404).json({ error: 'No encontrado' });
    pedido[0].productos = await sql`SELECT * FROM pedido_venta_productos WHERE pedido_venta_id = ${req.params.id}`;
    res.json(pedido[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
