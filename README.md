# Aromas - Sistema de Gestión de Perfumería

## Descripción
Aromas es un sistema de gestión para empresas de perfumería, desarrollado en Node.js con Express y NeonDB. Permite administrar productos, almacenes, fórmulas, inventario, pedidos, contactos, bancos, pagos y usuarios con roles. Incluye autenticación JWT, documentación Swagger y pruebas automáticas.

## Características
- API RESTful modular
- Autenticación JWT y roles (admin, empleado)
- Base de datos NeonDB (PostgreSQL serverless)
- Documentación interactiva con Swagger
- Pruebas unitarias con Jest y Supertest
- Scripts de inicialización y semillas

## Estructura del Proyecto
```
Aromas/
├── src/
│   ├── app.js            # Configuración principal de Express y rutas
│   ├── server.js         # Inicialización del servidor
│   ├── initNeonDB.js     # Script para crear tablas y datos de prueba
│   ├── models/           # Modelos de datos
│   ├── routes/           # Rutas de la API
│   ├── tests/            # Pruebas unitarias
│   └── swagger.json      # Documentación Swagger
├── package.json          # Dependencias y scripts
├── .env                  # Variables de entorno
└── README.md             # Documentación
```

## Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/leonardou92/aromas.git
   cd aromas
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env`:
   ```env
   DATABASE_URL='TU_URL_DE_NEONDB'
   JWT_SECRET=supersecreto
   ```
4. Inicializa la base de datos:
   ```bash
   npm run seed
   ```
5. Inicia el servidor:
   ```bash
   npm run dev
   ```

## Uso de la API
- Accede a la documentación interactiva en [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Endpoints principales:
  - Autenticación: `POST /api/auth/login`, `POST /api/auth/register`
  - Productos: `GET/POST /api/productos`
   - Catálogo público de productos: `GET /api/productos/catalogo` (no requiere token)
  - Proveedores: `GET /api/proveedores`
  - Almacenes: `GET /api/almacenes`
  - Fórmulas: `GET /api/formulas`
  - Inventario: `GET /api/inventario`
  - Pedidos: `GET /api/pedidos-venta`, `GET /api/pedidos-compra`
  - Contactos: `GET /api/contactos`
  - Bancos: `GET /api/bancos`
  - Formas de pago: `GET /api/formas-pago`
  - Cliente-bancos: `GET /api/cliente-bancos`
  - Pagos: `GET /api/pagos`

## Autenticación y Roles
- Registra un usuario con `POST /api/auth/register` (campos: nombre, email, password, rol)
- Inicia sesión con `POST /api/auth/login` (campos: email, password)
- Usa el token JWT en el header `Authorization: Bearer <token>` para acceder a los endpoints protegidos

## Pruebas
- Ejecuta las pruebas unitarias:
  ```bash
  npm test
  ```
- Las pruebas validan todos los endpoints protegidos por JWT

## Tecnologías
- Node.js
- Express
- NeonDB (@neondatabase/serverless)
- JWT (jsonwebtoken)
- Bcryptjs
- Swagger
- Jest
- Supertest

## Contribución
1. Haz un fork del repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz commit
4. Envía un pull request

## Autor
- Leonardo Urdaneta
- [leonardou92@gmail.com](mailto:leonardou92@gmail.com)

## Licencia
MIT
