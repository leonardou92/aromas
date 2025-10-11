const mongoose = require('mongoose');
const ProductoSchema = new mongoose.Schema({
  nombre: String,
  tipo: { type: String, enum: ['MateriaPrima', 'ProductoTerminado'] },
  unidad: String,
  stock: Number,
  costo: Number,
  precioVenta: Number,
  proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor' }
});
module.exports = mongoose.model('Producto', ProductoSchema);
