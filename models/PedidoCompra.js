const mongoose = require('mongoose');
const PedidoCompraSchema = new mongoose.Schema({
  proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor' },
  productos: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    cantidad: Number
  }],
  estado: { type: String, enum: ['Pendiente', 'Recibido'] },
  fecha: Date
});
module.exports = mongoose.model('PedidoCompra', PedidoCompraSchema);
