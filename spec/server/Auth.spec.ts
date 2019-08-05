import mongoose from 'mongoose';
import request from 'supertest';
import supertest = require('supertest');
import app from '../../server/App';
import { connectTestMongo } from '../../server/core/db/mongo';
import { User } from '../../server/models';

process.env.NODE_ENV = 'test';

describe('Test Auth API.', () => {
  let conn: mongoose.Connection | undefined;
  const req: supertest.SuperTest<supertest.Test> = request(app);

  beforeAll(async () => {
    conn = await connectTestMongo();
    const admin = new User({ email: 'admin@gmail.com' });
    await admin.setPassword('admin');
    return admin.save();
  });

  test('SignUp: Duplicate email.', async () => {
    const response = await req.post('/api/auth/signup')
      .send({
        email: 'admin@gmail.com',
        password: '1234',
      });
    expect(response.status).toEqual(409);
  });

  test('SignUp: Missing argument.', async () => {
    const response = await req.post('/api/auth/signup')
      .send({
        email: 'admin@gmail.com',
      });
    expect(response.status).toEqual(422);
  });

  test('SignUp: Valid.', async () => {
    const response = await req.post('/api/auth/signup')
      .send({
        email: 'apple@gmail.com',
        password: '1234',
      });
    // 201 created.
    expect(response.status).toEqual(201);

    // check the user is created.
    const users = await User.find({ email: 'apple@gmail.com' });
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
  });

  test('Login: Missing argument.', async () => {
    const response = await req.post('/api/auth/login')
    .send({
      email: 'admin@gmail.com',
    });
    expect(response.status).toEqual(422);
  });

  test('Login: Email or password error.', async () => {
    const response = await req.post('/api/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: '2223',
      });
    expect(response.status).toEqual(401);
  });

  test('Login: Valid.', async () => {
    const response = await req.post('/api/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: 'admin',
      });
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe('string');
    expect(response.body.token.length).toBeGreaterThan(0);
  });

  test('Valid: Without auth header.', async () => {
    const response = await req.get('/api/auth/validate');
    expect(response.status).toEqual(401);
  });

  test('Valid: With Authentication header.', async () => {
    const logInResponse = await req.post('/api/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: 'admin',
      });
    const { token } = logInResponse.body;
    const response = await req.get('/api/auth/validate')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(204);
  });

  afterAll(async () => {
    if (conn) {
      conn.dropDatabase();
    }
  });
});
