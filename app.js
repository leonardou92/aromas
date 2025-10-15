require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors()); // Permitir todos los orígenes

// Human-friendly colorized console logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    let userId = '-';
    try {
      const auth = req.headers['authorization'];
      if (auth && auth.startsWith('Bearer ')) {
        const token = auth.split(' ')[1];
        const decoded = jwt.decode(token) || {};
        userId = decoded.id || decoded.userId || decoded.sub || '-';
      }
    } catch (e) {}

    const ip = (req.headers['x-forwarded-for'] || req.ip || (req.connection && req.connection.remoteAddress) || '-').toString();
    const time = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const status = res.statusCode;

    const reset = '\u001b[0m';
    const red = '\u001b[31m';
    const yellow = '\u001b[33m';
    const green = '\u001b[32m';
    let color = green;
    if (status >= 500) color = red;
    else if (status >= 400) color = red;
    else if (status >= 300) color = yellow;

    const line = `${time} | ${method} ${url} | ${color}${status}${reset} | ${duration}ms | ip=${ip} | user=${userId}`;
    console.log(line);
  });
  next();
});

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token inválido' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Rutas públicas
app.use('/api/auth', require('./routes/auth'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas protegidas
app.use('/api/productos', authMiddleware, require('./routes/productos'));
app.use('/api/proveedores', authMiddleware, require('./routes/proveedores'));
app.use('/api/almacenes', authMiddleware, require('./routes/almacenes'));
app.use('/api/formulas', authMiddleware, require('./routes/formulas'));
app.use('/api/ordenes-produccion', authMiddleware, require('./routes/ordenesProduccion'));
app.use('/api/inventario', authMiddleware, require('./routes/inventario'));
app.use('/api/pedidos-venta', authMiddleware, require('./routes/pedidosVenta'));
app.use('/api/pedidos-compra', authMiddleware, require('./routes/pedidosCompra'));
app.use('/api/contactos', authMiddleware, require('./routes/contactos'));
app.use('/api/bancos', authMiddleware, require('./routes/bancos'));
app.use('/api/formas-pago', authMiddleware, require('./routes/formasPago'));
app.use('/api/cliente-bancos', authMiddleware, require('./routes/clienteBancos'));
app.use('/api/pagos', authMiddleware, require('./routes/pagos'));

app.get('/', (req, res) => {
  res.send('API REST Aromas funcionando');
});

module.exports = app;