const mongoose = require('mongoose');
const AlmacenSchema = new mongoose.Schema({
  nombre: String,
  tipo: { type: String, enum: ['MateriaPrima', 'Venta'] },
  ubicacion: { type: String },
  responsable: { type: String }
});
module.exports = mongoose.model('Almacen', AlmacenSchema);
