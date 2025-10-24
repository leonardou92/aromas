const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

// GET / -> catálogo público de productos
// Query params opcionales:
//  - q: texto a buscar en nombre (LIKE)
//  - includeOutOfStock=true: incluir productos con stock <= 0
//  - limit: número máximo de resultados
router.get('/', async (req, res) => {
  try {
    const { q, includeOutOfStock, limit } = req.query;
    const cols = 'id, nombre, tipo, unidad, stock, precio_venta, image_url';
    const hasQ = q && q.toString().trim() !== '';
    const includeOut = includeOutOfStock === 'true';
    const lim = limit && !isNaN(Number(limit)) ? Number(limit) : null;
    let result = [];

    const pattern = hasQ ? `%${q}%` : null;

    // Si no incluimos agotados, traemos y filtramos en JS (evita problemas de sintaxis en algunos clientes SQL)
    if (!includeOut) {
      if (hasQ) {
  if (lim) result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta, image_url FROM productos WHERE nombre ILIKE ${pattern} LIMIT ${lim}`;
  else result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta, image_url FROM productos WHERE nombre ILIKE ${pattern}`;
      } else {
  if (lim) result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta, image_url FROM productos LIMIT ${lim}`;
  else result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta, image_url FROM productos`;
      }
      result = (result || []).filter(r => Number(r.stock) > 0);
    } else {
      // incluir agotados: directamente en SQL
      if (hasQ) {
  if (lim) result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta, image_url FROM productos WHERE nombre ILIKE ${pattern} LIMIT ${lim}`;
  else result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta, image_url FROM productos WHERE nombre ILIKE ${pattern}`;
      } else {
  if (lim) result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta, image_url FROM productos LIMIT ${lim}`;
  else result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta, image_url FROM productos`;
      }
    }

    res.json(result);
  } catch (err) {
    console.error('Error en /api/productos/catalogo', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
