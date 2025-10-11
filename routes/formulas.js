const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

function validarFormula(body) {
  if (!body.producto_terminado_id || isNaN(Number(body.producto_terminado_id))) return 'ID de producto terminado requerido';
  if (!Array.isArray(body.componentes) || body.componentes.length === 0) return 'Componentes requeridos';
  for (const c of body.componentes) {
    if (!c.materia_prima_id || isNaN(Number(c.materia_prima_id))) return 'ID de materia prima requerido';
    if (!c.cantidad || isNaN(Number(c.cantidad))) return 'Cantidad requerida';
    if (!c.unidad || typeof c.unidad !== 'string') return 'Unidad requerida';
  }
  return null;
}

router.get('/', async (req, res) => {
  try {
    const formulas = await sql`SELECT * FROM formulas`;
    for (const f of formulas) {
      f.componentes = await sql`SELECT * FROM formula_componentes WHERE formula_id = ${f.id}`;
    }
    res.json(formulas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const error = validarFormula(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const { producto_terminado_id, componentes } = req.body;
    const formula = await sql`
      INSERT INTO formulas (producto_terminado_id)
      VALUES (${producto_terminado_id}) RETURNING *
    `;
    for (const c of componentes) {
      await sql`
        INSERT INTO formula_componentes (formula_id, materia_prima_id, cantidad, unidad)
        VALUES (${formula[0].id}, ${c.materia_prima_id}, ${c.cantidad}, ${c.unidad})
      `;
    }
    formula[0].componentes = await sql`SELECT * FROM formula_componentes WHERE formula_id = ${formula[0].id}`;
    res.status(201).json(formula[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const formula = await sql`SELECT * FROM formulas WHERE id = ${req.params.id}`;
    if (formula.length === 0) return res.status(404).json({ error: 'No encontrado' });
    formula[0].componentes = await sql`SELECT * FROM formula_componentes WHERE formula_id = ${req.params.id}`;
    res.json(formula[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
