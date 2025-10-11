const mongoose = require('mongoose');
const PedidoVentaSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Contacto' },
  productos: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    cantidad: Number
  }],
  estado: { type: String, enum: ['Pendiente', 'Enviado', 'Completado'] },
  fecha: Date
});
module.exports = mongoose.model('PedidoVenta', PedidoVentaSchema);
