const mongoose = require('mongoose');
const ProveedorSchema = new mongoose.Schema({
  nombre: String,
  telefono: String,
  email: String
});
module.exports = mongoose.model('Proveedor', ProveedorSchema);
