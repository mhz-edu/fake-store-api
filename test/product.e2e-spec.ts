import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Products (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = (await moduleFixture.createNestApplication().init()).getHttpServer();
  });

  it('all product', async () => {
    const response = await request(app).get('/products');
    console.log(response.body);

    expect(response.status).toBe(200);
    console.log('get', response.body);
    expect(response.body).not.toStrictEqual([]);
  });

  it('get a single product', async () => {
    const response = await request(app).get('/products/1');
    expect(response.status).toBe(200);
    console.log('get by id', response.body);
    expect(response.body).not.toStrictEqual({});
    expect(response.body).toHaveProperty('title');
  });

  it('get products in a category', async () => {
    const response = await request(app).get('/products/category/jewelery');
    expect(response.status).toBe(200);
    console.log('get by category', response.body);
    expect(response.body).not.toStrictEqual([]);
  });

  it('get products in a limit and sort', async () => {
    const response = await request(app).get('/products?limit=3&sort=desc');
    expect(response.status).toBe(200);
    console.log('get with querystring', response.body);
    expect(response.body).not.toStrictEqual([]);
    expect(response.body).toHaveLength(3);
  });

  it('post a product', async () => {
    const response = await request(app).post('/products').send({
      title: 'test',
      price: 13.5,
      description: 'test desc',
      image: 'test img',
      category: 'text cat',
    });
    expect(response.status).toBe(201);
    console.log('post', response.body);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title', 'test');
  });

  it('put a product', async () => {
    const response = await request(app).put('/products/1').send({
      title: 'test',
      price: 13.5,
      description: 'test desc',
      image: 'test img',
      category: 'text cat',
    });
    expect(response.status).toBe(200);
    console.log('put', response.body);
    expect(response.body).toHaveProperty('id');
  });

  it.skip('patch a product', async () => {
    const response = await request(app).patch('/products/1').send({
      title: 'test',
      price: 13.5,
      description: 'test desc',
      image: 'test img',
      category: 'text cat',
    });
    expect(response.status).toBe(200);
    console.log('patch', response.body);
    expect(response.body).toHaveProperty('id');
  });

  it('delete a product', async () => {
    const response = await request(app).put('/products/1');
    expect(response.status).toBe(200);
    console.log('delete', response.body);
    expect(response.body).toHaveProperty('id');
  });
});
