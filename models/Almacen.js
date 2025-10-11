const mongoose = require('mongoose');
const AlmacenSchema = new mongoose.Schema({
  nombre: String,
  tipo: { type: String, enum: ['MateriaPrima', 'Venta'] }
});
module.exports = mongoose.model('Almacen', AlmacenSchema);
