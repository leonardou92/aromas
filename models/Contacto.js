const mongoose = require('mongoose');
const ContactoSchema = new mongoose.Schema({
  nombre: String,
  tipo: { type: String, enum: ['Cliente', 'Proveedor'] },
  telefono: String,
  email: String
});
module.exports = mongoose.model('Contacto', ContactoSchema);
