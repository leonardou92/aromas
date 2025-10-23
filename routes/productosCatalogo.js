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
    // Construir consultas simples por ramas para evitar concatenación compleja de templates
    const cols = 'id, nombre, tipo, unidad, stock, precio_venta';
    let result;
    const hasQ = q && q.toString().trim() !== '';
    const includeOut = includeOutOfStock === 'true';
    const lim = limit && !isNaN(Number(limit)) ? Number(limit) : null;

    if (hasQ) {
      const pattern = `%${q}%`;
      if (!includeOut) {
        // Algunas instalaciones pueden fallar al inyectar operadores en templates; obtener los
        // resultados sin el filtro y aplicar el filtro en JS para evitar errores de sintaxis
        if (lim) result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta FROM productos WHERE nombre ILIKE ${pattern} LIMIT ${lim}`;
        else result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta FROM productos WHERE nombre ILIKE ${pattern}`;
        result = (result || []).filter(r => Number(r.stock) > 0);
      } else {
  if (lim) result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta FROM productos WHERE nombre ILIKE ${pattern} LIMIT ${lim}`;
  else result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta FROM productos WHERE nombre ILIKE ${pattern}`;
      }
    } else {
      if (!includeOut) {
        if (lim) result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta FROM productos LIMIT ${lim}`;
        else result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta FROM productos`;
        result = (result || []).filter(r => Number(r.stock) > 0);
      } else {
  if (lim) result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta FROM productos LIMIT ${lim}`;
  else result = await sql`SELECT id, nombre, tipo, unidad, stock, precio_venta FROM productos`;
      }
    }
    res.json(result);
  } catch (err) {
    console.error('Error en /api/productos/catalogo', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
