import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Carts (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = (await moduleFixture.createNestApplication().init()).getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('get all carts', async () => {
    const response = await request(app).get('/carts');
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body).not.toEqual([]);
  });

  it('get a single cart', async () => {
    const response = await request(app).get('/carts/2');
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body).not.toEqual({});
    expect(response.body).toHaveProperty('userId');
    expect(response.body).not.toHaveProperty('_Id');
  });

  it('get carts in a date range and limit and sort', async () => {
    const response = await request(app).get(
      '/carts?limit=2&sort=desc&startdate=2019-12-10&enddate=2020-10-10',
    );
    expect(response.status).toBe(200);
    console.log('get with querystring', response.body);
    expect(response.body).not.toEqual([]);
  });

  it('get carts in for user in date range', async () => {
    const response = await request(app).get(
      '/carts/user/1?startdate=2019-12-10&enddate=2020-10-10',
    );
    expect(response.status).toBe(200);
    console.log('get with date range', response.body);
    expect(response.body).not.toEqual([]);
  });

  it('get carts in for user without start date', async () => {
    const response = await request(app).get('/carts/user/1?enddate=2020-10-10');
    expect(response.status).toBe(200);
    console.log('get user cart without start date', response.body);
    expect(response.body).not.toEqual([]);
  });

  it('get carts in for user without end date', async () => {
    const response = await request(app).get(
      '/carts/user/1?startdate=2019-12-10',
    );
    expect(response.status).toBe(200);
    console.log('get user cart without end date', response.body);
    expect(response.body).not.toEqual([]);
  });

  it('get carts in for user', async () => {
    const response = await request(app).get('/carts/user/1');
    expect(response.status).toBe(200);
    console.log('get with userid', response.body);
    expect(response.body).not.toEqual([]);
  });

  it('add a new cart', async () => {
    const response = await request(app)
      .post('/carts')
      .send({
        userId: 1,
        date: new Date('2020-10-10'),
        products: [
          { productId: 2, quantity: 4 },
          { productId: 1, quantity: 10 },
          { productId: 5, quantity: 2 },
        ],
      });
    expect(response.status).toBe(201);
    console.log(response.body);
    expect(response.body).toHaveProperty('id');
  });

  it.skip('edit a cart', async () => {
    const response = await request(app)
      .put('/carts/2')
      .send({
        userId: 1,
        date: new Date('2020-10-10'),
        products: [
          { productId: 2, quantity: 4 },
          { productId: 1, quantity: 10 },
          { productId: 5, quantity: 2 },
        ],
      });
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body).toHaveProperty('id');
  });

  it('edit a cart', async () => {
    const response = await request(app)
      .patch('/carts/2')
      .send({
        userId: 1,
        date: new Date('2020-10-10'),
        products: [
          { productId: 2, quantity: 4 },
          { productId: 1, quantity: 10 },
          { productId: 5, quantity: 2 },
        ],
      });
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body).toHaveProperty('id');
  });

  it('delete a cart', async () => {
    const response = await request(app).delete('/carts/2');
    expect(response.status).toBe(200);
    console.log(response.body);
    // expect(response.body).toHaveProperty('id');
  });
});
