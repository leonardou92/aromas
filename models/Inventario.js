const mongoose = require('mongoose');
const InventarioSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
  almacen: { type: mongoose.Schema.Types.ObjectId, ref: 'Almacen' },
  stockFisico: Number,
  stockComprometido: Number
});
InventarioSchema.virtual('stockDisponible').get(function() {
  return this.stockFisico - this.stockComprometido;
});
module.exports = mongoose.model('Inventario', InventarioSchema);
