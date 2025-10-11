const mongoose = require('mongoose');
const FormulaSchema = new mongoose.Schema({
  productoTerminado: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
  componentes: [{
    materiaPrima: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    cantidad: Number,
    unidad: String
  }]
});
module.exports = mongoose.model('Formula', FormulaSchema);
