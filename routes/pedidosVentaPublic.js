const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);


function validarPedido(body) {
  // Para pedidos públicos `cliente_id` es opcional (puede venir null/0).
  if (body.cliente_id != null && body.cliente_id !== '' && isNaN(Number(body.cliente_id))) return 'ID de cliente inválido';
  if (!Array.isArray(body.productos) || body.productos.length === 0) return 'Productos requeridos';
  for (const p of body.productos) {
    if (!p.producto_id || isNaN(Number(p.producto_id))) return 'ID de producto requerido';
    if (!p.cantidad || isNaN(Number(p.cantidad))) return 'Cantidad requerida';
  }
  // estado es opcional para pedidos públicos (se fuerza a 'Pendiente' en la inserción)
  if (body.estado != null && !['Pendiente', 'Enviado', 'Completado'].includes(body.estado)) return 'Estado inválido';
  return null;
}

// Endpoint público para crear pedidos de venta (no requiere token)
router.post('/', async (req, res) => {
  console.log('Public POST /api/pedidos-venta body:', req.body);
  const error = validarPedido(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { cliente_id, productos, estado, nombre_cliente, telefono, cedula } = req.body;
    // Insertar incluyendo campos opcionales nombre_cliente, telefono y cedula
  // Si cliente_id no se provee o es 0, lo almacenamos como NULL (pedido público)
  // Forzamos estado a 'Pendiente' para pedidos públicos
  const clienteIdValue = (cliente_id == null || Number(cliente_id) === 0) ? null : Number(cliente_id);
    const forcedEstado = 'Pendiente';
    // Capturar IP y User-Agent para trazabilidad
    const origenIp = (req.headers['x-forwarded-for'] || req.ip || '').toString();
    const userAgent = (req.headers['user-agent'] || '').toString();

    const pedido = await sql`
      INSERT INTO pedidos_venta (cliente_id, nombre_cliente, telefono, cedula, estado, fecha, origen_ip, user_agent)
      VALUES (${clienteIdValue}, ${nombre_cliente || null}, ${telefono || null}, ${cedula || null}, ${forcedEstado}, NOW(), ${origenIp || null}, ${userAgent || null}) RETURNING *
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

module.exports = router;
