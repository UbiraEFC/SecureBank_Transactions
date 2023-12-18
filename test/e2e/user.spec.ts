import { Application } from 'express';
import httpStatus from 'http-status';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createAppInstance } from '@src/app';
import { typeormDataSource } from '@src/shared/db/typeorm/data-source';

let app: Application;

describe('User Controller', () => {
  beforeAll(async () => {
    app = await createAppInstance();
  });

  afterAll(async () => {
    await typeormDataSource.dropDatabase();
  });

  it('should regirster a new user', async () => {
    const response = await request(app).post('/user/register').send({
      name: 'John Doe',
      email: 'john@email.com',
      document: '29829179044',
      userType: 'PF',
      password: 'Password123',
    });

    expect(response.status).toBe(httpStatus.CREATED);
  });
});
