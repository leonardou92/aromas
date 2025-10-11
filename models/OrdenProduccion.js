const mongoose = require('mongoose');
const OrdenProduccionSchema = new mongoose.Schema({
  productoTerminado: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
  cantidad: Number,
  formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
  estado: { type: String, enum: ['Pendiente', 'Completada'] },
  fecha: Date
});
module.exports = mongoose.model('OrdenProduccion', OrdenProduccionSchema);
