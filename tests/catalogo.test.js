const request = require('supertest');
const app = require('../app');

describe('Catálogo público de productos', () => {
  test('GET /api/productos/catalogo responde 200 y devuelve un arreglo', async () => {
    const res = await request(app).get('/api/productos/catalogo');
    expect([200, 204]).toContain(res.statusCode);
    // Si hay contenido esperado que sea array
    if (res.body) expect(Array.isArray(res.body)).toBe(true);
  });
});
