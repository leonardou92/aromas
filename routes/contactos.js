const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

function validarContacto(body) {
  if (!body.nombre || typeof body.nombre !== 'string') return 'Nombre requerido';
  if (!body.tipo || !['Cliente', 'Proveedor'].includes(body.tipo)) return 'Tipo inválido';
  if (!body.telefono || typeof body.telefono !== 'string') return 'Teléfono requerido';
  if (!body.email || typeof body.email !== 'string') return 'Email requerido';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM contactos`;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const error = validarContacto(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { nombre, tipo, telefono, email } = req.body;
    const result = await sql`
      INSERT INTO contactos (nombre, tipo, telefono, email)
      VALUES (${nombre}, ${tipo}, ${telefono}, ${email}) RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM contactos WHERE id = ${req.params.id}`;
    if (result.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const error = validarContacto(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { nombre, tipo, telefono, email } = req.body;
    const result = await sql`
      UPDATE contactos SET nombre=${nombre}, tipo=${tipo}, telefono=${telefono}, email=${email}
      WHERE id = ${req.params.id} RETURNING *
    `;
    if (result.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await sql`DELETE FROM contactos WHERE id = ${req.params.id} RETURNING *`;
    if (result.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ eliminado: true, contacto: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
