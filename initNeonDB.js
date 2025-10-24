require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function initDB() {
    // Verificar y crear tabla usuarios si no existe
    await sql`CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      rol VARCHAR(20)
    );`;
    await sql`CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      rol VARCHAR(20)
    );`;
    await sql`INSERT INTO usuarios (nombre, email, password, rol) VALUES
      ('Administrador', 'admin@aromas.com', '$2a$10$adminhash', 'admin'),
      ('Empleado', 'empleado@aromas.com', '$2a$10$empleadohash', 'empleado')
      ON CONFLICT (email) DO NOTHING;`;
  // ALTER TABLE para agregar columnas si no existen
  try { await sql`ALTER TABLE contactos ADD COLUMN banco VARCHAR(100);`; } catch(e) {}
  try { await sql`ALTER TABLE contactos ADD COLUMN cuenta_bancaria VARCHAR(50);`; } catch(e) {}
  try { await sql`ALTER TABLE contactos ADD COLUMN formas_pago VARCHAR(100);`; } catch(e) {}
    await sql`CREATE TABLE IF NOT EXISTS bancos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100)
    );`;
    await sql`CREATE TABLE IF NOT EXISTS cliente_bancos (
      id SERIAL PRIMARY KEY,
      cliente_id INT,
      banco_id INT,
      cuenta_bancaria VARCHAR(50)
    );`;
    await sql`CREATE TABLE IF NOT EXISTS pagos (
      id SERIAL PRIMARY KEY,
      pedido_venta_id INT,
      forma_pago_id INT,
      banco_id INT,
      monto NUMERIC,
      fecha TIMESTAMP
    );`;
    await sql`INSERT INTO bancos (nombre) VALUES
      ('Banco Uno'),
      ('Banco Dos')
      ON CONFLICT DO NOTHING;`;
    await sql`INSERT INTO cliente_bancos (cliente_id, banco_id, cuenta_bancaria) VALUES
      (1, 1, '1234567890'),
      (2, 2, '0987654321')
      ON CONFLICT DO NOTHING;`;
  try {
    // Crear tablas (una por una)
    await sql`CREATE TABLE IF NOT EXISTS proveedores (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100),
      telefono VARCHAR(30),
      email VARCHAR(100)
    );`;
    await sql`CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100),
      tipo VARCHAR(30),
      unidad VARCHAR(20),
      stock INT,
      costo NUMERIC,
      precio_venta NUMERIC,
      proveedor_id INT
    );`;
    await sql`CREATE TABLE IF NOT EXISTS almacenes (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100),
      tipo VARCHAR(30),
      ubicacion VARCHAR(200),
      responsable VARCHAR(100)
    );`;
    // Asegurar columnas en caso de migracion previa
    try { await sql`ALTER TABLE almacenes ADD COLUMN ubicacion VARCHAR(200);`; } catch(e) {}
    try { await sql`ALTER TABLE almacenes ADD COLUMN responsable VARCHAR(100);`; } catch(e) {}
    await sql`CREATE TABLE IF NOT EXISTS formulas (
      id SERIAL PRIMARY KEY,
      producto_terminado_id INT
    );`;
    await sql`CREATE TABLE IF NOT EXISTS formula_componentes (
      id SERIAL PRIMARY KEY,
      formula_id INT,
      materia_prima_id INT,
      cantidad NUMERIC,
      unidad VARCHAR(20)
    );`;
    await sql`CREATE TABLE IF NOT EXISTS ordenes_produccion (
      id SERIAL PRIMARY KEY,
      producto_terminado_id INT,
      cantidad INT,
      formula_id INT,
      estado VARCHAR(30),
      fecha TIMESTAMP
    );`;
    await sql`CREATE TABLE IF NOT EXISTS inventario (
      id SERIAL PRIMARY KEY,
      producto_id INT,
      almacen_id INT,
      stock_fisico INT,
      stock_comprometido INT
    );`;
    await sql`CREATE TABLE IF NOT EXISTS contactos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100),
      tipo VARCHAR(30),
      telefono VARCHAR(30),
      email VARCHAR(100),
      banco VARCHAR(100),
      cuenta_bancaria VARCHAR(50),
      formas_pago VARCHAR(100)
    );`;
    await sql`CREATE TABLE IF NOT EXISTS formas_pago (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(50)
    );`;
    await sql`CREATE TABLE IF NOT EXISTS pedidos_venta (
      id SERIAL PRIMARY KEY,
      cliente_id INT,
      estado VARCHAR(30),
      fecha TIMESTAMP
    );`;
    // Asegurar columnas adicionales para pedidos_venta (migración segura)
    try { await sql`ALTER TABLE pedidos_venta ADD COLUMN nombre_cliente TEXT;`; } catch(e) {}
    try { await sql`ALTER TABLE pedidos_venta ADD COLUMN telefono TEXT;`; } catch(e) {}
    try { await sql`ALTER TABLE pedidos_venta ADD COLUMN cedula TEXT;`; } catch(e) {}
    try { await sql`ALTER TABLE pedidos_venta ADD COLUMN origen_ip TEXT;`; } catch(e) {}
    try { await sql`ALTER TABLE pedidos_venta ADD COLUMN user_agent TEXT;`; } catch(e) {}
    await sql`CREATE TABLE IF NOT EXISTS pedido_venta_productos (
      id SERIAL PRIMARY KEY,
      pedido_venta_id INT,
      producto_id INT,
      cantidad INT
    );`;
    await sql`CREATE TABLE IF NOT EXISTS pedidos_compra (
      id SERIAL PRIMARY KEY,
      proveedor_id INT,
      estado VARCHAR(30),
      fecha TIMESTAMP
    );`;
    await sql`CREATE TABLE IF NOT EXISTS pedido_compra_productos (
      id SERIAL PRIMARY KEY,
      pedido_compra_id INT,
      producto_id INT,
      cantidad INT
    );`;

    // Semillas y datos falsos (una por una)
    await sql`INSERT INTO proveedores (nombre, telefono, email) VALUES
      ('Proveedor Aromas', '123456789', 'aromas@proveedor.com'),
      ('Proveedor Frascos', '987654321', 'frascos@proveedor.com')
      ON CONFLICT DO NOTHING;`;

    await sql`INSERT INTO productos (nombre, tipo, unidad, stock, costo, proveedor_id) VALUES
      ('Esencia de Jazmín', 'MateriaPrima', 'ml', 1000, 0.5, 1),
      ('Alcohol de Perfumería', 'MateriaPrima', 'ml', 5000, 0.2, 1),
      ('Fijador', 'MateriaPrima', 'ml', 2000, 0.3, 1),
      ('Frasco de Vidrio 50ml', 'MateriaPrima', 'unidad', 200, 1.0, 2),
      ('Tapa Atomizadora', 'MateriaPrima', 'unidad', 200, 0.5, 2),
      ('Etiqueta "Floral N°5"', 'MateriaPrima', 'unidad', 200, 0.1, 2)
      ON CONFLICT DO NOTHING;`;

    await sql`INSERT INTO productos (nombre, tipo, unidad, stock, precio_venta) VALUES
      ('Perfume Floral N°5 - 50ml', 'ProductoTerminado', 'unidad', 0, 25.0)
      ON CONFLICT DO NOTHING;`;

    await sql`INSERT INTO almacenes (nombre, tipo) VALUES
      ('Almacén de Materia Prima', 'MateriaPrima'),
      ('Almacén de Venta', 'Venta')
      ON CONFLICT DO NOTHING;`;

    await sql`INSERT INTO formulas (producto_terminado_id) VALUES (7)
      ON CONFLICT DO NOTHING;`;

    await sql`INSERT INTO formula_componentes (formula_id, materia_prima_id, cantidad, unidad) VALUES
      (1, 1, 10, 'ml'),
      (1, 2, 35, 'ml'),
      (1, 3, 5, 'ml'),
      (1, 4, 1, 'unidad'),
      (1, 5, 1, 'unidad'),
      (1, 6, 1, 'unidad')
      ON CONFLICT DO NOTHING;`;

    await sql`INSERT INTO contactos (nombre, tipo, telefono, email, banco, cuenta_bancaria, formas_pago) VALUES
      ('Cliente Uno', 'Cliente', '555111222', 'cliente1@aromas.com', 'Banco Uno', '1234567890', 'Tarjeta,Transferencia'),
      ('Cliente Dos', 'Cliente', '555333444', 'cliente2@aromas.com', 'Banco Dos', '0987654321', 'Efectivo,Transferencia')
      ON CONFLICT DO NOTHING;`;
    await sql`INSERT INTO formas_pago (nombre) VALUES
      ('Tarjeta'),
      ('Transferencia'),
      ('Efectivo')
      ON CONFLICT DO NOTHING;`;

    await sql`INSERT INTO inventario (producto_id, almacen_id, stock_fisico, stock_comprometido) VALUES
      (1, 1, 1000, 0),
      (2, 1, 5000, 0),
      (3, 1, 2000, 0),
      (4, 1, 200, 0),
      (5, 1, 200, 0),
      (6, 1, 200, 0),
      (7, 2, 0, 0)
      ON CONFLICT DO NOTHING;`;

    console.log('Tablas y datos de prueba creados en NeonDB');
  } catch (error) {
    console.error('Error inicializando NeonDB:', error);
  }
}

initDB();
